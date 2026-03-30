package com.pms.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * Render provides Postgres as a `postgres://user:pass@host:port/db` connection string.
 * Spring's DataSource expects JDBC: `jdbc:postgresql://host:port/db`.
 *
 * This runs early and rewrites `DATABASE_URL` into `spring.datasource.url` when needed.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String PROPERTY_SOURCE_NAME = "renderDatabaseUrl";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String alreadySet = environment.getProperty("spring.datasource.url");
        if (alreadySet != null && !alreadySet.isBlank() && alreadySet.startsWith("jdbc:")) {
            return;
        }

        String jdbcUrl = environment.getProperty("JDBC_DATABASE_URL");
        if (jdbcUrl != null && !jdbcUrl.isBlank()) {
            return;
        }

        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            return;
        }

        String converted = toJdbcPostgres(databaseUrl);
        if (converted == null) {
            return;
        }

        Map<String, Object> props = new HashMap<>();
        props.put("spring.datasource.url", converted);

        // If credentials are embedded in the URL, Spring can use them without username/password.
        // We only provide username/password if the user didn't already specify them.
        if (environment.getProperty("spring.datasource.username") == null) {
            String username = extractUser(databaseUrl);
            if (username != null && !username.isBlank()) props.put("spring.datasource.username", username);
        }
        if (environment.getProperty("spring.datasource.password") == null) {
            String password = extractPassword(databaseUrl);
            if (password != null && !password.isBlank()) props.put("spring.datasource.password", password);
        }

        environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, props));
    }

    private static String toJdbcPostgres(String url) {
        try {
            URI uri = URI.create(url);
            String scheme = uri.getScheme();
            if (scheme == null) return null;
            if (!scheme.equalsIgnoreCase("postgres") && !scheme.equalsIgnoreCase("postgresql")) return null;

            String host = uri.getHost();
            int port = uri.getPort();
            String path = uri.getPath(); // includes leading '/'
            if (host == null || host.isBlank() || path == null || path.isBlank()) return null;

            StringBuilder sb = new StringBuilder();
            sb.append("jdbc:postgresql://").append(host);
            if (port > 0) sb.append(":").append(port);
            sb.append(path);

            // Preserve query params (e.g. sslmode=require)
            String query = uri.getQuery();
            if (query != null && !query.isBlank()) sb.append("?").append(query);

            return sb.toString();
        } catch (Exception e) {
            return null;
        }
    }

    private static String extractUser(String url) {
        try {
            URI uri = URI.create(url);
            String userInfo = uri.getUserInfo();
            if (userInfo == null) return null;
            int idx = userInfo.indexOf(':');
            return idx >= 0 ? userInfo.substring(0, idx) : userInfo;
        } catch (Exception e) {
            return null;
        }
    }

    private static String extractPassword(String url) {
        try {
            URI uri = URI.create(url);
            String userInfo = uri.getUserInfo();
            if (userInfo == null) return null;
            int idx = userInfo.indexOf(':');
            return idx >= 0 ? userInfo.substring(idx + 1) : null;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}

