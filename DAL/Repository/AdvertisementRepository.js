const {RefrenceModuleType} =require('../../Enum/RefrenceModuleType'); 
const {FileUsageType} = require('../../Enum/FileUsageType');
const {isObjectHasKey} = require('../../Utils/checking');

class AdvertisementRepository{
    constructor(context){
        this._context = context;
    }

    async getHorizondalAds(FileUsageType, ReferenceID){
        
        return {};
    }
}

module.exports = AdvertisementRepository;