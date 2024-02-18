import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useHistory hook
import Cookies from "universal-cookie";

const cookies = new Cookies();

function SignUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleInput = (e) => {
    let name = e.target.id;
    let value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      const data = await response.json();
      cookies.set("token", data.token);
      cookies.set("data", data);
      console.log(data);
      if(data.status === "success"){
        navigate("/chat");
      } else{
        alert(data.message);
      }
    } catch (err) {
      console.log("Sign Up: ", err);
    }
  };

  const handLogin = () => {
    navigate("/login");
  }

  return (
    <>
      <div className=" w-full  flex items-center justify-center ">
        <div className=" w-1/3 flex items-center flex-col">
          <h1 className="text-4xl mb-3 mt-[0px]">Chat App</h1>
          <h2 className="text-xl mb-3 ">Sign Up</h2>
          <div className="w-550px">
            <form action="">
              <div className="w-full">
                <label
                  htmlFor="first_name"
                  className="uppercase tracking-wide text-xs font-bold mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  className=" appearance-none border-2 border-[#00000] rounded w-full  px-4 py-1 focus:outline-none mb-3"
                  placeholder="Enter First Name"
                  required
                  onChange={handleInput}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="last_name"
                  className=" uppercase tracking-wide text-xs font-bold mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="appearance-none border-2 border-[#00000] rounded w-full  px-4 py-1 focus:outline-none mb-3"
                  placeholder="Enter Last Name"
                  required
                  onChange={handleInput}
                />
              </div>
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
              <div className="w-full">
                <label
                  htmlFor="passwordConfirm"
                  className=" uppercase tracking-wide text-xs font-bold mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="passwordConfirm"
                  className="appearance-none border-2 border-[#00000] rounded w-full  px-4 py-1 focus:outline-none mb-3 "
                  placeholder="Enter Confirm Password"
                  required
                  onChange={handleInput}
                />
              </div>
              <button
                className="bg-[#c7c7c7] w-full my-6 py-2 rounded-lg"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
            </form>
          </div>
          <p>Already have an account? <span className="text-green-500 cursor-pointer" onClick={handLogin}>Login</span></p>
        </div>
      </div>
    </>
  );
}

export default SignUp;
