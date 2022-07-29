/**
 * File: \src\indiemarkdetect.js
 * Created Date: Sunday, July 17th 2022, 10:13:49 am
 * Author: Andy Jarosz
 * License:  Creative Commons Attribution Non Commercial Share Alike 4.0
 * -----
 * Copyright (c) 2022 LOLED Virtual, LLC
 */



const path = require('path');
const {
    fork
} = require('child_process');
var usbDetect = require('usb-detection');
const HID = require('node-hid');

function spawnIndie(device) {
    fork(path.join(__dirname, 'subprocess.js'), [device.serialNumber]);
}

usbDetect.startMonitoring();

usbDetect.find(11914, 61450, function (err, devices) {
    devices.forEach(function (device) {
        console.log("serial " + device.serialNumber);
        if (device.serialNumber != undefined && device.serialNumber!= '') {
            console.log(device);
            spawnIndie(device);
        }
    });

});

usbDetect.on('add:11914:61450', function (device) {
    console.log(device);
    //	usbDetect.stopMonitoring()
    setTimeout(spawnIndie, 1000, device);
    console.log(device);
});

usbDetect.on('remove:vid:pid', function (device) {
    console.log(device);

});
