'use strict';
var oauthLib = require('oauth');

exports.oauth2_data = class oauth2_Data{
    constructor(){
        this.key ="";
        this.secret = "";
        this.window = "";
        this.base_url = "";
        this.auth_path = null;
        this.token_path = null;
        this.customHeaders = null;
        this.scope = "";
    }
}

class oauth2_local{
    constructor(info, window){
        this.oauth_token = "";
        this.oauth_token_secret = "";
        this.info = info;
        this.window = window;
        this.oauth = new oauthLib.OAuth2(this.info.key, this.info.secret, this.info.base_url, this.info.auth_path, this.info.token_path, this.info.customHeaders);
    }

    get_auth_url(){
        return this.oauth.getAuthorizeUrl({
            redirect_uri: this.info.redirect_url,
            scope: this.info.scope,
            state: 'some random string to protect against cross-site request forgery attacks'
        });
    }

    get_auth_tokens(){
        return new Promise((resolve,reject) => {
            this.oauth.getOAuthAccessToken(this.info.code, this.info.params, (error, access_token, refresh_token, results) => {
                if (error) {
                    reject(error);
                }
                else {
                  resolve({ oauth_access_token: access_token, oauth_refresh_token: refresh_token});
                }
            });
        });
    }
}

exports.oauth2 = class oauth2_export{

    constructor(){
    }

    login(info, window){
        return new Promise((resolve,reject) => {
            var localoauth = new oauth2_local(info, window);

            window.webContents.on('close', function(){
                reject('closed window');
            });

            window.webContents.on('will-navigate', function (event, url) {
                    window.show();
                    localoauth.get_auth_tokens().then((result)=>{
                        resolve(result);
                    }).catch((error)=>{reject(error);});
            });

            localoauth.get_auth_tokens().then((result)=>{
                resolve(result);
            }).catch((error) => {
                var url = localoauth.get_auth_url();
                window.loadURL(url);
            });

        });
    }
};
