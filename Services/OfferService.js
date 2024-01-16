const {FileUsageType} = require('../Enum/FileUsageType');
const {RefrenceModuleType} = require('../Enum/RefrenceModuleType');

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
}
module.exports = OfferService