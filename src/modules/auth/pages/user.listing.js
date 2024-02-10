import React, { useEffect, useState } from "react";
import authService from '../auth-service';
import brandService from '../../brand/service';
import offerService from '../../offers/service';
import { isUndefinedNullOrEmpty } from "../../../core/utils/checking";
import { USER_TYPE } from '../../../core/enums/userTypeEnum';
import { UserForm } from '../components/userForm';
import { PopUp } from "../../../components/popup";
import { useAuth } from "../../../core/hooks/useAuth";
import { PaginationModel } from "../../../core/models/pagination";
import { Pagination } from "../../../components/pagination";
import { BrandForm } from "../../brand/components/brand.form";

export const UserListing = ()=>{
    const [showPopup, setShowPopup] = useState(false);
    const [showBrandPopup, setShowBrandPopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedBrandId, setSelectedBrandId] = useState(null);
    const [items, setItems] = useState([]);
    const {isBrandRootAdmin, user, isAdmin, isBrandAdmin, isBrandUser} = useAuth();
    const [query, setQuery] = useState({isNeedSubUsers: !isAdmin(), BrandID: isBrandUser() ? user.BrandID : 0, isExcludeAdmin: !isAdmin(), Pagination: new PaginationModel()});

    useEffect(()=>{
        fetchUsers();
    }, []);

    const fetchUsers = (q={})=>{
        authService.getAllFiltered({...query, ...q}).then((data)=>{
            setItems(data.Items);
            onChangePagination({TotalRecord: data.TotalRecord, PageNumber: data.PageNumber});
        })
    }

    const onChangeQuery = (value)=>{
        const constructValues = {...query, ...value};
        setQuery(constructValues);
    }

    const resolveUserType = (type)=>{
        switch(type){
            case USER_TYPE.Admin:
                return "System admin";
            case USER_TYPE.BrandAdmin:
                return "Brand admin";
            case USER_TYPE.BrandEditor:
                return "Brand editor";
            case USER_TYPE.BrandRootAdmin:
                return "Brand super admin";
        }
    }

    const closePopUp = ()=>{
        setShowPopup(false);
        fetchUsers();
    }

    const openPopUp = (id)=>{
        setShowPopup(true);
        setSelectedId(id);
    }

    const closeBrandPopUp = ()=>{
        setShowBrandPopup(false);
        fetchUsers();
    }

    const openBrandPopUp = (id)=>{
        setShowBrandPopup(true);
        setSelectedBrandId(id);
    }

    const onRemoveUser = (user)=>{
        authService.removeUser(user.UserID).then((data)=>{
            if(user.UserType == USER_TYPE.BrandRootAdmin){
                Promise.all([brandService.removeBrand(user.BrandID), brandService.removeAllBrandSubUsers(user.BrandID), offerService.removeOfferByBrandID(user.BrandID)]).then(()=>{
                    fetchUsers();
                });
            }
            else if(user.UserType == USER_TYPE.BrandAdmin || user.UserType == USER_TYPE.BrandEditor){
                brandService.removeBrandSubUserByUserID(user.UserID).then(()=>{
                    fetchUsers();
                });
            }
            else{
                fetchUsers();
            }
        });
    }

    const onChangePagination = (value)=>{
        onChangeQuery({Pagination: {...query.Pagination, ...value}});
    }

    const handlePageClick = (page) => {
        fetchUsers({...query, Pagination: {...query.Pagination, PageNumber: page.PageNumber} });
        onChangePagination({PageNumber: page.PageNumber});
    };


    const renderRow = (v, i)=>{
        return (
            <tr key={i}>
                <td>{v.UserName}</td>
                <td>{v.BrandName ? v.BrandName : v.SubUserBrandName}</td>
                <td>{resolveUserType(v.UserType)}</td>
                <td>{v.Email}</td>
                <td>{ v.IsActive ? <span class="badge badge-success">Active</span> : <span class="badge badge-danger">InActive</span> }</td>
                <td>
                    <div>
                        {(user.UserID == v.UserID || isAdmin() || (isBrandRootAdmin() ? v.UserType == USER_TYPE.BrandAdmin || v.UserType == USER_TYPE.BrandEditor : false) || (isBrandAdmin() ? v.UserType == USER_TYPE.BrandEditor : false) ) &&
                            <button className="btn btn-warning mr-2" onClick={()=> openPopUp(v.UserID)}>
                                <i class="fa fa-pencil" aria-hidden="true"></i>    
                            </button>
                        }

                        {( (isAdmin() && user.UserID != v.UserID) || (isBrandRootAdmin() && user.UserID != v.UserID ? v.UserType == USER_TYPE.BrandAdmin || v.UserType == USER_TYPE.BrandEditor : false) ) &&
                            <button className="btn btn-danger mr-2">
                                <i class="fa fa-trash-o" aria-hidden="true" onClick={()=> onRemoveUser(v)}></i>
                            </button>
                        }

                        {(isAdmin() && v.UserType == USER_TYPE.BrandRootAdmin) &&
                            <button className="btn btn-primary">
                                <i class="fa fa-building text-white" aria-hidden="true" onClick={()=> openBrandPopUp(v.BrandID)}></i>
                            </button>
                        }
                        
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <div>
            {isBrandRootAdmin() &&
                <div class="d-flex justify-content-end w-100 mb-3">
                    <button class="btn btn-primary" onClick={()=> openPopUp()}> Add Brand User</button>
                </div>
            }

            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">User Name</th>
                        <th scope="col">Brand</th>
                        <th scope="col">Role</th>
                        <th scope="col">Email</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(renderRow)}
                </tbody>
            </table>

            <Pagination paging={query.Pagination} handlePageClick={handlePageClick}/>

            <PopUp show={showPopup} onClose={closePopUp} title={selectedId ? "Edit User" : "Add User"}>
                <UserForm onClose={()=> closePopUp()} selectedId={selectedId}/>
            </PopUp>

            <PopUp show={showBrandPopup} onClose={closeBrandPopUp} title={selectedBrandId ? "Edit Brand" : "Add Brand"}>
                <BrandForm onClose={()=> closeBrandPopUp()} selectedId={selectedBrandId}/>
            </PopUp>

        </div>
    );
}