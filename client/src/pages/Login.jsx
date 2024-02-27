import React, { useState } from "react";
import { useAIStateValue } from "../context/AIStateProvider";
import { AIActionType } from "../context/AIReducer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [{ userInfo, recipient, password }, dispatch] = useAIStateValue();
  const [userPassword, setUserPassword] = useState("");

  const handlePasswordChange = (e) => {
    setUserPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userPassword) {
      try {
        const results = await axios({
          url: (process.env.REACT_APP_NODE_ENV === "production" ? process.env.REACT_APP_PRODUCTION : process.env.REACT_APP_LOCAL) + "/login",
          data: { password: userPassword },
          method: "post",
          withCredentials: "true",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        setUserPassword(userPassword);
        dispatch({ type: AIActionType.SET_USER_PASSWORD, password: userPassword });
        navigate("/", { replace: true });
        return results?.data;
      } catch (error) {
        console.log(error);
        alert("WRONG PASSWORD");
        return null;
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {process.env.REACT_APP_TEST}
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={userPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
