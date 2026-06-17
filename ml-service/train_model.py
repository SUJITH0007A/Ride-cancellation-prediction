"""
Train Logistic Regression and Random Forest, save the best model.
Run: python train_model.py
"""

import os

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

BASE_DIR = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE_DIR, "data", "ride_cancellations.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_FILE = os.path.join(MODEL_DIR, "cancellation_model.joblib")
METADATA_FILE = os.path.join(MODEL_DIR, "model_metadata.joblib")

FEATURE_COLUMNS = [
    "booking_hour",
    "driver_rating",
    "surge_multiplier",
    "distance",
    "weather",
    "vehicle_type",
]
TARGET = "cancelled"
CATEGORICAL = ["weather", "vehicle_type"]
NUMERIC = ["booking_hour", "driver_rating", "surge_multiplier", "distance"]


def build_preprocessor():
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERIC),
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        ]
    )


def build_pipeline(estimator):
    return Pipeline(
        steps=[
            ("preprocessor", build_preprocessor()),
            ("classifier", estimator),
        ]
    )


def main():
    if not os.path.exists(DATA_FILE):
        raise FileNotFoundError(
            "Dataset not found at {}. Run generate_dataset.py first.".format(DATA_FILE)
        )

    df = pd.read_csv(DATA_FILE)
    X = df[FEATURE_COLUMNS]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    models = {
        "logistic_regression": build_pipeline(
            LogisticRegression(max_iter=1000, random_state=42)
        ),
        "random_forest": build_pipeline(
            RandomForestClassifier(n_estimators=120, random_state=42)
        ),
    }

    best_name = None
    best_model = None
    best_accuracy = 0.0

    print("Training models...\n")
    for name, pipeline in models.items():
        pipeline.fit(X_train, y_train)
        preds = pipeline.predict(X_test)
        acc = accuracy_score(y_test, preds)
        print("=== {} ===".format(name.replace("_", " ").title()))
        print("Accuracy: {:.4f}".format(acc))
        print(classification_report(y_test, preds, target_names=["Not Cancelled", "Cancelled"]))
        if acc >= best_accuracy:
            best_accuracy = acc
            best_name = name
            best_model = pipeline

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(best_model, MODEL_FILE)
    joblib.dump(
        {
            "model_name": best_name,
            "accuracy": best_accuracy,
            "feature_columns": FEATURE_COLUMNS,
        },
        METADATA_FILE,
    )

    print("\nBest model: {} (accuracy={:.4f})".format(best_name, best_accuracy))
    print("Saved to: {}".format(MODEL_FILE))


if __name__ == "__main__":
    main()
