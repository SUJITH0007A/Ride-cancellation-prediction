package com.ridecancellation.util;

import com.ridecancellation.model.PredictionRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public final class ValidationUtils {
    public static final Set<String> VALID_WEATHERS = Set.of("Clear", "Rain", "Snow", "Fog", "Storm");
    public static final Set<String> VALID_VEHICLES = Set.of("Sedan", "SUV", "Hatchback", "Luxury", "Bike");

    private ValidationUtils() {
    }

    public static List<String> validate(String hourText, String ratingText, String surgeText,
                                        String distanceText, String weather, String vehicleType) {
        List<String> errors = new ArrayList<>();
        if (hourText == null || hourText.isBlank()) {
            errors.add("Booking hour is required.");
        } else {
            try {
                int hour = Integer.parseInt(hourText.trim());
                if (hour < 0 || hour > 23) errors.add("Booking hour must be between 0 and 23.");
            } catch (NumberFormatException e) {
                errors.add("Booking hour must be a whole number.");
            }
        }
        if (ratingText == null || ratingText.isBlank()) {
            errors.add("Driver rating is required.");
        } else {
            try {
                double rating = Double.parseDouble(ratingText.trim());
                if (rating < 1.0 || rating > 5.0) errors.add("Driver rating must be between 1.0 and 5.0.");
            } catch (NumberFormatException e) {
                errors.add("Driver rating must be a valid number.");
            }
        }
        if (surgeText == null || surgeText.isBlank()) {
            errors.add("Surge multiplier is required.");
        } else {
            try {
                double surge = Double.parseDouble(surgeText.trim());
                if (surge < 1.0 || surge > 5.0) errors.add("Surge multiplier must be between 1.0 and 5.0.");
            } catch (NumberFormatException e) {
                errors.add("Surge multiplier must be a valid number.");
            }
        }
        if (distanceText == null || distanceText.isBlank()) {
            errors.add("Distance is required.");
        } else {
            try {
                double distance = Double.parseDouble(distanceText.trim());
                if (distance <= 0 || distance > 100) errors.add("Distance must be between 0.1 and 100 km.");
            } catch (NumberFormatException e) {
                errors.add("Distance must be a valid number.");
            }
        }
        if (weather == null || !VALID_WEATHERS.contains(weather)) {
            errors.add("Please select a valid weather condition.");
        }
        if (vehicleType == null || !VALID_VEHICLES.contains(vehicleType)) {
            errors.add("Please select a valid vehicle type.");
        }
        return errors;
    }

    public static PredictionRequest buildRequest(String hourText, String ratingText, String surgeText,
                                                  String distanceText, String weather, String vehicleType) {
        return new PredictionRequest(
                Integer.parseInt(hourText.trim()),
                Double.parseDouble(ratingText.trim()),
                Double.parseDouble(surgeText.trim()),
                Double.parseDouble(distanceText.trim()),
                weather,
                vehicleType
        );
    }
}
