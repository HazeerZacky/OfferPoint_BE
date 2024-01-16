const multer  = require('multer');
const FileStorageEngine = require('./storageEngine'); 

class FileUploadService{
    constructor(){
        const fileStorageEngine = new FileStorageEngine('./Public');
        this.diskStorageEngine = fileStorageEngine._diskStorage;
        this._multer = multer({storage: this.diskStorageEngine});
    }

    uploadSingleFile(fileKey){
        return this._multer.single(fileKey);
    }
}
module.exports = FileUploadService;