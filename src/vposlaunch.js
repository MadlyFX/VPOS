/**
 * File: \src\vposlaunch.js
 * Created Date: Monday, July 18th 2022, 8:13:28 pm
 * Author: Andy Jarosz
 * License:  Creative Commons Attribution Non Commercial Share Alike 4.0
 * -----
 * Copyright (c) 2022 LOLED Virtual, LLC
 */



const path = require('path');
const {
    fork
} = require('child_process');
var spawn = require('child_process').spawn;
const fs = require('fs');
const { Server } = require("socket.io");
const io = new Server({
    allowEIO3: true // false by default
  });


  console.log("__      _______   ____   _____    ___  __ \r\n \\ \\    \/ \/  __ \\ \/ __ \\ \/ ____|  \/ _ \\\/_ |\r\n  \\ \\  \/ \/| |__) | |  | | (___   | | | || |\r\n   \\ \\\/ \/ |  ___\/| |  | |\\___ \\  | | | || |\r\n    \\  \/  | |    | |__| |____) | | |_| || |\r\n     \\\/   |_|     \\____\/|_____\/   \\___(_)_|\r\n                                           ");

io.on("connection", (socket) => {
    console.log(socket.id + " new connection");
    
    socket.onAny((eventName, ...args) => {
       // console.log(...args);
      io.emit(eventName,...args);
    });
});

io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  io.listen(3031, () => {
    console.log('listening on *:3031');
  });

///External software start
const directoryPath = path.join(__dirname, 'programs');
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        spawn(path.join(directoryPath, file));
        console.log("Launching: " + file); 
    });
});
////

//fork(path.join(__dirname, 'OSCSender.js'));

//fork(path.join(__dirname, 'cookeILensData.js'));

///LONET2 output
//fork(path.join(__dirname, 'lonet2.js'));
////

//indiemark encoder detection
//var indiemarkdetect = require('./indiemarkdetect.js');
////

///Data logger 
//fork(path.join(__dirname, 'dataLogger.js'));
////

//fork(path.join(__dirname, 'tcp_passthrough.js'));