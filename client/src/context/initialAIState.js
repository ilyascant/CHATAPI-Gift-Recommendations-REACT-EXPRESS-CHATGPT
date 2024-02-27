const recipient = null;
const shape = JSON.stringify({
  question: `What type of experience would your recipient prefer for their gift`,
  options: [
    "Adventurous Escapade",
    "Culinary Delight",
    "Pampering Spa Day",
    "Artistic Endeavors",
    "Tech and Gadgets",
    "Travel and Getaway",
    "Mind and Body Wellness",
    "Learning and Development",
  ],
});
const prompt = `You will present a unique and random question that will guide someone in purchasing a gift for their recipient appropriate for their age, which is linked to previous questions you have asked but still randomize it. format the response as JSON. Use this ${shape} as example, change questions and options`;
export const suggestionPrompt = (_userInfo, _recipient, _localMessages) =>
  `Hello! I am a ${_userInfo.userAge}-year-old ${_userInfo.userGender}. My budget for a gift is from $${_userInfo.userBudgets[0]} to $${
    _userInfo.userBudgets[1]
  }. I want to buy a gift for my ${_recipient.recipientAge}-year-old ${
    _recipient.recipientGender
  }. Here are the questions I asked, along with the options ${_recipient} chose in JSON format:\n${JSON.stringify(
    _localMessages
  )}.\n\nI would like you to suggest gift names and gift ideas from Trendyol.com for my ${_recipient}. Feel free to think outside the box and suggest items that go beyond the given options. Please provide between ${
    _localMessages.length * 1.5
  } - ${parseInt(
    _localMessages.length * 2.5,
    10
  )} gift names with their exact names and average prices. Your response should be in the following format:\n${JSON.stringify([
    {
      hediyeler: [
        {
          isim: "Harry Potter Kitap",
          "ortalama fiyat": 30,
        },
      ],
    },
  ])}.\n\nand in TURKISH`;

const messages = [{ role: "system", content: prompt }];
const userInfo = {
  userGender: null,
  userAge: null,
  userBudgets: [null],
  recipientGender: null,
  recipientAge: null,
};

export default {
  recipient: recipient,
  messages: messages,
  userInfo: userInfo,
  password: null,
};
