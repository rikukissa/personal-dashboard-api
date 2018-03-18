import { flatten } from "ramda";
import {
  getMatchFunctions,
  inTribe,
  prioritizeByTribe,
  removeDuplicates
} from "./people-filter";
import { People } from "./people";

const printNamesAndOffices = (people: People) =>
  people.map(p => `${p.first} ${p.last} (${p.office})`);

describe("basic helper functions", () => {
  it("should figure that '123 London' means the 'London' tribe", () => {
    const tester = testPeople.find(p => p.office === "123 London")!;
    expect(inTribe("London")(tester)).toEqual(true);
  });

  it("should remove duplicates in a list", () => {
    const list = ["a", "c", "b", "c", "c", "e", "e"];
    expect(removeDuplicates(list)).toEqual(["a", "c", "b", "e"]);
  });
});

describe("tribe prioritization", () => {
  it("should prioritize name list by a given tribe", () => {
    const peoplePrioritizedByTammerforce = prioritizeByTribe("Tammerforce")(
      testPeople
    );
    expect(printNamesAndOffices(peoplePrioritizedByTammerforce)).toEqual([
      "Tiia Maunu (Tammerforce)",
      "Ricardo Sanchez (Tammerforce)",
      "Rob Ace (London)",
      "Matilda Braxton (Subcontractors)",
      "Hulda Helen (London)",
      "Riku Rouvila (London)",
      "Rick Hacker (123 London)",
      "Taco Head (London)"
    ]);
  });
});

describe("primitive name matching", () => {
  const ricoMatchFunctions = getMatchFunctions("Rico");

  it('should get names similar to "Rico" from all tribes', () => {
    const peopleArray: People[] = [];
    ricoMatchFunctions.forEach(matchFunction => {
      const similarPeople = testPeople.filter(p => matchFunction(p.first));
      peopleArray.push(similarPeople);
    });
    const ricoMatches = removeDuplicates(flatten(peopleArray));
    expect(printNamesAndOffices(ricoMatches)).toEqual([
      "Ricardo Sanchez (Tammerforce)",
      "Rick Hacker (123 London)",
      "Riku Rouvila (London)",
      "Taco Head (London)"
    ]);
  });

  it('should get names similar to "Rico" prioritized by London', () => {
    const peopleArray: People[] = [];
    ricoMatchFunctions.forEach(matchFunction => {
      const similarPeople = testPeople.filter(p => matchFunction(p.first));
      const londonPeople = prioritizeByTribe("London")(similarPeople);
      peopleArray.push(londonPeople);
    });
    const ricoMatches = removeDuplicates(flatten(peopleArray));
    expect(printNamesAndOffices(ricoMatches)).toEqual([
      "Rick Hacker (123 London)",
      "Ricardo Sanchez (Tammerforce)",
      "Riku Rouvila (London)",
      "Taco Head (London)"
    ]);
  });
});

const testPeople: People = [
  {
    username: "race",
    first: "Rob",
    last: "Ace",
    office: "London"
  },
  {
    username: "mbra",
    first: "Matilda",
    last: "Braxton",
    office: "Subcontractors"
  },
  {
    username: "tmau",
    first: "Tiia",
    last: "Maunu",
    office: "Tammerforce"
  },
  {
    username: "hulh",
    first: "Hulda",
    last: "Helen",
    office: "London"
  },
  {
    username: "rrou",
    first: "Riku",
    last: "Rouvila",
    office: "London"
  },
  {
    username: "rhac",
    first: "Rick",
    last: "Hacker",
    office: "123 London"
  },
  {
    username: "rsan",
    first: "Ricardo",
    last: "Sanchez",
    office: "Tammerforce"
  },
  {
    username: "thea",
    first: "Taco",
    last: "Head",
    office: "London"
  }
];
