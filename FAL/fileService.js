const Fs = require('fs');
const path = require('path');

function removeFileFromDisk(fileName){
    Fs.unlinkSync(path.join(__dirname, `../Public/${fileName}`));
}

module.exports={removeFileFromDisk}