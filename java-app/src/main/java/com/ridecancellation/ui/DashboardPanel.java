package com.ridecancellation.ui;

import com.ridecancellation.model.DashboardStats;
import com.ridecancellation.service.PredictionService;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.data.general.DefaultPieDataset;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingWorker;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.GridLayout;

public class DashboardPanel extends JPanel {
    private final PredictionService service;
    private final JLabel totalLabel = statLabel("0");
    private final JLabel cancelledLabel = statLabel("0");
    private final JLabel notCancelledLabel = statLabel("0");
    private final JLabel avgProbLabel = statLabel("0%");
    private final JLabel weatherLabel = statLabel("N/A");
    private final JPanel chartContainer = new JPanel(new BorderLayout());

    public DashboardPanel(PredictionService service) {
        this.service = service;
        setLayout(new BorderLayout(10, 10));
        setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12));
        JPanel cards = new JPanel(new GridLayout(2, 3, 12, 12));
        cards.add(card("Total Predictions", totalLabel));
        cards.add(card("Predicted Cancelled", cancelledLabel));
        cards.add(card("Predicted Not Cancelled", notCancelledLabel));
        cards.add(card("Avg Cancel Probability", avgProbLabel));
        cards.add(card("Most Risky Weather", weatherLabel));
        JButton refreshBtn = new JButton("Refresh Dashboard");
        refreshBtn.addActionListener(e -> refresh());
        JPanel top = new JPanel(new BorderLayout());
        top.add(cards, BorderLayout.CENTER);
        top.add(refreshBtn, BorderLayout.SOUTH);
        chartContainer.setBorder(BorderFactory.createTitledBorder("Outcomes"));
        add(top, BorderLayout.NORTH);
        add(chartContainer, BorderLayout.CENTER);
    }

    public void refresh() {
        new SwingWorker<DashboardStats, Void>() {
            String error;
            @Override protected DashboardStats doInBackground() {
                try { return service.getDashboardStats(); } catch (Exception ex) { error = ex.getMessage(); return null; }
            }
            @Override protected void done() {
                if (error != null) return;
                try {
                    DashboardStats s = get();
                    if (s == null) return;
                    totalLabel.setText(String.valueOf(s.getTotalPredictions()));
                    cancelledLabel.setText(String.valueOf(s.getCancelledCount()));
                    notCancelledLabel.setText(String.valueOf(s.getNotCancelledCount()));
                    avgProbLabel.setText(String.format("%.1f%%", s.getAvgCancellationProbability() * 100));
                    weatherLabel.setText(s.getMostRiskyWeather());
                    DefaultPieDataset<String> ds = new DefaultPieDataset<>();
                    if (s.getTotalPredictions() == 0) ds.setValue("No data", 1);
                    else { ds.setValue("Cancelled", s.getCancelledCount()); ds.setValue("Not Cancelled", s.getNotCancelledCount()); }
                    JFreeChart chart = ChartFactory.createPieChart("Prediction Outcomes", ds, true, true, false);
                    chartContainer.removeAll();
                    chartContainer.add(new ChartPanel(chart), BorderLayout.CENTER);
                    chartContainer.revalidate();
                    chartContainer.repaint();
                } catch (Exception ignored) { }
            }
        }.execute();
    }

    private static JLabel statLabel(String t) {
        JLabel l = new JLabel(t, JLabel.CENTER);
        l.setFont(new Font("Segoe UI", Font.BOLD, 24));
        return l;
    }

    private static JPanel card(String title, JLabel value) {
        JPanel p = new JPanel(new BorderLayout());
        p.setBorder(BorderFactory.createCompoundBorder(BorderFactory.createLineBorder(new Color(220, 220, 220)),
                BorderFactory.createEmptyBorder(12, 12, 12, 12)));
        JLabel t = new JLabel(title);
        t.setForeground(new Color(100, 100, 100));
        p.add(t, BorderLayout.NORTH);
        p.add(value, BorderLayout.CENTER);
        return p;
    }
}
