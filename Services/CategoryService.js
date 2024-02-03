class CategoryService {
    constructor(uow){
        this._uow = uow
    }

    async GetAll(){
        var x= await this._uow.Category.GetAll();
        return x;
    }

    async getAllCategoryAsKeyValue(){
        const categories= await this._uow.Category.getAllCategoryAsKeyValue();
        return categories;
    }

    async getCategory(id){
        var category = await this._uow.Category.getCategory(id);
        return category;
    }

    async createCategory(categoryModel){
        var x= await this._uow.Category.createCategory(categoryModel);
        return x;
    }

    async updateCategory(categoryModel){
        await this._uow.Category.updateCategory(categoryModel);
    }

    async removeCategory(id){
        await this._uow.Category.removeCategory(id);
    }

    async getAllFiltered(categoryFilterModel){
        var category = await this._uow.Category.getAllFiltered(categoryFilterModel);
        return category;
    }
    
}
module.exports = CategoryService