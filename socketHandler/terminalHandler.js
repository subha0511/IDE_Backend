const os = require("os");

module.exports = (io, socket) => {
  const saveScript = (payload) => {
    console.log(payload);
  };

  socket.on("save script", saveScript);
};
