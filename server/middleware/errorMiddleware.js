import { fail } from '../utils/apiResponse.js'

export function notFoundHandler(_req, res) {
  fail(res, 'Route not found', 404)
}

export function errorHandler(err, _req, res, _next) {
  console.error(err)
  fail(res, err.message || 'Internal server error', err.status || 500)
}
