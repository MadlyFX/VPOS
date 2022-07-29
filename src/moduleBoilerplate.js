/**
 * File: \src\moduleBoilerplate.js
 * Created Date: Tuesday, July 26th 2022, 2:29:46 pm
 * Author: Andy Jarosz
 * License:  Creative Commons Attribution Non Commercial Share Alike 4.0
 * -----
 * Copyright (c) 2022 LOLED Virtual, LLC
 */



const io = require("socket.io-client");
const URL = "http://localhost:3031";
const socket = io(URL);

// Add a connect listener
socket.on('connect', function (socket) {
    console.log("Module Started");
});


socket.on("yourEvent", (msg) => {
    // console.log(msg);
    //Do your stuff here
}); 