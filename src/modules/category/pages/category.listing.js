import React, { useEffect, useState } from "react";
import { PopUp } from "../../../components/popup";
import categoryService from '../service';
import { isUndefinedNullOrEmpty } from "../../../core/utils/checking";
import { CategoryForm } from "../components/categoryForm";
import { useAuth } from "../../../core/hooks/useAuth";
import { PaginationModel } from "../../../core/models/pagination";
import { Pagination } from "../../../components/pagination";

export const CategoryListing = ()=>{
    const [showPopup, setShowPopup] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState({Pagination: new PaginationModel()});
    const {isAdmin} = useAuth();

    useEffect(()=>{
        fetchCategories();
    }, []);

    const fetchCategories = (q={})=>{
        categoryService.getAllFiltered({...query, ...q}).then((data)=>{
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
        fetchCategories();
    }

    const openPopUp = (id)=>{
        setShowPopup(true);
        setSelectedId(id);
    }

    const onRemoveCategory = (id)=>{
        categoryService.removeCategory(id).then(()=>{
            fetchCategories();
        });   
    }

    const onChangePagination = (value)=>{
        onChangeQuery({Pagination: {...query.Pagination, ...value}});
    }

    const handlePageClick = (page) => {
        fetchCategories({...query, Pagination: {...query.Pagination, PageNumber: page.PageNumber} });
        onChangePagination({PageNumber: page.PageNumber});
    };

    const renderRow = (v, i)=>{
        return (
            <tr key={i}>
                <td>{v.CategoryName}</td>
                {isAdmin() &&
                    <td>
                        <div>
                            <button className="btn btn-warning mr-2" onClick={()=> openPopUp(v.CategoryID)}>
                                <i class="fa fa-pencil" aria-hidden="true"></i>    
                            </button>
                            <button className="btn btn-danger" onClick={()=> onRemoveCategory(v.CategoryID)}>
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                            </button>
                        </div>
                    </td>
                }
            </tr>
        );
    }

    return (
        <div>
            {isAdmin() &&
                <div class="d-flex justify-content-end w-100 mb-3">
                    <button class="btn btn-primary" onClick={()=> openPopUp()}> Add New Category </button>
                </div>
            }
            
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Category Name</th>
                        {isAdmin() && <th scope="col">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map(renderRow)}
                </tbody>
            </table>
            
            <Pagination paging={query.Pagination} handlePageClick={handlePageClick}/>

            <PopUp show={showPopup} onClose={closePopUp} title={selectedId ? "Edit Category" : "Add Category"}>
                <CategoryForm onClose={()=> closePopUp()} selectedId={selectedId}/>
            </PopUp>
        </div>
    );
}