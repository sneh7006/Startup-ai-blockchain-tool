from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# -----------------------------
# AI MODEL (Simple Classifier)
# -----------------------------
def classify_query(text):
    text = text.lower()

    if "buy" in text or "price" in text or "cost" in text:
        return "Sales"

    elif "issue" in text or "error" in text or "problem" in text:
        return "Support"

    elif "bad" in text or "complaint" in text or "not happy" in text:
        return "Complaint"

    else:
        return "General"


# -----------------------------
# API ROUTES
# -----------------------------

# Home route (test)
@app.route('/')
def home():
    return "Backend is running 🚀"


# Classification API
@app.route('/classify', methods=['POST'])
def classify():
    data = request.json

    if not data or 'text' not in data:
        return jsonify({"error": "No input provided"}), 400

    query = data['text']
    result = classify_query(query)

    return jsonify({
        "query": query,
        "category": result
    })


# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == '__main__':
    app.run(debug=True)