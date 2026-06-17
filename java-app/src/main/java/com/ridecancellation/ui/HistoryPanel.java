package com.ridecancellation.ui;

import com.ridecancellation.model.RidePrediction;
import com.ridecancellation.service.PredictionService;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.SwingWorker;
import javax.swing.table.DefaultTableModel;
import java.awt.BorderLayout;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class HistoryPanel extends JPanel {
    private final PredictionService service;
    private final DefaultTableModel tableModel = new DefaultTableModel(
            new String[]{"ID", "Hour", "Rating", "Surge", "Dist", "Weather", "Vehicle", "Prob%", "Risk", "Cancelled", "Date"}, 0) {
        @Override public boolean isCellEditable(int r, int c) { return false; }
    };
    private final JLabel statusLabel = new JLabel(" ");

    public HistoryPanel(PredictionService service) {
        this.service = service;
        setLayout(new BorderLayout(8, 8));
        setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12));
        JButton refreshBtn = new JButton("Refresh History");
        refreshBtn.addActionListener(e -> refresh());
        add(refreshBtn, BorderLayout.NORTH);
        JTable table = new JTable(tableModel);
        table.setAutoCreateRowSorter(true);
        add(new JScrollPane(table), BorderLayout.CENTER);
        add(statusLabel, BorderLayout.SOUTH);
    }

    public void refresh() {
        statusLabel.setText("Loading...");
        new SwingWorker<List<RidePrediction>, Void>() {
            String error;
            @Override protected List<RidePrediction> doInBackground() {
                try { return service.getHistory(); } catch (Exception ex) { error = ex.getMessage(); return List.of(); }
            }
            @Override protected void done() {
                if (error != null) { statusLabel.setText("Error: " + error); return; }
                tableModel.setRowCount(0);
                var fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
                try {
                    for (RidePrediction p : get()) {
                        tableModel.addRow(new Object[]{p.getPredictionId(), p.getBookingHour(), p.getDriverRating(),
                                p.getSurgeMultiplier(), p.getDistance(), p.getWeather(), p.getVehicleType(),
                                String.format("%.1f", p.getCancellationProbability() * 100), p.getRiskLevel(),
                                p.isPredictedCancelled() ? "Yes" : "No",
                                p.getPredictionDate() != null ? p.getPredictionDate().format(fmt) : ""});
                    }
                    statusLabel.setText(tableModel.getRowCount() + " record(s).");
                } catch (Exception ex) { statusLabel.setText("Error: " + ex.getMessage()); }
            }
        }.execute();
    }
}
