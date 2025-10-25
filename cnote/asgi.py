"""
ASGI config for cnote project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cnote.settings')

application = get_asgi_application()
