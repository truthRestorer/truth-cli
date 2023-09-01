import type { Relations } from '@truth-cli/shared'

function getCirculation(relations: Relations, name: string) {
  if (!relations[name])
    return
  const { devDependencies, dependencies = {} } = relations[name]
  const pkgs = Object.assign(dependencies, devDependencies)
  const result = []
  for (const pkg of Object.keys(pkgs)) {
    if (relations[pkg]) {
      const { devDependencies, dependencies } = relations[pkg]
      if (devDependencies?.[name] || dependencies?.[name])
        result.push(pkg)
    }
  }
  return result.length ? result : undefined
}

export function genCirculation(relations: Relations) {
  const circulation: { [key: string]: string[] } = {}
  for (const name of Object.keys(relations)) {
    const cir = getCirculation(relations, name)
    if (cir)
      circulation[name] = cir
  }
  return circulation
}
