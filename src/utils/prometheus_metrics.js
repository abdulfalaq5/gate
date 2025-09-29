const promClient = require('prom-client');
const { Logger } = require('./enhanced_logger');
const ssoConfig = require('../config/sso_config');

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add default metrics (memory, cpu, etc)
promClient.collectDefaultMetrics({ register });

// Custom HTTP metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'gate_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'service'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new promClient.Counter({
  name: 'gate_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'service']
});

const httpRequestSize = new promClient.Histogram({
  name: 'gate_http_request_size_bytes',
  help: 'Size of HTTP requests in bytes',
  labelNames: ['method', 'route', 'service'],
  buckets: [100, 1000, 10000, 100000, 1000000]
});

const httpResponseSize = new promClient.Histogram({
  name: 'gate_http_response_size_bytes',
  help: 'Size of HTTP responses in bytes',
  labelNames: ['method', 'route', 'service'],
  buckets: [100, 1000, 10000, 100000, 1000000]
});

// System metrics
const activeConnections = new promClient.Gauge({
  name: 'gate_active_connections',
  help: 'Number of active connections'
});

const memoryUsage = new promClient.Gauge({
  name: 'gate_memory_usage_bytes',
  help: 'Memory usage in bytes',
  labelNames: ['type']
});

const cpuUsage = new promClient.Gauge({
  name: 'gate_cpu_usage_percent',
  help: 'CPU usage percentage'
});

// SSO specific metrics
const ssoLoginAttempts = new promClient.Counter({
  name: 'gate_sso_login_attempts_total',
  help: 'Total number of SSO login attempts',
  labelNames: ['status', 'method']
});

const ssoTokenExchanges = new promClient.Counter({
  name: 'gate_sso_token_exchanges_total',
  help: 'Total number of SSO token exchanges',
  labelNames: ['status', 'type']
});

const ssoActiveSessions = new promClient.Gauge({
  name: 'gate_sso_active_sessions',
  help: 'Number of active SSO sessions'
});

const ssoRateLimitHits = new promClient.Counter({
  name: 'gate_sso_rate_limit_hits_total',
  help: 'Total number of SSO rate limit hits',
  labelNames: ['endpoint', 'client_ip']
});

// Database metrics
const dbConnections = new promClient.Gauge({
  name: 'gate_db_connections_active',
  help: 'Number of active database connections'
});

const dbQueryDuration = new promClient.Histogram({
  name: 'gate_db_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['query_type', 'table']
});

const dbQueryTotal = new promClient.Counter({
  name: 'gate_db_queries_total',
  help: 'Total number of database queries',
  labelNames: ['query_type', 'table', 'status']
});

// Business logic metrics
const employeeImportTotal = new promClient.Counter({
  name: 'gate_employee_imports_total',
  help: 'Total number of employee imports',
  labelNames: ['status', 'source']
});

const fileUploadTotal = new promClient.Counter({
  name: 'gate_file_uploads_total',
  help: 'Total number of file uploads',
  labelNames: ['file_type', 'status']
});

const queueProcessedTotal = new promClient.Counter({
  name: 'gate_queue_processed_total',
  help: 'Total number of queue items processed',
  labelNames: ['queue_name', 'status']
});

// Error metrics
const errorTotal = new promClient.Counter({
  name: 'gate_errors_total',
  help: 'Total number of errors',
  labelNames: ['error_type', 'severity', 'module']
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(httpRequestSize);
register.registerMetric(httpResponseSize);
register.registerMetric(activeConnections);
register.registerMetric(memoryUsage);
register.registerMetric(cpuUsage);
register.registerMetric(ssoLoginAttempts);
register.registerMetric(ssoTokenExchanges);
register.registerMetric(ssoActiveSessions);
register.registerMetric(ssoRateLimitHits);
register.registerMetric(dbConnections);
register.registerMetric(dbQueryDuration);
register.registerMetric(dbQueryTotal);
register.registerMetric(employeeImportTotal);
register.registerMetric(fileUploadTotal);
register.registerMetric(queueProcessedTotal);
register.registerMetric(errorTotal);

class PrometheusMetrics {
  constructor() {
    this.isEnabled = ssoConfig.sso.monitoring.enableMetrics;
    this.startSystemMetricsCollection();
  }

  // System metrics collection
  startSystemMetricsCollection() {
    if (!this.isEnabled) {
      Logger.info('Prometheus metrics disabled in configuration');
      return;
    }

    // Collect system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);

    Logger.info('Prometheus metrics collection started');
  }

  collectSystemMetrics() {
    try {
      const memUsage = process.memoryUsage();
      
      // Memory metrics
      memoryUsage.set({ type: 'heap_used' }, memUsage.heapUsed);
      memoryUsage.set({ type: 'heap_total' }, memUsage.heapTotal);
      memoryUsage.set({ type: 'external' }, memUsage.external);
      memoryUsage.set({ type: 'rss' }, memUsage.rss);

      // CPU metrics (simplified)
      const cpuUsagePercent = process.cpuUsage();
      const totalCpuUsage = (cpuUsagePercent.user + cpuUsagePercent.system) / 1000000; // Convert to seconds
      cpuUsage.set(totalCpuUsage);

      // Active connections (simplified - you might want to implement proper tracking)
      activeConnections.set(Math.floor(Math.random() * 100) + 50); // Placeholder

    } catch (error) {
      Logger.error('Error collecting system metrics', { error: error.message });
    }
  }

  // HTTP metrics middleware
  httpMetricsMiddleware() {
    return (req, res, next) => {
      if (!this.isEnabled) {
        return next();
      }

      const start = Date.now();
      const route = req.route ? req.route.path : req.path;
      const service = 'gate-api';

      // Track request size
      const requestSize = parseInt(req.get('content-length') || '0');
      if (requestSize > 0) {
        httpRequestSize.observe(
          { method: req.method, route, service },
          requestSize
        );
      }

      // Override res.end to capture response metrics
      const originalEnd = res.end;
      res.end = function(chunk, encoding) {
        const duration = (Date.now() - start) / 1000;
        const responseSize = chunk ? Buffer.byteLength(chunk, encoding) : 0;

        // Record metrics
        httpRequestDuration.observe(
          { 
            method: req.method, 
            route, 
            status_code: res.statusCode.toString(),
            service 
          },
          duration
        );

        httpRequestTotal.inc({
          method: req.method,
          route,
          status_code: res.statusCode.toString(),
          service
        });

        if (responseSize > 0) {
          httpResponseSize.observe(
            { method: req.method, route, service },
            responseSize
          );
        }

        originalEnd.call(this, chunk, encoding);
      };

      next();
    };
  }

  // SSO metrics
  recordSsoLoginAttempt(status, method = 'password') {
    if (this.isEnabled) {
      ssoLoginAttempts.inc({ status, method });
    }
  }

  recordSsoTokenExchange(status, type = 'refresh') {
    if (this.isEnabled) {
      ssoTokenExchanges.inc({ status, type });
    }
  }

  setSsoActiveSessions(count) {
    if (this.isEnabled) {
      ssoActiveSessions.set(count);
    }
  }

  recordSsoRateLimitHit(endpoint, clientIp) {
    if (this.isEnabled) {
      ssoRateLimitHits.inc({ endpoint, client_ip: clientIp });
    }
  }

  // Database metrics
  setDbConnections(count) {
    if (this.isEnabled) {
      dbConnections.set(count);
    }
  }

  recordDbQuery(queryType, table, duration, status = 'success') {
    if (this.isEnabled) {
      dbQueryDuration.observe({ query_type: queryType, table }, duration);
      dbQueryTotal.inc({ query_type: queryType, table, status });
    }
  }

  // Business logic metrics
  recordEmployeeImport(status, source = 'csv') {
    if (this.isEnabled) {
      employeeImportTotal.inc({ status, source });
    }
  }

  recordFileUpload(fileType, status) {
    if (this.isEnabled) {
      fileUploadTotal.inc({ file_type: fileType, status });
    }
  }

  recordQueueProcessed(queueName, status) {
    if (this.isEnabled) {
      queueProcessedTotal.inc({ queue_name: queueName, status });
    }
  }

  // Error metrics
  recordError(errorType, severity = 'error', module = 'unknown') {
    if (this.isEnabled) {
      errorTotal.inc({ error_type: errorType, severity, module });
    }
  }

  // Get metrics endpoint
  async getMetrics() {
    if (!this.isEnabled) {
      return '# Prometheus metrics disabled\n';
    }

    try {
      return await register.metrics();
    } catch (error) {
      Logger.error('Error getting Prometheus metrics', { error: error.message });
      return '# Error generating metrics\n';
    }
  }

  // Health check for metrics
  isHealthy() {
    return this.isEnabled;
  }
}

// Create singleton instance
const prometheusMetrics = new PrometheusMetrics();

module.exports = {
  PrometheusMetrics,
  prometheusMetrics,
  register
};
