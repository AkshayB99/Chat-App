import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import userLogo from "../assets/user.png";
import Cookies from "universal-cookie";
import { Routes, Route, useNavigate } from "react-router-dom";

const cookies = new Cookies();

function Navbar() {
  const navigate = useNavigate();
  const [data, setData] = useState(cookies.get("data"));
  const authToken = cookies.get("token");

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = cookies.get("data");
      if (newData && newData.message === "success") {
        setData(newData);
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [authToken]);
  

  const handleImgClick = () => {
    navigate("/");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <div className="h-[110px] flex">
      <div className="w-1/2  flex items-center">
        <img
          className="w-[65px] h-[55px] ml-[90px] cursor-pointer"
          src={logo}
          alt=""
          onClick={handleImgClick}
        />
      </div>
      <div className="w-1/2  flex items-center justify-end">
        {authToken ? (
          <div className="flex items-center">
            <img
              className="w-[60px] h-[60px]  border-[3px] border-red-300 bg-slate-100 rounded-full mr-16"
              src={userLogo}
              alt=""
            />
          </div>
        ) : (
          <div className="flex items-center">
            <button
              className="bg-[#36b328] w-28 h-9 rounded-md text-lg mr-8"
              onClick={handleSignUp}
            >
              SignUp
            </button>
            <button
              className="bg-[#36b328] w-28 h-9 rounded-md text-lg mr-8"
              onClick={handleLogIn}
            >
              LogIn
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
