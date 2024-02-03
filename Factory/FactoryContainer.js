const UnitOfWork = require('../DAL/Uow/UnitOfWork');
const BrandService = require('../Services/BrandService');
const CategoryService = require('../Services/CategoryService');
const FileService = require('../Services/FileService');
const OfferService = require('../Services/OfferService');
const UserService = require('../Services/UserService');
const FileUploadService = require('../FAL/fileUploadService');
const {FactoryResolveType} = require('../Enum/FactoryResolveType');
const AdvertisementService = require('../Services/AdvertisementService');
const PaginationService = require('../Services/PaginationService');

class FactoryContainer{
    static Resolve(type = null, isNeedUow = false){
        const uow = isNeedUow ? new UnitOfWork() : null;
        switch(type){
            case FactoryResolveType.UNITOFWORK:
                return new UnitOfWork();
            case FactoryResolveType.BRAND_SERVICE:
                return new BrandService(uow, new FileService(uow));
            case FactoryResolveType.CATEGORY_SERVICE:
                return new CategoryService(uow);
            case FactoryResolveType.FILE_SERVICE:
                return new FileService(uow);
            case FactoryResolveType.OFFER_SERVICE:
                return new OfferService(uow, new FileService(uow));
            case FactoryResolveType.USER_SERVICE:
                return new UserService(uow);
            case FactoryResolveType.FILE_UPLOAD_SERVICE:
                return new FileUploadService();
            case FactoryResolveType.ADVERTISEMENT_SERVICE:
                return new AdvertisementService(uow);
            case FactoryResolveType.PAGINATION_SERVICE:
                return new PaginationService();
            default:
                return null;
        }
    }
}
module.exports = FactoryContainer;