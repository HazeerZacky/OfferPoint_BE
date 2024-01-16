const BrandModel = require("../Models/BrandModel");
const UserModel =  require("../Models/UserModel");
class UserService {
    constructor(uow){
        this._uow = uow
    }

    async getAll(){
        var user = await this._uow.User.getAll();
        return user;
    }

    async getUser(id){
        var user = await this._uow.User.getUser(id);
        return user;
    }

    async createUser(userModel){
        const id = await this._uow.User.createUser(userModel);
        return id;
    }

    async updateUser(userModel){
        await this._uow.User.updateUser(userModel);
    }

    async removeUser(id){
        await this._uow.User.removeUser(id);
    }

    async registerBrandUser(brandUser){
        const userModel = new UserModel();
        userModel.UserName = brandUser.UserName;
        userModel.Password = brandUser.Password;
        userModel.UserType = brandUser.UserType;
        userModel.Email = brandUser.Email;
        userModel.IsActive = true;

        const user = await this.createUser(userModel);

        const brandModel = new BrandModel();
        brandModel.BrandName = brandUser.BrandName;
        brandModel.UserID = user.id;

        const brand = await this._uow.Brand.createBrand(brandModel);

        return user;
    }
    
    async loginUser(loginModel){
        const user = await this._uow.User.loginUser(loginModel);
        return user;
    } 

}
module.exports = UserService