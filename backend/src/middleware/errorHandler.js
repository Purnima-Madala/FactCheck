export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  const status = error.status || 500;
  res.status(status).json({
    error: error.message || "Unexpected server error"
  });
}
