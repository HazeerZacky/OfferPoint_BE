import React, { useEffect, useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { BreadCrumb } from "../../../components/breadcrumb";
import { Link, useParams,useNavigate } from "react-router-dom";
import { isURL, isUndefinedNullOrEmpty } from "../../../core/utils/checking";
import brandService from '../service';
import { BrandFilterModel } from "../../../core/models/brand-filter-model";
import { resolveImageURL } from "../../../core/utils/url";
import defaultImage from '../../../assets/images/defaultImage.jpg';
import { OfferFilterModel } from "../../../core/models/offer-filter-model";
import offerService from '../../offers/service';
import { PopUp } from "../../../components/popup";
import { OfferForm } from "../../offers/components/offer.form";
import {useAuth} from '../../../core/hooks/useAuth';

import moment from "moment";
import { BrandForm } from "../components/brand.form";

const TAB_KEY = Object.freeze({
    INFO: 1,
    OFFERS: 2
});


export const BrandViewPage = (props)=>{
    const {id} = useParams();
    const [key, setKey] = useState(TAB_KEY.INFO);
    const [brand, setBrand] = useState(null);
    const BrandID = +atob(id);
    const [isVerifiedBrand, setIsVerifiedBrand] = useState(false);
    const {isBrandUser} = useAuth();

    const onChangeKey = (k)=>{
        setKey(k)
    }

    useEffect(()=>{
        if(BrandID) {
            fetchBrand();
            if(isBrandUser()){
                brandService.IsVerifiedBrand(BrandID).then((v)=> setIsVerifiedBrand(v));
            }
        }
        
    }, []);

    const fetchBrand = ()=>{
        brandService.getAllFiltered({...new BrandFilterModel(), BrandID: BrandID}).then((data)=>{
            setBrand(data.Items[0]);
        })
    };

    return (
        <div>
            <BreadCrumb childTitle="brand view" moduleTitle={!isUndefinedNullOrEmpty(brand) ? brand.BrandName : ''} parentTitle="brands" parentPath="/brands"/>
                <div class="page-section pt-2">
                    <div class="container">
                        <div className="row">
                            <div className="col-md-12">
                                <Tabs activeKey={key} transition={false} onSelect={onChangeKey}>
                                    <Tab eventKey={TAB_KEY.INFO} title="Info" className="p-3">
                                        {key == TAB_KEY.INFO && <BrandInfo brand={brand} fetchBrand={fetchBrand} />}
                                    </Tab>
                                    <Tab eventKey={TAB_KEY.OFFERS} title="Offers" className="p-3">
                                        {key == TAB_KEY.OFFERS && <OfferListing BrandID={BrandID} brand={brand} fetchBrand={fetchBrand} isVerifiedBrand={isVerifiedBrand}/>}
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>            
        </div>
    );
}

const BrandInfo = (props)=>{
    const brand = props.brand;
    const [showPopup, setShowPopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const {user, isLogin, isBrandUser, isBrandRootAdmin, isAdmin} = useAuth();
    const BrandID = isLogin && isBrandUser() ? user.BrandID : 0;

    const closePopUp = ()=>{
        setShowPopup(false);
        props.fetchBrand();
    }

    const openPopUp = (id)=>{
        setShowPopup(true);
        setSelectedId(id);
    }

    return(
        <div>
            {!isUndefinedNullOrEmpty(brand) &&
                <>
                    <div className="w-100 d-flex align-items-center flex-column p-3">
                        <img src={brand.FileName ? resolveImageURL(brand.FileName) : defaultImage} height="150" width="150" className="border p-2"/>
                        {isLogin && ((isBrandRootAdmin() ? brand.BrandID == user.BrandID : false) || isAdmin()) && 
                            <button className="btn btn-warning mt-3" onClick={()=> openPopUp(brand.BrandID)}>
                                <i class="fa fa-pencil" aria-hidden="true"></i>
                            </button>
                        }
                    </div>
                    <p className="brand-descrition-view">{brand.Description.replace(/\n/g, '')}</p>
                    <div className="p-3 d-flex flex-wrap">
                        {brand.ContactNo &&
                            <div className="mr-3">
                                <i class="fa fa-phone mr-2" aria-hidden="true"></i>
                                <span>{brand.ContactNo}</span>
                            </div>
                        }

                        <div className="mr-3">
                            {brand.IsVerified ? <i class="fa fa-check-circle-o text-success mr-2"></i> : <i class="fa fa-exclamation-triangle text-warning mr-2" style={{fontSize:15}}></i>}
                            <span>{brand.IsVerified ? 'Verified' : 'Unverified'} brand</span>
                        </div>
                        {brand.CategoryName &&
                            <div className="mr-3">
                                <i class="fa fa-tag mr-2 text-primary"></i>
                                <span>{brand.CategoryName}</span>
                            </div>
                        }

                        {brand.Website &&
                            <div className="mr-3">
                                <i class="fa fa-globe mr-2 text-accent"></i>
                                {isURL(brand.Website) ? <a href={brand.Website} target="_blank">{brand.Website}</a> : <span>{brand.Website}</span> }
                            </div>
                        }

                    </div>
                </>
            }

            <PopUp show={showPopup} onClose={closePopUp} title={selectedId ? "Edit Brand" : "Add Brand"}>
                <BrandForm onClose={()=> closePopUp()} selectedId={selectedId}/>
            </PopUp>

        </div>
    ); 
}

const OfferListing = (props)=>{
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState({...new OfferFilterModel(), BrandID: props.BrandID});
    const [showPopup, setShowPopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const {user, isLogin, isBrandUser, isBrandAdmin, isBrandRootAdmin, isAdmin} = useAuth();
    const BrandID = isLogin && isBrandUser() ? user.BrandID : 0;
    const [isVerifiedBrand, setIsVerifiedBrand] = useState(false);
    const navigate = useNavigate();
    const brand = props.brand;
    
    useEffect(()=>{
        fetchOffers();
        if(isBrandUser()){
            brandService.IsVerifiedBrand(user.BrandID).then((v)=> setIsVerifiedBrand(v));
        }
    },[]);

    const fetchOffers = ()=>{
        offerService.getAllFiltered(query).then((data)=>{
            setItems(data.Items);
        })
    }

    const closePopUp = ()=>{
        setShowPopup(false);
        fetchOffers();
        props.fetchBrand();
    }

    const openPopUp = (id)=>{
        setShowPopup(true);
        setSelectedId(id);
    }

    const onRemoveOffer = (id)=>{
        offerService.removeOffer(id).then(()=>{
            fetchOffers();
            props.fetchBrand();
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
                            <Link to={`/${btoa(v.OfferID)}`}>{v.Title}</Link>
                        </h5>
                        <div>
                            <button className="badge badge-light p-1 border mb-2">{v.BrandName}</button>
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

                        <div className="d-flex flex-wrap mt-2">
                            {isLogin &&
                            <>  
                                {(isBrandUser() ? user.BrandID == v.BrandID && isVerifiedBrand : false) &&
                                    <button className="btn btn-warning mr-2" onClick={()=> openPopUp(v.OfferID)}>
                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                    </button>
                                }
                                
                                {( (isBrandAdmin() || isBrandRootAdmin() ? user.BrandID == v.BrandID && isVerifiedBrand : false) || isAdmin() )&&
                                    <button className="btn btn-danger" onClick={()=> onRemoveOffer(v.OfferID)}>
                                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                                    </button>
                                }
                            </>
                            }
                        </div>

                    </div>
                </div>
            </div>
        )
    } 

    return(
        <div>
            <div className="container">
                <div className="row">
                    {!isUndefinedNullOrEmpty(brand) &&
                        <>
                            <div className="col-lg-8">
                                <div className="d-flex flex-wrap mb-3">
                                    <span class="badge badge-light p-2 ml-1 mb-1">Promotions ({brand.ActivePromotion})</span>
                                    <span class="badge badge-light p-2 ml-1 mb-1 ">Expired Promotions ({brand.ExpirePromotion})</span>
                                </div>
                            </div>
                            
                            {isLogin && isBrandUser() && props.isVerifiedBrand &&
                                <div className="col-lg-4">
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-primary" onClick={()=> openPopUp(null)}>ADD NEW OFFER</button>
                                    </div>
                                </div>
                            }

                            {!props.isVerifiedBrand && isLogin && !isAdmin() &&
                                <div className="alert alert-warning col-lg-12" role="alert">
                                    Your brand is currenty unverified so you can't add, edit and remove offers,
                                    contact admin | enquiry@offerpoint.com
                                </div>
                            }
                        </>
                    }
                    {items.map(renderOfferCard)}
                </div>
            </div>
            <PopUp show={showPopup} onClose={closePopUp} title={selectedId ? "Edit Offer" : "Add Offer"}>
                <OfferForm onClose={()=> closePopUp()} selectedId={selectedId}/>
            </PopUp>
        </div>
    ); 
}