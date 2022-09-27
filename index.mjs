/**
 * TeleBot instance
 * @typedef {Object} TeleBot TeleBot instance
 */

/**
 * Environment hosts
 * @typedef {Object<string,string>} EnvHosts Environment hosts
 * @see https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables
 */

/**
 * Getting the target host
 * @param {EnvHosts} [hosts] Environment hosts
 * @param {Object} [headers] Request HTTP headers
 * @returns {String | undefined | null} Target host
 */
export const getHost = (hosts = {}, headers = {}) => hosts[process?.env?.VERCEL_ENV] || headers?.['x-forwarded-host']

/**
 * Webhook setup handler
 * @param {TeleBot} bot TeleBot instance
 * @param {String} [path] Path to function
 * @param {EnvHosts} [hosts] Environment hosts
 * @param {Object} [headers] Request HTTP headers
 * @param {Function} [json] Server JSON-response function
 * @returns {Promise} Server response promise
 */
export const setWebhookHandler = async (bot = {}, path = '', hosts, {headers} = {}, {json = _ => _} = {}) =>
    json(await bot?.setWebhook(`https://${getHost(hosts, headers)}/${path}`).catch(_ => _))

/**
 * Webhook setup handler factory
 * @param {TeleBot} bot TeleBot instance
 * @param {String} [path] Path to function
 * @param {EnvHosts} [hosts] Environment hosts
 * @return {Function} Webhook setup handler
 */
export const setWebhook = (bot, path, hosts) => setWebhookHandler.bind(this, bot, path, hosts)

/**
 * Webhook handler
 * @param {TeleBot} bot TeleBot instance
 * @param {Object} [body] Request body
 * @param {Function} [json] Server JSON-response function
 * @returns {Promise} Server response promise
 */
export const startHandler = async (bot = {}, {body = {}} = {}, {json = _ => _} = {}) =>
    json(body?.update_id ? await bot?.receiveUpdates([body]) : {status: false})

/**
 * Webhook handler factory
 * @param {TeleBot} bot TeleBot instance
 * @return {Function} Webhook handler
 */
export const start = bot => startHandler.bind(this, bot)
