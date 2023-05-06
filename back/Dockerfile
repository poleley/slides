FROM python:3.7
ENV PYTHONUNBUFFERED 1

RUN mkdir /backend
WORKDIR /backend
COPY requirements.txt /backend/
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY . /backend/