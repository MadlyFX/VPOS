/**
 * File: \src\cookeILensData.js
 * Created Date: Tuesday, July 26th 2022, 6:43:39 pm
 * Author: Andy Jarosz
 * License:  Creative Commons Attribution Non Commercial Share Alike 4.0
 * -----
 * Copyright (c) 2022 LOLED Virtual, LLC
 */



const io = require("socket.io-client");
const URL = "http://localhost:3031";
const socket = io(URL);
const { SerialPort } = require('serialport')
const { DelimiterParser } = require('@serialport/parser-delimiter')
const { MockBinding } = require('@serialport/binding-mock')
/*
We send: N command to wake up lens
Lens sends: N response with static data
We send: kb6 to set baud rate to 115200
We send: D command to get lens data
*/

var lastSentCommand = "";

var NCommandResponse = {
    "serial": 123456,
    "lensType": "P",
    "focalLength": 24
}

var DCommandResponse = {
    "focusDistance": 1234,
    "aperture": 5.6,
    "apertureStop" : 5.6,
    "zoom": 50,
    "hyperfocal": 456,
    "nearFocus": 123,
    "farFocus": 789,
    "HFOV": 40,
    "entrancePupil": 10.5,
    "normalizedZoom": 50,
    "lensSerial": 123456789
}

var oscMsg = {
    "address": "lens/",
    "values": [
    ]
};

function FormOSCObject(){
    oscMsg["address"] = "/lensData/" + NCommandResponse["serial"];
    for(val in DCommandResponse){
        oscMsg["values"].push(DCommandResponse[val]);
    }
    if(NCommandResponse["lensType"] == "P"){//Lens is a prime
        DCommandResponse["zoom"] = NCommandResponse["focalLength"];
    }
}


MockBinding.createPort('COM69', { })

// Add a connect listener
socket.on('connect', function (socket) {
    console.log("Cooke /i Started");
    openPort();
});

socket.on("yourEvent", (msg) => {
    // console.log(msg);
   
});
//////////////////////////////////////////////////////////////
// Create a port
const port = new SerialPort({
    path: 'COM69',//linux: /dev/tty-usbserial1
    baudRate: 9600,//Lens will fall back to 9600 if not spoken to in 1 second, AKA always in this case
    autoOpen: false
   // binding: MockBinding
})

const parser = port.pipe(new DelimiterParser({ delimiter: '\r' }))

function openPort() {
    port.open(function (err) {
        if (err) {
            return console.log('Error opening port: ', err.message)
        }
        port.write("N" + '\r');//Emit first D command to wake up lens
        lastSentCommand = "N";
      //  port.port.emitData("NS4050.0093OCooke Test Lens Body           LPN050M050UIT95 B4.34\n\r")
    })
}

function parseNCommand(data){
    const strungBuf = data.toString();
   // console.log("N command " + strungBuf);
    NCommandResponse["serial"] = strungBuf.substring(2,10);
    NCommandResponse["lensType"] = strungBuf.substring(44,45);
    NCommandResponse["focalLength"] = strungBuf.substring(46,49);
    console.log("serial " + NCommandResponse["serial"]);
    console.log("lensType "  + NCommandResponse["lensType"]);
    console.log("focalLength " + NCommandResponse["focalLength"]);

    port.write("Kb6" + '\r');//Change baud rate for faster transfe
    port.update(115200);
    lastSentCommand = "Kb6";
    //    port.port.emitData("Kb1!\n\r");
}

function parseDCommand(data){
    const strungBuf = data.toString();
    //console.log("D command " + strungBuf);
    DCommandResponse["focusDistance"] = strungBuf.substring(1, 8);
    DCommandResponse["aperture"] = strungBuf.substring(9, 13);
    DCommandResponse["apertureStop"] = strungBuf.substring(14, 19);
    DCommandResponse["zoom"]  = strungBuf.substring(20, 24);
    DCommandResponse["hyperfocal"]  = strungBuf.substring(25,32);
    DCommandResponse["nearFocus"]  = strungBuf.substring(33, 40);
    DCommandResponse["farFocus"] = strungBuf.substring(41, 48);
    DCommandResponse["HFOV"]  = strungBuf.substring(49, 54);
    DCommandResponse["entrancePupil"]  = strungBuf.substring(55, 59);
    DCommandResponse["normalizedZoom"]  = strungBuf.substring(60, 64);
    DCommandResponse["lensSerial"]  = strungBuf.substring(65, 74);
}

// Switches the port into "flowing mode"
port.on('data', function (data) {
    //console.log('Data:', data)
    switch (lastSentCommand) {
        case "N":
            parseNCommand(data);
            break;
        case "Kb6":
            console.log("changing baud");
            port.write("D" + '\r');//Retrieve one set of ASCII Data
            lastSentCommand = "D";
           // port.port.emitData("D0000798T0680t5.6+5Z0000H0006123N0000711F0000909V027.3E+023z0000S4050.0093\n\r");
            break;
        case "D":
            parseDCommand(data);

            FormOSCObject();
            socket.emit("sendOSC", oscMsg);//This sends through HW port to LONET2
            port.write("D" + '\r');//Retrieve one set of ASCII Data
          //  port.port.emitData("D0000798T0680t5.6+5Z0000H0006123N0000711F0000909V027.3E+023z0000S4050.0093\n\r");
            break;
    }
})

