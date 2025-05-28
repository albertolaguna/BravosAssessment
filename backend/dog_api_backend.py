from flask import Flask, jsonify
import urllib.request
import json

app = Flask(__name__)
BASE_URL = "https://dogapi.dog/api/v2"


def fetch_from_dog_api(endpoint):
    url = f"{BASE_URL}/{endpoint}"
    try:
        with urllib.request.urlopen(url) as response:
            data = response.read().decode()
            return json.loads(data)
    except Exception as e:
        return {"error": str(e)}


@app.route("/breeds", methods=["GET"])
def get_breeds():
    return jsonify(fetch_from_dog_api("breeds"))


@app.route("/breeds/<breed_id>", methods=["GET"])
def get_breed_by_id(breed_id):
    return jsonify(fetch_from_dog_api(f"breeds/{breed_id}"))


@app.route("/facts", methods=["GET"])
def get_facts():
    return jsonify(fetch_from_dog_api("facts"))


@app.route("/groups", methods=["GET"])
def get_groups():
    return jsonify(fetch_from_dog_api("groups"))


@app.route("/groups/<group_id>", methods=["GET"])
def get_group_by_id(group_id):
    return jsonify(fetch_from_dog_api(f"groups/{group_id}"))


@app.route("/group-details/<group_id>", methods=["GET"])
def get_group_details(group_id):
    return jsonify(fetch_from_dog_api(f"groups/{group_id}/relationships/breeds"))


@app.route("/group-details/<group_id>/breed/<breed_id>", methods=["GET"])
def get_breed_in_group(group_id, breed_id):
    group_data = fetch_from_dog_api(f"groups/{group_id}/relationships/breeds")
    if "data" in group_data:
        for breed in group_data["data"]:
            if breed["id"] == breed_id:
                return jsonify(breed)
        return jsonify({"error": "Breed not found in group"}), 404
    return jsonify(group_data)


if __name__ == "__main__":
    app.run(debug=True)
