export const handler = async (bot = {}, {body} = {}, {json = _ => _} = {}) =>
    json(body?.update_id ? await bot?.receiveUpdates([body]) : {status: false})

export default bot => handler.bind(this, bot)