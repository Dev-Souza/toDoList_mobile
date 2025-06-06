import axios from "axios";

const toDoListService = axios.create({
    baseURL: 'http://localhost:8080/'
});

export default toDoListService;