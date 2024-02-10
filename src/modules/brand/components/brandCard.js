import React from "react";
import {NavLink} from 'react-router-dom';

export const BrandCard = (props)=>{
    return (
        <div class="card-service">
            <div class="header">
                <img src={props.BrandImage} alt="" className="brand-image"/>
            </div>
            <div class="body">
                <h5 class="text-secondary">
                    {props.BrandName}
                    {props.isVerified ? <i class="fa fa-check-circle-o text-success pl-2" style={{fontSize:15}}></i> : <i class="fa fa-exclamation-triangle text-warning pl-2" style={{fontSize:15}}></i>}
                </h5>
                <div className="d-flex justify-content-center flex-wrap mb-3">
                    <a href="#" class="badge badge-light p-2 ml-1 mb-1">Promotions ({props.ActivePromotion})</a>
                    <a href="#" class="badge badge-light p-2 ml-1 mb-1 ">Expired Promotions ({props.ExpirePromotion})</a>
                    <a href="#" class="badge badge-light p-2 ml-1 mb-1 ">{props.ContactNo}</a>
                </div>
                <p className="text-justify">{props.Description}</p>
                <NavLink to="/" className="btn btn-primary">View Offers</NavLink>
            </div>
        </div>
    );
}