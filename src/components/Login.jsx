import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    let name = e.target.id;
    let value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      cookies.set("token", data.token);
      cookies.set("data", data);
      navigate("/chat");
      
    } catch (err) {
      console.log("Sign Up: ", err);
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  }

  return (
    <>
      <div className=" w-full  flex items-center justify-center mt-[90px]">
        <div className=" w-1/3 flex items-center flex-col">
          <h1 className="text-4xl mb-3 mt-[30px]">Chat App</h1>
          <h2 className="text-xl mb-3 ">LogIn</h2>
          <div className="w-550px">
            <form action="">
              <div className="w-full">
                <label
                  htmlFor="email"
                  className=" uppercase tracking-wide text-xs font-bold mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="appearance-none border-2 border-[#00000] rounded w-full  px-4 py-1 focus:outline-none mb-3"
                  placeholder="Enter Email"
                  required
                  onChange={handleInput}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="password"
                  className=" uppercase tracking-wide text-xs font-bold mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="appearance-none border-2 border-[#00000] rounded w-full  px-4 py-1 focus:outline-none mb-3"
                  placeholder="Enter password"
                  required
                  onChange={handleInput}
                />
              </div>
              
              <button
                className="bg-[#c7c7c7] w-full my-6 py-2 rounded-lg"
                onClick={handleSubmit}
              >
                 Login
              </button>
            </form>
          </div>
          <p>Don't have an account? <span className="text-green-500 cursor-pointer" onClick={handleSignUp}>Sign Up</span></p>
        </div>
      </div>  
    </>
  );
}

export default Login;
