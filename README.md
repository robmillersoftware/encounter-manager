### Development Machine setup
#### Prerequisites
* Install the latest version of NodeJS
* Install the latest Gradle or Android Studio
* Install the latest Android SDK, including the build tools and the platform-tools
* Install the latest JDK
* Make sure ANDROID_HOME is set to your SDK directory
* Add ANDROID_HOME and ANDROID_HOME/bin to your PATH
* Set the NODE_PATH environment variable to your project's root directory
* Run ```npm install -g ionic cordova```

**NOTE**: If you get an error when trying to run npm scripts due to the 'node' command not being found. This is due to an update in NodeJS. The executable is now named 'nodejs'. You can either install the nodejs-legacy package or make a symbolic link or alias to fix the issue

#### Project setup
1) Email robmillersoftware@gmail.com to get invited to the GitHub project.
2) Set up an [SSH key](https://help.github.com/articles/connecting-to-github-with-ssh/)
3) Clone the project source code: ```git clone git@github.com:robmillersoftware/encounter-manager.git```
4) Run ```npm install```
5) Run ```ionic serve``` to view the project in a browser

See [Debugging and Testing Strategies](#debugging) below for more information and for connecting to a device.

### Networking
Retconnected uses an unstructured P2P network to communicate between devices. The network architecture is divided between 4 distinct layers in a hierarchy:
  1) The lowest level consists of the Nearby Plugin (located in the nearby folder). This communicates with hardware to connect devices and send data
  2) Comms is the next lowest level. This level is an abstraction to make the P2P network platform agnostic. Currently, only P2P is supported but eventually Wifi, Cellular Data, Wifi Direct, and even Bluetooth can be supported by adding an entry to this layer.
  3) P2P is the next layer. This layer is the bridge between the UI and the networking logic. It is here where the network topology is managed.
  4) The top layer consists of the NetworkingService. This service provides the entry point for other modules to make use of P2P networking.

### Shared Library
Any objects/methods that may need to be imported in multiple places should go in the shared folder. It is broken into 4 folders that are all imported by the shared module.

#### Components
Any directives or components that need to be used on multiple screens go here. Create a subfolder under "components" where you can add html, typescript, and/or scss.

#### Objects
Objects in the shared/objects folder follow a specific pattern. Each object should reside in its own .ts file. These files should contain a Data interface, a Class matching the name of the file, and a Factory. The Data interface should be passed as the only parameter into the object, and the Factory should take a list of arguments it uses to build the Interface and return the resulting Class. The Class and the Factory should both be exported. For example:

```
interface ExampleData {
  someProperty: any
}

export class Example {
  public someProperty: any;
  constructor(data: ExampleData) {
    this.someProperty = data.someProperty;
  }
}

export class ExampleFactory {
  public buildExample(prop: any): Example {
    return new Example({someProperty: prop});
  }
}
```
#### Persistence
Persistence modules handle CRUD operations for objects put into local storage. Each data type needs its own persistence module. All persistence modules need to import the StorageService module which can be found in storage.persistence.ts. This is a wrapper around the actual get/set calls.

Persistence modules should not be used directly by pages/components/etc, but instead services should be written that use them.

#### Services
Services handle logic between individual components. For instance, any networking, data persistence, or state-based operations should be handled by a service. Persistence modules should not import services, but services should import persistence modules.

<a name="debugging"></a>
### Debugging and Testing Strategies
#### Browser
To debug in browser, simply run:
```
ionic serve
```
from the command line at the project root directory. This will open a new tab in your browser showing the application (you can also connect to the server through http://localhost:8100). This method is useful for testing simple navigation and UI elements, but cordova plugins and other native code will not be available.

#### On Device
This is by far the best way to test using Ionic as it gives you full access to all of the application's logs. It also allows you to test the functionality of the cordova plugins.

**Tools Required**

* [ADB](https://developer.android.com/studio/command-line/adb)
* Google Chrome or any Chromium-based browser

**Viewing Device Logs**

To view the javascript console, android, and cordova logs during development, copy the following function into your .bashrc file:

```
function adblog() {
  adb -s "$1" logcat | grep -e NearbyPlugin -e SystemWebChromeClient -e PluginManager;
}
```

Use like so:

```
adblog *.*.*.*
```
Where the parameter is the IP address or device ID of the device to view. You can see the IP addresses and ids of all connected devices using the ```adb devices``` command

**Debugging Through Chrome**

If you don't need to access the android system logs or the cordova plugin logs, then you can also debug remotely through Chrome.

1) Connect to your device through ADB  
2) Open a new tab in Chrome  
3) Open the developer tools  
4) Click on the three pips to open the menu  
5) Select "More tools"->"Remote devices"  
6) Find the name of your device on the Remote Devices tab and click on it  
7) Find RetConnected and click "Inspect"  

This will open a new window showing a rendering of your device's web view plus all of the console output.

#### Emulator
This is not recommended as most android emulators generally don't support bluetooth and other native functions out of the box. It's possible to create a VM with this functionality, but the setup required for this generally isn't worth the effort. As such, it will not be discussed further.
