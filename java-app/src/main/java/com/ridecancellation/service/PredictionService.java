package com.ridecancellation.service;

import com.ridecancellation.model.DashboardStats;
import com.ridecancellation.model.PredictionRequest;
import com.ridecancellation.model.PredictionResponse;
import com.ridecancellation.model.RidePrediction;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class PredictionService {
    private final FlaskApiClient apiClient;
    private final PredictionRepository repository;

    public PredictionService() {
        this(new FlaskApiClient(), new PredictionRepository());
    }

    public PredictionService(FlaskApiClient apiClient, PredictionRepository repository) {
        this.apiClient = apiClient;
        this.repository = repository;
    }

    public boolean isMlApiAvailable() {
        return apiClient.isApiHealthy();
    }

    public PredictionResponse predictAndSave(PredictionRequest request) throws IOException, SQLException {
        PredictionResponse response = apiClient.predict(request);
        repository.save(request, response);
        return response;
    }

    public List<RidePrediction> getHistory() throws SQLException {
        return repository.findAllOrderByDateDesc();
    }

    public DashboardStats getDashboardStats() throws SQLException {
        return repository.getDashboardStats();
    }
}
