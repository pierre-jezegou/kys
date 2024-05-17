FROM python:3.10-slim

WORKDIR /api

# Install dependencies
COPY requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements-dev.txt

COPY inject-vars.py app.py ./
COPY .chalice .chalice/

COPY chalicelib chalicelib/

RUN mkdir /root/.aws
COPY .credentials /root/.aws/credentials

# Add network configuration
EXPOSE 8000

CMD python inject-vars.py && chalice local --host 0.0.0.0