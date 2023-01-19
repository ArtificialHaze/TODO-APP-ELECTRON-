const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const url = require("url");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let win;
let todoWindow;

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl + W",
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: "About",
    submenu: [
      {
        label: "about us",
      },
    ],
  },
  {
    label: "Actions",
    submenu: [
      {
        label: "New Todo Item",
        accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
        click: () => {
          if (!todoWindow) {
            openNewTodo();
          }
        },
      },
    ],
  },
];

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, "index.html"));

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Open the DevTools.
  win.webContents.openDevTools();
};

function openNewTodo() {
  todoWindow = new BrowserWindow({
    width: 320,
    height: 320,
    title: "Add new Todo",
  });

  todoWindow.loadURL(path.join(__dirname, "newTodo.html"));

  todoWindow.on("close", function () {
    todoWindow = null;
  });
}

ipcMain.on("todo:new", function (e, todo) {
  win.webContents.send("todo:new", todo);
  todoWindow.close();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on("ready", () => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
