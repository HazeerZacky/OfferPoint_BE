const Category = require('../Entity/Category');

class CategoryRepository{
    constructor(context){
        this._context = context;
    }

    async GetAll(){
        return new Promise((resolve, reject)=>{
            this._context.query('SELECT * FROM category',(error, result)=>{
                resolve(result);
            });
        });
    }

    async getAllCategoryAsKeyValue(){
        return new Promise((resolve, reject)=>{
            this._context.query('SELECT CategoryID as k, CategoryName as v FROM category',(error, result)=>{
                resolve(result);
            });
        });
    }

    async getCategory(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM category WHERE CategoryID = ${id}`, (error, result)=>{
                resolve(result[0]);
            });
        });
    }

    async createCategory(categoryModel){
        let categoryToInsert = this.ToEntity(categoryModel, new Category());

        return new Promise((resolve, reject)=>{
            this._context.query('INSERT INTO category SET ?', categoryToInsert, (error, result)=>{
                resolve({id : result.insertId});
            });
        });
    }

    async updateCategory(categoryModel){
        const existingCategory = await this.getCategory(categoryModel.CategoryID);
        const categoryToUpdate = this.ToEntity(categoryModel, existingCategory);

        return new Promise((resolve, reject)=>{
            this._context.query(`UPDATE category SET ? WHERE CategoryID = ${categoryToUpdate.CategoryID}`, categoryToUpdate, (error, result)=>{
                resolve();
            });
        });
    }

    async removeCategory(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`DELETE FROM category WHERE CategoryID = ${id}`, (error, result)=>{
                resolve();
            });
        });
    }

    ToEntity(source, target){
        target.CategoryID = source.CategoryID;
        target.CategoryName = source.CategoryName;
        return target;
    }
}

module.exports = CategoryRepository;