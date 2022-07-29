/**
 * File: \src\tcp_passthrough.js
 * Created Date: Wednesday, July 20th 2022, 10:04:57 pm
 * Author: Andy Jarosz
 * -----
 * Copyright (c) 2022 LOLED Virtual, LLC
 * 
 * 
 * //This file can be used to provide a TCP passthrough to enable wireless functionality of wired ethernet devices
//Plug the device in with a crossover cable and change the settings below
 */



var proxy = require("node-tcp-proxy");
var util = require("util");

const serviceHost = "192.168.0.103";
const servicePort = 5055;

var newProxy = proxy.createProxy(5051, serviceHost, servicePort, {
    upstream: function(context, data) {
        console.log(util.format("Client %s:%s sent:",
            context.proxySocket.remoteAddress,
            context.proxySocket.remotePort));
        // do something with the data and return modified data
        return data;
    },
    downstream: function(context, data) {
        console.log(util.format("Service %s:%s sent:",
            context.serviceSocket.remoteAddress,
            context.serviceSocket.remotePort));
        // do something with the data and return modified data
        return data;
    },
    serviceHostSelected: function(proxySocket, i) {
        console.log(util.format("Service host %s:%s selected for client %s:%s.",
            serviceHost,
            servicePort,
            proxySocket.remoteAddress,
            proxySocket.remotePort));
        // use your own strategy to calculate i
        return i;
    }
});