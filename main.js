// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const execa = require("execa");

// Parcel bundler
function runParcel() {
  return new Promise(resolve => {
    let output = "";
    const parcelProcess = execa("parcel", ["index.html"]);
    const concat = chunk => {
      output += chunk;
      console.log(output);
      if (output.includes("Built in ")) {
        parcelProcess.stdout.removeListener("data", concat);
        console.log(output);
        resolve();
      }
    };
    parcelProcess.stdout.on("data", concat);
  });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')

  // load app bundled by parcel
  await runParcel();
  mainWindow.loadURL(`http://localhost:1234`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const DCS = require('./app/dcs')

// Start UDP server to receive data from DCS
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  // console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  DCS.receiveData(msg);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(9100);