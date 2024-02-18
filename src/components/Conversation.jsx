import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function Conversation({ data, currentUserId }) {
  const authToken = cookies.get("token");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data.members.find((member) => member !== currentUserId);
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
    getUser();
  }, [authToken, currentUserId, data]);

  return (
    <>
      <div>
        {userData && (
          <>
            <ul>
              <div className="flex">
                {userData?.data.user.first_name} 
                <p className="ml-1">{userData?.data.user.last_name} </p>
              </div>
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default Conversation;
