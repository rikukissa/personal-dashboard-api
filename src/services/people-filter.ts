import { flatten } from "ramda";
import { IPerson, People } from "./people";

export interface IPeopleProps {
  people: People;
  filter?(people: People): People;
}

export const getLikelySuspects = (office: string) => (people: People) => (
  name: string
): IPerson[] => {
  const matchFunctions = getMatchFunctions(name);
  const peopleArray: People[] = [];

  matchFunctions.forEach(matchFunction => {
    const similarlyNamedPeople = people.filter(p => matchFunction(p.first));
    const tribePrioritizedPeople = prioritizeByTribe(office)(
      similarlyNamedPeople
    );
    peopleArray.push(tribePrioritizedPeople);
  });

  return removeDuplicates(flatten(peopleArray));
};

export const inTribe = (tribe: string) => (p: IPerson) =>
  p.office.toLowerCase().includes(tribe.toLowerCase());

export const prioritizeByTribe = (tribeName: string) => (people: People) => {
  if (!tribeName || tribeName.length === 0) {
    return people;
  }
  return people.sort((a, b) => {
    if (inTribe(tribeName)(b)) {
      if (inTribe(tribeName)(a)) {
        return 0;
      }
      return 1;
    }
    return -1;
  });
};

export const removeDuplicates = (items: any[]) =>
  items.filter((element, position, arr) => arr.indexOf(element) === position);

export type MatchFunction = (s: string) => boolean;

export const getMatchFunctions = (name: string): MatchFunction[] => {
  const matches = [];
  name = name.toLowerCase();

  matches.push((n: string) => n.toLowerCase() === name);

  if (name.length >= 3) {
    matches.push(matchWithBeginningOfName(3)(name));
    matches.push(matchWithEndOfName(3)(name));
  }
  matches.push(matchWithBeginningOfName(2)(name));
  matches.push(matchWithEndOfName(2)(name));

  return matches;
};

const matchWithBeginningOfName = (length: number) => (name: string) => {
  return (n: string) => n.toLowerCase().startsWith(name.substr(0, length));
};

const matchWithEndOfName = (length: number) => (name: string) => {
  return (n: string) =>
    n.toLowerCase().endsWith(name.substr(name.length - length));
};
