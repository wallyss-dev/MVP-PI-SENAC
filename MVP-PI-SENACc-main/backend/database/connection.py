"""
BookClub Hub - Database Connection
Provides a connection factory using psycopg with parameterized config.
"""
import psycopg
from backend.config import config


def get_connection():
    """
    Returns a new psycopg connection to the PostgreSQL database.
    The caller is responsible for closing the connection (use a `with` block).
    """
    return psycopg.connect(
        host=config.DATABASE_HOST,
        port=config.DATABASE_PORT,
        dbname=config.DATABASE_NAME,
        user=config.DATABASE_USER,
        password=config.DATABASE_PASSWORD,
    )


def query_all(sql, params=None):
    """Run a SELECT and return all rows as a list of dicts."""
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params or ())
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, row)) for row in cur.fetchall()]


def query_one(sql, params=None):
    """Run a SELECT and return a single row as a dict, or None."""
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params or ())
            columns = [desc[0] for desc in cur.description]
            row = cur.fetchone()
            return dict(zip(columns, row)) if row else None


def execute(sql, params=None, fetch=False):
    """
    Execute an INSERT/UPDATE/DELETE.
    If fetch=True, returns the inserted/updated row as a dict (assumes RETURNING *).
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params or ())
            conn.commit()
            if fetch:
                columns = [desc[0] for desc in cur.description]
                row = cur.fetchone()
                return dict(zip(columns, row)) if row else None
    return None
