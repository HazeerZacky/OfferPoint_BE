import React, { useEffect, useState } from "react";
import { BreadCrumb } from "../../../components/breadcrumb";
import { Link, useParams, useNavigate } from "react-router-dom";
import offerService from '../service';
import {OfferFilterModel} from '../../../core/models/offer-filter-model';
import { resolveImageURL } from "../../../core/utils/url";
import moment from "moment";
import { isURL, isUndefinedNullOrEmpty } from "../../../core/utils/checking";

export const OfferViewPage = (props)=>{
    const {id} = useParams();
    const [offer, setOffer] = useState(null);
    const [relatedOffer, setRelatedOffer] = useState([]);
    const navigate = useNavigate();
  
    useEffect(()=>{
        fetchOffer();
        offerService.updateOfferViews(atob(id));
    }, []);

    const fetchOffer = ()=>{
        offerService.getAllFiltered({...new OfferFilterModel(), OfferID: atob(id)}).then((data)=>{
            const offerData = data.Items[0];
            setOffer(offerData);
            fetchRelatedOffer(offerData.BrandID);
        })
    }

    const fetchRelatedOffer = (BrandID)=>{
        offerService.getAllFiltered({...new OfferFilterModel(), BrandID}).then((data)=>{
            const relatedItem = data.Items.filter((v)=> v.OfferID != atob(id)).slice(0, 3);
            setRelatedOffer(relatedItem);
        })
    }

    const renderOfferCard = (v, i)=>{

        return (
            <div class="col-lg-4 py-3" key={i}>
                <div class="card-blog position-relative">
                    <div class="header">
                        <div class="post-thumb">
                            <img src={resolveImageURL(v.FileName)} className="w-100 h-100" alt=""/>
                        </div>
                    </div>
                    <div class="body">
                        <h5 class="post-title">
                            <a href={`/offers/${btoa(v.OfferID)}`}>{v.Title}</a>
                        </h5>
                        <div>
                            <button onClick={()=> navigate('/brands', {state: {SearchText : v.BrandName}})} className="badge badge-light p-1 border mb-2">{v.BrandName}</button>
                        </div>
                        <div class="post-date d-flex justify-content-between flex-wrap">
                            <span>{moment(v.CreatedOn).fromNow()}</span>
                            <span>
                                <i class="fa fa-eye mr-1" aria-hidden="true"></i>
                                {v.ViewsCount}
                            </span>
                        </div>

                        <div class="d-flex flex-wrap offer-status">
                            {moment(v.EndDate).isSameOrAfter(moment(), 'day') ? <span className="text-success">active</span> : <span className="text-danger">expired</span>}
                        </div>

                    </div>
                </div>
            </div>
        )
    } 

    return (
        <div>
            {!isUndefinedNullOrEmpty(offer) &&
                <div class="page-section pt-2 offer-view-page">
                    <div class="container">
                        <div className="row">
                            <div className="col-lg-12 d-flex flex-wrap mt-5">
                                <div className="row m-0 w-100 border p-3">
                                    <div className="col-md-4">
                                        <div class="post-thumb">
                                            <img src={resolveImageURL(offer.FileName)} className="max-height-100 max-width-100" alt=""/>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="p-3">
                                            <div className="mb-2"><span className="offer-title">{offer.Title}</span></div>
                                            <p className="text-justify mb-4">
                                                {offer.Description}
                                            </p>

                                            <div className="d-flex flex-wrap" style={{fontSize:'1.3rem'}}>
                                                <span class="badge badge-light p-2 border mb-2 mr-3 text-secondary"> 
                                                    <i class="fa fa-calendar mr-2 text-warning" aria-hidden="true"></i>
                                                    START :- {moment(offer.StartDate).format('ll')}
                                                </span>
                                                <span class="badge badge-light p-2 border mb-2 mr-3 text-secondary">
                                                    <i class="fa fa-calendar mr-2 text-warning" aria-hidden="true"></i>
                                                    END :- {moment(offer.EndDate).format('ll')}
                                                </span>
                                            </div>

                                            <div className="d-flex flex-wrap mb-2" style={{fontSize:'1.3rem'}}>
                                                <span class="badge badge-light p-2 border mb-2 mr-3 text-white bg-success d-flex flex-wrap w-auto text-wrap mt-2">
                                                    <i class="fa fa-bullhorn text-white m-2" aria-hidden="true"></i>
                                                    <span className="m-2">CLAIM OFFER :-</span> 
                                                    {isURL(offer.PromoCode) ? <a href={offer.PromoCode} target="_blank" className="text-white m-2">{offer.PromoCode}</a> : <span className="m-2">{offer.PromoCode}</span> }
                                                </span>
                                            </div>

                                            <div className="d-flex flex-wrap mb-3" style={{fontSize:'1.3rem'}}>
                                                <span className="badge badge-light p-2 border mb-2 mr-3 text-secondary">
                                                    <i class="fa fa-building mr-2 text-danger" aria-hidden="true"></i>
                                                    {offer.BrandName}
                                                </span>
                                                <span className="badge badge-light p-2 border mb-2 mr-3 text-secondary">
                                                    <i class="fa fa-tag  mr-2 text-primary" aria-hidden="true"></i>
                                                    {offer.CategoryName}
                                                </span>
                                            </div>

                                            <div className="d-flex flex-wrap">
                                                {(offer.Tags ? offer.Tags.split(',') : []).map((v,i)=>{
                                                    return (
                                                        <Link key={i} to={`/offers?tag=${v}`} className="mr-2">#{v}</Link>
                                                    )
                                                })}
                                            </div>

                                            <div className="d-flex justify-content-between">
                                                <span className="text-dark">
                                                    posted on : {moment(offer.CreatedOn).format('ll')}
                                                </span>

                                                <span className="text-dark">
                                                    <i class="fa fa-eye mr-2" aria-hidden="true"></i>
                                                    {offer.ViewsCount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row p-0 m-0 w-100 mt-4">
                           {relatedOffer.map(renderOfferCard)}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}