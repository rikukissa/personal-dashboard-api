import * as faceapp from "faceapp";

export function transform(filter: string, image: Express.Multer.File) {
  return faceapp.process(image.buffer, filter || "old");
}
