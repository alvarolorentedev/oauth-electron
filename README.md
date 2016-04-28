# ![drawing 1](https://cloud.githubusercontent.com/assets/3071208/14776049/cb6164ea-0ac3-11e6-8219-c8a46a56e3e5.png)

**this package is currently in development and is not available for use**

Use OAuth in a simple way inside your electron App.

## Installation

add it to your elenctron project using npm command
```
npm install oauth-electron --save
```

## Usage

### Oauth1

add the require for ouath and twitter specific code from this package

```js
var oauth = require('oauth-electron-twitter').oauth2;
var data = require('oauth-electron-twitter').oauth2_data;
```

use or extend the oauth object as per your requirements
```
{
    "key" : "",
    "secret" : "";
    "window" : "";
    "url" : "";
    "request_token" : "";
    "access_token" : "";
    "version" : "";
    "callback" : "";
    "signature_method" : "";
}
```
pass the previously named object and a the widow to display into the login process.
```js
var auth = new oauth();
auth.login(info, window);
```
the login function will return a Promise with the acces token and secret
```
{
    oauth_access_token: ***,
    oauth_access_token_secret: ***
}
```

### Oauth2

add the require for ouath and twitter specific code from this package

```js
var oauth = require('oauth-electron-twitter').oauth2;
var data = require('oauth-electron-twitter').oauth2_data;
```
use or extend the oauth object as per your requirements
```
{
    "key" : "",
    "secret" : "";
    "window" : "";
    "base_url" : "";
    "auth_path" : "";
    "token_path" : "";
    "customHeaders" : "";
    "scope" : "";
}
```
pass the previously named object and a the widow to display into the login process.
```js
var auth = new oauth();
auth.login(info, window);
```
the login function will return a Promise with the acces token and secret
```
{
    oauth_access_token: ***,
    oauth_refresh_token: ***
}
```


###### logo: Award,Passport graphics by <a href="http://www.freepik.com/">Freepik</a> from <a href="http://www.flaticon.com/">Flaticon</a> are licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>. Made with <a href="http://logomakr.com" title="Logo Maker">Logo Maker</a>
