import { promisify } from "util";
import { extname } from "path";
import * as AWS from "aws-sdk";
import { config } from "../config";

const rekognition = new AWS.Rekognition({
  region: "eu-west-1",
  accessKeyId: config.ACCESS_KEY_ID,
  secretAccessKey: config.SECRET_ACCESS_KEY
});

const s3 = new AWS.S3({
  accessKeyId: config.ACCESS_KEY_ID,
  secretAccessKey: config.SECRET_ACCESS_KEY
});

const deleteObject = promisify(s3.deleteObject.bind(s3));
const upload = promisify(s3.upload.bind(s3));
const indexFaces = promisify(rekognition.indexFaces.bind(rekognition));
const searchFacesByImage = promisify(
  rekognition.searchFacesByImage.bind(rekognition)
);

const UPLOAD_OPTIONS = { partSize: 10 * 1024 * 1024, queueSize: 1 };
const BUCKET_NAME = config.BUCKET_NAME || "";
const COLLECTION_NAME = config.COLLECTION_NAME;

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

export async function indexFace(id: string, image: Express.Multer.File) {
  const filename = await uploadFile(image);
  return indexFaces({
    CollectionId: COLLECTION_NAME,
    DetectionAttributes: [],
    ExternalImageId: id,
    Image: {
      S3Object: {
        Bucket: BUCKET_NAME,
        Name: filename
      }
    }
  });
}
export async function recognize(image: Express.Multer.File) {
  const filename = await uploadFile(image);
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

  await deleteObject({
    Key: filename,
    Bucket: BUCKET_NAME
  });
  return result;
}
