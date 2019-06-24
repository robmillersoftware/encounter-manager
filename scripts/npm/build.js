const { execSync } = require("child_process");

console.log("----------BUILD STARTED-----------");
execSync("ionic cordova build android", {stdio: 'inherit'});
console.log("----------BUILD FINISHED----------");
console.log(`Creating distribution directory at: ./dist`);
execSync(`mkdir -p ./dist`, {stdio: 'inherit'});
console.log("------CREATED DIST DIRECTORY------");
console.log("Copying APK to distribution directory.");
execSync(`cp ./platforms/android/app/build/outputs/apk/debug/app-debug.apk ./dist/retcon.apk`, {stdio: 'inherit'});
console.log("---------COPIED APK FILE----------")
