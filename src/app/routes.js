import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import {AboutPage} from '../modules/about/pages/about.page';
import {ContactPage} from '../modules/contact/pages/contact.page';
import { HomePage } from "../modules/home/pages/home.page";
import { AppLayout } from "./app-layout";
import { LoginPage } from "../modules/auth/pages/login.page";
import { RegisterPage } from "../modules/auth/pages/register.page";
import {OfferRoutes} from '../modules/offers/routes';
import { OfferPage } from "../modules/offers/pages/offer.page";
import { OfferViewPage } from "../modules/offers/pages/offer.view.page";
import { DashboardPage } from "../modules/dashboard/pages/dashboard.page";
import { BrandRoutes } from "../modules/brand/routes";

export const AppRoutes = ()=>{
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppLayout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="/:id" element={<OfferViewPage/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="/contact" element={<ContactPage/>}/>
                    <Route path="/brands/*" element={<BrandRoutes/>}/>
                    <Route path="/offers/*" element={<OfferRoutes/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/dashboard" element={<DashboardPage/>}/>
                </Route>

            </Routes>
        </BrowserRouter>
    );
}