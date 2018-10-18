const { execSync } = require("child_process");

console.log("----------BUILD STARTED-----------");
execSync("ionic cordova build android", {stdio: 'inherit'});
console.log("----------BUILD FINISHED----------");
console.log(`Creating distribution directory at: ${process.env.NODE_PATH}/dist`);
execSync(`mkdir -p ${process.env.NODE_PATH}/dist`, {stdio: 'inherit'});
console.log("------CREATED DIST DIRECTORY------");
console.log("Copying APK to distribution directory.");
execSync(`cp ${process.env.NODE_PATH}/platforms/android/app/build/outputs/apk/debug/app-debug.apk ${process.env.NODE_PATH}/dist/retcon.apk`, {stdio: 'inherit'});
console.log("---------COPIED APK FILE----------")
