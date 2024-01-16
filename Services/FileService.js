const FileUploadService = require('../FAL/fileUploadService');
const FileModel = require('../Models/FileModel');
const {removeFileFromDisk} = require('../FAL/fileService');

class FileService {
    constructor(uow){
        this._uow = uow;
        this._fileUploadService = new FileUploadService();
    }

    async getFile(id){
        var file = await this._uow.File.getFile(id);
        return file;
    }

    async createFile(req, res){
        return new Promise((resolve, reject)=>{
            this._fileUploadService.uploadSingleFile('File')(req, res, async ()=>{
                const insertedFile = req.file;
                const fileModel = new FileModel();
                fileModel.Name = insertedFile.filename;
                fileModel.ModuleID = req.body.ModuleID;
                fileModel.ReferenceID = req.body.ReferenceID;
                fileModel.FileUsageType = req.body.FileUsageType;
                
                const id = await this._uow.File.createFile(fileModel);
                resolve(id);
            });
        }); 
    }

    async updateFile(fileModel){
        await this._uow.File.updateFile(fileModel);
    }

    async removeFile(id){
        const file = await this._uow.File.getFile(id);
        removeFileFromDisk(file.Name);
        await this._uow.File.removeFile(id);
    }

    async removeFilesByModuleAndRefAndFileUsage(ModuleID, ReferenceID, FileUsageType){
        const files = await this._uow.File.getFilesByModuleAndRefAndFileUsage(ModuleID, ReferenceID, FileUsageType);

        files.map(async (v)=>{
            await this.removeFile(v.FileID);
        });
    }

}
module.exports = FileService