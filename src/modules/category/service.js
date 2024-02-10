import axios from "axios";
import config from '../../core/config';

export default {
    getAllCategoryAsKeyValue,
    getCategory,
    updateCategory,
    createCategory,
    getAllFiltered,
    removeCategory
};

function getAllCategoryAsKeyValue(){
    return axios.get(`${config.apiEndPoint}/api/OfferPoint/Category/getAllCategoryAsKeyValue`).then((res)=> res.data);
}

function updateCategory(categoryModel){
    return axios.put(`${config.apiEndPoint}/api/OfferPoint/Category/updateCategory`,categoryModel).then((res)=> res.data);
}

function createCategory(categoryModel){
    return axios.post(`${config.apiEndPoint}/api/OfferPoint/Category/createCategory`,categoryModel).then((res)=> res.data);
}

function getCategory(id){
    return axios.get(`${config.apiEndPoint}/api/OfferPoint/Category/${id}`).then((res)=> res.data);
}

function getAllFiltered(filterModel){
    return axios.post(`${config.apiEndPoint}/api/OfferPoint/Category/getAllFiltered`, filterModel).then((res)=> res.data);
}

function removeCategory(id){
    return axios.delete(`${config.apiEndPoint}/api/OfferPoint/Category/removeCategory/${id}`).then((res)=> res.data);
}

