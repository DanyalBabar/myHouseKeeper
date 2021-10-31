import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "api/vi"
    : "https://myhousekeeper-app.herokuapp.com/api/v1";

export default axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json",
  },
});
