import React from "react";
import { Route, Routes } from "react-router-dom";
import { BrandPage } from "./pages/brand.page";
import { BrandViewPage } from "./pages/brand.view.page";

export const BrandRoutes = ()=>{
    return (
        <>
            <Routes>
                <Route index element={<BrandPage/>}/>
                <Route path=":id" element={<BrandViewPage/>}/>
            </Routes>
        </>
    );
}