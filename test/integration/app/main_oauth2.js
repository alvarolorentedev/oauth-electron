const {app, BrowserWindow, session} = require('electron'),
    login = require('../../..')
  
  function createWindow () {
    let info = {
      key: process.env.FB_KEY,
      secret: process.env.FB_SECRET,
      scope: "user_posts,user_friends,publish_actions",
      baseSite: "",
      authorizePath: "https://www.facebook.com/dialog/oauth",
      accessTokenPath: "https://graph.facebook.com/oauth/access_token",
      redirectUrl: "http://localhost/"
    },
    window = new BrowserWindow({"node-integration": false})
    window.webContents.session.cookies.remove("https://www.facebook.com/", 'c_user', () => {
      login.oauth2(info, window)    
      .then(_ => {
       window.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Success</div>'`)
      })
      .catch(_ =>{
         window.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Error</div>'`)
      })
    })
  }
  
  app.on('ready', createWindow)