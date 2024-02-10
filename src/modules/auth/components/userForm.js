import React,{useEffect, useState} from "react";
import * as yup from 'yup';
import { isUndefinedNullOrEmpty } from "../../../core/utils/checking";
import authService from '../auth-service';
import { UserModel } from "../../../core/models/user.model";
import { USER_TYPE } from "../../../core/enums/userTypeEnum";
import { useAuth } from "../../../core/hooks/useAuth";
import {useFormValidation} from '../../../core/hooks/useFormValidation';
import {WrapErrorMessage, ErrorMessage, getErrorClass} from '../../../components/error-message';

export const UserForm = (props)=>{
    const [user, setUser] = useState({...new UserModel(), UserType: USER_TYPE.BrandAdmin});
    const [isDublicateUserName, setIsDublicateUserName] = useState(false);
    const [_prevPassword, set_PrevPassword] = useState('');
    const isEdit = !isUndefinedNullOrEmpty(props.selectedId);
    const USER_FORM_VALIDATION_SCHEMA = yup.object({
        UserName : yup.string().required('required'),
        Password : yup.string().test('check-length','password must be at least 5 characters',(value)=> value.length != 0 ? value.length >= 5 : true ).test('required-check', 'required', (value)=> !isEdit ? value.length : true),
        Email: yup.string().nullable().email('invalid email')
    });
    const {isBrandRootAdmin, user : loginUser , isAdmin} = useAuth();
    const {isValid, errors, onValidate, setErrors} = useFormValidation(USER_FORM_VALIDATION_SCHEMA);
    const Error = WrapErrorMessage(ErrorMessage, errors);
    
    useEffect(()=>{
        isEdit && fetchUser();
    }, []);

    const onChange = (value = {}) => {
        const constructValues = {...user, ...value};
        onValidate(constructValues);
        setUser(constructValues);
        setIsDublicateUserName(false);
    } 

    const onSave = ()=>{
        authService.IsUserNameAlreadyExist(user.UserName, user.UserID).then((isUserNameExist)=>{
            if(!isUserNameExist){
                onValidate(user).then((isFormValid)=>{
                    if(isFormValid){
                        let userData = user;
                        if(isEdit && userData.Password.trim() == ""){
                            userData.Password = _prevPassword;
                        }
                        (isEdit ? authService.updateUser : authService.createUser)(userData).then((data)=>{
                            if(!isEdit){
                                authService.linkBrandSubUser(data.id, loginUser.BrandID).then(()=>{
                                    props.onClose();
                                })
                            }
                            else{
                                props.onClose();
                            }
                        });
                    }
                })
                setIsDublicateUserName(false);
            }
            else{
                setIsDublicateUserName(true);
            }
        });
    }

    const fetchUser = ()=>{
        authService.getUser(props.selectedId).then((data)=>{
            set_PrevPassword(data.Password);
            delete data.Password;
            onChange(data);
        })
    }

    return (
            <div className="container">
                {isDublicateUserName &&
                    <div class="alert alert-danger w-100" role="alert">
                        This user name is already used.
                    </div>
                }
                <div class="row form-group">
                    <div class="col-md-12">
                        <label class="text-black">User Name</label>
                        <input type="text" class={`form-control ${getErrorClass('UserName',errors)}`} value={user.UserName} onChange={(e)=> onChange({UserName: e.target.value})}/>
                        <Error property="UserName"/>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-md-12">
                        <label class="text-black">Password</label>
                        <input type="password" class={`form-control ${getErrorClass('Password',errors)}`} value={user.Password} onChange={(e)=> onChange({Password: e.target.value})}/>
                        <Error property="Password"/>
                    </div>
                </div>
                {(isBrandRootAdmin() ? isEdit ? props.selectedId !=  loginUser.UserID : true : false) &&
                    <div class="row form-group">
                        <div class="col-md-12">
                            <label class="text-black">UserType</label>
                            <select id="categories" className="form-control" value={user.UserType} onChange={(e)=> onChange({UserType: e.target.value})}>
                                <option value={USER_TYPE.BrandAdmin}>Admin</option>
                                <option value={USER_TYPE.BrandEditor}>Editor</option>
                            </select>
                        </div>
                    </div>
                }

                <div class="row form-group">
                    <div class="col-md-12">
                        <label class="text-black">Email</label>
                        <input type="text" class={`form-control ${getErrorClass('Email',errors)}`} value={user.Email} onChange={(e)=> onChange({Email: e.target.value})}/>
                        <Error property="Email"/>
                    </div>
                </div>

                {user.UserType != USER_TYPE.Admin &&
                    <div class="form-group form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1" checked={user.IsActive} onChange={(e)=> onChange({IsActive: +e.target.checked}) }/>
                        <label class="form-check-label" for="exampleCheck1">Is Active</label>
                    </div>
                }

                <div class="row form-group mt-4">
                    <div class="col-md-12 d-flex justify-content-end">
                        <button class="btn btn-secondary mr-2" onClick={props.onClose}>Cancel</button>
                        <button class="btn btn-primary" disabled={!isValid} onClick={onSave}>Save</button>
                    </div>
                </div>
            </div>
    );
}