const Fs = require('fs');
const path = require('path');

function removeFileFromDisk(fileName){
    const filePath = path.join(__dirname, `../Public/${fileName}`); 
    if(Fs.existsSync(filePath)){
        Fs.unlinkSync(filePath);
    }
}

module.exports={removeFileFromDisk}