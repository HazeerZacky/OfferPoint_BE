const {FileUsageType} = require('../Enum/FileUsageType');
const {RefrenceModuleType} = require('../Enum/RefrenceModuleType');
class BrandService {
    constructor(uow, fileService){
        this._uow = uow;
        this._fileService = fileService;
    }
    
    async getAll(){
        var brand = await this._uow.Brand.getAll();
        return brand;
    }

    async getAllFiltered(brandFilterModel){
        var brand = await this._uow.Brand.getAllFiltered(brandFilterModel);
        return brand;
    }
    async getBrand(id){
        var brand = await this._uow.Brand.getBrand(id);
        return brand;
    }
    async getBrandIdByUserId(id){
        var brand = await this._uow.Brand.getBrandIdByUserId(id);
        return brand;
    }

    async createBrand(brandModel){
        const id = await this._uow.Brand.createBrand(brandModel);
        return id;
    }

    async updateBrand(brandModel){
        await this._uow.Brand.updateBrand(brandModel);
    }

    async removeBrand(id){
        await this._uow.Brand.removeBrand(id);
        await this._fileService.removeFilesByModuleAndRefAndFileUsage(RefrenceModuleType.Brand, id, FileUsageType.BrandVerificationDocument);
        await this._fileService.removeFilesByModuleAndRefAndFileUsage(RefrenceModuleType.Brand, id, FileUsageType.BrandProfileImage);
    }

    async removeAllBrandSubUsers(BrandID){
        const brands = await this._uow.User.getSubUsersByBrandID(BrandID);

        brands.map(async (v)=>{
            await this._uow.User.removeUser(v.UserID);
            await this._uow.User.removeSubUser(v.Id); 
        });
    }

    async removeBrandSubUserByUserID(UserID){
        await this._uow.User.removeBrandSubUserByUserID(UserID); 
    }
    
    async IsVerifiedBrand(BrandID){
        const IsVerified = await this._uow.Brand.IsVerifiedBrand(BrandID); 
        return IsVerified;
    }
}
module.exports = BrandService