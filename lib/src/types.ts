export interface INodes {
  name: string
  id: string
  category: number | null
  value: string
  symbolSize: number | null
}

export interface ILinks {
  relation?: INodes
  source: string
  target: string
}

interface ICategories {
  name: 'dependency' | 'devDependency' | 'root'
}

export const categories: ICategories[] = [
  {
    name: 'dependency',
  },
  {
    name: 'devDependency',
  },
  {
    name: 'root',
  },
]
