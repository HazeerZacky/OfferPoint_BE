import React from "react";
import {NavLink, Link} from 'react-router-dom';
import AppLogo from '../assets/images/appLogoPng.png';
import {useAuth} from '../core/hooks/useAuth';
import defaultImage from '../assets/images/avatar.jpg';
import { USER_TYPE } from "../core/enums/userTypeEnum";

export const TopNavigation = (props)=>{
    const {isLogin, logout, user} = useAuth();

    const resolveUserType = (type)=>{
        
        switch(type){
            case USER_TYPE.Admin:
                return "system admin";
            case USER_TYPE.BrandAdmin:
                return "brand admin";
            case USER_TYPE.BrandEditor:
                return "brand editor";
            case USER_TYPE.BrandRootAdmin:
                return "brand super admin";
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky" data-offset="500">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={AppLogo} className="w-auto" height={50}/>
                </Link>
    
                <button className="navbar-toggler" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
    
                <div className="navbar-collapse collapse" id="navbarContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/offers" className="nav-link">Offers</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/brands" className="nav-link">Brands</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/about" className="nav-link">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/contact" className="nav-link">Contact</NavLink>
                        </li>

                        {isLogin 
                            ?
                            (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <span className="nav-link cursor-pointer" onClick={()=> logout()}>Logout</span>
                                    </li>
                                </>
                            )
                            :
                            (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/login" className="nav-link">Login</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/register" className="nav-link">Register</NavLink>
                                    </li>
                                </>
                            )
                            
                        }
                        {isLogin &&
                            <div className="user-info d-flex border rounded p-1 pl-2 pr-2">
                                <img src={defaultImage} height={50} width={50} className="rounded-circle"/>
                                <div className="ml-2">
                                    <div className="text-dark" style={{fontSize:'18px'}}>{user.UserName}</div>
                                    <div className="text-secondary" style={{fontSize:'13px'}}>{resolveUserType(user.UserType)}</div>
                                </div>
                            </div>
                        }
                        
                    </ul>
                </div>

            </div>
        </nav>
    );
}