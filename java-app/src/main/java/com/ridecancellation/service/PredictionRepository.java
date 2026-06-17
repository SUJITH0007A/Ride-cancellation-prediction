package com.ridecancellation.service;

import com.ridecancellation.db.DatabaseConnection;
import com.ridecancellation.model.DashboardStats;
import com.ridecancellation.model.PredictionRequest;
import com.ridecancellation.model.PredictionResponse;
import com.ridecancellation.model.RidePrediction;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PredictionRepository {

    public void save(PredictionRequest request, PredictionResponse response) throws SQLException {
        String sql = "INSERT INTO predictions (booking_hour, driver_rating, surge_multiplier, distance, "
                + "weather, vehicle_type, cancellation_probability, risk_level, predicted_cancelled, prediction_date) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, request.getBookingHour());
            ps.setDouble(2, request.getDriverRating());
            ps.setDouble(3, request.getSurgeMultiplier());
            ps.setDouble(4, request.getDistance());
            ps.setString(5, request.getWeather());
            ps.setString(6, request.getVehicleType());
            ps.setDouble(7, response.getCancellationProbability());
            ps.setString(8, response.getRiskLevel());
            ps.setBoolean(9, response.isPredictedCancelled());
            ps.setTimestamp(10, Timestamp.valueOf(LocalDateTime.now()));
            ps.executeUpdate();
        }
    }

    public List<RidePrediction> findAllOrderByDateDesc() throws SQLException {
        String sql = "SELECT prediction_id, booking_hour, driver_rating, surge_multiplier, distance, "
                + "weather, vehicle_type, cancellation_probability, risk_level, predicted_cancelled, prediction_date "
                + "FROM predictions ORDER BY prediction_date DESC";
        List<RidePrediction> list = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) list.add(mapRow(rs));
        }
        return list;
    }

    public DashboardStats getDashboardStats() throws SQLException {
        String sql = "SELECT COUNT(*)::INT AS total, "
                + "COUNT(*) FILTER (WHERE predicted_cancelled)::INT AS cancelled, "
                + "COUNT(*) FILTER (WHERE NOT predicted_cancelled)::INT AS not_cancelled, "
                + "COALESCE(AVG(cancellation_probability), 0) AS avg_prob FROM predictions";
        int total = 0, cancelled = 0, notCancelled = 0;
        double avgProb = 0;
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                total = rs.getInt("total");
                cancelled = rs.getInt("cancelled");
                notCancelled = rs.getInt("not_cancelled");
                avgProb = rs.getDouble("avg_prob");
            }
        }
        return new DashboardStats(total, cancelled, notCancelled, avgProb, findMostRiskyWeather());
    }

    private String findMostRiskyWeather() throws SQLException {
        String sql = "SELECT weather FROM predictions GROUP BY weather "
                + "ORDER BY AVG(cancellation_probability) DESC LIMIT 1";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) return rs.getString("weather");
        }
        return "N/A";
    }

    private RidePrediction mapRow(ResultSet rs) throws SQLException {
        RidePrediction p = new RidePrediction();
        p.setPredictionId(rs.getInt("prediction_id"));
        p.setBookingHour(rs.getInt("booking_hour"));
        p.setDriverRating(rs.getDouble("driver_rating"));
        p.setSurgeMultiplier(rs.getDouble("surge_multiplier"));
        p.setDistance(rs.getDouble("distance"));
        p.setWeather(rs.getString("weather"));
        p.setVehicleType(rs.getString("vehicle_type"));
        p.setCancellationProbability(rs.getDouble("cancellation_probability"));
        p.setRiskLevel(rs.getString("risk_level"));
        p.setPredictedCancelled(rs.getBoolean("predicted_cancelled"));
        Timestamp ts = rs.getTimestamp("prediction_date");
        if (ts != null) p.setPredictionDate(ts.toLocalDateTime());
        return p;
    }
}
