import axios from "axios";
import { config } from "../config";
import { flatten } from "ramda";

export const MAX_RETURNED_NAMES = 6;

export interface Person {
  username: string;
  first: string;
  last: string;
  team: string;
  competence: string;
  supervisor: string;
  supervisorName: string;
  start: string;
  end?: string;
  active: string;
}

export type People = Person[];

export type PeopleProps = {
  people: People;
  filter?(people: People): People;
};

export async function getPeople(): Promise<People> {
  // TODO use better endpoint for fetching this data
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
      team: data.tribe,
      competence: "",
      supervisor: "",
      supervisorName: "",
      start: "",
      end: "",
      active: "",
      missingHours
    };
  });
}

export async function getPerson(username: string) {
  return (await getPeople()).filter(person => username === person.username)[0];
}

export const getLikelySuspects = (
  name: string,
  params: PeopleProps
): People => {
  const { people, filter } = params;
  const filteredPeople = filter
    ? filter(people)
    : filterBySimilarName(inLondon(people), name);
  return filteredPeople;
};

export const inLondon = (people: People): People =>
  filterByTribe("London")(people);

export const getFullNames = (people: People): string[] =>
  people.map(p => `${p.first} ${p.last}`);

export const getShortList = (people: People): People =>
  people.slice(0, MAX_RETURNED_NAMES);

export const filterByTribe = (tribeName: string) => (people: People) =>
  people.filter(p => p.team.includes(tribeName));

export const removeDuplicates = (items: any[]) =>
  items.filter((element, position, arr) => arr.indexOf(element) == position);

export const filterBySimilarName = (people: People, name: string): People => {
  const syllableMap = getDumbMatchingMap(name);
  const peopleArray: People[] = [];

  syllableMap.forEach(matchFunction => {
    const filteredPeople = people.filter(p => matchFunction(p.first));
    peopleArray.push(filteredPeople);
  });

  return removeDuplicates(flatten(peopleArray));
};

export const getDumbMatchingMap = (name: string): Map<string, Function> => {
  const map = new Map<string, Function>();
  name = name.toLowerCase();

  // Check for exact matches
  map.set(name, (n: string) => n === name);

  // Check for beginning of name matches -- totally ignores names shorter than 3 atm
  const startsWith = (numbersFromBeginning: number) => (n: string) =>
    n.toLowerCase().startsWith(name.substr(0, numbersFromBeginning));

  map.set(name.substr(0, 3), startsWith(3));
  map.set(name.substr(0, 2), startsWith(2));

  // Check for end of name matches -- same problems with name length here #TODO
  const endsWith = (numbersFromEnd: number) => (n: string) =>
    n.toLowerCase().endsWith(name.substr(name.length - numbersFromEnd));

  map.set(name.substr(name.length - 3), endsWith(3));
  map.set(name.substr(name.length - 2), endsWith(2));

  return map;
  // TODO what about repetition in name? Overwrites keys. ex: "riri"
  //      .. maybe this shoudln't be a map
};
