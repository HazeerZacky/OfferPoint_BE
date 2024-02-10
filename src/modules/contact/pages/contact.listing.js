import React, { useEffect, useState } from "react";
import contactService from '../service';
import { isUndefinedNullOrEmpty } from "../../../core/utils/checking";
import { useAuth } from "../../../core/hooks/useAuth";
import { PaginationModel } from "../../../core/models/pagination";
import { Pagination } from "../../../components/pagination";

export const ContactListing = ()=>{
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState({Pagination: new PaginationModel()});
    const {isAdmin} = useAuth();

    useEffect(()=>{
        fetchContacts();
    }, []);

    const fetchContacts = (q={})=>{
        contactService.getAllFilteredContactMessage({...query, ...q}).then((data)=>{
            setItems(data.Items);
            onChangePagination({TotalRecord: data.TotalRecord, PageNumber: data.PageNumber});
        })
    }

    const onChangeQuery = (value)=>{
        const constructValues = {...query, ...value};
        setQuery(constructValues);
    }

    const onRemoveContact = (id)=>{
        contactService.removeContactMessage(id).then(()=>{
            fetchContacts();
        });   
    }

    const onChangePagination = (value)=>{
        onChangeQuery({Pagination: {...query.Pagination, ...value}});
    }

    const handlePageClick = (page) => {
        fetchContacts({...query, Pagination: {...query.Pagination, PageNumber: page.PageNumber} });
        onChangePagination({PageNumber: page.PageNumber});
    };

    const renderRow = (v, i)=>{
        return (
            <tr key={i}>
                <td>{v.Name}</td>
                <td>{v.Subject}</td>
                <td>{v.Message}</td>
                <td>{v.Email}</td>
                {isAdmin() &&
                    <td>
                        <div>
                            <button className="btn btn-danger" onClick={()=> onRemoveContact(v.ID)}>
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
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Message</th>
                        <th scope="col">Email</th>
                        {isAdmin() && <th scope="col">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map(renderRow)}
                </tbody>
            </table>
            
            <Pagination paging={query.Pagination} handlePageClick={handlePageClick}/>
        </div>
    );
}