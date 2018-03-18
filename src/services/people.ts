import axios from "axios";
import { config } from "../config";

export interface IPerson {
  username: string;
  first: string;
  last: string;
  team: string;
}

export type People = IPerson[];

export async function getAllPeople(): Promise<People> {
  const res = await axios.get(config.HOURS_CSV_URL, {
    auth: {
      username: config.HOURS_CSV_USERNAME,
      password: config.HOURS_CSV_PASSWORD
    }
  });
  console.log(res.data.data)
  return Object.keys(res.data.data).map(username => {
    const data = res.data.data[username][0];
    const [firstname, ...lastname] = data.name.split(" ");
    return {
      username,
      first: firstname,
      last: lastname.join(" "),
      team: data.tribe
    };
  });
}

export async function getPerson(username: string) {
  return (await getAllPeople()).filter(person => username === person.username)[0];
}
