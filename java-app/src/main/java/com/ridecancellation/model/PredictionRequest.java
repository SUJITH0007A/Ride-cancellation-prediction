package com.ridecancellation.model;

public class PredictionRequest {
    private final int bookingHour;
    private final double driverRating;
    private final double surgeMultiplier;
    private final double distance;
    private final String weather;
    private final String vehicleType;

    public PredictionRequest(int bookingHour, double driverRating, double surgeMultiplier,
                             double distance, String weather, String vehicleType) {
        this.bookingHour = bookingHour;
        this.driverRating = driverRating;
        this.surgeMultiplier = surgeMultiplier;
        this.distance = distance;
        this.weather = weather;
        this.vehicleType = vehicleType;
    }

    public int getBookingHour() { return bookingHour; }
    public double getDriverRating() { return driverRating; }
    public double getSurgeMultiplier() { return surgeMultiplier; }
    public double getDistance() { return distance; }
    public String getWeather() { return weather; }
    public String getVehicleType() { return vehicleType; }
}
