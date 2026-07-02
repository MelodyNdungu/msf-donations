/**
 * Centralized Express error handler.
 * Catches errors passed via next(err) and returns a consistent JSON response.
 * Never leaks stack traces to the client.
 */
export function errorHandler(err, req, res, _next) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Unhandled error: ${err.stack || err.message}`);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? 'An unexpected server error occurred. Please try again.'
      : err.message;

  res.status(statusCode).json({ success: false, message });
}
