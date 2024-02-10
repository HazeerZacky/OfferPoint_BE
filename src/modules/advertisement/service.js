import axios from "axios";
import config from '../../core/config';

export default {
    getHorizondalAds
};

function getHorizondalAds(FileUsageType, ReferenceID){
    return axios.get(`${config.apiEndPoint}/api/OfferPoint/Advertisement/getHorizondalAds/${FileUsageType}/${ReferenceID}`).then((res)=> res.data);
}