package com.ridecancellation.model;

import java.time.LocalDateTime;

public class RidePrediction {
    private int predictionId;
    private int bookingHour;
    private double driverRating;
    private double surgeMultiplier;
    private double distance;
    private String weather;
    private String vehicleType;
    private double cancellationProbability;
    private String riskLevel;
    private boolean predictedCancelled;
    private LocalDateTime predictionDate;

    public int getPredictionId() { return predictionId; }
    public void setPredictionId(int predictionId) { this.predictionId = predictionId; }
    public int getBookingHour() { return bookingHour; }
    public void setBookingHour(int bookingHour) { this.bookingHour = bookingHour; }
    public double getDriverRating() { return driverRating; }
    public void setDriverRating(double driverRating) { this.driverRating = driverRating; }
    public double getSurgeMultiplier() { return surgeMultiplier; }
    public void setSurgeMultiplier(double surgeMultiplier) { this.surgeMultiplier = surgeMultiplier; }
    public double getDistance() { return distance; }
    public void setDistance(double distance) { this.distance = distance; }
    public String getWeather() { return weather; }
    public void setWeather(String weather) { this.weather = weather; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    public double getCancellationProbability() { return cancellationProbability; }
    public void setCancellationProbability(double cancellationProbability) { this.cancellationProbability = cancellationProbability; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public boolean isPredictedCancelled() { return predictedCancelled; }
    public void setPredictedCancelled(boolean predictedCancelled) { this.predictedCancelled = predictedCancelled; }
    public LocalDateTime getPredictionDate() { return predictionDate; }
    public void setPredictionDate(LocalDateTime predictionDate) { this.predictionDate = predictionDate; }
}
