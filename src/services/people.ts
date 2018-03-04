const RETURNED_NAMES_AMOUNT = 6

export interface Person {
  username: string 
  first: string 
  last: string 
  team: string 
  competence: string
  supervisor: string 
  supervisorName: string 
  start: string 
  active: string 
}

export function getPeople() {
  const peopleList: Person[] = require('./peopleList.json');

  return peopleList
    .filter(byTribe('London')) // Hardcoding ftw
    .map(getFullName)
    .slice(0, RETURNED_NAMES_AMOUNT);
}

const getFullName = (p: Person) => `${p.first} ${p.last}`

const byTribe = (tribeName: string) => (p: Person) => p.team.includes(tribeName)