/**
 * TeleBot instance
 * @typedef {Object} TeleBot TeleBot instance
 */

/**
 * Environment hosts
 * @typedef {Object<string,string>} EnvHosts Environment hosts
 * @see https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables
 */

export const isEdgeRuntime = typeof EdgeRuntime === 'string';

export const jsonResponse = data => isEdgeRuntime ? new Response(JSON.stringify(data)) : data;

/**
 * Getting the target host
 * @param {EnvHosts} [hosts] Environment hosts
 * @param {Object} [headers] Request HTTP headers
 * @param [header] Name of header with default host
 * @returns {String | undefined | null} Target host
 */
export const getHost = ({
                            hosts = {},
                            headers = {},
                            header = 'x-forwarded-host'
                        } = {}) => {
    const environment = process?.env?.VERCEL_ENV;
    if (hosts?.[environment]) return hosts?.[environment];
    if (isEdgeRuntime) return headers?.get(header);
    return headers?.[header];
}

/**
 * Webhook setup handler
 * @param {TeleBot} bot TeleBot instance
 * @param {String} [path] Path to function
 * @param {EnvHosts} [hosts] Environment hosts
 * @param [certificate]
 * @param {boolean} [handleErrors] Handle and output errors
 * @param [allowedUpdates]
 * @param [maxConnections]
 * @param {Object} [headers] Request HTTP headers
 * @param {Function} [json] Server JSON-response function
 * @returns {Promise} Server response promise
 */
export const setWebhookHandler = async ({
                                            hosts,
                                            bot = {},
                                            path = '',
                                            certificate,
                                            handleErrors,
                                            allowedUpdates,
                                            maxConnections = 100
                                        } = {}, {
                                            headers
                                        } = {}, {
                                            json = jsonResponse
                                        } = {}) => {
    try {
        const {href} = new URL(path, `https://${getHost({hosts, headers})}`);
        const response = await bot?.setWebhook(href, certificate, allowedUpdates, maxConnections);
        return json(response);
    } catch (e) {
        if (handleErrors) return json(e);
        throw e;
    }
}

/**
 * Webhook setup handler factory
 * @param {TeleBot} bot TeleBot instance
 * @param {String} [path] Path to function
 * @param {EnvHosts} [hosts] Environment hosts
 * @param [certificate]
 * @param {boolean} [handleErrors] Handle and output errors
 * @param [allowedUpdates]
 * @param [maxConnections]
 * @return {Function} Webhook setup handler
 */
export const setWebhook = ({
                               bot,
                               path,
                               hosts,
                               certificate,
                               handleErrors,
                               maxConnections,
                               allowedUpdates
                           } = {}) =>
    setWebhookHandler.bind(this, {
        allowedUpdates,
        maxConnections,
        handleErrors,
        certificate,
        hosts,
        path,
        bot
    });

/**
 * Webhook handler
 * @param {TeleBot} bot TeleBot instance
 * @param {boolean} [handleErrors] Handle and output errors
 * @param {Object} [body] Request body
 * @param {Function} [json] Server JSON-response function
 * @returns {Promise} Server response promise
 */
export const startHandler = async ({
                                       bot = {},
                                       handleErrors
                                   } = {}, {
                                       body = {}
                                   } = {}, {
                                       json = jsonResponse
                                   } = {}) => {
    try {
        let response = {status: false};
        if (isEdgeRuntime && body) {
            const chunks = [];
            const utf8decoder = new TextDecoder();
            for await (const chunk of body)
                chunks.push(utf8decoder.decode(chunk));
            body = JSON.parse(chunks.join(''));
        }
        if (body?.update_id) response = await bot?.receiveUpdates([body]);
        return json(response);
    } catch (e) {
        if (handleErrors) return json(e);
        throw e;
    }
}

/**
 * Webhook handler factory
 * @param {TeleBot} bot TeleBot instance
 * @param {boolean} [handleErrors] Handle and output errors
 * @return {Function} Webhook handler
 */
export const start = ({bot, handleErrors} = {}) => startHandler.bind(this, {bot, handleErrors});
