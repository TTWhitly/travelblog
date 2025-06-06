from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# Set up OpenAI API key
openai.api_key = ""

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    try:
        # Send the user message to ChatGPT
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message},
            ],
        )
        # Extract the AI's response
        ai_message = response["choices"][0]["message"]["content"]
        return jsonify({"message": ai_message})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
