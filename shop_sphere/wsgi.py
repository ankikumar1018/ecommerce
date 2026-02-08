import os
from django.core.wsgi import get_wsgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop_sphere.settings')
application = get_wsgi_application()

# Wrap with WhiteNoise to serve static files when running under Gunicorn
try:
	from whitenoise import WhiteNoise
	from pathlib import Path
	application = WhiteNoise(application, root=str(Path(__file__).resolve().parent.parent / 'staticfiles'))
except Exception:
	# If WhiteNoise isn't available yet (during build), continue without it
	pass
