import React, { useState } from "react";
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { BreadCrumb } from "../../../components/breadcrumb";
import { BrandRegisterModel} from '../../../core/models/brand-register.model';
import authService from '../auth-service';
import fileService from '../../../core/service/fileService';
import { FileUpload } from "../../../components/file-upload";
import { MODULE_TYPE } from "../../../core/enums/ModuleTypeEnum";
import { FILE_USAGE_TYPE } from "../../../core/enums/FIleUsageTypeEnum";
import { CategorySelector } from "../../category/components/categorySelector";
import {useFormValidation} from '../../../core/hooks/useFormValidation';
import {WrapErrorMessage, ErrorMessage, getErrorClass} from '../../../components/error-message';
import { isUndefinedNullOrEmpty } from "../../../core/utils/checking";


const REGISTER_FORM_VALIDATION_SCHEMA = yup.object({
    UserName : yup.string().required('required'),
    Password : yup.string().nullable().min(5, 'password must be at least 5 characters').required('required'),
    BrandName: yup.string().required('required'),
    Email : yup.string().nullable().email('invalid email'),
    ConfirmPassword: yup.string().nullable().required('required').oneOf([yup.ref('Password'), null], 'password must match'),
    VerificationDocument : yup.string().nullable().required("required")
});

export const RegisterPage = ()=>{
    const [brandAccount, setBrandAccount] = useState(new BrandRegisterModel());
    const [brandVerificationFile, setBrandVerificationFile] = useState(null);
    const [isDublicateUserName, setIsDublicateUserName] = useState(false);
    const {isValid, errors, onValidate} = useFormValidation(REGISTER_FORM_VALIDATION_SCHEMA);
    const Error = WrapErrorMessage(ErrorMessage, errors);

    const navigate = useNavigate();

    const onChange = (value = {}) => {
        const constructValues = {...brandAccount, ...value};
        onValidate(constructValues);
        setBrandAccount(constructValues);
        setIsDublicateUserName(false);
    } 

    const onSave = ()=>{
        authService.IsUserNameAlreadyExist(brandAccount.UserName,0).then((isUserNameExist)=>{
            if(!isUserNameExist){
                onValidate(brandAccount).then((isFormValid)=>{
                    if(isFormValid){
                        authService.registerBrand(brandAccount).then((data)=>{
                            if(brandVerificationFile){
                                const fileToInsert = brandVerificationFile;
                                fileToInsert.append('ReferenceID', data.id);
                                fileService.createFile(fileToInsert).then((data)=>{
                                    navigate('/login');
                                });
                            }
                            else{
                                navigate('/login');
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

    const onChangeFile = (file)=>{
        if(file){
            let fileModel = new FormData();
            fileModel.append('ModuleID', MODULE_TYPE.Brand);
            fileModel.append('FileUsageType', FILE_USAGE_TYPE.BrandVerificationDocument);
            fileModel.append('File', file);
            setBrandVerificationFile(fileModel);
        }
        onChange({VerificationDocument: file ? file : null});
    }

    return (
        <div>
            <BreadCrumb childTitle="register" moduleTitle="Create a new brand account"/>

            <div class="page-section">
                <div class="container">
                    <div className="row align-items-center">
                        <div class="col-lg-12">

                            {isDublicateUserName &&
                                <div class="alert alert-danger w-100" role="alert">
                                    This user name is already used.
                                </div>
                            }

                            <div class="contact-form px-lg-5">

                                <div class="row form-group">
                                    <div class="col-md-6 mb-3 mb-md-0">
                                        <label class="text-black" >User Name</label>
                                        <input type="text" class={`form-control ${getErrorClass('UserName',errors)}`} value={brandAccount.UserName} onChange={(e)=> onChange({UserName : e.target.value})}/>
                                        <Error property="UserName"/>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="text-black">Brand Name</label>
                                        <input type="text"  class={`form-control ${getErrorClass('BrandName',errors)}`} value={brandAccount.BrandName} onChange={(e)=> onChange({BrandName : e.target.value})}/>
                                        <Error property="BrandName"/>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <div class="col-md-6">
                                        <label class="text-black" >Email</label>
                                        <input type="email" class={`form-control ${getErrorClass('Email',errors)}`} value={brandAccount.Email} onChange={(e)=> onChange({Email : e.target.value})}/>
                                        <Error property="Email"/>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="text-black" >Category</label>
                                        <CategorySelector CategoryID={brandAccount.DefaultCategoryID} onChange={(e) => onChange({DefaultCategoryID: e.target.value})}/>
                                    </div>
                                </div>
                        
                                <div class="row form-group">
                                    <div class="col-md-12">
                                        <label class="text-black" >Password</label>
                                        <input type="password" class={`form-control ${getErrorClass('Password',errors)}`} value={brandAccount.Password} onChange={(e)=> onChange({Password : e.target.value})}/>
                                        <Error property="Password"/>
                                    </div>
                                </div>
                        
                                <div class="row form-group">                        
                                    <div class="col-md-12">
                                        <label class="text-black">Confirm Password</label>
                                        <input type="password" class={`form-control ${getErrorClass('ConfirmPassword',errors)}`} value={brandAccount.ConfirmPassword} onChange={(e)=> onChange({ConfirmPassword : e.target.value})}/>
                                        <Error property="ConfirmPassword"/>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <div class="col-md-6">
                                        <label class="text-black">Select verification document</label>
                                        <div className="d-flex flex-wrap align-items-center">
                                            <FileUpload accept="application/pdf" onChange={(e)=> onChangeFile(e.target.files[0])}/>
                                            {brandAccount.VerificationDocument && <span className="ml-3 mb-1">{brandAccount.VerificationDocument.name}</span> }
                                        </div>
                                        <Error property="VerificationDocument"/>
                                    </div>
                                </div>
                        
                                <div class="row form-group mt-4">
                                    <div class="col-md-12">
                                        <button class="btn btn-primary" disabled={!isValid} onClick={onSave}>Register</button>
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