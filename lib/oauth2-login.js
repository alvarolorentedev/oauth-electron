const Oauth = require('./oauth2'),
    url = require('url')

const getTokens = (oauth, address, resolve, reject) => {
    let parsed = url.parse(address, true)
    if(!parsed.query.code)
        return reject(`URL response is not correct, parameters are ${JSON.stringify(parsed.query)}`)
    oauth.getTokens(parsed.query.code)
        .then(resolve)
        .catch(reject)
}

const bindWindowsEvents = (window, oauth) =>
    (resolve, reject) => {
        window.webContents.on('close', () => {
            reject('closed window')
        });
        window.webContents.on('did-get-redirect-request', (_, __, address) => {
            if (!address.includes(oauth.redirectUrl))
                return
            getTokens(oauth, address, resolve, reject)
        })
    }

const login = (info, window) => {
    let oauth = new Oauth(info)
    let promise = new Promise(bindWindowsEvents(window, oauth))
    window.loadURL(oauth.getAuthUrl())
    return promise
}

module.exports = login