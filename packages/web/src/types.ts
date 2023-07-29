interface ICategories {
  name: 'devDependencies' | 'dependencies' | 'root'
}

export const categories: ICategories[] = [
  {
    name: 'devDependencies',
  },
  {
    name: 'dependencies',
  },
  {
    name: 'root',
  },
]
