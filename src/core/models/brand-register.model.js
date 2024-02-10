import {USER_TYPE} from '../enums/userTypeEnum';

export class BrandRegisterModel{

    constructor(){
        this.UserName = "",
        this.Password = "",
        this.ConfirmPassword = "",
        this.UserType = USER_TYPE.BrandRootAdmin,
        this.Email = "",
        this.BrandName = "",
        this.DefaultCategoryID = 0,
        this.VerificationDocument = null
    }
}