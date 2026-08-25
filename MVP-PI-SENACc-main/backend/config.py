"""
BookClub Hub - Configuration
Loads environment variables for database and backend settings.
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration loaded from environment variables."""

    DATABASE_HOST = os.getenv("DATABASE_HOST", "localhost")
    DATABASE_PORT = os.getenv("DATABASE_PORT", "5432")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "bookclub_hub")
    DATABASE_USER = os.getenv("DATABASE_USER", "bookclub")
    DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", "bookclub_secret")

    BACKEND_HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
    BACKEND_PORT = int(os.getenv("BACKEND_PORT", "5000"))
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "true").lower() == "true"


config = Config()
