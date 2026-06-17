package com.ridecancellation.model;

public class DashboardStats {
    private final int totalPredictions;
    private final int cancelledCount;
    private final int notCancelledCount;
    private final double avgCancellationProbability;
    private final String mostRiskyWeather;

    public DashboardStats(int totalPredictions, int cancelledCount, int notCancelledCount,
                          double avgCancellationProbability, String mostRiskyWeather) {
        this.totalPredictions = totalPredictions;
        this.cancelledCount = cancelledCount;
        this.notCancelledCount = notCancelledCount;
        this.avgCancellationProbability = avgCancellationProbability;
        this.mostRiskyWeather = mostRiskyWeather;
    }

    public int getTotalPredictions() { return totalPredictions; }
    public int getCancelledCount() { return cancelledCount; }
    public int getNotCancelledCount() { return notCancelledCount; }
    public double getAvgCancellationProbability() { return avgCancellationProbability; }
    public String getMostRiskyWeather() { return mostRiskyWeather; }
}
