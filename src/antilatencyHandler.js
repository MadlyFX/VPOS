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
    console.log("Antilatency Started");
});

var positionalData = {//This is a completed LONET2 object and is readable directly in Unreal
    "type": "camera_transform_data" /* LonetTypes.camera_transform_data */,
    "cameraName": "3C-00-3C-00-11-51-39-31-34-36-33-35",
    "position": [0,0,0],
    "orientation": [0,0,0,0],
    // "Timecode": "Free Run"
  };

socket.on("antilatencyData", (msg) => {
    positionalData["cameraName"] = msg["serialNumber"];
    positionalData["position"][0] = msg["position"][2] * 100;//To CM for UE
    positionalData["position"][1] = msg["position"][0]* 100;
    positionalData["position"][2] = msg["position"][1]* 100;

    positionalData["orientation"][0] = msg["rotation"][2];//Mappred to UE
    positionalData["orientation"][1] = msg["rotation"][0];
    positionalData["orientation"][2] = msg["rotation"][1];
    positionalData["orientation"][3] = msg["rotation"][3];

    var date = new Date();
    positionalData["Timestamp"] = date.toISOString();
  
    var masterObj = {};
    masterObj["camera_transform_data"] = positionalData;
  
    masterObj["port"] = 60608;
  
    socket.emit("sendLonet2", masterObj);//This sends through HW port to LONET2
    // console.log(positionalData);
    //Do your stuff here
}); 