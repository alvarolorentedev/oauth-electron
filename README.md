# ![drawing 1](https://cloud.githubusercontent.com/assets/3071208/14776049/cb6164ea-0ac3-11e6-8219-c8a46a56e3e5.png)
[![Build Status](https://travis-ci.org/kanekotic/oauth-electron.svg?branch=master)](https://travis-ci.org/kanekotic/oauth-electron)
[![Coverage Status](https://coveralls.io/repos/github/kanekotic/oauth-electron/badge.svg?branch=master)](https://coveralls.io/github/kanekotic/oauth-electron?branch=master)
[![npm](https://img.shields.io/npm/dy/oauth-electron.svg)](https://github.com/kanekotic/oauth-electron)
[![GitHub license](https://img.shields.io/github/license/kanekotic/oauth-electron.svg)](https://github.com/kanekotic/oauth-electron/blob/master/LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/kanekotic/oauth-electron/graphs/commit-activity)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/kanekotic/)

Use OAuth in a simple way inside your electron App.

## Installation

add it to your electron project using `npm install oauth-electron --save` or `yarn add oauth-electron`

## Usage

require `oauth-electron` exports a function that requires a javascript object and an electron window, as seen on the next example:

### Oauth1

```js
const login = require(`oauth-electron`)

let info = {
    key: ***,
    secret: ***,
    accessUrl: ***,
    authenticateUrl: ***,
    version: ***,
    authCallback: ***,
    signatureMethod: ***,
    responseType: ***, //this is optional if not provided it will default to 'code'
},
window = new BrowserWindow({webPreferences: {nodeIntegration: false}});

login.oauth1(info, window)
```
the login function will return a Promise with the access token and secret

```
{
    token: ***,
    tokenSecret: ***
}
```

### Oauth2

```js
const login = require('oauth-electron')

let info = {
    key: ***,
    secret: ***,
    scope: ***,
    baseSite: ***,
    authorizePath: ***,
    accessTokenPath: ***,
    redirectUrl: ***
},
window = new BrowserWindow({webPreferences: {nodeIntegration: false}});

login.oauth2(info, window)
```

the login function will return a Promise with the access token and secret

```
{
    accessToken: ***,
    refreshToken: ***
}
```
## Migration V0.x to V1.x

- there is no more need for the oauth object, info becomes a basic object with the properties stated in the usage step.
- the return object has a different format.

###### logo: Award,Passport graphics by <a href="http://www.freepik.com/">Freepik</a> from <a href="http://www.flaticon.com/">Flaticon</a> are licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>. Made with <a href="http://logomakr.com" title="Logo Maker">Logo Maker</a>
