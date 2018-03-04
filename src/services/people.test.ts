import { filterPeople, People } from './people'

describe('should filter people list correctly', () => {
  it('should get londoners', () => {
    expect(filterPeople(testPeople)).toEqual(
      [
        "Rob Ace",
        "Hulda Helen",
        "Riku Rouvila",
        "Taco Head"
      ]
    )
  })
})

const testPeople: People = [
  {
    username: "race",
    first: "Rob",
    last: "Ace",
    team: "1234 - London",
    competence: "Developer (Primary)",
    supervisor: "race",
    supervisorName: "Rob Ace",
    start: "2014-01-01",
    active: "Active"
  },
  {
    username: "mbra",
    first: "Matilda",
    last: "Braxton",
    team: "1235 - Subcontractors",
    competence: "Sub contractors (Primary)",
    supervisor: "race",
    supervisorName: "Rob Ace",
    start: "2016-07-01",
    end: "2016-12-31",
    active: "Passive"
  },
  {
    username: "tmau",
    first: "Tiia",
    last: "Maunu",
    team: "1236 - Tammerforce",
    competence: "Designer (Primary)",
    supervisor: "race",
    supervisorName: "Rob Ace",
    start: "2016-07-05",
    active: "Active"
  },
  {
    username: "hulh",
    first: "Hulda",
    last: "Helen",
    team: "1234 - London",
    competence: "Developer (Primary)",
    supervisor: "race",
    supervisorName: "Rob Ace",
    start: "2014-01-01",
    active: "Active"
  },
  {
    username: "rrou",
    first: "Riku",
    last: "Rouvila",
    team: "1234 - London",
    competence: "Developer (Primary)",
    supervisor: "race",
    supervisorName: "Rob Ace",
    start: "2014-01-01",
    active: "Active"
  },
  {
    username: "rsan",
    first: "Ricardo",
    last: "Sanchez",
    team: "1236 - Tammerforce",
    competence: "Developer (Primary)",
    supervisor: "race",
    supervisorName: "Rob Ace",
    start: "2014-01-01",
    active: "Active"
  },
  {
    username: "thea",
    first: "Taco",
    last: "Head",
    team: "1234 - London",
    competence: "Designer (Primary)",
    supervisor: "race",
    supervisorName: "Rob Ace",
    start: "2014-01-01",
    active: "Active"
  }
]