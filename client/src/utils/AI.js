import initialAIState from "../context/initialAIState";

const recipient = initialAIState.recipient;
const shape = JSON.stringify({
  question: `What type of books or authors does your ${recipient} like to read?`,
  options: [
    "Fiction",
    "Non-fiction",
    "Science fiction",
    "Fantasy",
    "Romance",
    "Biographies",
    "History",
    "Thrillers/Mystery",
    "Self-help",
    "Comic books/graphic novels",
    "Classic literature",
    "Poetry",
    "Cookbooks",
    "Doesn't like reading",
  ],
});
const prompt = `You will provide random unique question to guide a person to buy gifts for their ${recipient} format the response as JSON in the example shape of ${shape}`;
const messages = [{ role: "system", content: prompt }];

export const AIData = { recipient, shape, prompt, messages };
