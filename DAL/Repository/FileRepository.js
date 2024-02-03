const { RefrenceModuleType } = require('../../Enum/RefrenceModuleType');
const File = require('../Entity/File');

class FileRepository{
    constructor(context){
        this._context = context;
    }

    async getFile(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM files WHERE FileID = ${id}`, (error, result)=>{
                resolve(result[0]);
            });
        });
    }

    async createFile(fileModel){
        let fileToInsert = this.ToEntity(fileModel, new File());

        return new Promise((resolve, reject)=>{
            this._context.query('INSERT INTO files SET ?', fileToInsert, (error, result)=>{
                resolve({id : result.insertId});
            });
        });
    }

    async updateFile(fileModel){
        const existingFile = await this.getFile(fileModel.FileID);
        const fileToUpdate = this.ToEntity(fileModel, existingFile);

        return new Promise((resolve, reject)=>{
            this._context.query(`UPDATE files SET ? WHERE FileID = ${fileToUpdate.FileID}`, fileToUpdate, (error, result)=>{
                resolve();
            });
        });
    }

    async removeFile(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`DELETE FROM files WHERE FileID = ${id}`, (error, result)=>{
                resolve();
            });
        });
    }

    async getFilesByModuleAndRefAndFileUsage(ModuleID, ReferenceID, FileUsageType){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM files WHERE ModuleID = ${ModuleID} AND ReferenceID = ${ReferenceID} AND FileUsageType = ${FileUsageType}`, (error, result)=>{
                resolve(result);
            });
        });
    }

    async getHorizondalAds(FileUsageType, ReferenceID){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM files WHERE ModuleID = ${RefrenceModuleType.ADVERTISEMENT} AND ReferenceID = ${ReferenceID} AND FileUsageType = ${FileUsageType}`, (error, result)=>{
                resolve(result[0]);
            });
        });
    }

    ToEntity(source, target){
        target.FileID = source.FileID;
        target.ReferenceID = source.ReferenceID;
        target.ModuleID = source.ModuleID;
        target.Name = source.Name;
        target.FileUsageType = source.FileUsageType;
        return target;
    }

}

module.exports = FileRepository;