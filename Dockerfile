FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app

RUN apt-get update \
    && apt-get install -y build-essential libpq-dev gcc --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN python -m pip install --upgrade pip
RUN python -m pip install uv
RUN uv install
# Dependencies will be installed from pyproject.toml via `uv install`

COPY . /app

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV DJANGO_SETTINGS_MODULE=shop_sphere.settings
ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn", "shop_sphere.wsgi:application", "--bind", "0.0.0.0:8000"]
