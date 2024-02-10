import axios from "axios";
import config from '../../core/config';
export default {
    getAllFilteredContactMessage,
    removeContactMessage,
    createContactMessage
};

function getAllFilteredContactMessage(contactFilterModel){
    return axios.post(`${config.apiEndPoint}/api/OfferPoint/User/getAllFilteredContactMessage`, contactFilterModel).then((res)=> res.data);
}

function removeContactMessage(id){
    return axios.delete(`${config.apiEndPoint}/api/OfferPoint/User/removeContactMessage/${id}`).then((res)=> res.data);
}

function createContactMessage(contactModel){
    return axios.post(`${config.apiEndPoint}/api/OfferPoint/User/createContactMessage`, contactModel).then((res)=> res.data);
}
