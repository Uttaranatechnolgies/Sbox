import axios from "axios";

export default axios.create({
  //baseURL: "http://192.168.0.151:4000/api/",
  baseURL: "https://api.sbox.uttarana.com/api/",
  responseType: "json",
});
