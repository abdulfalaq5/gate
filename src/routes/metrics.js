const express = require('express');
const router = express.Router();
const { prometheusMetrics } = require('../utils/prometheus_metrics');
const { monitoringSystem } = require('../utils/monitoring_system');
const { Logger } = require('../utils/enhanced_logger');

/**
 * Prometheus metrics endpoint
 * GET /metrics
 * 
 * Returns metrics in Prometheus format for scraping
 */
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await prometheusMetrics.getMetrics();
    
    res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    res.send(metrics);
  } catch (error) {
    Logger.error('Error serving Prometheus metrics', { 
      error: error.message,
      stack: error.stack 
    });
    
    res.status(500).send('# Error generating metrics\n');
  }
});

/**
 * Health check endpoint for metrics system
 * GET /metrics/health
 */
router.get('/metrics/health', (req, res) => {
  try {
    const isHealthy = prometheusMetrics.isHealthy();
    
    res.json({
      status: isHealthy ? 'healthy' : 'disabled',
      timestamp: new Date().toISOString(),
      metrics_enabled: prometheusMetrics.isEnabled
    });
  } catch (error) {
    Logger.error('Error checking metrics health', { error: error.message });
    
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Custom application metrics endpoint
 * GET /metrics/app
 * 
 * Returns application-specific metrics in JSON format
 */
router.get('/metrics/app', async (req, res) => {
  try {
    const dashboardData = monitoringSystem.getDashboardData();
    
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: dashboardData
    });
  } catch (error) {
    Logger.error('Error getting application metrics', { error: error.message });
    
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
