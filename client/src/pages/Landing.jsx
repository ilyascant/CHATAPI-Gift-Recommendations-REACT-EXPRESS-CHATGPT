// LandingPage.js

import React, { useState } from "react";
import BudgetSlider from "../components/BudgetSlider";
import { useAIStateValue } from "../context/AIStateProvider";
import { AIActionType } from "../context/AIReducer";
import { useNavigate, Link } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const [yourSelectedGender, setYourSelectedGender] = useState(null);
  const [yourSelectedAge, setYourSelectedAge] = useState(18);
  const [recipientSelectedGender, setRecipientSelectedGender] = useState(null);
  const [recipientSelectedAge, setRecipientSelectedAge] = useState(18);
  const [budgets, setBudgets] = useState([0, 50]);

  const [_, dispatch] = useAIStateValue();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (yourSelectedGender == null || yourSelectedAge == null || recipientSelectedGender == null || recipientSelectedAge == null)
      return alert("Please Fill All Areas then Submit Again.");

    const info = {
      userGender: yourSelectedGender,
      userAge: yourSelectedAge,
      recipientGender: recipientSelectedGender,
      recipientAge: recipientSelectedAge,
      userBudgets: budgets,
    };

    dispatch({ type: AIActionType.SET_USER_INFO, userInfo: info });
    navigate("/quiz", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col justify-center items-center gap-12 w-[90%] xl:w-9/12 bg-white lg:p-2 p-1 rounded shadow-md">
        {/* Your Content*/}
        <div className="flex-1 flex">
          <div className="flex flex-col flex-1 gap-8">
            <div className="flex flex-col justify-evenly items-center lg:gap-8 gap-2">
              <h2 className="block text-gray-700 text-md sm:text-lg lg:mt-8 mt-2 ">Your Gender</h2>
              <div className="relative flex justify-evenly items-center gap-2">
                <div
                  onClick={() => setYourSelectedGender("male")}
                  className={`flex-1 md:flex-none md:w-[30%] aspect-square cursor-pointer rounded ${
                    yourSelectedGender == "male" ? "border-2 border-blue-500" : "shadow-md hover:scale-110 duration-300 transition-all"
                  }`}>
                  <img src="https://static.vecteezy.com/system/resources/previews/004/854/573/original/male-gender-symbol-free-vector.jpg" alt="" />
                </div>
                <div
                  onClick={() => setYourSelectedGender("female")}
                  className={`flex-1 md:flex-none md:w-[30%] aspect-square cursor-pointer rounded ${
                    yourSelectedGender == "female" ? "border-2 border-blue-500" : "shadow-md hover:scale-110 duration-300 transition-all"
                  }`}>
                  <img src="https://static.vecteezy.com/system/resources/previews/000/630/430/non_2x/vector-female-sign-icon-illustration.jpg" alt="" />
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="block text-gray-700 text-md mb-2 mr-2">Your Age</h2>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter Age"
                  value={yourSelectedAge}
                  onChange={(e) => setYourSelectedAge(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/*  */}
          <span className="w-px bg-gray-100 rounded-sm lg:mx-8 mx-2"></span>
          {/*  */}
          {/* Recipient's Content */}
          <div className="flex flex-col flex-1 gap-8">
            <div className="flex flex-col justify-evenly items-center lg:gap-8 gap-2">
              <h2 className="block text-gray-700 text-md sm:text-lg lg:mt-8 mt-2 ">Recipient's Gender</h2>
              <div className="relative flex justify-evenly items-center gap-2">
                <div
                  onClick={() => setRecipientSelectedGender("male")}
                  className={`flex-1 md:flex-none md:w-[30%] aspect-square cursor-pointer rounded ${
                    recipientSelectedGender == "male" ? "border-2 border-blue-500" : "shadow-md hover:scale-110 duration-300 transition-all"
                  }`}>
                  <img src="https://static.vecteezy.com/system/resources/previews/004/854/573/original/male-gender-symbol-free-vector.jpg" alt="" />
                </div>
                <div
                  onClick={() => setRecipientSelectedGender("female")}
                  className={`flex-1 md:flex-none md:w-[30%] aspect-square cursor-pointer rounded ${
                    recipientSelectedGender == "female" ? "border-2 border-blue-500" : "shadow-md hover:scale-110 duration-300 transition-all"
                  }`}>
                  <img src="https://static.vecteezy.com/system/resources/previews/000/630/430/non_2x/vector-female-sign-icon-illustration.jpg" alt="" />
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="block text-gray-700 text-md mb-2 mr-2">Recipient's Age</h2>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter Age"
                  value={recipientSelectedAge}
                  onChange={(e) => setRecipientSelectedAge(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Budget */}
        <div className="flex-1 w-full flex flex-col items-center gap-4 lg:gap-8">
          <div className="flex items-center lg:w-[70%] w-full ">
            <h2 className="lg:mr-4 mr-1">Budget </h2>
            <BudgetSlider {...{ budgets, setBudgets }} />
          </div>
          {/* Start Button */}
          <div className="flex justify-end">
            <button onClick={handleSubmit} className="w-fill bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
