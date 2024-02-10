import React from "react";
import { Route, Routes } from "react-router-dom";
import { OfferPage } from "./pages/offer.page";
import { OfferViewPage } from "./pages/offer.view.page";

export const OfferRoutes = ()=>{
    return (
        <>
            <Routes>
                <Route index element={<OfferPage/>}/>
                <Route path=":id" element={<OfferViewPage/>}/>
            </Routes>
        </>
    );
}