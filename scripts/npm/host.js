var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');

http.createServer(function(request, response) {
    var filePath = path.join(__dirname, '../../dist/retcon.apk');
    var stat = fileSystem.statSync(filePath);

    console.log("Got request. File path: " + filePath);
    response.writeHead(200, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    readStream.pipe(response);
})
.listen(2000);
