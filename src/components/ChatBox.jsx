import React, { useEffect, useState } from "react";
import sendIcon from "../assets/bgSend.png";
import Cookies from "universal-cookie";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

const cookies = new Cookies();

function ChatBox({ chat, currentUser, setSendMessage, receiveMessage }) {
  const authToken = cookies.get("token");
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [receiveId, setReceiveId] = useState(null);

  useEffect(() => {
    if (chat !== null) {
      const userId = chat?.members?.find((member) => member !== currentUser);
      const getUser = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/v1/users/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          const userData = await response.json();
          setUserData(userData);
        } catch (error) {
          console.log(error);
        }
      };
      if (chat !== null) getUser();
    }
  }, [chat, currentUser]);

  // for fetching the messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/message/${chat._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await response.json();
        setMessage(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const messageData = {
      // Rename to messageData to avoid confusion
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    // send message to data base
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });
      const data = await response.json();
      setMessage([...message, data]); // Update message array with the new message
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
    //send a message to socket server
    const receiveId = chat.members.find((member) => member !== currentUser);
    // setReceiveId(receiverId);
    setSendMessage({ ...messageData, receiveId });
  };

  // useEffect(() => {
  //   if (receiveId !== null) {
  //     setSendMessage({ ...message, receiveId });
  //     setReceiveId(null);
  //   }
  // }, [sendMessage]);

  useEffect(() => {
    // console.log("2", receiveMessage);
    // console.log(
    //   receiveMessage !== null && receiveMessage.receiveId === currentUser
    // );
    if (receiveMessage !== null && receiveMessage.receiveId === currentUser) {
      setMessage([...message, receiveMessage]);
      // console.log(receiveMessage);
      // console.log(message);
    }
  }, [receiveMessage]);

  return (
    <>
      <>
        {chat ? (
          <>
            <div className="w-full h-[85%] " key={chat._id}>
              <div className="flex items-center w-full bg-slate-400 h-14">
                <p className="flex ml-10 text-xl font-medium">
                  {userData?.data.user.first_name}{" "}
                  {userData?.data.user.last_name}
                </p>
              </div>
              <div className="overflow-y-auto max-h-[400px]">
                {message?.map((msg) => {
                  return (
                    <div
                      key={msg._id} // Add key prop here
                      className="flex justify-start items-center flex-col"
                    >
                      <p
                        key={`${msg._id}-text`} // Add key prop here
                        className={`${
                          msg.senderId === currentUser
                            ? "w-full flex flex-col items-end mr-10 text-xl font-medium"
                            : "w-full flex ml-10 flex-col items-start text-xl font-medium"
                        }`}
                      >
                        {msg.text}
                        <span className="text-xs text-gray-400">
                          {format(msg.createdAt)}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-slate-100 w-full h-[15%] flex items-center">
              <div className="mx-5 bg-gray-300 text-5xl flex justify-center items-center w-12 h-12 rounded-lg">
                <span className="mb-3">+</span>
              </div>
              <InputEmoji
                value={newMessage}
                onChange={handleChange}
                cleanOnEnter
              />
              <img
                className="mx-7 w-[40px] h-[40px] cursor-pointer"
                src={sendIcon}
                alt=""
                onClick={sendMessage}
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <span className="text-3xl">
              Tap on a chat to start Conversation..
            </span>
          </div>
        )}
      </>
    </>
  );
}

export default ChatBox;
