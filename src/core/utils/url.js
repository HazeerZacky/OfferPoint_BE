import config from '../config';

export const resolveImageURL = (fileName)=>{
    return `${config.staticFileEndPoint}/${fileName}`;
}

export const resolveFileURL = (fileName)=>{
    return `${config.staticFileEndPoint}/${fileName}`;
}