import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props)=>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin,setisLoggedin]=useState(false);
    const [UserData  ,setUserData]=useState({});

    const getAuthState = async()=>{
        try {
            const {data}=await axios.get(backendUrl + "/api/auth/is-Auth", { withCredentials: true })

            if(data.success){
                setisLoggedin(true)
                getUserData()
            }
                
        } catch (error) {
            toast.error(error.message)
        }
    }    
    const getUserData = async ()=>{
        try {
            
            const {data}=await axios.get(backendUrl+`/api/user/data`,{withCredentials:true});
            
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getAuthState();
    },[])

    const value ={
        getUserData,
        backendUrl,
        isLoggedin,setisLoggedin,
        UserData,setUserData
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}