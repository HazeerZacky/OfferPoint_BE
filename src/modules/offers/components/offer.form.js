import React,{useEffect, useState} from "react";
import * as yup from 'yup';
import DatePicker from "react-datepicker";
import { FileUpload } from "../../../components/file-upload";
import { OfferModel } from "../../../core/models/offer.model";
import { isUndefinedNullOrEmpty } from "../../../core/utils/checking";
import { FileAsBase64 } from "../../../core/utils/file";
import { MODULE_TYPE } from "../../../core/enums/ModuleTypeEnum";
import { FILE_USAGE_TYPE } from '../../../core/enums/FIleUsageTypeEnum';
import offerService from '../service';
import fileService from '../../../core/service/fileService';
import { CategorySelector } from "../../category/components/categorySelector";
import authService from '../../auth/auth-service';
import {useAuth} from '../../../core/hooks/useAuth';
import brandService from '../../brand/service';
import {useFormValidation} from '../../../core/hooks/useFormValidation';
import {WrapErrorMessage, ErrorMessage, getErrorClass} from '../../../components/error-message';

const OFFER_FORM_VALIDATION_SCHEMA = yup.object({
    Title : yup.string().required('required'),
    StartDate : yup.string().required('required'),
    EndDate: yup.string().required('required'),
    CategoryID : yup.number().min(1, 'required').required('required')
});

export const OfferForm = (props)=>{
    const [offer, setOffer] = useState(new OfferModel());
    const [offerPictureFile, setOfferPictureFile] = useState(null);
    const [offerPicturePreview, setOfferPicturePreview] = useState();
    const isEdit = !isUndefinedNullOrEmpty(props.selectedId);
    const {user, isLogin, isBrandUser} = useAuth();
    const {isValid, errors, onValidate} = useFormValidation(OFFER_FORM_VALIDATION_SCHEMA);
    const Error = WrapErrorMessage(ErrorMessage, errors);
    const BrandID = isLogin && isBrandUser() ? user.BrandID : 0;
    
    useEffect(()=>{
        isEdit ? fetchOffer() : setDefaultBrandCategory() ;
    }, []);

    const onChange = (value = {}) => {
        const constructValues = {...offer, ...value};
        onValidate(constructValues);
        setOffer(constructValues);
    } 

    const onChangeFile = (file)=>{
        if(file){
            let fileModel = new FormData();
            fileModel.append('ModuleID', MODULE_TYPE.Offer);
            fileModel.append('FileUsageType', FILE_USAGE_TYPE.OfferPostImage);
            fileModel.append('File', file);
            setOfferPictureFile(fileModel);

            FileAsBase64(file).then((data)=> {
                setOfferPicturePreview(data);
            });
        }
    }

    const onRemoveSelectedPic = ()=>{
        setOfferPicturePreview(null);
        setOfferPictureFile(null);
    };

    const setDefaultBrandCategory = ()=>{
        brandService.getBrand(BrandID).then((data)=>{
            if(!isUndefinedNullOrEmpty(data)){
                onChange({CategoryID : data.DefaultCategoryID});
            }
        });
    }

    const onSave = ()=>{
        onValidate(offer).then((isFormValid)=>{
            if(isFormValid){
                (isEdit ? offerService.updateOffer(offer) : offerService.createOffer({...offer, BrandID})).then((data)=>{

                    if(offerPictureFile){
                        const fileToInsert = offerPictureFile;
                        fileToInsert.append('ReferenceID', isEdit ? offer.OfferID : data.id);

                        (isEdit ? fileService.removeFilesByModuleAndRefAndFileUsage(MODULE_TYPE.Offer, offer.OfferID, FILE_USAGE_TYPE.OfferPostImage) : Promise.resolve()).then(()=>{
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
        })
        
    }

    const fetchOffer = ()=>{
        offerService.getOffer(props.selectedId).then((data)=>{
            data.StartDate = new Date(data.StartDate);
            data.EndDate = new Date(data.EndDate);
            onChange(data);
        })
    }

    return (
            <div className="container">
                <div class="row form-group">
                    <div class="col-md-6">
                        <label class="text-black" >Title</label>
                        <input type="text" class={`form-control ${getErrorClass('Title',errors)}`} value={offer.Title} onChange={(e)=> onChange({Title: e.target.value})}/>
                        <Error property="Title"/>
                    </div>
                    <div class="col-md-6">
                        <label class="text-black" >PromoCode</label>
                        <input type="text" class="form-control" value={offer.PromoCode} onChange={(e)=> onChange({PromoCode: e.target.value})}/>
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-md-6 d-flex flex-column">
                        <label class="text-black" >Start Date</label>
                        <DatePicker selected={offer.StartDate} className="form-control" onChange={(date) => onChange({StartDate: date})}/>
                        <Error property="StartDate"/>
                    </div>
                    <div class="col-md-6 d-flex flex-column">
                        <label class="text-black" >Expired Date</label>
                        <DatePicker selected={offer.EndDate} className="form-control" onChange={(date) => onChange({EndDate: date})}/>
                        <Error property="EndDate"/>
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-md-6">
                        <label class="text-black" >Category</label>
                        <CategorySelector CategoryID={offer.CategoryID} onChange={(e) => onChange({CategoryID: e.target.value})} className={`${getErrorClass('CategoryID',errors)}`}/>
                        <Error property="CategoryID"/>
                    </div>
                    <div class="col-md-6">
                        <label class="text-black" >Tags Eg - (newyear, ramazan)</label>
                        <input type="text" class="form-control" value={offer.Tags} onChange={(e)=> onChange({Tags: e.target.value})}/>
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-md-12">
                        <label class="text-black">Description</label>
                        <textarea type="text" class="form-control" rows={5} value={offer.Description} onChange={(e)=> onChange({Description: e.target.value})}></textarea>
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-md-12">
                        <label class="text-black">Select Offer Picture</label>
                        <FileUpload accept="image/*" onChange={(e)=> onChangeFile(e.target.files[0])}/>
                    </div>
                    {!isUndefinedNullOrEmpty(offerPicturePreview) &&
                        <div className="col-md-12">
                            <div>
                                <img className="w-100 h-auto mt-4" src={offerPicturePreview}/>
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