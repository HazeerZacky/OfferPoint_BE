import React,{useEffect, useState} from "react";
import * as yup from 'yup';
import { isUndefinedNullOrEmpty } from "../../../core/utils/checking";
import categoryService from '../service';
import { CategorySelector } from "../../category/components/categorySelector";
import { CategoryModel } from "../../../core/models/category.model";
import {useFormValidation} from '../../../core/hooks/useFormValidation';
import {WrapErrorMessage, ErrorMessage, getErrorClass} from '../../../components/error-message';

const CATEGORY_FORM_VALIDATION_SCHEMA = yup.object({
    CategoryName : yup.string().required('required')
});

export const CategoryForm = (props)=>{
    const [category, setCategory] = useState(new CategoryModel());
    const isEdit = !isUndefinedNullOrEmpty(props.selectedId);
    const {isValid, errors, onValidate} = useFormValidation(CATEGORY_FORM_VALIDATION_SCHEMA);
    const Error = WrapErrorMessage(ErrorMessage, errors);
    
    useEffect(()=>{
        isEdit && fetchCategory();
    }, []);

    const onChange = (value = {}) => {
        const constructValues = {...category, ...value};
        onValidate(constructValues);
        setCategory(constructValues);
    } 

    const onSave = ()=>{
        onValidate(category).then((isFormValid)=>{
            if(isFormValid){
                (isEdit ? categoryService.updateCategory : categoryService.createCategory)(category).then((data)=>{
                    props.onClose();
                });
            }
        })
    }

    const fetchCategory = ()=>{
        categoryService.getCategory(props.selectedId).then((data)=>{
            onChange(data);
        })
    }

    return (
            <div className="container">
                <div class="row form-group">
                    <div class="col-md-12">
                        <label class="text-black">Category Name</label>
                        <input type="text" class={`form-control ${getErrorClass('CategoryName',errors)}`} value={category.CategoryName} onChange={(e)=> onChange({CategoryName: e.target.value})}/>
                        <Error property="CategoryName"/>
                    </div>
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