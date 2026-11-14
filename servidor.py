from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

CODIGO_AUTORIZADO = "d7:4c:70:b1"


@app.route("/nfc", methods=["POST"])
def receber_nfc():
    dados = request.get_json(silent=True) or {}

    codigo = dados.get("serialNumber", "")

    print(f"\nCódigo recebido: {codigo}")

    if codigo != CODIGO_AUTORIZADO:
        return jsonify({
            "mensagem": "Código não autorizado"
        }), 403

    print("Cartão reconhecido pelo servidor Python!")

    return jsonify({
        "mensagem": "Código recebido com sucesso!"
    })


if __name__ == "__main__":
    print("Servidor NFC iniciado!")
    print("Aguardando dados do celular...")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )