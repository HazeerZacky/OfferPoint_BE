import axios from "axios";
import config from '../../core/config';
export default {
    getAllFiltered,
    updateBrand,
    getBrand,
    removeBrand,
    removeAllBrandSubUsers,
    removeBrandSubUserByUserID,
    IsVerifiedBrand
};


function getAllFiltered(brandFilterModel){
    return axios.post(`${config.apiEndPoint}/api/OfferPoint/Brand/getAllFiltered`, brandFilterModel).then((res)=> res.data);
}

function updateBrand(brand){
    return axios.put(`${config.apiEndPoint}/api/OfferPoint/Brand/updateBrand`, brand).then((res)=> res.data);
}

function getBrand(id){
    return axios.get(`${config.apiEndPoint}/api/OfferPoint/Brand/${id}`).then((res)=> res.data);
}

function removeBrand(id){
    return axios.delete(`${config.apiEndPoint}/api/OfferPoint/Brand/removeBrand/${id}`).then((res)=> res.data);
}

function removeAllBrandSubUsers(BrandID){
    return axios.delete(`${config.apiEndPoint}/api/OfferPoint/Brand/removeAllBrandSubUsers/${BrandID}`).then((res)=> res.data);
}

function removeBrandSubUserByUserID(UserID){
    return axios.delete(`${config.apiEndPoint}/api/OfferPoint/Brand/removeBrandSubUserByUserID/${UserID}`).then((res)=> res.data);
}

function IsVerifiedBrand(BrandID){
    return axios.get(`${config.apiEndPoint}/api/OfferPoint/Brand/IsVerifiedBrand/${BrandID}`).then((res)=> res.data);
}