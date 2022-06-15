const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const PTYService = require("./services/PTYService");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:300",
  },
});

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/api/run", require("./routes/api/run"));

app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

const registerTerminalHandlers = require("./socketHandler/fileHandler");

const onConnection = (socket) => {
  registerTerminalHandlers(io, socket);
};

io.on("connection", (socket) => {
  console.log("New User connected", socket.id);

  socket.on("disconnect", (reason) => {
    // console.log("Disconnected Socket: ", socket.id);
    console.log(reason);
  });

  const pty = new PTYService(socket);

  socket.on("input", (input) => {
    pty.write(input);
  });

  onConnection(socket);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});
