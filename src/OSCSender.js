/**
 * File: \src\OSCSender.js
 * Created Date: Tuesday, July 26th 2022, 2:30:33 pm
 * Author: Andy Jarosz
 * License:  Creative Commons Attribution Non Commercial Share Alike 4.0
 * -----
 * Copyright (c) 2022 LOLED Virtual, LLC
 */



const io = require("socket.io-client");
const URL = "http://localhost:3031";
const socket = io(URL);
const OSC = require('osc-js')
const options = { send: { port: 9001 } }
const osc = new OSC({ plugin: new OSC.DatagramPlugin(options) })

osc.open({ port: 9001 })

// Add a connect listener
socket.on('connect', function (socket) {
    console.log("OSC Started");
});


socket.on("sendOSC", (msg) => {
   // console.log(msg);
/*
    {
        "address": "/test/path",
        "values": [
          123,
          "wow"
        ]
    }
    */

    // console.log(msg)


    const message = new OSC.Message(msg["address"]);

    msg["values"].forEach((element, index, array)=>{
       // console.log(element);
        message.add(element);
    })

    osc.send(message,{ host: '127.0.0.1', port: 9000 });//Chage to your EP

}); 

osc.on('error', (err) => {
    console.log(err);
  });