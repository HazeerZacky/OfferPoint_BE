import React from "react";
import ReactPaginate from 'react-paginate';

export const Pagination = (props)=> {

    const handlePageClick = (event) => {
        const PageNumber = (event.selected * props.paging.PageSize) % props.paging.TotalRecord;
        props.handlePageClick({PageNumber, selected: event.selected});
    };

    return (
        <div class='w-100 d-flex justify-content-center p-3'>
            <ReactPaginate
                onPageChange={handlePageClick}
                pageRangeDisplayed={props.paging.PageSize}
                pageCount={Math.ceil(props.paging.TotalRecord / props.paging.PageSize)}
                renderOnZeroPageCount={null}
                className="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                nextClassName="page-item"
                previousLinkClassName="page-link"
                nextLinkClassName="page-link"
                activeClassName="active"
                disabledClassName="disabled"
            />
        </div>
    )
}