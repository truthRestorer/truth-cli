import type { Relations } from '@truth-cli/shared'

export function genCirculation(relations: Relations) {
  const circulation: { [key: string]: string[] } = {}
  for (const [rootName, rootVal] of Object.entries(relations)) {
    const { devDependencies, dependencies = {} } = rootVal
    const pkgs = Object.assign(dependencies, devDependencies)
    for (const name of Object.keys(pkgs)) {
      if (relations[name]) {
        const { devDependencies, dependencies } = relations[name]
        if (devDependencies?.[rootName] || dependencies?.[rootName]) {
          if (!circulation[rootName])
            circulation[rootName] = [name]
          else
            circulation[rootName].push(name)
        }
      }
    }
  }
  return circulation
}
