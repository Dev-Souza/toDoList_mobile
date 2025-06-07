import axios from "axios";

const toDoListService = axios.create({
  // baseURL: 'http://10.30.32.84:8080/'
  baseURL: "http://192.168.100.4:8080"
});

export default toDoListService;