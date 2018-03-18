import {
  filterBySimilarName,
  filterByTribe,
  getFullNames,
  getShortList,
  inLondon,
  MAX_RETURNED_NAMES
} from "./people-filter";
import { People } from "./people";

describe("should filter people list correctly", () => {
  it("should return no more than maximum amount of people specified when short list filter applied", () => {
    expect(getShortList(testPeople).length).toEqual(MAX_RETURNED_NAMES);
  });

  it("should get people whose tribe is London", () => {
    const peopleInLondon = filterByTribe("London")(testPeople);
    expect(getFullNames(peopleInLondon)).toEqual([
      "Rob Ace",
      "Hulda Helen",
      "Riku Rouvila",
      "Taco Head"
    ]);
  });

  it("should get people whose tribe is Tammerforce", () => {
    const peopleInTammerforce = filterByTribe("Tammerforce")(testPeople);
    expect(getFullNames(peopleInTammerforce)).toEqual([
      "Tiia Maunu",
      "Ricardo Sanchez"
    ]);
  });
});

describe("should get matching names in a dumb, but expected way", () => {
  it("should get a match map for Rico", () => {
    const namesSimilarToRico = filterBySimilarName(testPeople, "Rico");
    expect(getFullNames(namesSimilarToRico)).toEqual([
      "Ricardo Sanchez",
      "Riku Rouvila",
      "Taco Head"
    ]);
  });

  it("should get suspects for Rico from London only", () => {
    const ricosInLondon = filterBySimilarName(inLondon(testPeople), "Rico");
    expect(getFullNames(ricosInLondon)).toEqual(["Riku Rouvila", "Taco Head"]);
  });
});

const testPeople: People = [
  {
    username: "race",
    first: "Rob",
    last: "Ace",
    team: "1234 - London"
  },
  {
    username: "mbra",
    first: "Matilda",
    last: "Braxton",
    team: "1235 - Subcontractors"
  },
  {
    username: "tmau",
    first: "Tiia",
    last: "Maunu",
    team: "1236 - Tammerforce"
  },
  {
    username: "hulh",
    first: "Hulda",
    last: "Helen",
    team: "1234 - London"
  },
  {
    username: "rrou",
    first: "Riku",
    last: "Rouvila",
    team: "1234 - London"
  },
  {
    username: "rsan",
    first: "Ricardo",
    last: "Sanchez",
    team: "1236 - Tammerforce"
  },
  {
    username: "thea",
    first: "Taco",
    last: "Head",
    team: "1234 - London"
  }
];
