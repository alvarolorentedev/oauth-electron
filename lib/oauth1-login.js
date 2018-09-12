const Oauth = require('./oauth1')

let _ = {
    requestTokens: {}
}

const bindWindowsEvents = (window, oauth) =>
    (resolve, reject) => {
        window.webContents.on('close', () => {
            reject('closed window')
        });
        window.webContents.on('will-navigate', (__, address) => {
            resolve(oauth.getAccessToken(address, _.requestTokens))
        })
    }

const login = (info, window) => {
    let oauth = new Oauth(info)
    let promise = new Promise(bindWindowsEvents(window, oauth))
    oauth.getRequestTokens().then(result => {
        _.requestTokens = result
        window.loadURL(`${info.authenticateUrl}${result.token}`)
    })
    return promise
}

module.exports = login