from flask import Flask, request, jsonify
from flask_cors import CORS
from app.rag import answer_question

# Create Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Home route
@app.route("/")
def home():
    return "Shastika Chatbot Running"

# Chatbot API
@app.route("/chat", methods=["POST"])
def chat():

    data = request.json
    message = data.get("message")

    # Check if message exists
    if not message:
        return jsonify({"reply": "Please send a message"}), 400

    answer = answer_question(message)

    return jsonify({
        "reply": answer
    })

# Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)