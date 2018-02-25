import axios from "axios";
import { config } from "../config";

export async function getMissingHours(userId: string) {
  const res = await axios.get(config.HOURS_CSV_URL, {
    auth: {
      username: config.HOURS_CSV_USERNAME,
      password: config.HOURS_CSV_PASSWORD
    }
  });

  const userData = res.data.data[userId];
  if (!userData) {
    return null;
  }
  return res.data.data[userId][1].reduce(
    (memo: number, item: { capacity: number }) => memo + item.capacity,
    0
  );
}
