"""
BookClub Hub - API Routes
All REST endpoints for the application.
"""
from flask import Blueprint, request, jsonify
from backend.services import services
from psycopg.errors import UniqueViolation, ForeignKeyViolation, CheckViolation


def register_routes(bp: Blueprint):
    @bp.route("/health")
    def health():
        return jsonify({"status": "ok", "service": "BookClub Hub API"})

    # ========================================================
    # Dashboard
    # ========================================================
    @bp.route("/dashboard")
    def dashboard():
        stats = services.get_dashboard_stats()
        return jsonify({
            "stats": stats,
            "leitura_atual": services.get_leitura_atual(),
            "proximos_encontros": services.get_proximos_encontros(),
            "avaliacoes_recentes": services.get_avaliacoes_recentes(),
            "sugestoes_recentes": services.get_sugestoes_recentes(),
        })

    # ========================================================
    # Usuarios
    # ========================================================
    @bp.route("/usuarios", methods=["GET"])
    def list_usuarios():
        return jsonify(services.list_usuarios())

    @bp.route("/usuarios/<int:usuario_id>", methods=["GET"])
    def get_usuario(usuario_id):
        u = services.get_usuario(usuario_id)
        if not u:
            return jsonify({"error": "Usuario nao encontrado"}), 404
        return jsonify(u)

    @bp.route("/usuarios", methods=["POST"])
    def create_usuario():
        data = request.get_json()
        if not data or not data.get("nome") or not data.get("email") or not data.get("senha_hash"):
            return jsonify({"error": "nome, email e senha_hash sao obrigatorios"}), 400
        try:
            return jsonify(services.create_usuario(
                data["nome"], data["email"], data["senha_hash"]
            )), 201
        except UniqueViolation:
            return jsonify({"error": "Email ja cadastrado"}), 409

    # ========================================================
    # Clubes
    # ========================================================
    @bp.route("/clubs", methods=["GET"])
    def list_clubes():
        return jsonify(services.list_clubes())

    @bp.route("/clubs/<int:clube_id>", methods=["GET"])
    def get_clube(clube_id):
        c = services.get_clube(clube_id)
        if not c:
            return jsonify({"error": "Clube nao encontrado"}), 404
        return jsonify(c)

    @bp.route("/clubs", methods=["POST"])
    def create_clube():
        data = request.get_json()
        if not data or not data.get("nome") or not data.get("id_admin"):
            return jsonify({"error": "nome e id_admin sao obrigatorios"}), 400
        try:
            return jsonify(services.create_clube(
                data["nome"], data.get("descricao", ""), data["id_admin"]
            )), 201
        except ForeignKeyViolation:
            return jsonify({"error": "id_admin invalido"}), 400

    @bp.route("/clubs/<int:clube_id>", methods=["PUT"])
    def update_clube(clube_id):
        data = request.get_json()
        if not data or not data.get("nome"):
            return jsonify({"error": "nome e obrigatorio"}), 400
        result = services.update_clube(clube_id, data["nome"], data.get("descricao", ""))
        if not result:
            return jsonify({"error": "Clube nao encontrado"}), 404
        return jsonify(result)

    @bp.route("/clubs/<int:clube_id>", methods=["DELETE"])
    def delete_clube(clube_id):
        services.delete_clube(clube_id)
        return jsonify({"message": "Clube excluido"})

    # ========================================================
    # Membros
    # ========================================================
    @bp.route("/clubs/<int:clube_id>/membros", methods=["GET"])
    def list_membros(clube_id):
        return jsonify(services.list_membros_by_clube(clube_id))

    @bp.route("/clubs/<int:clube_id>/membros", methods=["POST"])
    def add_membro(clube_id):
        data = request.get_json()
        if not data or not data.get("id_usuario"):
            return jsonify({"error": "id_usuario e obrigatorio"}), 400
        try:
            return jsonify(services.add_membro(
                clube_id, data["id_usuario"], data.get("papel", "membro")
            )), 201
        except UniqueViolation:
            return jsonify({"error": "Usuario ja e membro deste clube"}), 409
        except ForeignKeyViolation:
            return jsonify({"error": "Clube ou usuario invalido"}), 400

    @bp.route("/membros/<int:membro_id>", methods=["DELETE"])
    def remove_membro(membro_id):
        services.remove_membro(membro_id)
        return jsonify({"message": "Membro removido"})

    # ========================================================
    # Autores
    # ========================================================
    @bp.route("/autores", methods=["GET"])
    def list_autores():
        return jsonify(services.list_autores())

    @bp.route("/autores/<int:autor_id>", methods=["GET"])
    def get_autor(autor_id):
        a = services.get_autor(autor_id)
        if not a:
            return jsonify({"error": "Autor nao encontrado"}), 404
        return jsonify(a)

    @bp.route("/autores", methods=["POST"])
    def create_autor():
        data = request.get_json()
        if not data or not data.get("nome"):
            return jsonify({"error": "nome e obrigatorio"}), 400
        return jsonify(services.create_autor(data["nome"], data.get("biografia", ""))), 201

    @bp.route("/autores/<int:autor_id>", methods=["PUT"])
    def update_autor(autor_id):
        data = request.get_json()
        if not data or not data.get("nome"):
            return jsonify({"error": "nome e obrigatorio"}), 400
        result = services.update_autor(autor_id, data["nome"], data.get("biografia", ""))
        if not result:
            return jsonify({"error": "Autor nao encontrado"}), 404
        return jsonify(result)

    @bp.route("/autores/<int:autor_id>", methods=["DELETE"])
    def delete_autor(autor_id):
        services.delete_autor(autor_id)
        return jsonify({"message": "Autor excluido"})

    # ========================================================
    # Categorias
    # ========================================================
    @bp.route("/categorias", methods=["GET"])
    def list_categorias():
        return jsonify(services.list_categorias())

    @bp.route("/categorias", methods=["POST"])
    def create_categoria():
        data = request.get_json()
        if not data or not data.get("nome"):
            return jsonify({"error": "nome e obrigatorio"}), 400
        return jsonify(services.create_categoria(data["nome"])), 201

    # ========================================================
    # Livros
    # ========================================================
    @bp.route("/books", methods=["GET"])
    def list_livros():
        search = request.args.get("search")
        categoria = request.args.get("categoria")
        return jsonify(services.list_livros(search, categoria))

    @bp.route("/books/<int:livro_id>", methods=["GET"])
    def get_livro(livro_id):
        l = services.get_livro(livro_id)
        if not l:
            return jsonify({"error": "Livro nao encontrado"}), 404
        return jsonify(l)

    @bp.route("/books", methods=["POST"])
    def create_livro():
        data = request.get_json()
        if not data or not data.get("titulo") or not data.get("id_autor"):
            return jsonify({"error": "titulo e id_autor sao obrigatorios"}), 400
        try:
            return jsonify(services.create_livro(
                data["titulo"], data["id_autor"], data.get("id_categoria"),
                data.get("ano_publicacao"), data.get("sinopse", ""), data.get("capa_url", "")
            )), 201
        except ForeignKeyViolation:
            return jsonify({"error": "Autor ou categoria invalido"}), 400

    @bp.route("/books/<int:livro_id>", methods=["PUT"])
    def update_livro(livro_id):
        data = request.get_json()
        if not data or not data.get("titulo") or not data.get("id_autor"):
            return jsonify({"error": "titulo e id_autor sao obrigatorios"}), 400
        result = services.update_livro(
            livro_id, data["titulo"], data["id_autor"], data.get("id_categoria"),
            data.get("ano_publicacao"), data.get("sinopse", ""), data.get("capa_url", "")
        )
        if not result:
            return jsonify({"error": "Livro nao encontrado"}), 404
        return jsonify(result)

    @bp.route("/books/<int:livro_id>", methods=["DELETE"])
    def delete_livro(livro_id):
        services.delete_livro(livro_id)
        return jsonify({"message": "Livro excluido"})

    # ========================================================
    # Leituras
    # ========================================================
    @bp.route("/readings", methods=["GET"])
    def list_leituras():
        clube_id = request.args.get("clube_id")
        return jsonify(services.list_leituras(clube_id))

    @bp.route("/readings/<int:leitura_id>", methods=["GET"])
    def get_leitura(leitura_id):
        l = services.get_leitura(leitura_id)
        if not l:
            return jsonify({"error": "Leitura nao encontrada"}), 404
        return jsonify(l)

    @bp.route("/readings", methods=["POST"])
    def create_leitura():
        data = request.get_json()
        if not data or not data.get("id_clube") or not data.get("id_livro") or not data.get("status"):
            return jsonify({"error": "id_clube, id_livro e status sao obrigatorios"}), 400
        try:
            return jsonify(services.create_leitura(
                data["id_clube"], data["id_livro"],
                data.get("data_inicio"), data.get("data_fim"), data["status"]
            )), 201
        except ForeignKeyViolation:
            return jsonify({"error": "Clube ou livro invalido"}), 400

    @bp.route("/readings/<int:leitura_id>", methods=["PUT"])
    def update_leitura(leitura_id):
        data = request.get_json()
        if not data or not data.get("status"):
            return jsonify({"error": "status e obrigatorio"}), 400
        result = services.update_leitura(
            leitura_id, data.get("data_inicio"), data.get("data_fim"), data["status"]
        )
        if not result:
            return jsonify({"error": "Leitura nao encontrada"}), 404
        return jsonify(result)

    # ========================================================
    # Encontros
    # ========================================================
    @bp.route("/meetings", methods=["GET"])
    def list_encontros():
        leitura_id = request.args.get("leitura_id")
        return jsonify(services.list_encontros(leitura_id))

    @bp.route("/meetings/<int:encontro_id>", methods=["GET"])
    def get_encontro(encontro_id):
        e = services.get_encontro(encontro_id)
        if not e:
            return jsonify({"error": "Encontro nao encontrado"}), 404
        return jsonify(e)

    @bp.route("/meetings", methods=["POST"])
    def create_encontro():
        data = request.get_json()
        if not data or not data.get("id_leitura") or not data.get("data_hora"):
            return jsonify({"error": "id_leitura e data_hora sao obrigatorios"}), 400
        try:
            return jsonify(services.create_encontro(
                data["id_leitura"], data["data_hora"],
                data.get("local_link", ""), data.get("descricao", "")
            )), 201
        except ForeignKeyViolation:
            return jsonify({"error": "Leitura invalida"}), 400

    @bp.route("/meetings/<int:encontro_id>", methods=["PUT"])
    def update_encontro(encontro_id):
        data = request.get_json()
        if not data or not data.get("data_hora"):
            return jsonify({"error": "data_hora e obrigatorio"}), 400
        result = services.update_encontro(
            encontro_id, data["data_hora"], data.get("local_link", ""), data.get("descricao", "")
        )
        if not result:
            return jsonify({"error": "Encontro nao encontrado"}), 404
        return jsonify(result)

    @bp.route("/meetings/<int:encontro_id>", methods=["DELETE"])
    def delete_encontro(encontro_id):
        services.delete_encontro(encontro_id)
        return jsonify({"message": "Encontro excluido"})

    # ========================================================
    # Presencas
    # ========================================================
    @bp.route("/presencas", methods=["GET"])
    def list_presencas():
        encontro_id = request.args.get("encontro_id")
        return jsonify(services.list_presencas(encontro_id))

    @bp.route("/presencas", methods=["POST"])
    def create_presenca():
        data = request.get_json()
        if not data or not data.get("id_encontro") or not data.get("id_membro"):
            return jsonify({"error": "id_encontro e id_membro sao obrigatorios"}), 400
        try:
            return jsonify(services.create_presenca(
                data["id_encontro"], data["id_membro"],
                data.get("confirmado", False), data.get("presente", False)
            )), 201
        except UniqueViolation:
            return jsonify({"error": "Membro ja possui registro de presenca neste encontro"}), 409
        except ForeignKeyViolation:
            return jsonify({"error": "Encontro ou membro invalido"}), 400

    @bp.route("/presencas/<int:presenca_id>", methods=["PUT"])
    def update_presenca(presenca_id):
        data = request.get_json()
        result = services.update_presenca(
            presenca_id, data.get("confirmado", False), data.get("presente", False)
        )
        if not result:
            return jsonify({"error": "Presenca nao encontrada"}), 404
        return jsonify(result)

    # ========================================================
    # Avaliacoes
    # ========================================================
    @bp.route("/reviews", methods=["GET"])
    def list_avaliacoes():
        leitura_id = request.args.get("leitura_id")
        return jsonify(services.list_avaliacoes(leitura_id))

    @bp.route("/reviews", methods=["POST"])
    def create_avaliacao():
        data = request.get_json()
        if not data or not data.get("id_membro") or not data.get("id_leitura") or not data.get("nota"):
            return jsonify({"error": "id_membro, id_leitura e nota sao obrigatorios"}), 400
        nota = int(data["nota"])
        if nota < 1 or nota > 5:
            return jsonify({"error": "nota deve estar entre 1 e 5"}), 400
        try:
            return jsonify(services.create_avaliacao(
                data["id_membro"], data["id_leitura"], nota, data.get("comentario", "")
            )), 201
        except UniqueViolation:
            return jsonify({"error": "Membro ja avaliou esta leitura"}), 409
        except CheckViolation:
            return jsonify({"error": "nota deve estar entre 1 e 5"}), 400
        except ForeignKeyViolation:
            return jsonify({"error": "Membro ou leitura invalido"}), 400

    # ========================================================
    # Sugestoes
    # ========================================================
    @bp.route("/suggestions", methods=["GET"])
    def list_sugestoes():
        clube_id = request.args.get("clube_id")
        return jsonify(services.list_sugestoes(clube_id))

    @bp.route("/suggestions", methods=["POST"])
    def create_sugestao():
        data = request.get_json()
        if not data or not data.get("id_clube") or not data.get("id_membro"):
            return jsonify({"error": "id_clube e id_membro sao obrigatorios"}), 400
        if not data.get("id_livro") and not data.get("titulo_sugerido"):
            return jsonify({"error": "id_livro ou titulo_sugerido e obrigatorio"}), 400
        try:
            return jsonify(services.create_sugestao(
                data["id_clube"], data["id_membro"],
                data.get("id_livro"), data.get("titulo_sugerido")
            )), 201
        except ForeignKeyViolation:
            return jsonify({"error": "Clube, membro ou livro invalido"}), 400
        except CheckViolation:
            return jsonify({"error": "id_livro ou titulo_sugerido e obrigatorio"}), 400

    @bp.route("/suggestions/<int:sugestao_id>", methods=["DELETE"])
    def delete_sugestao(sugestao_id):
        services.delete_sugestao(sugestao_id)
        return jsonify({"message": "Sugestao excluida"})

    # ========================================================
    # Votacoes
    # ========================================================
    @bp.route("/votes", methods=["GET"])
    def list_votacoes():
        clube_id = request.args.get("clube_id")
        return jsonify(services.list_votacoes(clube_id))

    @bp.route("/votes/<int:votacao_id>", methods=["GET"])
    def get_votacao(votacao_id):
        v = services.get_votacao(votacao_id)
        if not v:
            return jsonify({"error": "Votacao nao encontrada"}), 404
        v["opcoes"] = services.get_votacao_opcoes(votacao_id)
        return jsonify(v)

    @bp.route("/votes", methods=["POST"])
    def create_votacao():
        data = request.get_json()
        if not data or not data.get("id_clube") or not data.get("titulo"):
            return jsonify({"error": "id_clube e titulo sao obrigatorios"}), 400
        try:
            return jsonify(services.create_votacao(
                data["id_clube"], data["titulo"], data.get("aberta", True)
            )), 201
        except ForeignKeyViolation:
            return jsonify({"error": "Clube invalido"}), 400

    @bp.route("/votes/<int:votacao_id>", methods=["PUT"])
    def update_votacao(votacao_id):
        data = request.get_json()
        if not data or not data.get("titulo"):
            return jsonify({"error": "titulo e obrigatorio"}), 400
        result = services.update_votacao(votacao_id, data["titulo"], data.get("aberta", True))
        if not result:
            return jsonify({"error": "Votacao nao encontrada"}), 404
        return jsonify(result)

    @bp.route("/votes/<int:votacao_id>/opcoes", methods=["POST"])
    def add_opcao(votacao_id):
        data = request.get_json()
        if not data or not data.get("id_sugestao"):
            return jsonify({"error": "id_sugestao e obrigatorio"}), 400
        try:
            return jsonify(services.add_votacao_opcao(votacao_id, data["id_sugestao"])), 201
        except ForeignKeyViolation:
            return jsonify({"error": "Votacao ou sugestao invalida"}), 400

    @bp.route("/votes/cast", methods=["POST"])
    def cast_vote():
        data = request.get_json()
        if not data or not data.get("id_opcao") or not data.get("id_membro"):
            return jsonify({"error": "id_opcao e id_membro sao obrigatorios"}), 400
        try:
            return jsonify(services.create_voto(data["id_opcao"], data["id_membro"])), 201
        except UniqueViolation:
            return jsonify({"error": "Membro ja votou nesta votacao"}), 409
        except ForeignKeyViolation:
            return jsonify({"error": "Opcao ou membro invalido"}), 400
