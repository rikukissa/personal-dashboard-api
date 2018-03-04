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
  end?: string
  active: string
}

export type People = Person[]

export type PeopleProps = {
  people: People;
  filter?(people: People): string[];
}

export const getLikelySuspects = (params: PeopleProps) => {
  const { people, filter } = params;
  return filter ? filter(people) : inLondon(people);
}

export const inLondon = 
  (people: People) => 
    getFullNames(getShortList(filterByTribe(people)("London")))

export const getShortList = 
  (people: People) => 
    people.slice(0, RETURNED_NAMES_AMOUNT)

export const getFullNames = 
  (people: People) => 
    people.map(p => `${p.first} ${p.last}`)

export const filterByTribe = 
  (people: People) => 
  (tribeName: string) => 
    people.filter(p => p.team.includes(tribeName))