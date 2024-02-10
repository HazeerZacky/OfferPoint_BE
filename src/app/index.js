import React, { useEffect } from "react";
import { AppRoutes } from "./routes";
import { registerClientID } from "../core/utils/uniqueID";

const App = (props)=>{
    
    useEffect(()=>{
        registerClientID();
    },[]);

    return (
        <div>
            <AppRoutes/>
        </div>
    );
}

export default App;