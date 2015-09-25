var exec = require('child_process').exec
var cmd = '.' + __dirname + '/syncthing/syncthing --no-browser -verbose'
var app = require('app')  // Module to control application life.
var BrowserWindow = require('browser-window')  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start()
// if (error) throw error
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function runBrowser () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280, height: 720})

  // and load the index.html of the app.
  mainWindow.loadUrl('http://127.0.0.1:8384/')

  // Open the DevTools.
  // mainWindow.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    console.log('window closed')
    mainWindow = null
  })
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  var syncthing = exec(cmd)
  syncthing.stdout.on('data', function (data) {
    if (data.indexOf('Starting web GUI') !== -1) {
      console.log('web browser started')
      // runBrowser()
    }
  })
  runBrowser()
  syncthing.stderr.on('data', function (data) {
    throw new Error('stdout: ' + data)
  })
  syncthing.on('close', function (code) {
    console.log('closing code: ' + code)
  })
})
