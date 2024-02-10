import axios from "axios";
import config from '../../core/config';
export default {
    registerBrand,
    loginUser,
    getBrandIdByUserId,
    getAllFiltered,
    removeUser,
    updateUser,
    createUser,
    getUser,
    linkBrandSubUser,
    IsUserNameAlreadyExist
};

function registerBrand(brandUser){
    return axios.post(`${config.apiEndPoint}/api/OfferPoint/User/registerBrandUser`, brandUser).then((res)=> res.data);
}

function loginUser(loginModel){
    return axios.post(`${config.apiEndPoint}/api/OfferPoint/User/loginUser`, loginModel).then((res)=> res.data);
}

function getBrandIdByUserId(id){
    return axios.get(`${config.apiEndPoint}/api/OfferPoint/Brand/getBrandIdByUserId/${id}`).then((res)=> res.data);
}

function getAllFiltered(userFilterModel){
    return axios.post(`${config.apiEndPoint}/api/OfferPoint/User/getAllFiltered`, userFilterModel).then((res)=> res.data);
}

function removeUser(id){
    return axios.delete(`${config.apiEndPoint}/api/OfferPoint/User/removeUser/${id}`).then((res)=> res.data);
}

function updateUser(userModel){
    return axios.put(`${config.apiEndPoint}/api/OfferPoint/User/updateUser`, userModel).then((res)=> res.data);
}

function createUser(userModel){
    return axios.post(`${config.apiEndPoint}/api/OfferPoint/User/createUser`, userModel).then((res)=> res.data);
}

function getUser(id){
    return axios.get(`${config.apiEndPoint}/api/OfferPoint/User/${id}`).then((res)=> res.data);
}

function linkBrandSubUser(UserID, BrandID){
    return axios.post(`${config.apiEndPoint}/api/OfferPoint/User/linkBrandSubUser/${UserID}/${BrandID}`).then((res)=> res.data);
}

function IsUserNameAlreadyExist(UserName, UserID){
    return axios.get(`${config.apiEndPoint}/api/OfferPoint/User/IsUserNameAlreadyExist/${UserName}/${UserID}`).then((res)=> res.data);
}