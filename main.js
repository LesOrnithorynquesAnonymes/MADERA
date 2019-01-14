const {app, BrowserWindow} = require('electron');

const path = require('path');
const url = require('url');

let win;

function createWindow() {
    //Create new window browser.
    win = new BrowserWindow({
        width: 1800,
        height: 1200,
        icon: 'assets/zds.png',
        title: 'Madera',
        maximized: true,
        center: true,
        frame: true
    });

    // DevTool
    win.webContents.openDevTools();

    //Load the first page of the application
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file:',
        slashed: true
    }));

    // Cet evenement est déclenché lorsque la fenetre est fermée
    win.on('closed', function () {
        // réinitialisation de l'objet "window"
        win = null
    })
}

app.on('ready', createWindow);
