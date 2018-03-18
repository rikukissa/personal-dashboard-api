import {
  filterBySimilarName,
  prioritizeByTribe
} from "./people-filter";
import { People } from "./people";

const printNamesAndOffices = (people: People) =>
  people.map(p => `${p.first} ${p.last} (${p.office})`);

describe("should filter people list correctly", () => {
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
      "Taco Head (London)"
    ]);
  });
});

describe("should get similar names to a given name", () => {
  it('should get names similar to "Rico"', () => {
    const ricos = filterBySimilarName(testPeople, "Rico");
    expect(printNamesAndOffices(ricos)).toEqual([
      "Ricardo Sanchez (Tammerforce)",
      "Riku Rouvila (London)",
      "Taco Head (London)"
    ]);
  });

  it("should get suspects for Rico prioritized by London office", () => {
    const ricos = filterBySimilarName(testPeople, "Rico");
    const ricosWithLondonPriority = prioritizeByTribe("London")(ricos);
    expect(printNamesAndOffices(ricosWithLondonPriority)).toEqual([
      "Riku Rouvila (London)",
      "Taco Head (London)",
      "Ricardo Sanchez (Tammerforce)"
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
