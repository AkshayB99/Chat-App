import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import bgChat from "../assets/bg-chat.png";
import bgFriends from "../assets/bg-friends2.jpg";

const cookies = new Cookies();

function home() {
  const navigate = useNavigate(); // Importing useNavigate hook
  const authToken = cookies.get("token");


  const handleSignUpClick = () => {
    if(authToken){
      navigate("/chat");
    } else{
      navigate("/login");
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <div className="flex ">
      <div className=" w-1/2 flex pl-[80px]">
        <div className="  flex  flex-col">
          <h1 className="text-6xl	mb-[20px] mt-[200px] text-center">Welcome To Chat App</h1>
          <div className="flex h-[250px] flex-col">
            <p className="pl-4">
            Best way communicate with your Friends
            </p>
            <div className="flex  h-[100px] my-8 pl-4">
              <button
                className="bg-[#36b328] w-44 h-12 rounded-md mr-10 text-xl flex justify-center items-center"
                onClick={handleSignUpClick}
              >
                Get Started
                <img className="w-[30px] h-[30px] ml-4" src={bgChat} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-1/2 flex justify-center items-center">
        <img className="  " src={bgFriends} alt="" />
      </div>
    </div>
  );
}

export default home;
