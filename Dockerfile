FROM python:3.12.10-slim

WORKDIR /app

# Install system packages required by psycopg2 and GDAL
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    gdal-bin \
    libgdal-dev \
    python3-gdal \
    libpq-dev \
    libgeos-dev \
    libjpeg-dev \
    zlib1g-dev \
    libfreetype6-dev \
    liblcms2-dev \
    libtiff5-dev \
    tcl8.6-dev tk8.6-dev \
    libharfbuzz-dev libfribidi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY requirements.txt .

RUN pip install -r requirements.txt 

ENV GDAL_LIBRARY_PATH=/usr/lib/libgdal.so
ENV GEOS_LIBRARY_PATH=/usr/lib/libgeos_c.so

# Copy project files
COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]