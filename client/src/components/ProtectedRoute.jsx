import React, { useEffect } from "react";

import { Navigate, Outlet } from "react-router";
import { useAIStateValue } from "../context/AIStateProvider";

const ProtectedRoute = ({ component, checkValues, checkMessages, password }) => {
  const [{ messages }, _] = useAIStateValue();

  if (checkValues) {
    const values = Object.values(checkValues);
  }

  if (password !== undefined) {
    if (password === null) return <Navigate replace to="/login" />;
  }

  if (checkMessages) {
    try {
      const _messages = messages[0].content.match(/(?<=\))\s*(.*?)(?=\d|$)/gm);
      if (_messages.length == 0) <Navigate replace to="/" />;
    } catch (error) {
      return <Navigate replace to="/" />;
    }
  }

  if (checkValues) {
    const values = Object.values(checkValues);
    for (const value of values) {
      if (!value) return <Navigate replace to="/" />;
    }
  }

  return component ? component : <Outlet />;
};

export default ProtectedRoute;
