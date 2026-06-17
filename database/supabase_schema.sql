-- Ride Cancellation Prediction System - Supabase (PostgreSQL)
-- Paste this entire file into: Supabase Dashboard → SQL Editor → New query → Run

CREATE TABLE IF NOT EXISTS predictions (
    prediction_id            SERIAL PRIMARY KEY,
    booking_hour             SMALLINT NOT NULL CHECK (booking_hour BETWEEN 0 AND 23),
    driver_rating            NUMERIC(2,1) NOT NULL CHECK (driver_rating BETWEEN 1.0 AND 5.0),
    surge_multiplier         NUMERIC(3,2) NOT NULL CHECK (surge_multiplier >= 1.00),
    distance                 NUMERIC(6,2) NOT NULL CHECK (distance > 0),
    weather                  VARCHAR(20) NOT NULL,
    vehicle_type             VARCHAR(20) NOT NULL,
    cancellation_probability NUMERIC(6,4) NOT NULL,
    risk_level               VARCHAR(10) NOT NULL,
    predicted_cancelled      BOOLEAN NOT NULL DEFAULT FALSE,
    prediction_date          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_predictions_date ON predictions (prediction_date DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_risk ON predictions (risk_level);
CREATE INDEX IF NOT EXISTS idx_predictions_weather ON predictions (weather);

CREATE OR REPLACE VIEW prediction_analytics AS
SELECT
    COUNT(*)::INT AS total_predictions,
    COUNT(*) FILTER (WHERE predicted_cancelled)::INT AS cancelled_count,
    COUNT(*) FILTER (WHERE NOT predicted_cancelled)::INT AS not_cancelled_count,
    ROUND(AVG(cancellation_probability)::NUMERIC, 4) AS avg_cancellation_probability
FROM predictions;
