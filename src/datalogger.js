/**
 * File: \src\datalogger.js
 * Created Date: Tuesday, July 26th 2022, 11:47:44 am
 * Author: Andy Jarosz
 * License:  Creative Commons Attribution Non Commercial Share Alike 4.0
 * -----
 * Copyright (c) 2022 LOLED Virtual, LLC
 */



const fs = require('fs/promises');
const path = require('path');
const io = require("socket.io-client");
const URL = "http://localhost:3031";
const socket = io(URL);


var date = new Date();
const fileName = date.toDateString() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".json";
const filePath = "D:/dataLogs"


const makeDir = async () => {
    await mkdirp(filePath);
};

// Add a connect listener
socket.on('connect', function (socket) {
    console.log("Data Logger Started");
});

socket.on("connect_error", (err) => {
    console.log(`client connect_error due to ${err.message}`);
});

async function logFile(msg) {
    try {
        const content = 'Some content!';
        await fs.writeFile(filePath + "/" + fileName, msg, { flag: 'a+' });
    } catch (err) {
        console.log(err);
    }
}


socket.on("logDataToFile", (msg) => {
    // console.log(msg);
    logFile(msg);
}); 