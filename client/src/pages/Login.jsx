import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import  axios from 'axios';
import {toast} from 'react-toastify'


const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setisLoggedin, getUserData } = useContext(AppContext);
  const [state, setstate] = useState("SignUp");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      if (state == "SignUp") {
        axios.defaults.withCredentials=true;
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });
        if(data.success){
          
          setisLoggedin(true);
          getUserData()
          navigate('/');
        }else{
          toast.error(data.message)
        } 
      } else {
        axios.defaults.withCredentials=true;
        const {data}=await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
        if(data.success){
          getUserData()
          setisLoggedin(true);
          navigate('/');
        }
        else{
          toast.error(data.message)
        }
      }
    } catch (error) { 
      toast.error(error.message)
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "SignUp" ? "Create account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "SignUp" ? "Create your account" : "Login to your account"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state == "SignUp" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="outline-none bg-transparent "
                onChange={(e) => setname(e.target.value)}
                value={name}
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email-Id"
              required
              className="outline-none bg-transparent "
              onChange={(e) => setemail(e.target.value)}
              value={email}
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              className="outline-none bg-transparent "
              onChange={(e) => setpassword(e.target.value)}
              value={password}
            />
          </div>

          <p
            onClick={() => {
              navigate("/reset-password");
            }}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password?
          </p>
          <button className="w-full cursor-pointer py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>
        {state == "SignUp" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => {
                setstate("Login");
              }}
              className="cursor-pointer text-blue-400 underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => {
                setstate("SignUp");
              }}
              className="cursor-pointer text-blue-400 underline"
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
