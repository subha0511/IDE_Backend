const express = require("express");
const router = express.Router();
const child = require("child_process");
const fs = require("fs");

router.get("/", (req, res) => {
  res.write("welcome\n");
  res.end("wow");
});

// POST - /api/run/python
// req = {content:"python code"}
router.post("/python", async (req, res) => {
  const filename = Date.now().toString();
  const filepath = `./tmp/${filename}.py`;
  try {
    await fs.appendFile(filepath, req.body.content, function (err) {
      if (err) {
        throw err;
      }

      var myREPL = child.spawn("python", [filepath]);

      myREPL.stdout.on("data", function (data) {
        res.write(data);
      });

      myREPL.stdout.on("end", function (data) {
        res.end(data);
      });

      myREPL.stderr.on("data", function (data) {
        res.write(data);
      });

      myREPL.stderr.on("end", function (data) {
        res.end(data);
      });

      myREPL.on("error", async function () {
        await fs.unlink(filepath, function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        });
      });

      myREPL.on("exit", async function () {
        await fs.unlink(filepath, function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
