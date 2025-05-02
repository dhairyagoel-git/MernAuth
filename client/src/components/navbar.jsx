import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import  axios  from "axios";
const Navbar = () => {
  const navigate = useNavigate();
  const { UserData, backendUrl, setUserData, setisLoggedin } =
    useContext(AppContext);

    const logout = async()=>{
      try {
        const { data } = await axios.post(backendUrl + "/api/auth/logout",{withCredentials :true})
        if(data.success){
          setisLoggedin(false)
          setUserData(false)
          console.log("You have been logged out.")
          navigate('/')
        }
      } catch (error) {
        toast.error(error.message  )
      }
    }

    const sendVerificationOtp =async ()=>{
      try {
        axios.defaults.withCredentials = true;
        const {data}=await axios.post(backendUrl+"/api/auth/send-verify-otp")
        if(data.success){
          navigate("/email-verify")
          toast.success(data.message)
        }
        else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  console.log(`Navbar bar data : ${UserData.name}`)
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 ">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />

      {UserData ? (
        <div className="flex w-8 h-8 justify-center items-center rounded-full bg-black text-white relative group">
          {UserData?.name?.[0].toUpperCase()}


          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black roundex pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 min-w-30 text-sm">
              {!UserData.isAccountVerified && (
                <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify Email
                </li>
              )}
              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
