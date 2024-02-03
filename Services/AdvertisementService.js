
class AdvertisementService {
    constructor(uow){
        this._uow = uow;
    }
    
    async getHorizondalAds(FileUsageType, ReferenceID){
        const ads = await this._uow.Ads.getHorizondalAds(FileUsageType, ReferenceID);
        return ads;
    }

}
module.exports = AdvertisementService