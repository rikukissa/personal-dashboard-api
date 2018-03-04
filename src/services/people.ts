export const MAX_RETURNED_NAMES = 6

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
  filter?(people: People): People;
}

export const getLikelySuspects = (params: PeopleProps) => {
  const { people, filter } = params;
  const filteredPeople = filter ? filter(people) : inLondon(people);
  return getFullNames(filteredPeople);
}

export const inLondon = 
  (people: People) => 
    getShortList(filterByTribe("London")(people))

export const getFullNames = 
  (people: People) => 
    people.map(p => `${p.first} ${p.last}`)

export const getShortList = 
  (people: People) => 
    people.slice(0, MAX_RETURNED_NAMES)

export const filterByTribe = 
(tribeName: string) => 
  (people: People) => 
    people.filter(p => p.team.includes(tribeName))
