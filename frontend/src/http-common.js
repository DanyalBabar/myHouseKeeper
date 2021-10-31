import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://myhousekeeper-app.herokuapp.com/api/v1"
    : "http://localhost:5000/api/v1";

export default axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json",
  },
});
