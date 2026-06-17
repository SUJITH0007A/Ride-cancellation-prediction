package com.ridecancellation.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public final class AppConfig {
    private static final Properties PROPERTIES = new Properties();

    static {
        try (InputStream in = AppConfig.class.getClassLoader().getResourceAsStream("config.properties")) {
            if (in == null) {
                throw new IllegalStateException("config.properties not found on classpath");
            }
            PROPERTIES.load(in);
        } catch (IOException e) {
            throw new ExceptionInInitializerError("Failed to load config.properties: " + e.getMessage());
        }
    }

    private AppConfig() {
    }

    public static String get(String key) {
        return PROPERTIES.getProperty(key);
    }

    public static String dbUrl() {
        return get("db.url");
    }

    public static String dbUser() {
        return get("db.user");
    }

    public static String dbPassword() {
        return get("db.password");
    }

    public static String apiBaseUrl() {
        return get("api.baseUrl");
    }

    public static String predictEndpoint() {
        return get("api.predictEndpoint");
    }

    public static String healthEndpoint() {
        return get("api.healthEndpoint");
    }

    public static int apiTimeoutMs() {
        return Integer.parseInt(get("api.timeoutMs"));
    }
}
