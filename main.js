const {app, BrowserWindow} = require('electron')

const path = require('path');
const url = require('url');

function createWindow() {
  //Create new window browser.
  win = new BrowserWindow({width: 800, height: 600})

  //Load the first page of the application
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashed: true
  }))
}

app.on('ready', createWindow)
