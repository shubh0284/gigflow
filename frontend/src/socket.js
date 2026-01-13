import { io } from "socket.io-client";

const socket = io("https://gigflow-q5i8.onrender.com/api", {
  withCredentials: true,
  autoConnect: true,
});

export default socket;
