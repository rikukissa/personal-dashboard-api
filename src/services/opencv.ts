import { promisify } from "util";
import * as cv from "opencv";

const readImage = promisify(cv.readImage.bind(cv));

export async function detect(image: Buffer) {
  const im = await readImage(image);
  const detectObject = promisify(im.detectObject.bind(im));
  return detectObject(cv.FACE_CASCADE, {});
}
