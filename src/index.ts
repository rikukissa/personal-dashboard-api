import * as http from "http";
import * as WS from "ws";
import * as express from "express";
import * as multer from "multer";
import * as cors from "cors";
import { indexFace, recognize } from "./services/aws";
import { transform } from "./services/faceapp";
import { detect } from "./services/opencv";
import { config } from "./config";

const app = express();
app.use(cors());
const bodyParser = multer();

app.post("/faces", bodyParser.single("file"), async (req, res) => {
  if (!req.body.id) {
    return res.status(400).send('Missing "id" field');
  }

  try {
    await indexFace(req.body.id, req.file);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }

  res.status(201).send();
});

app.post("/recognize", bodyParser.single("file"), async (req, res) => {
  try {
    const result = await recognize(req.file);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.post("/transform", bodyParser.single("file"), async (req, res) => {
  try {
    const buffer = await transform(req.params.filter || "old", req.file);
    res.status(200).send(buffer.toString("base64"));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/*
 * Websockets
 */

const server = http.createServer(app);
const wss = new WS.Server({ server });

wss.on("connection", function connection(ws) {
  ws.on("error", () => {});
  ws.on("message", async function incoming(message: string) {
    const data = JSON.parse(message);

    const { id, image } = data;

    const buffer = Buffer.from(
      image.replace("data:image/png;base64,", ""),
      "base64"
    );
    try {
      const objects = detect(buffer);

      if (ws.OPEN) {
        ws.send(JSON.stringify({ objects, id }));
      }
    } catch (err) {
      console.log(err);
    }
  });
});

server.listen(config.PORT || 3000, () =>
  console.log("Listening on %d", server.address().port)
);
