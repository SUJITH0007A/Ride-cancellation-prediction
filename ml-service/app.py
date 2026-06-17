"""
Flask API for ride cancellation prediction.
Run: python app.py
"""

import os
from datetime import datetime, timezone

import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS

try:
    import psycopg2
    import psycopg2.extras
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False

DB_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:COMFORT@@sanvi360@db.ilqheoyaqbzdmqsaasaw.supabase.co:5432/postgres?sslmode=require",
)


def get_db():
    if not DB_AVAILABLE:
        raise RuntimeError("psycopg2 not installed. Run: python -m pip install psycopg2-binary")
    return psycopg2.connect(DB_URL, cursor_factory=psycopg2.extras.RealDictCursor)

BASE_DIR = os.path.dirname(__file__)
MODEL_FILE = os.path.join(BASE_DIR, "models", "cancellation_model.joblib")
METADATA_FILE = os.path.join(BASE_DIR, "models", "model_metadata.joblib")

app = Flask(__name__)
CORS(app)

model = None
metadata = None

VALID_WEATHERS = ["Clear", "Rain", "Snow", "Fog", "Storm"]
VALID_VEHICLES = ["Sedan", "SUV", "Hatchback", "Luxury", "Bike"]


def risk_level(probability):
    if probability < 0.35:
        return "LOW"
    if probability < 0.65:
        return "MEDIUM"
    return "HIGH"


def load_artifacts():
    global model, metadata
    if not os.path.exists(MODEL_FILE):
        raise FileNotFoundError(
            "Model not found. Run generate_dataset.py and train_model.py first."
        )
    model = joblib.load(MODEL_FILE)
    metadata = joblib.load(METADATA_FILE) if os.path.exists(METADATA_FILE) else {}


def validate_payload(data):
    required = [
        "booking_hour",
        "driver_rating",
        "surge_multiplier",
        "distance",
        "weather",
        "vehicle_type",
    ]
    for field in required:
        if field not in data:
            return False, "Missing field: {}".format(field)

    try:
        hour = int(data["booking_hour"])
        if hour < 0 or hour > 23:
            return False, "booking_hour must be between 0 and 23"
    except (TypeError, ValueError):
        return False, "booking_hour must be an integer"

    try:
        rating = float(data["driver_rating"])
        if rating < 1.0 or rating > 5.0:
            return False, "driver_rating must be between 1.0 and 5.0"
    except (TypeError, ValueError):
        return False, "driver_rating must be a number"

    try:
        surge = float(data["surge_multiplier"])
        if surge < 1.0 or surge > 5.0:
            return False, "surge_multiplier must be between 1.0 and 5.0"
    except (TypeError, ValueError):
        return False, "surge_multiplier must be a number"

    try:
        distance = float(data["distance"])
        if distance <= 0 or distance > 100:
            return False, "distance must be between 0.1 and 100 km"
    except (TypeError, ValueError):
        return False, "distance must be a number"

    weather = str(data["weather"]).strip()
    if weather not in VALID_WEATHERS:
        return False, "weather must be one of: {}".format(", ".join(VALID_WEATHERS))

    vehicle_type = str(data["vehicle_type"]).strip()
    if vehicle_type not in VALID_VEHICLES:
        return False, "vehicle_type must be one of: {}".format(", ".join(VALID_VEHICLES))

    return True, ""


@app.route("/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": model is not None,
            "model_name": metadata.get("model_name") if metadata else None,
        }
    )


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 503

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    valid, message = validate_payload(data)
    if not valid:
        return jsonify({"error": message}), 400

    import pandas as pd

    row = pd.DataFrame(
        [
            {
                "booking_hour": int(data["booking_hour"]),
                "driver_rating": float(data["driver_rating"]),
                "surge_multiplier": float(data["surge_multiplier"]),
                "distance": float(data["distance"]),
                "weather": str(data["weather"]).strip(),
                "vehicle_type": str(data["vehicle_type"]).strip(),
            }
        ]
    )

    proba = float(model.predict_proba(row)[0][1])
    predicted_cancelled = bool(model.predict(row)[0] == 1)
    level = risk_level(proba)

    result = {
        "cancellation_probability": round(proba, 4),
        "risk_level": level.upper(),
        "predicted_cancelled": predicted_cancelled,
    }

    # Persist to Supabase
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """INSERT INTO predictions
                       (booking_hour, driver_rating, surge_multiplier, distance,
                        weather, vehicle_type, cancellation_probability,
                        risk_level, predicted_cancelled, prediction_date)
                       VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (
                        int(data["booking_hour"]),
                        float(data["driver_rating"]),
                        float(data["surge_multiplier"]),
                        float(data["distance"]),
                        str(data["weather"]).strip(),
                        str(data["vehicle_type"]).strip(),
                        round(proba, 4),
                        level.upper(),
                        predicted_cancelled,
                        datetime.now(timezone.utc),
                    ),
                )
            conn.commit()
    except Exception as db_err:
        print(f"[DB] Failed to save prediction: {db_err}")

    return jsonify(result)


@app.route("/predictions", methods=["GET"])
def get_predictions():
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT * FROM predictions ORDER BY prediction_date DESC LIMIT 200"
                )
                rows = cur.fetchall()
        records = []
        for r in rows:
            rec = dict(r)
            if rec.get("prediction_date"):
                rec["prediction_date"] = rec["prediction_date"].isoformat()
            rec["cancellation_probability"] = float(rec["cancellation_probability"])
            rec["driver_rating"] = float(rec["driver_rating"])
            rec["surge_multiplier"] = float(rec["surge_multiplier"])
            rec["distance"] = float(rec["distance"])
            records.append(rec)
        return jsonify(records)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/analytics", methods=["GET"])
def get_analytics():
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """SELECT
                        COUNT(*)::INT AS total_predictions,
                        COUNT(*) FILTER (WHERE predicted_cancelled)::INT AS cancelled_count,
                        COUNT(*) FILTER (WHERE NOT predicted_cancelled)::INT AS not_cancelled_count,
                        COALESCE(AVG(cancellation_probability), 0) AS avg_cancellation_probability
                       FROM predictions"""
                )
                row = dict(cur.fetchone())
                cur.execute(
                    """SELECT risk_level, COUNT(*)::INT AS cnt
                       FROM predictions GROUP BY risk_level"""
                )
                risk_rows = cur.fetchall()
                cur.execute(
                    """SELECT weather FROM predictions
                       GROUP BY weather ORDER BY AVG(cancellation_probability) DESC LIMIT 1"""
                )
                weather_row = cur.fetchone()
        row["avg_cancellation_probability"] = float(row["avg_cancellation_probability"])
        row["risk_breakdown"] = {r["risk_level"]: r["cnt"] for r in risk_rows}
        row["most_risky_weather"] = weather_row["weather"] if weather_row else None
        return jsonify(row)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    load_artifacts()
    print("Ride Cancellation ML API running on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=False)
