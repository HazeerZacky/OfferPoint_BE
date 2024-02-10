import React,{useEffect, useState} from "react";
import * as yup from 'yup';
import { FileUpload } from "../../../components/file-upload";
import { isUndefinedNullOrEmpty } from "../../../core/utils/checking";
import { DownloadFile, FileAsBase64 } from "../../../core/utils/file";
import { MODULE_TYPE } from "../../../core/enums/ModuleTypeEnum";
import { FILE_USAGE_TYPE } from '../../../core/enums/FIleUsageTypeEnum';
import brandService from '../service';
import fileService from '../../../core/service/fileService';
import {useAuth} from '../../../core/hooks/useAuth';
import { BrandModel } from "../../../core/models/brand.model";
import { resolveFileURL } from "../../../core/utils/url";
import { CategorySelector } from "../../category/components/categorySelector";
import {useFormValidation} from '../../../core/hooks/useFormValidation';
import {WrapErrorMessage, ErrorMessage, getErrorClass} from '../../../components/error-message';

const BRAND_FORM_VALIDATION_SCHEMA = yup.object({
    BrandName : yup.string().required('required')
});

export const BrandForm = (props)=>{
    const [brand, setBrand] = useState(new BrandModel());
    const [brandPictureFile, setBrandPictureFile] = useState(null);
    const [brandPicturePreview, setBrandPicturePreview] = useState();
    const isEdit = !isUndefinedNullOrEmpty(props.selectedId);
    const {user, isLogin, isBrandUser, isAdmin} = useAuth();
    const {isValid, errors, onValidate} = useFormValidation(BRAND_FORM_VALIDATION_SCHEMA);
    const Error = WrapErrorMessage(ErrorMessage, errors);

    useEffect(()=>{
        isEdit && fetchBrand();
    }, []);

    const onChange = (value = {}) => {
        const constructValues = {...brand, ...value};
        onValidate(constructValues);
        setBrand(constructValues);
    } 

    const onChangeFile = (file)=>{
        if(file){
            let fileModel = new FormData();
            fileModel.append('ModuleID', MODULE_TYPE.Brand);
            fileModel.append('FileUsageType', FILE_USAGE_TYPE.BrandProfileImage);
            fileModel.append('File', file);
            setBrandPictureFile(fileModel);

            FileAsBase64(file).then((data)=> {
                setBrandPicturePreview(data);
            });
        }
    }

    const onRemoveSelectedPic = ()=>{
        setBrandPicturePreview(null);
        setBrandPictureFile(null);
    };

    const onSave = ()=>{
        onValidate(brand).then((isFormValid)=>{
            if(isFormValid){
                if(isEdit){
                    brandService.updateBrand(brand).then((data)=>{
                        if(brandPictureFile){
                            const fileToInsert = brandPictureFile;
                            fileToInsert.append('ReferenceID', brand.BrandID);
                            
                            fileService.removeFilesByModuleAndRefAndFileUsage(MODULE_TYPE.Brand, brand.BrandID, FILE_USAGE_TYPE.BrandProfileImage).then(()=>{
                                fileService.createFile(fileToInsert).then((data)=>{
                                    props.onClose();
                                });
                            })
                            
                        }
                        else{
                            props.onClose();
                        }
            
                    });
                }
            }
        })
    }

    const fetchBrand = ()=>{
        brandService.getBrand(props.selectedId).then((data)=>{
            onChange(data);
        })
    }

    return (
            <div className="container">
                <div class="row form-group">
                    <div class="col-md-6">
                        <label class="text-black" >Brand Name</label>
                        <input type="text" class={`form-control ${getErrorClass('BrandName',errors)}`} value={brand.BrandName} onChange={(e)=> onChange({BrandName: e.target.value})}/>
                        <Error property="BrandName"/>
                    </div>
                    <div class="col-md-6">
                        <label class="text-black" >Contact No</label>
                        <input type="text" class={`form-control`} value={brand.ContactNo} onChange={(e)=> onChange({ContactNo: e.target.value})}/>
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-md-12">
                        <label class="text-black">Web Site</label>
                        <input type="text" class={`form-control`} value={brand.Website} onChange={(e)=> onChange({Website: e.target.value})}/>
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-md-12">
                        <label class="text-black">Description</label>
                        <textarea type="text" class={`form-control`} rows={5} value={brand.Description} onChange={(e)=> onChange({Description: e.target.value})}></textarea>
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-md-12">
                        <label class="text-black">Category</label>
                        <CategorySelector CategoryID={brand.DefaultCategoryID} onChange={(e) => onChange({DefaultCategoryID: e.target.value})}/>
                    </div>
                </div>

                {isAdmin() &&
                    <div class="form-group form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1" checked={brand.IsVerified} onChange={(e)=> onChange({IsVerified: +e.target.checked}) }/>
                        <label class="form-check-label" for="exampleCheck1">Is Verified</label>
                    </div>
                }

                {!isUndefinedNullOrEmpty(brand.BrandDocument) &&
                    <div class="form-group">
                        <button onClick={()=> DownloadFile(resolveFileURL(brand.BrandDocument), brand.BrandDocument) } className="btn btn-light">
                            <i class="fa fa-download mr-2" aria-hidden="true"></i> 
                            Download verification document
                        </button>
                    </div>
                }

                <div class="row form-group">
                    <div class="col-md-12">
                        <label class="text-black">Select Brand Picture</label>
                        <FileUpload accept="image/*" onChange={(e)=> onChangeFile(e.target.files[0])}/>
                    </div>
                    {!isUndefinedNullOrEmpty(brandPicturePreview) &&
                        <div className="col-md-12">
                            <div>
                                <img className="w-100 h-auto mt-4" src={brandPicturePreview}/>
                            </div>
                            <button className="btn btn-danger mt-2" onClick={()=> onRemoveSelectedPic()}> <i class="fa fa-times" aria-hidden="true"></i> </button>
                        </div>
                    }
                </div>

                <div class="row form-group mt-4">
                    <div class="col-md-12 d-flex justify-content-end">
                        <button class="btn btn-secondary mr-2" onClick={props.onClose}>Cancel</button>
                        <button class="btn btn-primary" disabled={!isValid} onClick={onSave}>Save</button>
                    </div>
                </div>
            </div>
    );
}