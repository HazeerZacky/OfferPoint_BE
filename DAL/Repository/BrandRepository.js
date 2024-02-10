const Brand = require('../Entity/Brand');
const {RefrenceModuleType} =require('../../Enum/RefrenceModuleType'); 
const {FileUsageType} = require('../../Enum/FileUsageType');
const {isObjectHasKey} = require('../../Utils/checking');
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
            this._context.query(`
                SELECT brands.*, files.Name as BrandDocument 
                FROM brands 
                LEFT JOIN files ON brands.BrandID = files.ReferenceID AND files.ModuleID = ${RefrenceModuleType.Brand} AND files.FileUsageType = ${FileUsageType.BrandVerificationDocument}
                WHERE BrandID = ${id}
            `, (error, result)=>{
                resolve(result[0]);
            });
        });
    }

    async getAllFiltered(brandFilterModel){
        return new Promise((resolve, reject)=>{
            let q = `
                SELECT brands.*, files.Name as FileName, files.FileID,
                (SELECT COUNT(offers.OfferID) FROM offers WHERE BrandID = brands.BrandID AND offers.IsActive = 1) as ActivePromotion,
                (SELECT COUNT(offers.OfferID) FROM offers WHERE BrandID = brands.BrandID AND offers.IsActive = 1 AND date_format(offers.EndDate, '%Y-%m-%d') < date_format(NOW(), '%Y-%m-%d')) as ExpirePromotion,
                (SELECT category.CategoryName FROM category WHERE CategoryID = brands.DefaultCategoryID) as CategoryName
                FROM brands
                LEFT JOIN files ON brands.BrandID = files.ReferenceID AND files.ModuleID = ${RefrenceModuleType.Brand} AND files.FileUsageType = ${FileUsageType.BrandProfileImage}
            `;
            
            let whereClause = [];
            
            if(isObjectHasKey(brandFilterModel, 'BrandID') && brandFilterModel.BrandID > 0){
                whereClause.push(`brands.BrandID = ${brandFilterModel.BrandID}`);
            }

            if(isObjectHasKey(brandFilterModel, 'SearchText') && brandFilterModel.SearchText.trim() != ""){
                whereClause.push(`( brands.BrandName LIKE "%${brandFilterModel.SearchText}%" OR  brands.Description LIKE "%${brandFilterModel.SearchText}%" OR brands.ContactNo LIKE "%${brandFilterModel.SearchText}%" )`);
            }

            if(whereClause.length){
                q+= `WHERE ${whereClause.join(' AND ')}`;
            }

            q+= ` ORDER BY brands.BrandID desc`;

            this._context.query(q, (error, result)=>{
                resolve(result);
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
        delete existingBrand.BrandDocument;
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

    async getBrandIdBySubUserId(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT BrandID FROM brandsubusers WHERE UserID = ${id}`, (error, result)=>{
                resolve(result[0]);
            });
        });
    }

    async IsVerifiedBrand(BrandID){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM brands WHERE BrandID = ${BrandID} AND IsVerified = 1`, (error, result)=>{
                resolve(result.length > 0);
            });
        });
    }

    ToEntity(source, target){
        target.BrandID = source.BrandID;
        target.BrandName = source.BrandName;
        target.ContactNo = source.ContactNo;
        target.Description = source.Description;
        target.UserID = source.UserID;
        target.IsVerified = source.IsVerified;
        target.DefaultCategoryID = source.DefaultCategoryID;
        target.Website = source.Website;
        return target;
    }

}

module.exports = BrandRepository;