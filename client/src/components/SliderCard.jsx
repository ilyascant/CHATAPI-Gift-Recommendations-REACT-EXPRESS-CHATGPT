import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SliderCard = ({ name, items, images, loading }) => {
  const myRefs = useRef({});

  const sliderRef = useRef(null);

  const CustomPrevArrow = ({ onClick }) => (
    <button className="z-20 absolute left-[10%] -bottom-[15%]" onClick={onClick}>
      Previous
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button className="z-20 absolute right-[10%] -bottom-[15%]" onClick={onClick}>
      Next
    </button>
  );

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };
  return (
    !loading && (
      <div className="relative xl:w-[40%] lg:w-[50%] w-full mt-4 mb-16">
        <h2 className="font-semibold mb-2">{name}</h2>
        <Slider className="px-4" ref={sliderRef} {...settings}>
          {items?.map((item, index) => (
            <div className="relative xs:h-36 h-44 outline-none" key={index}>
              <a
                name={Math.random() * 100}
                ref={(myRefs.current[index] ??= { current: null })}
                className="absolute inset-0 w-full h-full"
                href={item?.link}
                target="_blank"></a>
              <div
                onClick={() => {
                  myRefs.current[index].current.click();
                }}
                className="cursor-pointer relative flex h-full border rounded-lg shadow-md mx-2 overflow-hidden">
                <img src={images?.length >= index ? images[index]?.image : item?.image} alt="" className="z-10 absolute w-full h-full inset-0 object-cover" />
                <div className="w-full h-[30%] z-20 mt-auto backdrop-blur-md bg-black/20">
                  <p className="mb-1 text-white text-sm text-ellipsis overflow-hidden">
                    {(() => {
                      const splitted = item?.title.split(" ");
                      let count = 0;
                      let allCount = 0;
                      let string = splitted.map((el, index) => {
                        allCount += el.length;
                        if (count < 24) {
                          count += el.length;
                          return el;
                        }
                      });
                      string = string.join(" ");
                      if (count < allCount) string += " ...";
                      return string;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    )
  );
};

export default SliderCard;
