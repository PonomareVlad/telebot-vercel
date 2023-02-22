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
 * @param header Name of header with default host
 * @returns {String | undefined | null} Target host
 */
export const getHost = ({
                            hosts = {},
                            headers = {},
                            header = 'x-forwarded-host'
                        } = {}) => {
    const environment = process?.env?.VERCEL_ENV;
    const isEdgeRuntime = typeof EdgeRuntime === 'string';
    if (hosts?.[environment]) return hosts?.[environment];
    if (isEdgeRuntime) return headers?.get(header);
    return headers?.[header];
}

/**
 * Webhook setup handler
 * @param {TeleBot} bot TeleBot instance
 * @param {String} [path] Path to function
 * @param {EnvHosts} [hosts] Environment hosts
 * @param certificate
 * @param allowedUpdates
 * @param maxConnections
 * @param {Object} [headers] Request HTTP headers
 * @param {Function} [json] Server JSON-response function
 * @returns {Promise} Server response promise
 */
export const setWebhookHandler = async ({
                                            hosts,
                                            bot = {},
                                            path = '',
                                            certificate,
                                            allowedUpdates,
                                            maxConnections = 100
                                        }, {headers} = {}, {json = _ => _} = {}) => {
    const url = new URL(path, `https://${getHost({hosts, headers})}`);
    return json(await bot?.setWebhook(url, certificate, allowedUpdates, maxConnections).catch(_ => _));
}

/**
 * Webhook setup handler factory
 * @param {TeleBot} bot TeleBot instance
 * @param {String} [path] Path to function
 * @param {EnvHosts} [hosts] Environment hosts
 * @param certificate
 * @param allowedUpdates
 * @param maxConnections
 * @return {Function} Webhook setup handler
 */
export const setWebhook = ({
                               bot,
                               path,
                               hosts,
                               certificate,
                               maxConnections,
                               allowedUpdates
                           } = {}) =>
    setWebhookHandler.bind(this, {
        allowedUpdates,
        maxConnections,
        certificate,
        hosts,
        path,
        bot
    });

/**
 * Webhook handler
 * @param {TeleBot} bot TeleBot instance
 * @param {Object} [body] Request body
 * @param {Function} [json] Server JSON-response function
 * @returns {Promise} Server response promise
 */
export const startHandler = async (bot = {}, {body = {}} = {}, {json = _ => _} = {}) =>
    json(body?.update_id ? await bot?.receiveUpdates([body]) : {status: false});

/**
 * Webhook handler factory
 * @param {TeleBot} bot TeleBot instance
 * @return {Function} Webhook handler
 */
export const start = bot => startHandler.bind(this, bot);
