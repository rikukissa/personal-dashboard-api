import { People, IPerson } from "./people";
import { flatten } from "ramda";

export const MAX_RETURNED_NAMES = 6;

export interface IPeopleProps {
  people: People;
  filter?(people: People): People;
}

export const getLikelySuspects = (
  name: string,
  office: string = "London",
  params: IPeopleProps
): IPerson[] => {
  const { people, filter } = params;
  const filteredPeople = filter
    ? filter(people)
    : filterBySimilarName(filterByTribe(office)(people), name);
  return filteredPeople;
};

export const getFullNames = (people: People): string[] =>
  people.map(p => `${p.first} ${p.last}`);

export const getShortList = (people: People): People =>
  people.slice(0, MAX_RETURNED_NAMES);

export const filterByTribe = (tribeName: string) => (people: People) =>
  people.filter(p => p.office.toLowerCase().includes(tribeName.toLowerCase()));

export const removeDuplicates = (items: any[]) =>
  items.filter((element, position, arr) => arr.indexOf(element) === position);

export const filterBySimilarName = (people: People, name: string): People => {
  const syllableMap = getDumbMatchingMap(name);
  const peopleArray: People[] = [];

  syllableMap.forEach(matchFunction => {
    const filteredPeople = people.filter(p => matchFunction(p.first));
    peopleArray.push(filteredPeople);
  });

  return removeDuplicates(flatten(peopleArray));
};

type MatchFunction = (s: string) => boolean

export const getDumbMatchingMap = (name: string): Map<string, MatchFunction> => {
  const map = new Map<string, MatchFunction>();
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
