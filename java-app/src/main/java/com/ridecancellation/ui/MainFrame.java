package com.ridecancellation.ui;

import com.ridecancellation.db.DatabaseConnection;
import com.ridecancellation.service.PredictionService;

import javax.swing.BorderFactory;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTabbedPane;
import javax.swing.SwingConstants;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;

public class MainFrame extends JFrame {
    private final PredictionService predictionService = new PredictionService();
    private final HistoryPanel historyPanel;
    private final DashboardPanel dashboardPanel;

    public MainFrame() {
        setTitle("Ride Cancellation Prediction System");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1000, 680);
        setLocationRelativeTo(null);

        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(new Color(33, 150, 243));
        header.setBorder(BorderFactory.createEmptyBorder(14, 20, 14, 20));
        JLabel title = new JLabel("Ride Cancellation Prediction System");
        title.setForeground(Color.WHITE);
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        header.add(title, BorderLayout.CENTER);

        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("Predict", new PredictionPanel(predictionService, this::refreshTabs));
        historyPanel = new HistoryPanel(predictionService);
        dashboardPanel = new DashboardPanel(predictionService);
        tabs.addTab("History", historyPanel);
        tabs.addTab("Dashboard", dashboardPanel);
        add(header, BorderLayout.NORTH);
        add(tabs, BorderLayout.CENTER);

        if (!DatabaseConnection.testConnection()) {
            JOptionPane.showMessageDialog(this,
                    "Could not connect to Supabase.\nCheck config.properties and run supabase_schema.sql",
                    "Database Warning", JOptionPane.WARNING_MESSAGE);
        }
        if (!predictionService.isMlApiAvailable()) {
            JOptionPane.showMessageDialog(this,
                    "Flask API not running.\nRun: cd ml-service && python app.py",
                    "API Warning", JOptionPane.WARNING_MESSAGE);
        }
        refreshTabs();
    }

    private void refreshTabs() {
        historyPanel.refresh();
        dashboardPanel.refresh();
    }
}
