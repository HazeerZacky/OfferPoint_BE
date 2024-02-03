const { UserType } = require('../../Enum/UserType');
const { isObjectHasKey } = require('../../Utils/checking');
const Contact = require('../Entity/Contact');
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

    async getAllFiltered(userFilterModel){
        return new Promise((resolve, reject)=>{
            let q = `
                SELECT users.Email,users.IsActive,users.UserID,users.UserName,users.UserType,brands.BrandID, brands.BrandName,
                (
                    SELECT b.BrandName from brandsubusers 
                    LEFT JOIN brands as b ON b.BrandID = brandsubusers.BrandID
                    LEFT JOIN users as u ON u.UserID = brandsubusers.UserID
                    where brandsubusers.UserID = users.UserID
                ) as SubUserBrandName
                FROM users
                LEFT JOIN brands ON users.UserID = brands.UserID
                LEFT JOIN brandsubusers ON users.UserID = brandsubusers.UserID
            `;
            
            let whereClause = [];
            
            if(isObjectHasKey(userFilterModel, 'SearchText') && userFilterModel.SearchText.trim() != ""){
                whereClause.push(`( users.UserName LIKE "%${userFilterModel.SearchText}%" )`);
            }

            if(isObjectHasKey(userFilterModel, 'isNeedSubUsers') && !userFilterModel.isNeedSubUsers){
                whereClause.push(` users.UserType != ${UserType.BrandEditor} AND users.UserType != ${UserType.BrandAdmin} `);
            }

            if(isObjectHasKey(userFilterModel, 'BrandID') && userFilterModel.BrandID > 0){
                whereClause.push(` brands.BrandID = ${userFilterModel.BrandID} OR brandsubusers.BrandID = ${userFilterModel.BrandID}`);
            }

            if(isObjectHasKey(userFilterModel, 'isExcludeAdmin') && userFilterModel.isExcludeAdmin){
                whereClause.push(` users.UserType != ${UserType.Admin} `);
            }

            if(whereClause.length){
                q+= `WHERE ${whereClause.join(' AND ')}`;
            }

            q+= ` ORDER BY users.UserID desc`;

            this._context.query(q, (error, result)=>{
                resolve(result);
            });
        });
    }

    async linkBrandSubUser(UserID, BrandID){
        let dataToInsert = {UserID, BrandID, Id: 0};

        return new Promise((resolve, reject)=>{
            this._context.query('INSERT INTO brandsubusers SET ?', dataToInsert, (error, result)=>{
                resolve({id : result.insertId});
            });
        });
    }

    async removeSubUser(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`DELETE FROM brandsubusers WHERE Id = ${id}`, (error, result)=>{
                resolve();
            });
        });
    }

    async getSubUsersByBrandID(BrandID){
        return new Promise((resolve, reject)=>{
            this._context.query(`SELECT brandsubusers.*,users.UserName from brandsubusers 
            LEFT JOIN users ON users.UserID = brandsubusers.UserID
            where brandsubusers.BrandID = ${BrandID}`, (error, result)=>{
                resolve(result);
            });
        });
    }

    async removeBrandSubUserByUserID(UserID){
        return new Promise((resolve, reject)=>{
            this._context.query(`DELETE FROM brandsubusers WHERE UserID = ${UserID}`, (error, result)=>{
                resolve();
            });
        });
    } 

    async createContactMessage(contactModel){
        let contactToInsert = this.ToEntityContact(contactModel, new Contact());

        return new Promise((resolve, reject)=>{
            this._context.query('INSERT INTO contacts SET ?', contactToInsert, (error, result)=>{
                resolve({id : result.insertId});
            });
        });
    }

    async removeContactMessage(id){
        return new Promise((resolve, reject)=>{
            this._context.query(`DELETE FROM contacts WHERE ID = ${id}`, (error, result)=>{
                resolve();
            });
        });
    }

    async getAllFilteredContactMessage(contactFilterModel){
        return new Promise((resolve, reject)=>{
            this._context.query('SELECT * FROM contacts ORDER BY ID desc', (error, result)=>{
                resolve(result);
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

    ToEntityContact(source, target){
        target.ID = source.ID;
        target.Email = source.Email;
        target.Subject = source.Subject;
        target.Message = source.Message;
        target.Name = source.Name;
        return target;
    }
}

module.exports = UserRepository;