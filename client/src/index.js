import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import App from "./App";
import { AIStateProvider } from "./context/AIStateProvider";
import initialAIState from "./context/initialAIState";
import reducer from "./context/AIReducer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router basename="/">
    <AIStateProvider initialState={initialAIState} reducer={reducer}>
      <App />
    </AIStateProvider>
  </Router>
);
