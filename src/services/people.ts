import axios from "axios";
import { config } from "../config";

export interface IPerson {
  username: string;
  first: string;
  last: string;
  office: string;
}

export type People = IPerson[];

export async function getAllPeople(): Promise<People> {
  const res = await axios.get(config.HOURS_CSV_URL, {
    auth: {
      username: config.HOURS_CSV_USERNAME,
      password: config.HOURS_CSV_PASSWORD
    }
  });
  return Object.keys(res.data.data).map(username => {
    const data = res.data.data[username][0];
    const missingHours = res.data.data[username][1].reduce(
      (memo: number, { capacity }: { capacity: number }) => memo + capacity,
      0
    );
    const [firstname, ...lastname] = data.name.split(" ");
    return {
      username,
      first: firstname,
      last: lastname.join(" "),
      office: data.tribe,
      missingHours
    };
  });
}

export async function getPerson(username: string) {
  return (await getAllPeople()).filter(person => username === person.username)[0];
}
