const multer  = require('multer');

class FileStorageEngine{
    constructor(diskDestination){
        this._diskStorage = multer.diskStorage({
            destination: diskDestination,
            filename: (req, file, callBack)=>{
                callBack(null, `${Date.now()}_${file.originalname}`);
            }
        }); 
    }
}

module.exports = FileStorageEngine;