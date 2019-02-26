const {app, BrowserWindow, session} = require('electron'),
    login = require('../../..')
  
  function createWindow () {
    let info = {
      key: process.env.FB_KEY,
      secret: process.env.FB_SECRET,
      scope: "email",
      baseSite: "",
      authorizePath: "https://www.facebook.com/dialog/oauth",
      accessTokenPath: "https://graph.facebook.com/oauth/access_token",
      redirectUrl: "https://www.facebook.com/connect/login_success.html"
    },
    window = new BrowserWindow({"node-integration": false})
    window.webContents.session.cookies.remove("https://www.facebook.com/", 'c_user', async () => {
      try {
        await login.oauth2(info, window, session) 
        window.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Success</div>'`)
      } catch (_) {
        window.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Error</div>'`)
      }  
    })
  }
  
  app.on('ready', createWindow)