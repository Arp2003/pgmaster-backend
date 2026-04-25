"""
Utility functions and helpers.
"""

from django.core.mail import send_mail
from django.conf import settings


def send_notification_email(to_email, subject, message):
    """Send email notification."""
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [to_email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False


def send_sms_notification(phone, message):
    """Send SMS notification (placeholder for actual SMS service integration)."""
    # TODO: Integrate with actual SMS service like Twilio
    print(f"SMS to {phone}: {message}")
    return True
