import React, { useEffect, useState } from "react";
import { FileUpload } from "../../../components/file-upload";
import Carousel from 'react-bootstrap/Carousel';
import { FILE_USAGE_TYPE } from "../../../core/enums/FIleUsageTypeEnum";
import { MODULE_TYPE } from "../../../core/enums/ModuleTypeEnum";
import fileService from '../../../core/service/fileService';
import { useAuth } from "../../../core/hooks/useAuth";
import { isUndefinedNullOrEmpty } from "../../../core/utils/checking";
import { resolveImageURL } from "../../../core/utils/url";
import defaultBannerImage from '../../../assets/images/banner-default.jpg';
import defaultCarouselImage from '../../../assets/images/carousel-default.png';

export const AdvertisementListing = ()=>{
    const {user, isLogin, isBrandUser, isAdmin} = useAuth();
    const [L1Ad, setL1Ad] = useState(null);
    const [L2Ad, setL2Ad] = useState(null);
    const [sliderImage, setSliderImage] = useState({[FILE_USAGE_TYPE.CS1]: null, [FILE_USAGE_TYPE.CS2]: null, [FILE_USAGE_TYPE.CS3]: null});
    const [isSliderRefresh, setIsSliderRefresh] = useState(true);
    
    useEffect(()=>{
        fetchAds(FILE_USAGE_TYPE.L1Ads);
        fetchAds(FILE_USAGE_TYPE.L2Ads);
        fetchAllSliders();
    },[]);

    const fetchAds = (FileUsageType)=>{
        setIsSliderRefresh(false);
        fileService.getFilesByModuleAndRefAndFileUsage(MODULE_TYPE.ADVERTISEMENT, 0, FileUsageType).then((data)=>{
            if(FileUsageType == FILE_USAGE_TYPE.L1Ads){
                setL1Ad(data[0]);
            }
            else if(FileUsageType == FILE_USAGE_TYPE.CS1 || FileUsageType == FILE_USAGE_TYPE.CS2 || FileUsageType == FILE_USAGE_TYPE.CS3){
                const constructValues = sliderImage;
                constructValues[FileUsageType] = data[0];
                setSliderImage(constructValues);
            }
            else{
                setL2Ad(data[0]);
            }
            setIsSliderRefresh(true);
        })
    };

    const fetchAllSliders = ()=>{
        fetchAds(FILE_USAGE_TYPE.CS1);
        fetchAds(FILE_USAGE_TYPE.CS2);
        fetchAds(FILE_USAGE_TYPE.CS3);
    } 

    const onChangeFile = (file, FileUsageType)=>{
        if(file){
            let fileModel = new FormData();
            fileModel.append('ModuleID', MODULE_TYPE.ADVERTISEMENT);
            fileModel.append('FileUsageType', FileUsageType);
            fileModel.append('File', file);
            fileModel.append('ReferenceID', 0);

            fileService.removeFilesByModuleAndRefAndFileUsage(MODULE_TYPE.ADVERTISEMENT, 0, FileUsageType).then(()=>{
                fileService.createFile(fileModel).then((data)=>{
                    fetchAds(FileUsageType);
                });
            })
        }
    }

    const onRemoveBannerAds = (FileUsageType)=>{
        fileService.removeFilesByModuleAndRefAndFileUsage(MODULE_TYPE.ADVERTISEMENT, 0, FileUsageType).then(()=>{
            fetchAds(FileUsageType);
        })
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 mb-5">
                    {isSliderRefresh &&
                        <Carousel className="border">
                            {Object.keys(sliderImage).map((k, i)=>{
                                return (
                                    <Carousel.Item key={i}>
                                        <div className="ads-carousel-image">
                                            <img src={sliderImage[k] ? resolveImageURL(sliderImage[k].Name) : defaultCarouselImage } className="w-100 h-100"/>
                                        </div>
                                    </Carousel.Item>
                                )
                            })}
                        </Carousel>
                    }
                </div>

                <div className="col-md-12 mb-5 d-flex flex-wrap">
                    <div className="mr-5">
                        <div>
                            <label class="text-black">Slider 01</label>
                            <FileUpload accept="image/*" id="slider01-ads" onChange={(e)=> onChangeFile(e.target.files[0], FILE_USAGE_TYPE.CS1)}/>
                        </div>
                        <div className="pb-2">
                            <button className="btn btn-danger mt-2" onClick={(e)=> onRemoveBannerAds(FILE_USAGE_TYPE.CS1)}> <i class="fa fa-times" aria-hidden="true"></i> </button>
                        </div>
                    </div>
                    <div className="mr-5">
                        <div>
                            <label class="text-black">Slider 02</label>
                            <FileUpload accept="image/*" id="slider02-ads" onChange={(e)=> onChangeFile(e.target.files[0], FILE_USAGE_TYPE.CS2)}/>
                        </div>
                        <div className="pb-2">
                            <button className="btn btn-danger mt-2" onClick={(e)=> onRemoveBannerAds(FILE_USAGE_TYPE.CS2)}> <i class="fa fa-times" aria-hidden="true"></i> </button>
                        </div>
                    </div>
                    <div>
                        <div>
                            <label class="text-black">Slider 03</label>
                            <FileUpload accept="image/*" id="slider03-ads" onChange={(e)=> onChangeFile(e.target.files[0], FILE_USAGE_TYPE.CS3)}/>
                        </div>
                        <div className="pb-2">
                            <button className="btn btn-danger mt-2" onClick={(e)=> onRemoveBannerAds(FILE_USAGE_TYPE.CS3)}> <i class="fa fa-times" aria-hidden="true"></i> </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 mb-5">
                    <h4>L1 Horizontal Ads</h4>
                    <div className="horizontal-ads-box border mb-3">
                        <img src={!isUndefinedNullOrEmpty(L1Ad) ? resolveImageURL(L1Ad.Name) : defaultBannerImage } className="w-100 h-100"/>
                    </div>
                    <div className="d-flex align-content-end">
                        <div>
                            <label class="text-black">Select Picture</label>
                            <FileUpload accept="image/*" id="l1-ads" onChange={(e)=> onChangeFile(e.target.files[0], FILE_USAGE_TYPE.L1Ads)}/>
                        </div>
                        <div className="ml-5 d-flex flex-column justify-content-end pb-2">
                            <button className="btn btn-danger mt-2" onClick={(e)=> onRemoveBannerAds(FILE_USAGE_TYPE.L1Ads)}> <i class="fa fa-times" aria-hidden="true"></i> </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 mb-5">
                    <h4>L2 Horizontal Ads</h4>
                    <div className="horizontal-ads-box border mb-3">
                        <img src={!isUndefinedNullOrEmpty(L2Ad) ? resolveImageURL(L2Ad.Name) : defaultBannerImage } className="w-100 h-100"/>
                    </div>
                    <div className="d-flex align-content-end">
                        <div>
                            <label class="text-black">Select Picture</label>
                            <FileUpload accept="image/*" id="l2-ads" onChange={(e)=> onChangeFile(e.target.files[0], FILE_USAGE_TYPE.L2Ads)}/>
                        </div>
                        <div className="ml-5 d-flex flex-column justify-content-end pb-2">
                            <button className="btn btn-danger mt-2" onClick={(e)=> onRemoveBannerAds(FILE_USAGE_TYPE.L2Ads)}> <i class="fa fa-times" aria-hidden="true"></i> </button>
                        </div>
                    </div>

                </div>

            </div>
            

        </div>
    );
}