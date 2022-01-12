const request = require("request");

// ------Get data from researchAPI_URL -----------//
const fetchData = (userInput, callback) => {
  const researchAPI_URL = `http://api.wolframalpha.com/v2/query?input=${userInput}&appid=AYXW5J-GKEW2LV46W`;
  request(researchAPI_URL, (error, response, body) => {
    if (error) {
      console.log(error);
    } else {
      if (body) {
        if (
          body.includes("watch") ||
          body.includes("show") ||
          body.includes("television") ||
          body.includes("movie") ||
          body.includes("theater")
        ) {
          callback(null, "watch");
        } else if (
          body.includes("eat") ||
          body.includes("food") ||
          body.includes("restaurant") ||
          body.includes("nutririon")
        ) {
          callback(null, "eat");
        } else if (
          body.includes("buy") ||
          body.includes("store") ||
          body.includes("market") ||
          body.includes("mall") ||
          body.includes("grocery") ||
          body.includes("wholesale")
        ) {
          callback(null, "buy");
        } else if (
          body.includes("read") ||
          body.includes("book") ||
          body.includes("novel") ||
          body.includes("magazine") ||
          body.includes("story")
        ) {
          callback(null, "read");
        } else {
          callback(null, null);
        }
      } else {
        callback("Data not Found", null);
      }
    }
  });
};

module.exports = { fetchData };
