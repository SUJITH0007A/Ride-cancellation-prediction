"""
Generate a synthetic ride cancellation dataset for training.
Run: python generate_dataset.py
"""

import os
import random
from typing import Dict, List

import numpy as np
import pandas as pd

RANDOM_SEED = 42
random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

WEATHERS = ["Clear", "Rain", "Snow", "Fog", "Storm"]
VEHICLES = ["Sedan", "SUV", "Hatchback", "Luxury", "Bike"]
NUM_SAMPLES = 2000

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "ride_cancellations.csv")


def cancellation_probability(row: dict) -> float:
    prob = 0.12

    hour = row["booking_hour"]
    if hour in (7, 8, 9, 17, 18, 19, 20):
        prob += 0.08
    if hour >= 22 or hour <= 5:
        prob += 0.15

    if row["driver_rating"] < 3.5:
        prob += 0.22
    elif row["driver_rating"] < 4.0:
        prob += 0.10

    if row["surge_multiplier"] > 2.0:
        prob += 0.18
    elif row["surge_multiplier"] > 1.5:
        prob += 0.08

    if row["distance"] > 25:
        prob += 0.12
    elif row["distance"] > 15:
        prob += 0.06

    weather_boost = {
        "Clear": 0.0,
        "Fog": 0.10,
        "Rain": 0.14,
        "Snow": 0.20,
        "Storm": 0.28,
    }
    prob += weather_boost.get(row["weather"], 0.0)

    vehicle_boost = {
        "Bike": 0.05,
        "Hatchback": 0.02,
        "Sedan": 0.0,
        "SUV": -0.02,
        "Luxury": -0.04,
    }
    prob += vehicle_boost.get(row["vehicle_type"], 0.0)

    return min(max(prob, 0.02), 0.95)


def generate_rows(n: int) -> List[Dict]:
    rows = []
    for _ in range(n):
        booking_hour = random.randint(0, 23)
        driver_rating = round(random.uniform(2.0, 5.0), 1)
        surge_multiplier = round(random.uniform(1.0, 3.0), 2)
        distance = round(random.uniform(1.0, 40.0), 1)
        weather = random.choice(WEATHERS)
        vehicle_type = random.choice(VEHICLES)

        features = {
            "booking_hour": booking_hour,
            "driver_rating": driver_rating,
            "surge_multiplier": surge_multiplier,
            "distance": distance,
            "weather": weather,
            "vehicle_type": vehicle_type,
        }
        prob = cancellation_probability(features)
        cancelled = 1 if random.random() < prob else 0
        features["cancelled"] = cancelled
        rows.append(features)
    return rows


def main() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    rows = generate_rows(NUM_SAMPLES)
    df = pd.DataFrame(rows)
    df.to_csv(OUTPUT_FILE, index=False)
    cancel_rate = df["cancelled"].mean() * 100
    print("Dataset saved to: {}".format(OUTPUT_FILE))
    print("Rows: {} | Cancellation rate: {:.1f}%".format(len(df), cancel_rate))


if __name__ == "__main__":
    main()
