const PaginationModel = require("../Models/PaginationModel");
const { isObjectHasKey } = require("../Utils/checking");

class PaginationService {
    
    BuildPaginationResponse(items = [], filterModel={}){
        let _items = items;
        let paginationModel = new PaginationModel();

        if(isObjectHasKey(filterModel, 'Pagination')){
            paginationModel = filterModel.Pagination;
            _items = this.paginate(_items, paginationModel.PageSize, paginationModel.PageNumber);
        }

        return {
            Items: _items,
            PageNumber : paginationModel.PageNumber,
            TotalRecord : items.length
        }
    }

    paginate(array, page_size, page_number) {
        return array.slice(page_number , page_number + page_size);
    }

}

module.exports = PaginationService;