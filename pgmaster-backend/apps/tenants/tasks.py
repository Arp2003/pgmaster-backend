"""
Celery tasks for tenant-related notifications.
"""

from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_tenant_notice_email(self, tenant_id, notice_id):
    """
    Send notice email when tenant is being issued notice period.
    
    Args:
        tenant_id: Tenant ID
        notice_id: Notice ID from notices app
    """
    try:
        from apps.tenants.models import Tenant
        from apps.notices.models import Notice
        
        tenant = Tenant.objects.get(id=tenant_id)
        notice = Notice.objects.get(id=notice_id)
        
        context = {
            'tenant_name': tenant.tenant_name,
            'property_name': tenant.pg.property_name,
            'notice_content': notice.content,
            'notice_date': notice.created_at.strftime('%d %B %Y'),
        }
        
        html_content = render_to_string('emails/notice.html', context)
        text_content = strip_tags(html_content)
        
        subject = f'Important Notice from {tenant.pg.property_name}'
        email = EmailMultiAlternatives(
            subject,
            text_content,
            from_email='noreply@pgmaster.com',
            to=[tenant.email]
        )
        email.attach_alternative(html_content, 'text/html')
        email.send()
        
        logger.info(f"Notice email sent to {tenant.email}")
        return f"Notice email sent to {tenant.email}"
        
    except Exception as exc:
        logger.error(f"Error sending tenant notice email: {str(exc)}")
        self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
