const BrandModel = require("../Models/BrandModel");
const UserModel =  require("../Models/UserModel");
const {UserType} = require("../Enum/UserType"); 
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
        brandModel.DefaultCategoryID = brandUser.DefaultCategoryID;

        const brand = await this._uow.Brand.createBrand(brandModel);

        return brand;
    }
    
    async loginUser(loginModel){
        const user = await this._uow.User.loginUser(loginModel);
        if(user){
            if(user.UserType == UserType.BrandRootAdmin){
                const brand = await this._uow.Brand.getBrandIdByUserId(user.UserID);
                user.BrandID = brand.BrandID;
            }
            else if(user.UserType == UserType.BrandAdmin || user.UserType == UserType.BrandEditor){
                const brand = await this._uow.Brand.getBrandIdBySubUserId(user.UserID);
                user.BrandID = brand.BrandID;
            }
        }
        return user;
    } 

    async getAllFiltered(userFilterModel){
        const user = await this._uow.User.getAllFiltered(userFilterModel);
        return user;
    } 

    async linkBrandSubUser(UserID, BrandID){
        const user = await this._uow.User.linkBrandSubUser(UserID, BrandID);
        return user;
    } 

    async createContactMessage(contactModel){
        const id = await this._uow.User.createContactMessage(contactModel);
        return id;
    }

    async removeContactMessage(id){
        await this._uow.User.removeContactMessage(id);
    }

    async getAllFilteredContactMessage(contactFilterModel){
        const message = await this._uow.User.getAllFilteredContactMessage(contactFilterModel);
        return message;
    }

    async IsUserNameAlreadyExist(UserName, UserID){
        const isUserNameAlreadyExist = await this._uow.User.IsUserNameAlreadyExist(UserName, UserID);
        return isUserNameAlreadyExist;
    }
}
module.exports = UserService