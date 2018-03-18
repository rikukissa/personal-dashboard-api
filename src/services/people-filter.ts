import { People, IPerson } from "./people";
import { flatten } from "ramda";

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
    : prioritizeByTribe(office)(filterBySimilarName(people, name));
  return filteredPeople;
};

export const inTribe = (tribe: string) => (p: IPerson) =>
  p.office.toLowerCase().includes(tribe.toLowerCase());

export const prioritizeByTribe = (tribeName: string) => (people: People) =>
  people.sort((a, b) => {
    if (inTribe(tribeName)(b)) {
      if (inTribe(tribeName)(a)) {
        return 0;
      }
      return 1;
    }
    return -1;
  });

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

type MatchFunction = (s: string) => boolean;

export const getDumbMatchingMap = (
  name: string
): Map<string, MatchFunction> => {
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
