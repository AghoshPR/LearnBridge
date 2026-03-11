FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# System dependencies (mysqlclient + pillow)
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy full project (manage.py is here)
COPY . .

EXPOSE 8000

# Run migrations + start ASGI server
CMD ["sh", "-c", "python manage.py migrate && daphne -b 0.0.0.0 -p 8000 LearnBridge.asgi:application"]