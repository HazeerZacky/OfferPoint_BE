const Offer = require('../Entity/Offer');
const {RefrenceModuleType} =require('../../Enum/RefrenceModuleType'); 
const {FileUsageType} = require('../../Enum/FileUsageType');
const {isObjectHasKey} = require('../../Utils/checking');
class OfferRepository{
    constructor(context){
        this._context = context;
    }

    async getAll(){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM offers`, (error, result)=>{
                resolve(result);
            });
        });
    }

    async getOffer(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM offers WHERE OfferID = ${id}`, (error, result)=>{
                resolve(result[0]);
            });
        });
    }

    async getAllFiltered(offerFilterModel){
        return new Promise((resolve, reject)=>{
            let q = `
                SELECT offers.*, category.CategoryName, brands.BrandName, brands.ContactNo, files.Name as FileName, files.FileID
                FROM offers 
                LEFT JOIN category ON offers.CategoryID = category.CategoryID
                LEFT JOIN brands ON offers.BrandID = brands.BrandID
                LEFT JOIN files ON offers.OfferID = files.ReferenceID AND files.ModuleID = ${RefrenceModuleType.Offer} AND files.FileUsageType = ${FileUsageType.OfferPostImage}
            `;
            let whereClause = [];
            
            if(isObjectHasKey(offerFilterModel, 'OfferID') && offerFilterModel.OfferID > 0){
                whereClause.push(`offers.OfferID = ${offerFilterModel.OfferID}`);
            }

            if(isObjectHasKey(offerFilterModel, 'CategoryID') && offerFilterModel.CategoryID > 0){
                whereClause.push(`offers.CategoryID = ${offerFilterModel.CategoryID}`);
            }

            if(isObjectHasKey(offerFilterModel, 'BrandID') && offerFilterModel.BrandID > 0){
                whereClause.push(`offers.BrandID = ${offerFilterModel.BrandID}`);
            }

            if(isObjectHasKey(offerFilterModel, 'SearchText') && offerFilterModel.SearchText.trim() != ""){
                whereClause.push(`( offers.Title LIKE "%${offerFilterModel.SearchText}%" OR  offers.Description LIKE "%${offerFilterModel.SearchText}%" OR offers.Tags LIKE "%${offerFilterModel.SearchText}%" OR brands.BrandName LIKE "%${offerFilterModel.SearchText}%" )`);
            }

            if(whereClause.length){
                q+= `WHERE ${whereClause.join(' AND ')}`;
            }

            q+= ` ORDER BY offers.OfferID desc`;
            
            this._context.query(q, (error, result)=>{
                resolve(result);
            });
        });
    }

    async createOffer(offerModel){
        let offerToInsert = this.ToEntity(offerModel, new Offer());

        return new Promise((resolve, reject)=>{
            this._context.query('INSERT INTO offers SET ?', offerToInsert, (error, result)=>{
                resolve({id : result.insertId});
            });
        });
    }

    async updateOffer(offerModel){
        const existingOffer = await this.getOffer(offerModel.OfferID);
        const offerToUpdate = this.ToEntity(offerModel, existingOffer);

        return new Promise((resolve, reject)=>{
            this._context.query(`UPDATE offers SET ? WHERE OfferID = ${offerToUpdate.OfferID}`, offerToUpdate, (error, result)=>{
                resolve();
            });
        });
    }

    async removeOffer(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`DELETE FROM offers WHERE OfferID = ${id}`, (error, result)=>{
                resolve();
            });
        });
    }

    async getMostRecentOffers(){
        let q = `
                SELECT offers.*, category.CategoryName, brands.BrandName, brands.ContactNo, files.Name as FileName, files.FileID
                FROM offers 
                LEFT JOIN category ON offers.CategoryID = category.CategoryID
                LEFT JOIN brands ON offers.BrandID = brands.BrandID
                LEFT JOIN files ON offers.OfferID = files.ReferenceID AND files.ModuleID = ${RefrenceModuleType.Offer} AND files.FileUsageType = ${FileUsageType.OfferPostImage}
                ORDER BY offers.OfferID desc LIMIT 6
            `;
        
        return new Promise((resolve, reject)=>{
            this._context.query(q, (error, result)=>{
                resolve(result);
            });
        });
    }

    async getMostPopularOffers(){
        let q = `
            SELECT offers.*, category.CategoryName, brands.BrandName, brands.ContactNo, files.Name as FileName, files.FileID
            FROM offers 
            LEFT JOIN category ON offers.CategoryID = category.CategoryID
            LEFT JOIN brands ON offers.BrandID = brands.BrandID
            LEFT JOIN files ON offers.OfferID = files.ReferenceID AND files.ModuleID = ${RefrenceModuleType.Offer} AND files.FileUsageType = ${FileUsageType.OfferPostImage}
            ORDER BY offers.ViewsCount desc LIMIT 6
        `;

        return new Promise((resolve, reject)=>{
            this._context.query(q, (error, result)=>{
                resolve(result);
            });
        });
    }

    async isAlreadyViewed(OfferID, ClientID){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM offerviews WHERE OfferID = ${OfferID} AND ClientID = ${ClientID}`, (error, result)=>{
                resolve(result.length > 0);
            });
        });
    }

    async increaseViewCount(OfferID){
        return new Promise((resolve, reject)=>{
            this._context.query(`UPDATE offers SET ViewsCount = (SELECT ViewsCount from offers WHERE OfferID = ${OfferID}) + 1 WHERE OfferID = ${OfferID}`, (error, result)=>{
                resolve();
            });
        });
    }

    async insertOfferViewLog (OfferID, ClientID){
        return new Promise((resolve, reject)=>{
            this._context.query('INSERT INTO offerviews SET ?', {OfferID, ClientID}, (error, result)=>{
                resolve({id : result.insertId});
            });
        });
    }

    ToEntity(source, target){
        
        target.OfferID = source.OfferID;
        target.Title = source.Title;
        target.Description = source.Description;
        target.Tags = source.Tags;
        target.StartDate = source.StartDate;
        target.EndDate = source.EndDate;
        target.CategoryID = source.CategoryID;
        target.PromoCode = source.PromoCode;
        target.ViewsCount = source.ViewsCount;
        target.BrandID = source.BrandID;
        target.IsActive = source.IsActive;

        return target;
    }

}

module.exports = OfferRepository;