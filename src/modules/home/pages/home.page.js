import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BreadCrumb } from "../../../components/breadcrumb";
import { PopUp } from "../../../components/popup";
import {resolveImageURL} from '../../../core/utils/url';
import offerService from '../../offers/service';
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

export const HomePage = ()=>{
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
    },[]);

    const fetchOffers = (v = {})=>{
        offerService.getAllFiltered({...query, ...v}).then((data)=>{
            setItems(data.Items);
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
                    </div>
                </div>
            </div>
        )
    } 

    return (
    <div>
            <header>
                <div class="container">
                    <div className="row">
                            <div className="col-md-12 mt-3">
                                <Carousel className="border" variant="dark">
                                    <Carousel.Item>
                                        <div className="ads-carousel-image">
                                            <img src={!isUndefinedNullOrEmpty(sliderImage[FILE_USAGE_TYPE.CS1]) ? resolveImageURL(sliderImage[FILE_USAGE_TYPE.CS1].Name) : defaultCarouselImage } className="w-100 h-100"/>
                                        </div>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <div className="ads-carousel-image">
                                            <img src={!isUndefinedNullOrEmpty(sliderImage[FILE_USAGE_TYPE.CS2]) ? resolveImageURL(sliderImage[FILE_USAGE_TYPE.CS2].Name) : defaultCarouselImage } className="w-100 h-100"/>
                                        </div>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <div className="ads-carousel-image">
                                            <img src={!isUndefinedNullOrEmpty(sliderImage[FILE_USAGE_TYPE.CS3]) ? resolveImageURL(sliderImage[FILE_USAGE_TYPE.CS3].Name) : defaultCarouselImage } className="w-100 h-100"/>
                                        </div>
                                    </Carousel.Item>
                                </Carousel>
                            </div>
                    </div>
                </div>
            </header>

            <div className="container-fluid p-2">
                <div className="row m-0">
                    <div className="col-md-12 p-5">
                        <div className="container">
                            <div class="row">
                                <div className="col-md-12 mb-3">
                                    <h3>Most recent offers</h3>
                                    <div className="row p-0 m-0 w-100 mt-4">
                                        {mostRecentItems.map(renderOfferCard)}
                                    </div>
                                </div>

                                <div className="col-md-12 mb-5">
                                    <div className="horizontal-ads-box border">
                                        <img src={!isUndefinedNullOrEmpty(L1Ad) ? resolveImageURL(L1Ad.Name) : defaultBannerImage } className="w-100 h-100"/>
                                    </div>
                                </div>

                                <div className="col-md-12 mb-3">
                                    <h3>Most popular offers</h3>
                                    <div className="row p-0 m-0 w-100 mt-4">
                                        {mostPopularItems.map(renderOfferCard)}
                                    </div>
                                </div>

                                <div className="col-md-12 mb-5">
                                    <div className="horizontal-ads-box border">
                                        <img src={!isUndefinedNullOrEmpty(L2Ad) ? resolveImageURL(L2Ad.Name) : defaultBannerImage } className="w-100 h-100"/>
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