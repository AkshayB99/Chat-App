import React, { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import { Routes, Route, useNavigate } from "react-router-dom";

import { io } from "socket.io-client";
import Conversation from "./Conversation";
import ChatBox from "./ChatBox";

const cookies = new Cookies();

function Chat() {
  const navigate = useNavigate();
  const authToken = cookies.get("token");
  const data = cookies.get("data");
  const [userData, setUserData] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [remainingUser, setRemainingUser] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user

  const socket = useRef();

  useEffect(() => {
    socket.current = io("http://127.0.0.1:8000");
    socket.current.emit("new-user-add", data.data.user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUser(users);
    });
  }, [data.data.user._id]);

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      setReceiveMessage(data);
    });
  }, []);

  useEffect(() => {
    const redirectToLogin = () => {
      if (!authToken) {
        navigate("/login");
      } else {
        fetchData();
      }
    };

    redirectToLogin();
  }, [authToken, navigate]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/users/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUserData(userData.data.users);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const getChats = async () => {
      const chats = await userChats(data.data.user._id);
      setChats(chats);
    };
    getChats();
  }, [authToken]);

  const userChats = async (userId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/chat/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleAddChat = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const datas = await response.json();
        const users = datas.data.users;
        const newUsers = users.filter((user) =>
          Array.isArray(chats) &&
          chats.every(
            (chat) => Array.isArray(chat.members) && chat.members.length >= 2
          )
            ? !chats.some((chat) =>
                chat.members.some((member) => member === user._id)
              ) && user._id !== data.data.user._id
            : true
        );
        setRemainingUser(newUsers);
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedUser(null); // Reset selected user when closing popup
  };

  const handleUserClick = async (user) => {
    const newChat = {
      senderId: data.data.user._id,
      receiverId: user._id,
    };
    console.log(data.data.user._id);
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newChat),
      });
      const chats = await userChats(data.data.user._id);
      setChats(chats);
    } catch (error) {
      console.log(error);
    }
    setShowPopup(false); // Close popup when a user is clicked
  };

  // console.log(receiveMessage);

  return (
    <>
      {showPopup && (
        <div className="popup-container flex justify-center items-center h-screen bg-opacity-70 z-50 ">
          <div className="popup z-50">
            <h2>Add Users</h2>
            <ul>
              {remainingUser.map((user) => (
                <li key={user._id} onClick={() => handleUserClick(user)}>
                  {user.first_name} {user.last_name}
                </li>
              ))}
            </ul>
            <button onClick={handleClosePopup}>Close</button>
          </div>
          {/* Background overlay */}
          <div className="overlay" />
        </div>
      )}

      <div className="flex z-0">
        <div className="w-[30%] h-[550px]">
          <div className="border-[4px]  border-green-300 h-full m-4 rounded-lg flex items-center flex-col">
            <div className="text-center font-semibold text-lg my-2">
              All Users
            </div>
            {chats.map((chat) => (
              <div
                onClick={() => setCurrentChat(chat)}
                key={chat._id}
                className="flex justify-center items-center w-[90%] h-[50px] mx-4 bg-slate-200 mb-2 cursor-pointer rounded-md"
              >
                <Conversation data={chat} currentUserId={data.data.user._id} />
              </div>
            ))}
            <div
              className=" h-full flex w-full justify-end items-end mr-14 mb-8"
              onClick={handleAddChat}
            >
              <p className="bg-gray-300 w-10 h-12 flex justify-center items-center text-6xl rounded-lg">
                <span className="mb-3">+</span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-[70%]">
          <div className="border-[4px] border-green-300 h-full m-4 rounded-lg">
            <ChatBox
              chat={currentChat}
              currentUser={data.data.user._id}
              setSendMessage={setSendMessage}
              receiveMessage={receiveMessage}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
