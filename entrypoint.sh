#!/bin/sh
set -e

# Wait for DB to be ready using Python (no external dependencies)
if [ "$DATABASE_HOST" != "" ]; then
  echo "Waiting for database at $DATABASE_HOST:$DATABASE_PORT..."
  python -c "
import socket
import time
import sys

host = '$DATABASE_HOST'
port = int('$DATABASE_PORT')
max_retries = 30
retry_count = 0

while retry_count < max_retries:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((host, port))
        sock.close()
        if result == 0:
            print(f'Database {host}:{port} is ready!')
            sys.exit(0)
    except Exception as e:
        pass
    
    retry_count += 1
    if retry_count < max_retries:
        print(f'Attempt {retry_count}/{max_retries} - waiting for database...')
        time.sleep(1)

print(f'Failed to connect to {host}:{port} after {max_retries} attempts')
sys.exit(1)
  "
fi

  python manage.py makemigrations accounts shop --noinput || true
  python manage.py migrate --noinput
python manage.py collectstatic --noinput || true

exec "$@"
