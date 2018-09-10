const {app, BrowserWindow, Tray, ipcMain, Menu} = require('electron')
const path = require('path')
const url = require('url')
iconPath = path.join(__dirname,'assets/icon.png')
let window, tray;

function createWindow() {
  window = new BrowserWindow({
    width: 220,
    height: 330,
    show: false,
    frame: false,
    transparent: true,
    'node-integration': false
  })
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
   }))
}
app.on('ready', () => {
  tray = new Tray(iconPath)
  tray.setToolTip('Open Cpu Usage')
  createWindow()
  app.dock.hide()
  tray.on('click', () => {
    toggleWindow()
  })
  tray.on('right-click', ()=>{
    app.quit()
  })
})
app.on('window-all-closed', ()=>{

})
const getWindowPosition = () => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
  const y = Math.round(trayBounds.y + trayBounds.height + 3)

  return {x: x, y: y}
}
const showWindow = () => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}
const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
    app.hide()
  } else {
    showWindow()
  }
}
ipcMain.on('show-window', () => {
  showWindow()
})