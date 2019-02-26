const Oauth = require('./oauth2'),
    url = require('url')

const getTokens = async (oauth, address) => {
    const parsed = url.parse(address, true)
    if(!parsed.query.code)
        throw `URL response is not correct, parameters are ${JSON.stringify(parsed.query)}`
    return await oauth.getTokens(parsed.query.code)
}

const bindWindowsEvents = (window, oauth, session, filter) =>
        new Promise((resolve, reject) => {
        window.webContents.on('close', () => {
            reject('closed window')
        });

        session.defaultSession.webRequest.onCompleted(filter, async (details) => {
            try {
                resolve(await getTokens(oauth, details.url))
            } catch (error) {
                reject(error)
            }
        });
    })

const login = async(info, window, session) => {
    const oauth = new Oauth(info)
    const filter = { urls: [`${info.redirectUrl}*`] };
    const events = bindWindowsEvents(window, oauth, session, filter)
    window.loadURL(oauth.getAuthUrl())
    return await events
}

module.exports = login