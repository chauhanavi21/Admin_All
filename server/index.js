import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js'
import { seedAdminIfEmpty } from './lib/seed.js'
import { ensureStoreFile } from './services/storeService.js'

const app = express()
const PORT = process.env.PORT || 4000
const isProduction = process.env.NODE_ENV === 'production'

const LOCAL_ORIGINS = [
  'http://localhost:5180',
  'http://127.0.0.1:5180',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

function getAllowedOrigins() {
  const fromEnv = [process.env.CLIENT_ORIGIN, process.env.CORS_ORIGINS]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((origin) => origin.trim())
    .filter(Boolean)

  return [...new Set([...LOCAL_ORIGINS, ...fromEnv])]
}

const allowedOrigins = getAllowedOrigins()
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === 'true'

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (allowedOrigins.includes(origin)) return true
  if (allowVercelPreviews && origin.endsWith('.vercel.app')) return true
  return false
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)
app.use(express.json())

app.use('/api', apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

function validateEnv() {
  const jwtSecret = process.env.JWT_SECRET?.trim()

  if (isProduction) {
    if (!jwtSecret) {
      console.error('JWT_SECRET is not set. Add it in Render → Environment.')
      process.exit(1)
    }

    if (jwtSecret.length < 16) {
      console.error('JWT_SECRET must be at least 16 characters in production.')
      process.exit(1)
    }

    if (!process.env.CLIENT_ORIGIN) {
      console.warn(
        'CLIENT_ORIGIN is not set — browser requests from your Vercel site may be blocked by CORS.',
      )
    }
  }
}

async function start() {
  validateEnv()
  await ensureStoreFile()
  await seedAdminIfEmpty()

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Admin API running on port ${PORT}`)
    console.log(`Health: http://localhost:${PORT}/api/health`)
    if (allowedOrigins.length > LOCAL_ORIGINS.length) {
      console.log('CORS allowed origins:', allowedOrigins.join(', '))
    }
    if (allowVercelPreviews) {
      console.log('CORS: *.vercel.app preview URLs allowed')
    }
  })
}

start()
