import React from "react";
import {Outlet} from "react-router-dom";
import {TopNavigation} from '../components/top-nav';
import {Footer} from '../components/footer';

export const AppLayout = ()=>{
    return (
        <>
            <TopNavigation/>
            <Outlet/>
            <Footer/>
        </>
    );
}