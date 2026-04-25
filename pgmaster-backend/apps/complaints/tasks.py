"""
Celery tasks for complaint-related notifications.
"""

from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_complaint_notification_to_staff(self, complaint_id, staff_id):
    """
    Send complaint assignment notification to staff member.
    
    Args:
        complaint_id: Complaint ID
        staff_id: Staff user ID
    """
    try:
        from apps.complaints.models import Complaint
        from apps.auth.models import User
        
        complaint = Complaint.objects.get(id=complaint_id)
        staff = User.objects.get(id=staff_id)
        
        context = {
            'staff_name': staff.first_name or staff.username,
            'complaint_title': complaint.title,
            'complaint_description': complaint.description,
            'complaint_category': complaint.get_category_display(),
            'complaint_priority': complaint.get_priority_display(),
            'tenant_name': complaint.tenant.tenant_name,
            'tenant_phone': complaint.tenant.phone,
            'tenant_email': complaint.tenant.email,
            'property_name': complaint.tenant.pg.property_name,
        }
        
        html_content = render_to_string('emails/complaint_update.html', context)
        text_content = strip_tags(html_content)
        
        subject = f'New Complaint Assigned: {complaint.title} [{complaint.get_priority_display()}]'
        email = EmailMultiAlternatives(
            subject,
            text_content,
            from_email='noreply@pgmaster.com',
            to=[staff.email]
        )
        email.attach_alternative(html_content, 'text/html')
        email.send()
        
        logger.info(f"Complaint assigned notification sent to {staff.email}")
        return f"Notification sent to {staff.email}"
        
    except Exception as exc:
        logger.error(f"Error sending complaint notification: {str(exc)}")
        self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@shared_task(bind=True, max_retries=3)
def send_complaint_resolution_email(self, complaint_id):
    """
    Send complaint resolution email to tenant.
    
    Args:
        complaint_id: Complaint ID
    """
    try:
        from apps.complaints.models import Complaint
        
        complaint = Complaint.objects.get(id=complaint_id)
        
        context = {
            'tenant_name': complaint.tenant.tenant_name,
            'complaint_title': complaint.title,
            'complaint_description': complaint.description,
            'resolution_notes': complaint.resolution_notes or 'Your complaint has been resolved.',
            'property_name': complaint.tenant.pg.property_name,
        }
        
        html_content = render_to_string('emails/complaint_update.html', context)
        text_content = strip_tags(html_content)
        
        subject = f'Your Complaint Has Been Resolved: {complaint.title}'
        email = EmailMultiAlternatives(
            subject,
            text_content,
            from_email='noreply@pgmaster.com',
            to=[complaint.tenant.email]
        )
        email.attach_alternative(html_content, 'text/html')
        email.send()
        
        logger.info(f"Complaint resolution email sent to {complaint.tenant.email}")
        return f"Resolution email sent to {complaint.tenant.email}"
        
    except Exception as exc:
        logger.error(f"Error sending complaint resolution email: {str(exc)}")
        self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
