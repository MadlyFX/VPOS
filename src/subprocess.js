/**
 * File: \src\subprocess.js
 * Created Date: Sunday, July 17th 2022, 10:13:49 am
 * Author: Andy Jarosz
 * License:  Creative Commons Attribution Non Commercial Share Alike 4.0
 * -----
 * Copyright (c) 2022 LOLED Virtual, LLC
 */



const path = require('path');
const HID = require('node-hid');
var udp = require('dgram');
const io = require("socket.io-client");
const URL = "http://localhost:3031";
const socket = io(URL);



console.log("Args0:" + process.argv[0]);
console.log("Args1:" + process.argv[1]);
console.log("Args2:" + process.argv[2]);

var device = new HID.HID(11914, 61450, process.argv[2]);

var client = udp.createSocket('udp4');


var status = 0;
var camera = "0";
var number = 0;
var position = 0;

var USBData = [];

var bISBlackedOut = false;




function blackout(data) {
  console.log("Blackout");
  var rList = [0x00, 0xff, 0x00, 0xff, 0xff];

  if (data == 1) {
    rList[2] = (1 << 5) | rList[2];
  }
  else {
    rList[2] = rList[2] & ~(1 << 5);
  }

  if (data == 1) {
    bISBlackedOut = 1;
  } else {
    bISBlackedOut = 0;
  }


  console.log(rList);
  device.write(rList);
}


sendLonetObject = { //This shows up in LONET 2 and can be mapped as if it was directly attached, converted to OSC, or sent to Reality Field
  "type": "vpos_encoder",
  "DeviceName": "3C-00-3C-00-11-51-39-31-34-36-33-35",
  "Timestamp": "2021-12-02T21:08:58.692Z",
  "RawValue": 0,
  "Timecode": "Free Run",
}

var encoderData = {//This is a completed LONET2 object and is readable directly in Unreal
  "type": "encoder_data" /* LonetTypes.camera_transform_data */,
  "cameraName": "3C-00-3C-00-11-51-39-31-34-36-33-35",
  "Timestamp": "2021-12-02T21:08:58.692Z",
  "focusRaw": 0,
  "irisRaw": 0,
  "focalLengthMapped": 0,
  "irisMapped": 0,
  "focusMapped": 0,
  "focalLengthRaw": 0,
  // "Timecode": "Free Run"
};

device.on("data", function (data) {
  var oldCam = camera;
  var oldNum = number;
  var oldPos = position;

  USBData = data;
  UnpackCamLetter(data[0]);
  status = data[1];
  position = UnpackRotation(data[2], data[3])


  sendLonetObject["RawValue"] = position;
  encoderData["focusRaw"] = position;

  sendLonetObject["cameraName"] = process.argv[2];//Serial
  encoderData["cameraName"] = process.argv[2];

  var date = new Date();
  sendLonetObject["Timestamp"] = date.toISOString();
  encoderData["Timestamp"] = date.toISOString();

  var masterObj = {};
  masterObj["encoder_data"] = encoderData;

  sendLonetObject["port"] = 60607;
  masterObj["port"] = 60608;

  socket.emit("sendLonet2", sendLonetObject);//This sends through HW port to LONET2
  socket.emit("sendLonet2", masterObj);//This sends through SW port to Unreal/Reality Field
  socket.emit("logDataToFile",JSON.stringify(masterObj));
});


function UnpackCamLetter(byte) {
  camera = (byte & 0xf0) >> 4;
  if (camera != 0) {
    camera = String.fromCharCode(camera + 64);
  }
  number = byte & 0x0f;
}


function UnpackRotation(byte1, byte2) {
  var newPositon = 0;
  newPositon = byte1 << 8 | byte2;
  return newPositon;
}

