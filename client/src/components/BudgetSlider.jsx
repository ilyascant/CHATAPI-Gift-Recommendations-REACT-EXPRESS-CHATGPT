import React, { useState } from "react";
import Slider from "react-slider";

const BudgetSlider = ({ budgets, setBudgets }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState([]);

  const handleChange = (value, index) => {
    setBudgets(value);
    const handle = document.querySelector(`.horizontal-slider .slider-handle-${index}`);
    if (handle) {
      const rect = handle.getBoundingClientRect();
      setTooltipPosition([rect.left + rect.width / 2, rect.top - 5]);
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full">
      <Slider
        className="horizontal-slider h-2 w-full flex items-center"
        thumbClassName="bg-blue-500 h-4 w-4 rounded-[50%] slider-handle"
        trackClassName="bg-gray-200 h-full rounded-md"
        min={0}
        max={1_000}
        step={5}
        value={budgets}
        onChange={handleChange}
        onBeforeChange={handleChange}
        onAfterChange={() => setTimeout(() => setActiveIndex(-1), 500)}
      />
      {activeIndex !== -1 && (
        <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-full" style={{ left: tooltipPosition[0], top: tooltipPosition[1] }}>
          <div className="bg-gray-800 text-white px-2 py-1 rounded">{budgets[activeIndex]}$</div>
        </div>
      )}
    </div>
  );
};

export default BudgetSlider;
