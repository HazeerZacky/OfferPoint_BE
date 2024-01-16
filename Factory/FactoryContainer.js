const UnitOfWork = require('../DAL/Uow/UnitOfWork');
const BrandService = require('../Services/BrandService');
const CategoryService = require('../Services/CategoryService');
const FileService = require('../Services/FileService');
const OfferService = require('../Services/OfferService');
const UserService = require('../Services/UserService');
const FileUploadService = require('../FAL/fileUploadService');
const {FactoryResolveType} = require('../Enum/FactoryResolveType');

class FactoryContainer{
    static Resolve(type = null, isNeedUow = false){
        const uow = isNeedUow ? new UnitOfWork() : null;
        switch(type){
            case FactoryResolveType.UNITOFWORK:
                return new UnitOfWork();
            case FactoryResolveType.BRAND_SERVICE:
                return new BrandService(uow);
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
            default:
                return null;
        }
    }
}
module.exports = FactoryContainer;