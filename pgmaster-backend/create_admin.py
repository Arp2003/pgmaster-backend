import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username="admin").exists():
    # Since our custom user requires phone
    user = User.objects.create_superuser("admin", "admin@example.com", "admin123")
    user.phone = "1234567890"
    user.role = "super_admin"
    user.is_verified = True
    user.save()
    print("Admin user created successfully! Username: admin, Password: admin123")
else:
    print("Admin user already exists!")
