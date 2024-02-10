import React, { Fragment } from "react";

export const ErrorMessage = (props)=>{
    return (
        <Fragment>
            {props.property in props.errors && <span className="error-message">{props.errors[props.property]}</span>}
        </Fragment>
    )
}

export const WrapErrorMessage = (Component ,errors)=>{
    return function WrapErrorMessage(props){
        return <Component errors={errors} {...props}/>;
    }
}

export const getErrorClass = (key="", errors={})=>{
    return key in errors ? 'is-invalid': '';
}