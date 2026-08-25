"""
BookClub Hub - Flask Application Entry Point
"""
from flask import Flask
from flask_cors import CORS
from backend.config import config
from backend.routes.routes import register_routes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

api_bp = Flask.register_blueprint  # noqa: placeholder, replaced below
api_bp = None  # noqa

from flask import Blueprint

api = Blueprint("api", __name__, url_prefix="/api")
register_routes(api)
app.register_blueprint(api)


@app.errorhandler(404)
def not_found(e):
    from flask import jsonify
    return jsonify({"error": "Rota nao encontrada"}), 404


@app.errorhandler(500)
def server_error(e):
    from flask import jsonify
    return jsonify({"error": "Erro interno do servidor"}), 500


if __name__ == "__main__":
    app.run(
        host=config.BACKEND_HOST,
        port=config.BACKEND_PORT,
        debug=config.FLASK_DEBUG,
    )
