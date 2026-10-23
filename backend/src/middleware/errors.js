// Anything that matched no route.
export function notFound(req, res) {
  res.status(404).json({ ok: false, error: 'Not found' });
}

// Last stop for errors: friendly messages, no internal details leaked.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, error: 'Invalid JSON' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ ok: false, error: 'Request too large' });
  }
  console.error('Unhandled error:', err.message);
  res.status(500).json({ ok: false, error: 'Something went wrong' });
}
