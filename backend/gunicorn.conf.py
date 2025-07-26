# Gunicorn configuration for Elliot OCEAN Terminal API
# Optimized for ML model serving with large memory requirements

import multiprocessing
import os

# Server socket - Heroku provides PORT environment variable
port = os.environ.get('PORT', 5001)
bind = f"0.0.0.0:{port}"
backlog = 2048

# Worker processes
workers = 1  # Single worker to avoid model loading overhead
worker_class = "sync"
worker_connections = 1000
timeout = 120  # Longer timeout for ML inference
keepalive = 2

# Memory and performance
max_requests = 500  # Restart workers after 500 requests to prevent memory leaks
max_requests_jitter = 50
preload_app = True  # Load app before forking workers

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "elliot-ocean-api"

# SSL/Security (for production)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"

# Development vs Production settings
if os.getenv("FLASK_ENV") == "development":
    reload = True
    workers = 1
    loglevel = "debug"
else:
    # Production settings
    reload = False
    workers = 1  # Keep single worker for model consistency
    worker_tmp_dir = "/dev/shm"  # Use shared memory for better performance
    
# Graceful shutdown
graceful_timeout = 30

def when_ready(server):
    """Called when the server is started."""
    server.log.info("🚀 Elliot OCEAN Terminal API server started")
    server.log.info("🧠 Ready to load OCEAN personality model (265.5MB)")
    server.log.info("📊 API endpoints: /api/analyze, /api/terminal, /api/model_info")

def worker_int(worker):
    """Called when worker receives INT or QUIT signal."""
    worker.log.info("🔄 Worker received signal, shutting down gracefully...")

def on_exit(server):
    """Called when the server shuts down."""
    server.log.info("👋 Elliot OCEAN Terminal API server stopped")