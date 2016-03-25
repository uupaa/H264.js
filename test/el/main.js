"use strict";

var app = require("app");
var BrowserWindow = require("browser-window");

process.chdir("test/el");
// var cwd = process.cwd();
// console.log(cwd);

require("crash-reporter").start();

var mainWindow = null;

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") { app.quit(); }
});

app.on("ready", function() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadUrl("file://" + __dirname + "/index.html");
//  mainWindow.webContents.on("did-finish-load", function() {
//    mainWindow.webContents.executeJavaScript("process.chdir('" + cwd + "')");
//  });

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
});


