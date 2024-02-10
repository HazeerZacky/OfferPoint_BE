import axios from "axios";
import config from '../config';

export default {
    createFile,
    removeFilesByModuleAndRefAndFileUsage,
    getFilesByModuleAndRefAndFileUsage
};

function createFile(fileModelFormData){
    return axios.post(`${config.apiEndPoint}/api/OfferPoint/File/createFile`, fileModelFormData, {headers: {'Content-Type': 'multipart/form-data'}}).then((res)=> res.data);
}

function removeFilesByModuleAndRefAndFileUsage(ModuleID, ReferenceID, FileUsageType){
    return axios.delete(`${config.apiEndPoint}/api/OfferPoint/File/removeFile/${ModuleID}/${ReferenceID}/${FileUsageType}`).then((res)=> res.data);
}

function getFilesByModuleAndRefAndFileUsage(ModuleID, ReferenceID, FileUsageType){
    return axios.get(`${config.apiEndPoint}/api/OfferPoint/File/getFilesByModuleAndRefAndFileUsage/${ModuleID}/${ReferenceID}/${FileUsageType}`).then((res)=> res.data);
}