import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAIStateValue } from "../context/AIStateProvider";
import { suggestionPrompt } from "../context/initialAIState";
import SliderCard from "../components/SliderCard";

const Recommendation = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);
  const [images, setImages] = useState([]);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [{ messages, recipient, userInfo, password }, dispatch] = useAIStateValue();

  useEffect(() => {
    setLocalMessages(messages[0].content.match(/(?<=\))\s*(.*?)(?=\d|$)/gm).map((e) => e.trim()));
  }, [messages]);

  const fetchData = async (data) => {
    try {
      const results = await axios({
        url:
          (process.env.REACT_APP_NODE_ENV === "production"
            ? process.env.REACT_APP_PRODUCTION
            : process.env.REACT_APP_LOCAL) + "/scrape",
        data: { password: password, data: data },
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
    }
  };

  const fetchChatAPI = async () => {
    try {
      const results = await axios({
        url:
          (process.env.REACT_APP_NODE_ENV === "production"
            ? process.env.REACT_APP_PRODUCTION
            : process.env.REACT_APP_LOCAL) + "/chatapi",
        data: {
          password: password,
          messages: [
            {
              role: "user",
              content: "Türkçe konuş ve cevap ver " + suggestionPrompt(userInfo, recipient, localMessages),
            },
          ],
          temperature: 0.85,
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
    let response;

    try {
      response = await fetchChatAPI();
    } catch (error) {
      console.log(error);
    }
    if (response) {
      const assistantResponse = JSON.parse(response.choices[0].message.content);
      setGifts(assistantResponse);
      const fetchedData = await fetchData(assistantResponse.hediyeler);
      setResponse(fetchedData);
    }
    setLoading(false);
  };
  const steamImages = async (data) => {
    try {
      const url =
        (process.env.REACT_APP_NODE_ENV === "production"
          ? process.env.REACT_APP_PRODUCTION
          : process.env.REACT_APP_LOCAL) + "/stream-images";

      const queryParams = new URLSearchParams({
        password: password,
        data: JSON.stringify(data),
      });

      const fetchOptions = {
        method: "GET",
        credentials: "include",
      };

      const response = await fetch(url + "?" + queryParams.toString(), fetchOptions);
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              for (const item of chunk.split("\n")) {
                try {
                  controller.enqueue(JSON.parse(item));
                } catch (error) {}
              }
            },
          })
        )
        .pipeTo(
          new WritableStream({
            write(chunk) {
              const currentImg = chunk;
              try {
                setImages((prev) => [...prev, currentImg]);
              } catch (error) {
                console.log("chunk ", chunk, "\nerror ", error);
                setImages((prev) => [...prev, []]);
              }
            },
          })
        );
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(async () => {
    if (localMessages?.length !== 0) {
      await callAPI();
    }
  }, [localMessages]);

  useMemo(async () => {
    if (response?.length !== 0) {
      const streamImage = await steamImages(gifts.hediyeler);
    }
  }, [response]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div
        className={`${
          loading ? "flex" : "hidden"
        } fixed z-50 inset-0 items-center justify-center bg-gray-500 bg-opacity-75`}>
        <div
          className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
      <div className="min-h-full flex items-center justify-center bg-gray-100">
        {/* <button
          className="absolute top-10 left-10 bg-blue-500 text-white px-4 py-2 rounded mt-4 active:scale-110 transition-transform duration-300"
          onClick={async () => {
            await callAPI();
          }}>
          CALL API
        </button> */}
        <div className="w-[90%] xl:w-9/12 mx-auto mt-5 text-center  border-1 border-solid bg-white border-gray-300 rounded shadow-md">
          <h1 className="text-2xl font-bold mt-8">Recommendation</h1>
          <div className="flex p-4 flex-wrap justify-evenly">
            {!loading &&
              gifts?.hediyeler?.map((el, index) => {
                return (
                  response[index].length > 0 && (
                    <SliderCard
                      windowSize={windowSize}
                      images={images.length >= index && images[index]}
                      loading={loading}
                      key={index}
                      name={el?.isim}
                      items={response[index]}
                    />
                  )
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Recommendation;
