import React, { useEffect, useState } from "react";
import { BreadCrumb } from "../../../components/breadcrumb";
import moment from "moment";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PopUp } from "../../../components/popup";
import {resolveImageURL} from '../../../core/utils/url';
import brandService from '../service';
import {useAuth} from '../../../core/hooks/useAuth';
import {BrandFilterModel} from '../../../core/models/brand-filter-model';
import defaultImage from '../../../assets/images/defaultImage.jpg';
import { isUndefinedNullOrEmpty } from "../../../core/utils/checking";
import { BrandForm } from "../components/brand.form";
import { PaginationModel } from "../../../core/models/pagination";
import { Pagination } from "../../../components/pagination";

export const BrandPage = ()=>{
    const location = useLocation();
    const [showPopup, setShowPopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState({...new BrandFilterModel(), SearchText: !isUndefinedNullOrEmpty(location.state) ? location.state.SearchText : "", Pagination: new PaginationModel()});
    const navigate = useNavigate();
    const {user, isLogin, isBrandUser, isBrandRootAdmin, isAdmin} = useAuth();
    const BrandID = isLogin && isBrandUser() ? user.BrandID : 0;

    useEffect(()=>{
        fetchBrands();
    },[]);

    const fetchBrands = (v = {})=>{
        brandService.getAllFiltered({...query, ...v}).then((data)=>{
            setItems(data.Items);
            onChangePagination({TotalRecord: data.TotalRecord, PageNumber: data.PageNumber});
        })
    }

    const onChangeQuery = (value)=>{
        const constructValues = {...query, ...value};
        setQuery(constructValues);
    }

    const closePopUp = ()=>{
        setShowPopup(false);
        fetchBrands();
    }

    const openPopUp = (id)=>{
        setShowPopup(true);
        setSelectedId(id);
    }

    const onChangePagination = (value)=>{
        onChangeQuery({Pagination: {...query.Pagination, ...value}});
    }

    const handlePageClick = (page) => {
        fetchBrands({...query, Pagination: {...query.Pagination, PageNumber: page.PageNumber} });
        onChangePagination({PageNumber: page.PageNumber});
    };


    const renderBrandCard = (v, i)=>{
        return (
            <div class="col-lg-4" key={i}>
                <div class="card-service m-0 border mb-4">
                    <div class="header">
                        <img src={ v.FileName ? resolveImageURL(v.FileName) : defaultImage} alt="" className="brand-image"/>
                    </div>
                    <div class="body">
                        <h5 class="text-secondary">
                            <Link to={`/brands/${btoa(v.BrandID)}`} className="text-dark">{v.BrandName}</Link>
                            {v.IsVerified ? <i class="fa fa-check-circle-o text-success pl-2" style={{fontSize:15}}></i> : <i class="fa fa-exclamation-triangle text-warning pl-2" style={{fontSize:15}}></i>}
                        </h5>
                        <div className="d-flex flex-wrap mb-3">
                            <span class="badge badge-light p-2 ml-1 mb-1">Promotions ({v.ActivePromotion})</span>
                            <span class="badge badge-light p-2 ml-1 mb-1 ">Expired Promotions ({v.ExpirePromotion})</span>
                        </div>
                        <p className="brand-description">{v.Description}</p>
                        
                        <div className="d-flex flex-wrap mt-2 justify-content-center">
                            {isLogin && ((isBrandRootAdmin() ? v.BrandID == user.BrandID : false) || isAdmin()) &&
                                <>  
                                    <button className="btn btn-warning mr-2" onClick={()=> openPopUp(v.BrandID)}>
                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                    </button>
                                </>
                            }
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <BreadCrumb childTitle="brand" moduleTitle="Our Brands"/>
            <div class="page-section pt-4">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 d-flex ">
                            <div class="input-group">
                                <input type="text" class="form-control rounded-0" value={query.SearchText} placeholder="Search..." onChange={(e)=> onChangeQuery({SearchText: e.target.value})}/>
                            </div>
                            <div class="ml-3">
                                <button class="btn btn-secondary p-0 d-flex justify-content-center align-items-center h-100 border" style={{width: 100}} onClick={()=> fetchBrands()}>Search</button>
                            </div>
                        </div>
                        <div class="d-flex justify-content-center w-100 pl-3 mb-5">
                            
                        </div>
                        {items.map(renderBrandCard)}
                        <Pagination paging={query.Pagination} handlePageClick={handlePageClick}/>
                    </div>
                </div>
            </div>

            <PopUp show={showPopup} onClose={closePopUp} title={selectedId ? "Edit Brand" : "Add Brand"}>
                <BrandForm onClose={()=> closePopUp()} selectedId={selectedId}/>
            </PopUp>
        </div>
    );
}