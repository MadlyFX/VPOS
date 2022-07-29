
![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


# Virtual Production Operating System

VPOS is a software framework for camera-side virtual production development. It is a module system, inspired by Robot Operating System (ROS) that enables developers to quickly build custom applications for VP data.



![CC BY-NC-SA 4.0 License](https://mirrors.creativecommons.org/presskit/buttons/80x15/svg/by-nc-sa.svg)


## Features

- Intermodule and external event system via local SocketIO 
- Can be used to auto-start external software
- Sample modules for Indiemark encoders, Cooke /i lens data, OSC output, and more
- Runs on Windows or Linux, can be run on embedded platforms or Mini PCs


## Usage/Examples
Vposlaunch.js is the launch file, and modules are launched from here. VPOS is launched with:

**npm run start**

Modules should be forked to be enabled, i.e.
```javascript
///Data logger 
fork(path.join(__dirname, 'dataLogger.js'));
```

Each module lives in it's own .js or .ts file, and runs as a subprocess. Modules can communicate via SocketIO.

```javascript
//Sending data to another module 
socket.emit("sendLonet2", sendLonetObject);//This sends through HW port to LONET2

///Receiving data from another module
socket.on("sendLonet2", (msg) => {
    console.log("Got " + msg);
}); 
```


