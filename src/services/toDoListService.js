import axios from "axios";

const toDoListService = axios.create({
  // baseURL: 'http://10.30.32.84:8080/' IESB
  // baseURL: "http://192.168.100.4:8080" CASA
  baseURL: "http://192.168.1.128:8080" // Trabalho
});

export default toDoListService;