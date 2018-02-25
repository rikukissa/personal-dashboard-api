import * as http from "http";
import { promisify } from "util";
import { extname } from "path";
import * as cv from "opencv";
import * as WS from "ws";
import * as AWS from "aws-sdk";
import * as express from "express";
import * as multer from "multer";
import * as cors from "cors";
import * as faceapp from "faceapp";

const app = express();
app.use(cors());
const bodyParser = multer();

const rekognition = new AWS.Rekognition({
  region: "eu-west-1",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const deleteObject = promisify(s3.deleteObject.bind(s3));
const upload = promisify(s3.upload.bind(s3));
const indexFaces = promisify(rekognition.indexFaces.bind(rekognition));
const searchFacesByImage = promisify(
  rekognition.searchFacesByImage.bind(rekognition)
);

const UPLOAD_OPTIONS = { partSize: 10 * 1024 * 1024, queueSize: 1 };
const BUCKET_NAME = process.env.BUCKET_NAME || "";
const COLLECTION_NAME = process.env.COLLECTION_NAME;

async function uploadFile(file: Express.Multer.File) {
  const filename = `${Date.now()}${extname(file.originalname)}`;
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: file.buffer
  };
  await upload(uploadParams, UPLOAD_OPTIONS);
  return filename;
}

app.post("/faces", bodyParser.single("file"), async (req, res) => {
  if (!req.body.id) {
    return res.status(400).send('Missing "id" field');
  }

  try {
    const filename = await uploadFile(req.file);
    await indexFaces({
      CollectionId: COLLECTION_NAME,
      DetectionAttributes: [],
      ExternalImageId: req.body.id,
      Image: {
        S3Object: {
          Bucket: BUCKET_NAME,
          Name: filename
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }

  res.status(201).send();
});

app.post("/recognize", bodyParser.single("file"), async (req, res) => {
  try {
    const filename = await uploadFile(req.file);
    const result = await searchFacesByImage({
      CollectionId: COLLECTION_NAME,
      FaceMatchThreshold: 95,
      Image: {
        S3Object: {
          Bucket: BUCKET_NAME,
          Name: filename
        }
      },
      MaxFaces: 5
    });
    if (result.FaceMatches.length === 0) {
      await deleteObject({
        Key: filename,
        Bucket: BUCKET_NAME
      });
    }

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.post("/transform", bodyParser.single("file"), async (req, res) => {
  try {
    const buffer = await faceapp.process(
      req.file.buffer,
      req.params.filter || "old"
    );
    res.status(200).send(buffer.toString("base64"));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

const readImage = promisify(cv.readImage.bind(cv));

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
      const im = await readImage(buffer);
      if (im.width() < 1 || im.height() < 1) {
        console.log("empty");

        throw new Error("Image has no size");
      }

      const detectObject = promisify(im.detectObject.bind(im));
      const objects = await detectObject(cv.FACE_CASCADE, {});

      if (ws.OPEN) {
        ws.send(JSON.stringify({ objects, id }));
      }
    } catch (err) {
      console.log(err);
    }
  });
});

server.listen(process.env.PORT || 3000, () =>
  console.log("Listening on %d", server.address().port)
);
