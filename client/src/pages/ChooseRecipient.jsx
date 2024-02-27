import React, { useState } from "react";
import { AIActionType } from "../context/AIReducer";
import { useAIStateValue } from "../context/AIStateProvider";
import { useNavigate } from "react-router-dom";

const ChooseRecipient = () => {
  const navigate = useNavigate();
  const [_, dispatch] = useAIStateValue();

  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const options = [
    {
      text: "Father",
      img: "data:image/png;base64,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",
    },
    {
      text: "Mother",
      img: "https://img.freepik.com/premium-vector/mother-child-flat-vector-illustration-mom-baby-children-protection-day-mothers-day_591769-94.jpg",
    },
    {
      text: "Boyfriend",
      img: "https://static.vecteezy.com/system/resources/previews/018/835/037/original/enamored-man-falling-in-love-vector.jpg",
    },
    {
      text: "Girlfriend",
      img: "https://media.istockphoto.com/id/1461457761/vector/a-girl-in-love-the-concept-of-support-and-kindness-in-the-community-a-young-girl-thinks.jpg?s=612x612&w=0&k=20&c=M7rvTLOkSA4NEwtw6a-YiCzI9C0lDV4XNgrSP0sDMwE=",
    },
    {
      text: "Coworker",
      img: "https://www.shutterstock.com/image-vector/employees-coworking-open-office-flat-600nw-1494760418.jpg",
    },
    {
      text: "Yourself",
      img: "https://img.freepik.com/free-vector/high-self-esteem-with-woman-mirror_23-2148731985.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1708646400&semt=ais",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRecipient == null) return alert("Please Select Recipient then Submit Again.");

    dispatch({ type: AIActionType.SET_RECIPIENT, recipient: selectedRecipient });
    navigate("/selection", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col text-xl font-semibold gap-8 w-3/4 xl:w-1/2 bg-white p-8 rounded shadow-md">
        <h1>Who are you buying for?</h1>

        <div className="flex flex-wrap justify-evenly gap-8">
          {options.map((el) => {
            return (
              <div key={el.text}>
                <div
                  onClick={(e) => setSelectedRecipient(el.text)}
                  className={`w-32 aspect-square cursor-pointer rounded ${
                    el.text == selectedRecipient ? "border-2 border-blue-500" : "shadow-md hover:scale-110 duration-300 transition-all"
                  }`}>
                  <img className="h-full pointer-events-none object-cover overflow-hidden object-top" src={el.img} alt="" />
                </div>
                <p className="text-lg font-semibold mt-1">{el.text}</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end">
          <button onClick={handleSubmit} className="w-1/5 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseRecipient;
