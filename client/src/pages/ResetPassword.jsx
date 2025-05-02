import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [isEmailSend, setisEmailSend] = useState("");
  const [otp, setotp] = useState("");
  const [isotpSubmitted, setIsotpSubmitted] = useState(false);
  const inputRefs = React.useRef([]);

  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handlekeydown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e, index) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      console.log(email)
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setisEmailSend(true);
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  const onSubmitotp = async (e)=>{
    e.preventDefault()
    const otparray = inputRefs.current.map(e=>e.value)
    setotp(otparray.join(""))
    try {
      const {data}= await axios.post(backendUrl + "/api/auth/verify-otp",{email,otp})
      if(data.success){
        toast.success(data.message)
        setIsotpSubmitted(true)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  const onSubmitNewPass = async (e)=>{
    e.preventDefault()
    try {
      const {data}=await axios.post(backendUrl + "/api/auth/set-new-password",{email,newPassword})
      data.success ? toast.success(data.message ) : toast.error(data.message)
      data.success && navigate("/login")
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {!isEmailSend && (
        <form
          action=""
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered Email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.mail_icon} className="w-3 h-3" alt="" />
            <input
              type="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit
          </button>
        </form>
      )}

      {/* otp input form */}
      {!isotpSubmitted && isEmailSend && (
        <form
          action=""
          onSubmit={onSubmitotp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password otp
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6 digit code send to your Email
          </p>
          <div onPaste={handlePaste} className="flex justify-between mb-8">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => {
                    handlekeydown(e, index);
                  }}
                  className="w-12 h-12 bg-[#333a5c] text-white text-center text-xl rounded-md"
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit
          </button>
        </form>
      )}

      {/* Enter new password */}
      {isotpSubmitted && isEmailSend && (
        <form
          action=""
          onSubmit={onSubmitNewPass}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.lock_icon} className="w-3 h-3" alt="" />
            <input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
              required
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
