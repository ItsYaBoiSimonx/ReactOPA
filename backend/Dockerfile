FROM python:3.11-slim

WORKDIR /app

COPY backend.py data.csv ./
COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 9000

CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "9000"]
