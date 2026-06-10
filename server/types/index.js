/** @typedef {'active' | 'inactive' | 'pending'} AppStatus */
/** @typedef {'admin' | 'manager' | 'viewer'} UserRole */

/**
 * @typedef {Object} AdminUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} passwordHash
 * @property {UserRole} role
 * @property {boolean} active
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} RegisteredApp
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {string} baseUrl
 * @property {string} [apiKey]
 * @property {AppStatus} status
 * @property {Record<string, unknown>} metadata
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} AdminSettings
 * @property {string} platformName
 * @property {string} supportEmail
 * @property {boolean} maintenanceMode
 * @property {string} defaultTimezone
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} DataStore
 * @property {AdminUser[]} users
 * @property {RegisteredApp[]} apps
 * @property {AdminSettings} settings
 * @property {{ id: string; action: string; resource: string; userId: string; details: string; createdAt: string }[]} activityLog
 */

export {}
