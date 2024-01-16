const Brand = require('../Entity/Brand');
class BrandRepository{
    constructor(context){
        this._context = context;
    }

    async getAll(){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM brands`, (error, result)=>{
                resolve(result);
            });
        });
    }

    async getBrand(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM brands WHERE BrandID = ${id}`, (error, result)=>{
                resolve(result[0]);
            });
        });
    }

    async createBrand(brandModel){
        let brandToInsert = this.ToEntity(brandModel, new Brand());

        return new Promise((resolve, reject)=>{
            this._context.query('INSERT INTO brands SET ?', brandToInsert, (error, result)=>{
                resolve({id : result.insertId});
            });
        });
    }

    async updateBrand(brandModel){
        const existingBrand = await this.getBrand(brandModel.BrandID);
        const brandToUpdate = this.ToEntity(brandModel, existingBrand);

        return new Promise((resolve, reject)=>{
            this._context.query(`UPDATE brands SET ? WHERE BrandID = ${brandToUpdate.BrandID}`, brandToUpdate, (error, result)=>{
                resolve();
            });
        });
    }

    async removeBrand(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`DELETE FROM brands WHERE BrandID = ${id}`, (error, result)=>{
                resolve();
            });
        });
    }

    async getBrandIdByUserId(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT BrandID FROM brands WHERE UserID = ${id}`, (error, result)=>{
                resolve(result[0]);
            });
        });
    }

    ToEntity(source, target){
        target.BrandID = source.BrandID;
        target.BrandName = source.BrandName;
        target.ContactNo = source.ContactNo;
        target.Description = source.Description;
        target.UserID = source.UserID;

        return target;
    }

}

module.exports = BrandRepository;