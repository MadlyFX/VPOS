/**
 * File: \src\wifiConnect.js
 * Created Date: Monday, July 18th 2022, 8:13:28 pm
 * Author: Andy Jarosz
 * License:  Creative Commons Attribution Non Commercial Share Alike 4.0
 * -----
 * Copyright (c) 2022 LOLED Virtual, LLC
 */


const path = require('path');
const wifi = require('node-wifi');

console.log("Wifi Starting");
const wifiSsid = "ssid";
const wifiPw =  "password";
const wifiInterface = "Wi-Fi";

wifi.init({
  iface: wifiInterface // network interface, choose a random wifi interface if set to null
});

wifi.connect({ ssid: wifiSsid, password: wifiPw }, () => {
  console.log('WiFi Connected');
  // on windows, the callback is called even if the connection failed due to netsh limitations
});

function connect(wifiSsid, wifiPassword) {
  // Connect to a network


}

