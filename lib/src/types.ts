export interface INodes {
  name: string
  id: string
  category: number
  version: string
}

export interface ILinks {
  relation?: INodes
  source: string
  target: string
}

interface ICategories {
  name: 'dependencies' | 'devDependencies' | 'root' | 'yourself'
}

export const categories: ICategories[] = [
  {
    name: 'dependencies',
  },
  {
    name: 'devDependencies',
  },
  {
    name: 'root',
  },
  {
    name: 'yourself',
  },
]
