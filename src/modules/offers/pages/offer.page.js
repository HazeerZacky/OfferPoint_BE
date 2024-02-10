import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BreadCrumb } from "../../../components/breadcrumb";
import { PopUp } from "../../../components/popup";
import { OfferForm } from "../components/offer.form";
import {resolveImageURL} from '../../../core/utils/url';
import offerService from '../service';
import brandService from '../../brand/service';
import { CategorySelector } from "../../category/components/categorySelector";
import {useAuth} from '../../../core/hooks/useAuth';
import {OfferFilterModel} from '../../../core/models/offer-filter-model';
import { isUndefinedNullOrEmpty } from "../../../core/utils/checking";
import Carousel from 'react-bootstrap/Carousel';
import fileService from '../../../core/service/fileService';
import { FILE_USAGE_TYPE } from "../../../core/enums/FIleUsageTypeEnum";
import defaultBannerImage from '../../../assets/images/banner-default.jpg';
import { MODULE_TYPE } from "../../../core/enums/ModuleTypeEnum";
import defaultCarouselImage from '../../../assets/images/company-carousel-default.png';
import { PaginationModel } from "../../../core/models/pagination";
import { Pagination } from "../../../components/pagination";

export const OfferPage = (props)=>{
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const tagFromQuery = searchParams.get('tag');
    const [showPopup, setShowPopup] = useState(false);
    const [items, setItems] = useState([]);
    const [mostRecentItems, setMostRecentItems] = useState([]);
    const [mostPopularItems, setMostPopularItems] = useState([]);
    const [query, setQuery] = useState({...new OfferFilterModel(), BrandID: !isUndefinedNullOrEmpty(location.state) ? location.state.BrandID : 0, SearchText : tagFromQuery ? tagFromQuery : "", Pagination: new PaginationModel() });
    const [selectedId, setSelectedId] = useState(null);
    const {user, isLogin, isBrandUser, isBrandAdmin, isBrandRootAdmin, isAdmin} = useAuth();
    const BrandID = isLogin && isBrandUser() ? user.BrandID : 0;
    const navigate = useNavigate();
    const [L1Ad, setL1Ad] = useState(null);
    const [L2Ad, setL2Ad] = useState(null);
    const [sliderImage, setSliderImage] = useState({[FILE_USAGE_TYPE.CS1]: null, [FILE_USAGE_TYPE.CS2]: null, [FILE_USAGE_TYPE.CS3]: null});
    const [isVerifiedBrand, setIsVerifiedBrand] = useState(false);

    useEffect(()=>{
        fetchOffers();
        fetchMostRecent();
        fetchMostPopular();
        fetchAds(FILE_USAGE_TYPE.L1Ads);
        fetchAds(FILE_USAGE_TYPE.L2Ads);
        fetchAllSliders();
        if(isBrandUser()){
            brandService.IsVerifiedBrand(user.BrandID).then((v)=> setIsVerifiedBrand(v));
        }
    },[]);

    const fetchOffers = (v = {})=>{
        offerService.getAllFiltered({...query, ...v}).then((data)=>{
            setItems(data.Items);
            onChangePagination({TotalRecord: data.TotalRecord, PageNumber: data.PageNumber});
        })
    }

    const fetchMostRecent = ()=>{
        offerService.getMostRecentOffers().then((data)=>{
            setMostRecentItems(data);
        })
    }

    const fetchMostPopular = ()=>{
        offerService.getMostPopularOffers().then((data)=>{
            setMostPopularItems(data);
        })
    }

    const closePopUp = ()=>{
        setShowPopup(false);
        fetchOffers();
        fetchMostRecent();
        fetchMostPopular();
    }

    const openPopUp = (id)=>{
        setShowPopup(true);
        setSelectedId(id);
    }

    const onRemoveOffer = (id)=>{
        offerService.removeOffer(id).then(()=>{
            fetchOffers();
            fetchMostRecent();
            fetchMostPopular();
        })
    }

    const onChangeQuery = (value)=>{
        const constructValues = {...query, ...value};
        setQuery(constructValues);
    }

    const fetchAds = (FileUsageType)=>{
        fileService.getFilesByModuleAndRefAndFileUsage(MODULE_TYPE.ADVERTISEMENT, 0, FileUsageType).then((data)=>{
            if(FileUsageType == FILE_USAGE_TYPE.L1Ads){
                setL1Ad(data[0]);
            }
            else if(FileUsageType == FILE_USAGE_TYPE.CS1 || FileUsageType == FILE_USAGE_TYPE.CS2 || FileUsageType == FILE_USAGE_TYPE.CS3){
                const constructValues = sliderImage;
                constructValues[FileUsageType] = data[0];
                setSliderImage(constructValues);
            }
            else{
                setL2Ad(data[0]);
            }
        })
    };

    const fetchAllSliders = ()=>{
        fetchAds(FILE_USAGE_TYPE.CS1);
        fetchAds(FILE_USAGE_TYPE.CS2);
        fetchAds(FILE_USAGE_TYPE.CS3);
    } 

    const onChangePagination = (value)=>{
        onChangeQuery({Pagination: {...query.Pagination, ...value}});
    }

    const handlePageClick = (page) => {
        fetchOffers({...query, Pagination: {...query.Pagination, PageNumber: page.PageNumber} });
        onChangePagination({PageNumber: page.PageNumber});
    };

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
                            <Link to={`/offers/${btoa(v.OfferID)}`}>{v.Title}</Link>
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

    return (
        <div>
            
            <div className="container-fluid p-2 min-vh-100">
                <div className="row m-0">
                    <div className="col-md-12 p-5">
                        <div className="container">
                            <div class="row">

                                <div className="col-md-12 mb-3">
                                    <h3 className="mb-3">All offers</h3>
                                    <div className="mb-5 d-flex">
                                        <div class="input-group">
                                            <input type="text" class="form-control rounded-0" value={query.SearchText} placeholder="Search..." onChange={(e)=> onChangeQuery({SearchText: e.target.value})}/>
                                        </div>
                                        <div class="ml-3">
                                            <button class="btn btn-secondary p-0 d-flex justify-content-center align-items-center h-100 border" style={{width: 100}} onClick={()=> fetchOffers()}>Search</button>
                                        </div>
                                        <div class="ml-3">
                                            <button class="btn btn-danger p-0 d-flex justify-content-center align-items-center h-100 border" style={{width: 100}} onClick={()=>{fetchOffers(new OfferFilterModel()); onChangeQuery(new OfferFilterModel());}}>Clear</button>
                                        </div>
                                        {isLogin && isBrandUser() && isVerifiedBrand &&
                                            <div class="ml-3">
                                                <button class="btn btn-primary p-0 d-flex justify-content-center align-items-center h-100 border" style={{width: 100}} onClick={()=> openPopUp(null)}>Add New</button>
                                            </div>
                                        }
                                    </div>
                                    {!isVerifiedBrand && isLogin && !isAdmin() &&
                                        <div className="alert alert-warning" role="alert">
                                            Your brand is currenty unverified so you can't add, edit and remove offers,
                                            contact admin | enquiry@offerpoint.com
                                        </div>
                                    }

                                    <div className="row p-0 m-0 w-100 mt-4">
                                        {items.map(renderOfferCard)}
                                    </div>
                                    <Pagination paging={query.Pagination} handlePageClick={handlePageClick}/>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PopUp show={showPopup} onClose={closePopUp} title={selectedId ? "Edit Offer" : "Add Offer"} className="mt-5">
                <OfferForm onClose={()=> closePopUp()} selectedId={selectedId}/>
            </PopUp>
        </div>
    );
}