import io from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// create a single shared socket instance (singleton)
export const socket = io(SOCKET_URL, {
  transports: ["websocket"], // use websocket directly (faster)
  autoConnect: false, // we will connect manually
});

// helper function to start connection
export const connectSocket = (userId: string) => {
  if (!socket.connected) {
    socket.io.opts.query = { userId }; // attach session id (temporary user id)
    socket.connect();
  }
};

// helper to disconnect
export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};
