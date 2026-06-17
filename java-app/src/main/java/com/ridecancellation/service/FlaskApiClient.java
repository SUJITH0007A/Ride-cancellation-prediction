package com.ridecancellation.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ridecancellation.config.AppConfig;
import com.ridecancellation.model.PredictionRequest;
import com.ridecancellation.model.PredictionResponse;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class FlaskApiClient {
    private final Gson gson = new Gson();

    public boolean isApiHealthy() {
        try {
            HttpURLConnection conn = openConnection(AppConfig.healthEndpoint(), "GET");
            int code = conn.getResponseCode();
            conn.disconnect();
            return code == 200;
        } catch (IOException e) {
            return false;
        }
    }

    public PredictionResponse predict(PredictionRequest request) throws IOException {
        HttpURLConnection conn = openConnection(AppConfig.predictEndpoint(), "POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/json");

        JsonObject body = new JsonObject();
        body.addProperty("booking_hour", request.getBookingHour());
        body.addProperty("driver_rating", request.getDriverRating());
        body.addProperty("surge_multiplier", request.getSurgeMultiplier());
        body.addProperty("distance", request.getDistance());
        body.addProperty("weather", request.getWeather());
        body.addProperty("vehicle_type", request.getVehicleType());

        byte[] payload = gson.toJson(body).getBytes(StandardCharsets.UTF_8);
        try (OutputStream os = conn.getOutputStream()) {
            os.write(payload);
        }

        int status = conn.getResponseCode();
        String responseBody = readBody(conn, status >= 400);
        if (status != 200) {
            throw new IOException("API error (" + status + "): " + extractErrorMessage(responseBody));
        }

        JsonObject json = JsonParser.parseString(responseBody).getAsJsonObject();
        conn.disconnect();
        return new PredictionResponse(
                json.get("cancellation_probability").getAsDouble(),
                json.get("risk_level").getAsString(),
                json.get("predicted_cancelled").getAsBoolean()
        );
    }

    private HttpURLConnection openConnection(String endpoint, String method) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) URI.create(AppConfig.apiBaseUrl() + endpoint).toURL().openConnection();
        conn.setRequestMethod(method);
        conn.setConnectTimeout(AppConfig.apiTimeoutMs());
        conn.setReadTimeout(AppConfig.apiTimeoutMs());
        return conn;
    }

    private String readBody(HttpURLConnection conn, boolean errorStream) throws IOException {
        InputStream stream = errorStream ? conn.getErrorStream() : conn.getInputStream();
        if (stream == null) return "";
        try (Scanner scanner = new Scanner(stream, StandardCharsets.UTF_8)) {
            scanner.useDelimiter("\\A");
            return scanner.hasNext() ? scanner.next() : "";
        }
    }

    private String extractErrorMessage(String responseBody) {
        try {
            JsonObject json = JsonParser.parseString(responseBody).getAsJsonObject();
            if (json.has("error")) return json.get("error").getAsString();
        } catch (Exception ignored) {
        }
        return responseBody.isBlank() ? "Unknown error" : responseBody;
    }
}
