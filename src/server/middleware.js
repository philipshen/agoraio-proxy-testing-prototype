/**
 * Prevents response from being cached so we always get a fresh response
 */
function noCache(_req, resp, next) {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  resp.header('Expires', '-1');
  resp.header('Pragma', 'no-cache');
  next();
}

module.exports = {
  noCache,
}