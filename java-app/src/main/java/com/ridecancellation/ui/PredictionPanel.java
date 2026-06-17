package com.ridecancellation.ui;

import com.ridecancellation.model.PredictionRequest;
import com.ridecancellation.model.PredictionResponse;
import com.ridecancellation.service.PredictionService;
import com.ridecancellation.util.ValidationUtils;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingWorker;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.stream.Collectors;

public class PredictionPanel extends JPanel {
    private final PredictionService service;
    private final Runnable onSaved;
    private final JTextField hourField = new JTextField(8);
    private final JTextField ratingField = new JTextField(8);
    private final JTextField surgeField = new JTextField(8);
    private final JTextField distanceField = new JTextField(8);
    private final JComboBox<String> weatherCombo = new JComboBox<>(ValidationUtils.VALID_WEATHERS.toArray(new String[0]));
    private final JComboBox<String> vehicleCombo = new JComboBox<>(ValidationUtils.VALID_VEHICLES.toArray(new String[0]));
    private final JTextArea resultArea = new JTextArea(8, 40);
    private final JButton predictButton = new JButton("Predict Cancellation Risk");

    public PredictionPanel(PredictionService service, Runnable onSaved) {
        this.service = service;
        this.onSaved = onSaved;
        setLayout(new BorderLayout(12, 12));
        setBorder(BorderFactory.createEmptyBorder(16, 16, 16, 16));

        JPanel form = new JPanel(new GridBagLayout());
        form.setBorder(BorderFactory.createTitledBorder("Ride Details"));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(6, 8, 6, 8);
        gbc.anchor = GridBagConstraints.WEST;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        addRow(form, gbc, 0, "Booking Hour (0-23):", hourField);
        addRow(form, gbc, 1, "Driver Rating (1-5):", ratingField);
        addRow(form, gbc, 2, "Surge Multiplier:", surgeField);
        addRow(form, gbc, 3, "Distance (km):", distanceField);
        addRow(form, gbc, 4, "Weather:", weatherCombo);
        addRow(form, gbc, 5, "Vehicle Type:", vehicleCombo);
        predictButton.setBackground(new Color(33, 150, 243));
        predictButton.setForeground(Color.WHITE);
        predictButton.addActionListener(e -> runPrediction());
        gbc.gridx = 0; gbc.gridy = 6; gbc.gridwidth = 2;
        form.add(predictButton, gbc);

        resultArea.setEditable(false);
        resultArea.setText("Enter ride details and click Predict.");
        add(form, BorderLayout.NORTH);
        add(new JScrollPane(resultArea), BorderLayout.CENTER);
    }

    private void addRow(JPanel form, GridBagConstraints gbc, int row, String label, java.awt.Component field) {
        gbc.gridx = 0; gbc.gridy = row; gbc.gridwidth = 1; gbc.weightx = 0;
        form.add(new JLabel(label), gbc);
        gbc.gridx = 1; gbc.weightx = 1;
        form.add(field, gbc);
    }

    private void runPrediction() {
        var errors = ValidationUtils.validate(hourField.getText(), ratingField.getText(), surgeField.getText(),
                distanceField.getText(), (String) weatherCombo.getSelectedItem(), (String) vehicleCombo.getSelectedItem());
        if (!errors.isEmpty()) {
            resultArea.setText(errors.stream().map(e -> " - " + e).collect(Collectors.joining("\n", "Validation errors:\n", "")));
            return;
        }
        PredictionRequest request = ValidationUtils.buildRequest(hourField.getText(), ratingField.getText(),
                surgeField.getText(), distanceField.getText(), (String) weatherCombo.getSelectedItem(), (String) vehicleCombo.getSelectedItem());
        predictButton.setEnabled(false);
        resultArea.setText("Calling ML API...");
        new SwingWorker<PredictionResponse, Void>() {
            String error;
            @Override
            protected PredictionResponse doInBackground() {
                try { return service.predictAndSave(request); }
                catch (Exception ex) { error = ex.getMessage(); return null; }
            }
            @Override
            protected void done() {
                predictButton.setEnabled(true);
                if (error != null) { resultArea.setText("Error: " + error); return; }
                try {
                    PredictionResponse r = get();
                    resultArea.setText(String.format("[%s RISK]\n\nCancellation Probability: %.2f%%\nRisk Level: %s\nOutcome: %s\n\nSaved to Supabase.",
                            r.getRiskLevel().toUpperCase(), r.getCancellationProbability() * 100, r.getRiskLevel(),
                            r.isPredictedCancelled() ? "Likely Cancelled" : "Likely Completed"));
                    onSaved.run();
                } catch (Exception ex) { resultArea.setText("Error: " + ex.getMessage()); }
            }
        }.execute();
    }
}
