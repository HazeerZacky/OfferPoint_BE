
class BrandService {
    constructor(uow){
        this._uow = uow;
    }
    
    async getAll(){
        var brand = await this._uow.Brand.getAll();
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
    }
}
module.exports = BrandService