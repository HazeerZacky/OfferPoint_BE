import React,{ useState }  from "react";
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { BreadCrumb } from "../../../components/breadcrumb";
import authService from '../auth-service';
import {isUndefinedNullOrEmpty} from '../../../core/utils/checking';
import { REDUX_ACTION } from "../../../core/enums/reduxActionEnum";
import {useFormValidation} from '../../../core/hooks/useFormValidation';
import {WrapErrorMessage, ErrorMessage, getErrorClass} from '../../../components/error-message';
import {USER_TYPE} from '../../../core/enums/userTypeEnum';

const LOGIN_FORM_VALIDATION_SCHEMA = yup.object({
    UserName : yup.string().required('required'),
    Password : yup.string().nullable().min(5, 'password must be at least 5 characters').required('required'),
    WrongUserNamePassword: yup.string().nullable()
});

export const LoginPage = ()=>{
    const [login, setLogin] = useState({UserName: '', Password: ''});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isValid, errors, onValidate, setErrors} = useFormValidation(LOGIN_FORM_VALIDATION_SCHEMA);
    const Error = WrapErrorMessage(ErrorMessage, errors);
    const [isLogin, setIsLogin] = useState(false);

    const onChange = (value = {}) => {
        const constructValues = {...login, ...value};
        onValidate(constructValues);
        setLogin(constructValues);
    } 

    const onSave = ()=>{
        onValidate(login).then((isFormValid)=>{
            if(isFormValid){
                authService.loginUser(login).then((data)=>{
                    if(isUndefinedNullOrEmpty(data)){
                        setErrors({WrongUserNamePassword: 'wrong username or password'});
                    }
                    else{
                        if(data.message){
                            setErrors({WrongUserNamePassword: data.message});
                        }
                        else{
                            saveUserToRedux(data);
                            setIsLogin(true);
                            setTimeout(()=>{
                                setIsLogin(false);
                                if(data.UserType == USER_TYPE.Admin){
                                    navigate('/dashboard');
                                } 
                                else if(data.UserType == USER_TYPE.BrandAdmin || data.UserType == USER_TYPE.BrandEditor || data.UserType == USER_TYPE.BrandRootAdmin){
                                    navigate(`/brands/${btoa(data.BrandID)}`);
                                }
                                else{
                                    navigate('/');
                                }
                            },1500)
                            
                        }
                    }
                });
            }
        })
    }

    const saveUserToRedux = (user)=>{
        dispatch({
            type: `${REDUX_ACTION.SET_USER}`,
            payload: {...user}
        });
    }

    return (
        <div>
            <BreadCrumb childTitle="login" moduleTitle="Login"/>

            <div class="page-section">
                <div class="container">
                    <div className="row justify-content-center">
                        <div class="col-lg-6">
                            <div class="contact-form px-lg-5">
                                {isLogin &&
                                    <div class="alert alert-success" role="alert">
                                        successfully logged in you will be redirect for a while...
                                    </div>
                                }

                                <div class="row form-group">
                                    <div class="col-md-12">
                                        <label class="text-black" >User Name</label>
                                        <input type="email" value={login.UserName} onChange={(e)=> onChange({UserName: e.target.value})} class={`form-control ${getErrorClass('UserName',errors)}`}/>
                                        <Error property="UserName"/>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <div class="col-md-12">
                                        <label class="text-black">Password</label>
                                        <input type="password" value={login.Password} onChange={(e)=> onChange({Password: e.target.value})} class={`form-control ${getErrorClass('Password',errors)}`}/>
                                        <Error property="Password"/>
                                    </div>
                                </div>

                                <Error property="WrongUserNamePassword"/>
                                

                                <div class="row form-group mt-4">
                                    <div class="col-md-12">
                                        <button class="btn btn-primary" disabled={!isValid} onClick={onSave}>Login</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}