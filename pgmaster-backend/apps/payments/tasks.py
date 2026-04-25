"""
Celery tasks for async email notifications.
Send emails asynchronously to avoid blocking requests.
"""

from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_payment_reminder_email(self, tenant_id, payment_id):
    """
    Send payment reminder email to tenant.
    
    Args:
        tenant_id: Tenant ID
        payment_id: Payment ID for the reminder
    """
    try:
        from apps.tenants.models import Tenant
        from apps.payments.models import Payment
        
        tenant = Tenant.objects.get(id=tenant_id)
        payment = Payment.objects.get(id=payment_id)
        
        context = {
            'tenant_name': tenant.tenant_name,
            'amount': payment.amount,
            'month': payment.month,
            'due_date': payment.due_date.strftime('%d %B %Y'),
            'room_number': tenant.bed.room.room_number,
            'floor': tenant.bed.room.floor,
            'property_name': tenant.pg.property_name,
            'property_address': tenant.pg.address,
            'property_email': tenant.pg.owner.email,
            'property_phone': tenant.pg.contact_number,
            'payment_link': f'{settings.FRONTEND_URL}/tenant/payments/{payment_id}',
        }
        
        # Render HTML email template
        html_content = render_to_string('emails/payment_reminder.html', context)
        text_content = strip_tags(html_content)
        
        # Send email
        subject = f'Payment Reminder - ₹{payment.amount} due on {payment.due_date.strftime("%d %b %Y")}'
        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [tenant.email]
        )
        email.attach_alternative(html_content, 'text/html')
        email.send()
        
        logger.info(f"Payment reminder email sent to {tenant.email} for payment {payment_id}")
        return f"Email sent successfully for payment {payment_id}"
        
    except Exception as exc:
        logger.error(f"Error sending payment reminder email: {str(exc)}")
        # Retry with exponential backoff
        self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@shared_task(bind=True, max_retries=3)
def send_complaint_update_email(self, complaint_id, complaint_update_id):
    """
    Send complaint status update email to tenant.
    
    Args:
        complaint_id: Complaint ID
        complaint_update_id: Complaint update ID
    """
    try:
        from apps.complaints.models import Complaint, ComplaintUpdate
        
        complaint = Complaint.objects.get(id=complaint_id)
        update = ComplaintUpdate.objects.get(id=complaint_update_id)
        
        context = {
            'tenant_name': complaint.tenant.tenant_name,
            'complaint_id': complaint.id,
            'complaint_title': complaint.title,
            'complaint_category': complaint.get_category_display(),
            'complaint_priority': complaint.get_priority_display(),
            'complaint_description': complaint.description,
            'previous_status': 'Open',  # Get from ComplaintUpdate if tracking previous status
            'new_status': update.status,
            'updated_date': update.created_at.strftime('%d %B %Y at %H:%M'),
            'resolution_notes': update.resolution_notes or '',
            'complaint_status': update.status,
            'property_name': complaint.tenant.pg.property_name,
            'complaint_link': f'{settings.FRONTEND_URL}/tenant/complaints/{complaint_id}',
        }
        
        # Render HTML email template
        html_content = render_to_string('emails/complaint_update.html', context)
        text_content = strip_tags(html_content)
        
        # Send email
        subject = f'Update on Your Complaint: {complaint.title} - Status: {update.status}'
        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [complaint.tenant.email]
        )
        email.attach_alternative(html_content, 'text/html')
        email.send()
        
        logger.info(f"Complaint update email sent to {complaint.tenant.email} for complaint {complaint_id}")
        return f"Email sent successfully for complaint {complaint_id}"
        
    except Exception as exc:
        logger.error(f"Error sending complaint update email: {str(exc)}")
        self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@shared_task(bind=True, max_retries=3)
def send_notice_email(self, notice_id, tenant_id=None):
    """
    Send notice email to tenant(s).
    
    Args:
        notice_id: Notice ID
        tenant_id: Optional tenant ID (if None, sends to all tenants in target rooms)
    """
    try:
        from apps.notices.models import Notice
        from apps.tenants.models import Tenant
        import json
        
        notice = Notice.objects.get(id=notice_id)
        
        # Determine recipients
        if tenant_id:
            tenants = Tenant.objects.filter(id=tenant_id)
        elif notice.send_to_all:
            tenants = Tenant.objects.filter(
                pg=notice.pg,
                status='active'
            )
        else:
            # Send to tenants in target rooms
            target_rooms = json.loads(notice.target_rooms) if notice.target_rooms else []
            tenants = Tenant.objects.filter(
                bed__room_id__in=target_rooms,
                status='active'
            )
        
        # Send email to each tenant
        for tenant in tenants:
            context = {
                'tenant_name': tenant.tenant_name,
                'property_name': notice.pg.property_name,
                'property_address': notice.pg.address,
                'property_email': notice.pg.owner.email,
                'property_phone': notice.pg.contact_number,
                'room_number': tenant.bed.room.room_number,
                'floor': tenant.bed.room.floor,
                'notice_type': notice.get_notice_type_display(),
                'issued_date': notice.created_at.strftime('%d %B %Y'),
                'notice_content': notice.content,
                'notice_link': f'{settings.FRONTEND_URL}/tenant/notices/{notice_id}',
            }
            
            # Render HTML email template
            html_content = render_to_string('emails/notice.html', context)
            text_content = strip_tags(html_content)
            
            # Send email
            subject = f'Notice from {notice.pg.property_name}: {notice.title}'
            email = EmailMultiAlternatives(
                subject,
                text_content,
                settings.DEFAULT_FROM_EMAIL,
                [tenant.email]
            )
            email.attach_alternative(html_content, 'text/html')
            email.send()
            
            logger.info(f"Notice email sent to {tenant.email} for notice {notice_id}")
        
        return f"Notice emails sent successfully to {tenants.count()} tenants"
        
    except Exception as exc:
        logger.error(f"Error sending notice email: {str(exc)}")
        self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@shared_task(bind=True, max_retries=3)
def send_password_reset_email(self, user_id, reset_token):
    """
    Send password reset email to user.
    
    Args:
        user_id: User ID
        reset_token: Password reset token
    """
    try:
        from apps.auth.models import User
        
        user = User.objects.get(id=user_id)
        
        context = {
            'user_name': user.first_name or user.username,
            'reset_link': f'{settings.FRONTEND_URL}/auth/reset-password?token={reset_token}',
        }
        
        # Render HTML email template
        html_content = render_to_string('emails/password_reset.html', context)
        text_content = strip_tags(html_content)
        
        # Send email
        subject = 'Reset Your PGMaster Password'
        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [user.email]
        )
        email.attach_alternative(html_content, 'text/html')
        email.send()
        
        logger.info(f"Password reset email sent to {user.email}")
        return f"Password reset email sent successfully to {user.email}"
        
    except Exception as exc:
        logger.error(f"Error sending password reset email: {str(exc)}")
        self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@shared_task(bind=True, max_retries=3)
def send_welcome_email(self, user_id):
    """
    Send welcome email to new user.
    
    Args:
        user_id: User ID
    """
    try:
        from apps.auth.models import User
        
        user = User.objects.get(id=user_id)
        
        context = {
            'user_name': user.first_name or user.username,
            'user_email': user.email,
            'user_role': user.get_role_display(),
            'dashboard_link': f'{settings.FRONTEND_URL}/dashboard',
            'docs_link': f'{settings.FRONTEND_URL}/docs',
            'tutorials_link': f'{settings.FRONTEND_URL}/tutorials',
            'faq_link': f'{settings.FRONTEND_URL}/faq',
        }
        
        # Render HTML email template
        html_content = render_to_string('emails/welcome.html', context)
        text_content = strip_tags(html_content)
        
        # Send email
        subject = '🎉 Welcome to PGMaster!'
        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [user.email]
        )
        email.attach_alternative(html_content, 'text/html')
        email.send()
        
        logger.info(f"Welcome email sent to {user.email}")
        return f"Welcome email sent successfully to {user.email}"
        
    except Exception as exc:
        logger.error(f"Error sending welcome email: {str(exc)}")
        self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@shared_task
def send_monthly_payment_reminders():
    """
    Scheduled task to send payment reminders for all pending payments.
    Run daily via Celery Beat.
    """
    try:
        from apps.payments.models import Payment
        from datetime import datetime, timedelta
        
        # Find payments due in next 3 days
        today = datetime.now().date()
        due_soon = today + timedelta(days=3)
        
        pending_payments = Payment.objects.filter(
            due_date__lte=due_soon,
            due_date__gte=today,
            status='pending'
        )
        
        count = 0
        for payment in pending_payments:
            send_payment_reminder_email.delay(payment.tenant.id, payment.id)
            count += 1
        
        logger.info(f"Scheduled {count} payment reminder emails for sending")
        return f"Scheduled {count} payment reminder emails"
        
    except Exception as exc:
        logger.error(f"Error in scheduled payment reminders task: {str(exc)}")


from django.conf import settings
