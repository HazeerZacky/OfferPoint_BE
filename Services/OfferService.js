const {FileUsageType} = require('../Enum/FileUsageType');
const {RefrenceModuleType} = require('../Enum/RefrenceModuleType');
const { isObjectHasKey } = require('../Utils/checking');

class OfferService {
    constructor(uow, fileService){
        this._uow = uow,
        this._fileService = fileService;
    }

    async getAll(){
        var offer = await this._uow.Offer.getAll();
        return offer;
    }

    async getAllFiltered(offerFilterModel){
        var offers = await this._uow.Offer.getAllFiltered(offerFilterModel); 
        return offers;
    }

    async getOffer(id){
        var offer = await this._uow.Offer.getOffer(id);
        return offer;
    }

    async createOffer(offerModel){
        const id = await this._uow.Offer.createOffer(offerModel);
        return id;
    }

    async updateOffer(offerModel){
        await this._uow.Offer.updateOffer(offerModel);
    }

    async removeOffer(id){
        await this._uow.Offer.removeOffer(id);
        await this._fileService.removeFilesByModuleAndRefAndFileUsage(RefrenceModuleType.Offer, id, FileUsageType.OfferPostImage);
    }

    async getMostRecentOffers(){
        var offer = await this._uow.Offer.getMostRecentOffers();
        return offer;
    }

    async getMostPopularOffers(){
        var offer = await this._uow.Offer.getMostPopularOffers();
        return offer;
    }
    
    async removeOfferByBrandID(BrandID){
        var offers = await this._uow.Offer.getAllFiltered({BrandID});
        offers.map(async (v)=>{
            await this.removeOffer(v.OfferID);
        });
    }

    async updateOfferViews(OfferID, ClientID){
        if(ClientID){
            const isAlreadyViewed = await this._uow.Offer.isAlreadyViewed(OfferID, ClientID);
            if(!isAlreadyViewed){
                await this._uow.Offer.increaseViewCount(OfferID);
                await this._uow.Offer.insertOfferViewLog(OfferID, ClientID);
            }
        }
    }

}
module.exports = OfferService