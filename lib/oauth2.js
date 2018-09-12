const Oauth2 = require('oauth').OAuth2

class Oauth {
    constructor(info){
        this.info = info
        this.oauth = new Oauth2(
            info.key, 
            info.secret,
            info.baseSite, 
            info.authorizePath, 
            info.accessTokenPath)
    }

    getAuthUrl(){
        return this.oauth.getAuthorizeUrl({
                redirect_uri: this.info.redirectUrl,
                scope: this.info.scope
            });
    }

    getTokens(code) {
        return new Promise((resolve,reject) => {
            this.oauth.getOAuthAccessToken(code, {
                redirect_uri: this.info.redirectUrl
            }, (error, accessToken, refreshToken) => {
                if(error)
                    return reject(error)
                resolve({accessToken,refreshToken})
            })
        })
    }
}

module.exports = Oauth