import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'echo-paradox-secret-key-2024'
    PORT = 2394
    DEBUG = True
