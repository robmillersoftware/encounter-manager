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
