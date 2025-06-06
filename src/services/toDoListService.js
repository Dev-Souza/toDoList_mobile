import axios from "axios";

const toDoListService = axios.create({
    baseURL: 'http://192.168.1.128:8080/'
});

export default toDoListService;