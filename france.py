from flask import Flask, request, jsonify # type: ignore
import json
import os

app = Flask(__name__)

# Path to the comments file
COMMENTS_FILE = "comments.json"

# Ensure the comments file exists
if not os.path.exists(COMMENTS_FILE):
    with open(COMMENTS_FILE, "w") as file:
        json.dump([], file)

# Route to get all comments
@app.route("/comments", methods=["GET"])
def get_comments():
    with open(COMMENTS_FILE, "r") as file:
        comments = json.load(file)
    return jsonify(comments)

# Route to post a new comment
@app.route("/comments", methods=["POST"])
def post_comment():
    data = request.get_json()
    if "name" not in data or "comment" not in data:
        return jsonify({"error": "Name and comment are required"}), 400

    # Load existing comments
    with open(COMMENTS_FILE, "r") as file:
        comments = json.load(file)

    # Add the new comment
    new_comment = {
        "name": data["name"],
        "comment": data["comment"]
    }
    comments.append(new_comment)

    # Save the updated comments
    with open(COMMENTS_FILE, "w") as file:
        json.dump(comments, file)

    return jsonify(new_comment), 201

if __name__ == "__main__":
    app.run(debug=True)

