package com.ridecancellation.model;

public class PredictionResponse {
    private final double cancellationProbability;
    private final String riskLevel;
    private final boolean predictedCancelled;

    public PredictionResponse(double cancellationProbability, String riskLevel, boolean predictedCancelled) {
        this.cancellationProbability = cancellationProbability;
        this.riskLevel = riskLevel;
        this.predictedCancelled = predictedCancelled;
    }

    public double getCancellationProbability() { return cancellationProbability; }
    public String getRiskLevel() { return riskLevel; }
    public boolean isPredictedCancelled() { return predictedCancelled; }
}
