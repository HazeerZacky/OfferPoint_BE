import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { REDUX_ACTION } from '../enums/reduxActionEnum';
import { isUndefinedNullOrEmpty } from '../utils/checking';
import {USER_TYPE} from '../enums/userTypeEnum';
export function useAuth() {
    const { user } = useSelector(({ user }) => ({ user }));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLogin = !isUndefinedNullOrEmpty(user);
    const userType = !isUndefinedNullOrEmpty(user) ? user.UserType : 0;
    
    const logout = () => {
        dispatch({
            type: `${REDUX_ACTION.SET_USER}`,
            payload: {}
        });
        navigate('/');
    };

    const isBrandUser = ()=>{
        return userType == USER_TYPE.BrandRootAdmin || userType == USER_TYPE.BrandAdmin || userType == USER_TYPE.BrandEditor;
    }

    const isAdmin = ()=>{
        return userType == USER_TYPE.Admin;
    }

    const isBrandEditor = ()=>{
        return userType == USER_TYPE.BrandEditor;
    }

    const isBrandRootAdmin = ()=>{
        return userType == USER_TYPE.BrandRootAdmin;
    }

    const isBrandAdmin = ()=>{
        return userType == USER_TYPE.BrandAdmin;
    }

    return {user, logout, userType, isLogin, isBrandUser, isAdmin, isBrandEditor, isBrandRootAdmin, isBrandAdmin};
}