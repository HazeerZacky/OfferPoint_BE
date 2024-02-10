export function getUniqueID(){
    return Date.now() + ( (Math.random()*100000).toFixed());
}

export function registerClientID(){
    if(!localStorage.getItem("ClientID")){
        localStorage.setItem("ClientID", getUniqueID());
    }
}