import * as AWS from "aws-sdk";
import * as express from "express";
import * as multer from "multer";
import { promisify } from "util";
import { extname } from "path";
import * as cors from "cors";

const bodyParser = multer();
const app = express();

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

app.use(cors());
app.use(bodyParser.single("file"));

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

app.post("/faces", async (req, res) => {
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

app.post("/recognize", async (req, res) => {
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

app.listen(process.env.PORT || 3000);
