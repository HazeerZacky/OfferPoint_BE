const User = require('../Entity/User');
class UserRepository{
    constructor(context){
        this._context = context;
    }

    async getAll(){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM users`, (error, result)=>{
                resolve(result);
            });
        });
    }

    async getUser(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT * FROM users WHERE UserID = ${id}`, (error, result)=>{
                resolve(result[0]);
            });
        });
    }

    async createUser(userModel){
        let userToInsert = this.ToEntity(userModel, new User());

        return new Promise((resolve, reject)=>{
            this._context.query('INSERT INTO users SET ?', userToInsert, (error, result)=>{
                resolve({id : result.insertId});
            });
        });
    }

    async loginUser(loginModel){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT Email,IsActive,UserID,UserName,UserType FROM users WHERE UserName = "${loginModel.UserName}" AND Password = "${loginModel.Password}" `, (error, result)=>{
                resolve(result[0]);
            });
        });
    }

    async updateUser(userModel){
        const existingUser = await this.getUser(userModel.UserID);
        const userToUpdate = this.ToEntity(userModel, existingUser);

        return new Promise((resolve, reject)=>{
            this._context.query(`UPDATE users SET ? WHERE UserID = ${userToUpdate.UserID}`, userToUpdate, (error, result)=>{
                resolve();
            });
        });
    }

    async removeUser(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`DELETE FROM users WHERE UserID = ${id}`, (error, result)=>{
                resolve();
            });
        });
    }

    ToEntity(source, target){
        
        target.UserID = source.UserID;
        target.UserName = source.UserName;
        target.Password = source.Password;
        target.UserType = source.UserType;
        target.IsActive = source.IsActive;
        target.Email = source.Email;

        return target;
    }
}

module.exports = UserRepository;