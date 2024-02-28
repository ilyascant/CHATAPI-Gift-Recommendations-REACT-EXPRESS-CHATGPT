import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAIStateValue } from "../context/AIStateProvider.js";
import { AIActionType } from "../context/AIReducer.js";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();
  const [totalQuestionCount, setTotalQuestionCount] = useState(8);
  const [canSkip, setCanSkip] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [questions, setQuestions] = useState([]);

  const [{ recipient, messages, userInfo, password }, dispatch] = useAIStateValue();

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const fetchChatAPI = async () => {
    try {
      const results = await axios({
        url: (process.env.REACT_APP_NODE_ENV === "production" ? process.env.REACT_APP_PRODUCTION : process.env.REACT_APP_LOCAL) + "/chatapi",
        data: {
          password: password,
          messages: [
            {
              role: "user",
              content: `I am an ${userInfo.userAge}-year-old ${userInfo.userGender}. My budget is from ${userInfo.userBudgets[0]}\$ to ${userInfo.userBudgets[1]}\$, and I want to buy a gift for my ${userInfo.recipientAge}-years-old ${recipient}, who is ${userInfo.recipientGender}. Help me to choose a gift, be creative and consider my budget when asking question`,
            },
            ...messages,
          ],
          temperature: 0.95,
        },
        method: "post",
        withCredentials: "true",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      return results?.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const callAPI = async () => {
    setLoading(true);
    let response = await fetchChatAPI();

    if (response) {
      const assistantResponse = JSON.parse(response.choices[0].message.content);
      setQuestions((prev) => [...prev, { question: assistantResponse.question, options: assistantResponse.options }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentQuestionIndex == totalQuestionCount) navigate("/recommendation", { replace: true });
  }, [currentQuestionIndex]);

  useMemo(async () => {
    // if (canSkip) {
    setPageLoading(false);
    await callAPI();
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setCanSkip(false);
    // }
  }, [messages]);

  const handleOptionClick = async (e, selectedAnswer) => {
    navigate("/quiz", { replace: true });
    setCanSkip(true);
    setQuestions((prev) => {
      const _questions = [...prev];
      _questions[currentQuestionIndex].selected = selectedAnswer;
      return _questions;
    });
    const msg = {
      role: "user",
      content: `questions you already have asked and user have choosed ones are ${questions.map((e, index) =>
        [`\n${index + 1}) ${e.question}`, `-${e.selected || selectedAnswer}`].join(" ")
      )}\nask different and creative unique questions and options to learn more about recipient`,
    };
    dispatch({ type: AIActionType.SET_MESSAGES, messages: [msg, messages[messages.length - 1]] });
  };

  return pageLoading ? (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded mt-4 active:scale-110 transition-transform duration-300"
      onClick={async () => {
        await callAPI();
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setPageLoading(false);
      }}>
      CALL API
    </button>
  ) : (
    <>
      <div className={`${loading ? "flex" : "hidden"} fixed z-50 inset-0 items-center justify-center bg-gray-500 bg-opacity-75`}>
        <div
          className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-3/4 xl:w-1/2 mx-auto mt-5 text-center p-4 border-1 border-solid bg-white rounded shadow-md">
          <div className="w-full">
            <span className="text-sm w-fit block ml-auto mb-2">{currentQuestionIndex + 1 + " / " + totalQuestionCount}</span>
            <div className="relative h-2 w-full bg-gray-100 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                style={{ width: `${clamp((currentQuestionIndex / totalQuestionCount) * 100, 0, 100)}%` }}></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold mt-8">
            {currentQuestionIndex + 1}) {questions[currentQuestionIndex]?.question}
          </h1>
          <div>
            <ul className="list-none p-0 mt-10 flex flex-wrap justify-center items-center">
              {questions[currentQuestionIndex]?.question != null &&
                questions[currentQuestionIndex]?.options != null &&
                questions[currentQuestionIndex]?.options.map((option, index) => (
                  <li
                    key={index}
                    onClick={(e) => handleOptionClick(e, option)}
                    className="lg:w-40 lg:h-40 hover:scale-110 p-2 text-center bg-gray-100 border-1 border-solid border-gray-300 m-2 cursor-pointer rounded shadow-md transition-all duration-300 select-none hover:bg-gray-300 active:bg-gray-500 flex items-center justify-center">
                    <p className="text-ellipsis overflow-hidden w-full">{option}</p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;
