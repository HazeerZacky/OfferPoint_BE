import { useState } from 'react';
import * as yup from 'yup';
import { isUndefinedNullOrEmpty } from '../utils/checking';

export const useFormValidation = (schema)=>{
    const [errors, setErrors] = useState({});

    const onValidate = (values={})=>{
        return schema.validate(values, {abortEarly: false})
            .then(()=> {
                setErrors({});
                return true;
            })
            .catch(({inner}) => {
                setErrors(constructErrorValues(inner)); 
            })
    }

    const isValid = isUndefinedNullOrEmpty(errors);
    
    return {isValid, onValidate, errors, setErrors};
}

const constructErrorValues = (errors = [])=>{
    return errors.reduce((acc, v)=>{
        acc[v.path] = v.message;
        return acc;
    }, {});
}