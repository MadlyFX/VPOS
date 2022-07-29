/**
 * File: \src\lonet2.js
 * Created Date: Tuesday, July 19th 2022, 9:45:36 am
 * Author: Andy Jarosz
 * License:  Creative Commons Attribution Non Commercial Share Alike 4.0
 * -----
 * Copyright (c) 2022 LOLED Virtual, LLC
 * 
 * The LONET2 protocol is a JSON-over-UDP procol for virtual production.
 * It can send data directly to Unreal via LiveLink, into Aximmetry via it's Lens Calibrator, and into the LONET 2 Server software for encoder management.
 * https://github.com/MadlyFX/LONET-2-LiveLink-Plugin
 * https://aximmetry.com/learn/tutorials/control-methods/using-glassmark-indiemark-encoders/
 * It uses a multicast IP 236.12.12.12, with an Input port (from hardware) of 60607, and an Output port (from software) of 60608.
 * This module simply sends data over the network, the JSON objects are formed in the sending module.
 */




"use strict";
exports.__esModule = true;
var udp = require('dgram');
const io = require("socket.io-client");
const URL = "http://localhost:3031";
const socket = io(URL);

var softwareServer = udp.createSocket({ type: 'udp4', reuseAddr: true });
var hardwareServer = udp.createSocket({ type: 'udp4', reuseAddr: true });

// Add a connect listener
socket.on('connect', function (socket) {
    console.log("LONET2 Started");
});

socket.on("connect_error", (err) => {
    console.log(`client connect_error due to ${err.message}`);
});



softwareServer.bind(60608, () => {
    softwareServer.addMembership('236.12.12.12');
  });
  hardwareServer.bind(60607, () => {
    hardwareServer.addMembership('236.12.12.12');
  });



socket.on("sendLonet2", (msg) => {
    var dataToSend = Buffer.from(JSON.stringify(msg));
   // console.log(msg);
   
   softwareServer.send(dataToSend, msg["port"], '236.12.12.12', function (error) {
        if (error) {
            console.log(error);
            softwareServer.close();
        }
    })
}); 