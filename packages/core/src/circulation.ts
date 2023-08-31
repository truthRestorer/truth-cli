import type { Relations } from '@truth-cli/shared'

export function getCirculation(relations: Relations, name: string) {
  if (!relations[name])
    return
  const { devDependencies, dependencies = {} } = relations[name]
  const pkgs = Object.assign(dependencies, devDependencies)
  const result = []
  for (const pkg of Object.keys(pkgs)) {
    if (relations[pkg]) {
      const { devDependencies = {}, dependencies } = relations[pkg]
      const relationPkg = Object.assign(devDependencies, dependencies)
      if (Object.keys(relationPkg).includes(name))
        result.push(pkg)
    }
  }
  return result.length ? result : undefined
}

export function genCirculation(relations: Relations) {
  const circulation: { [key: string]: string[] } = {}
  function loadCirculation() {
    for (const name of Object.keys(relations)) {
      const cir = getCirculation(relations, name)
      if (cir)
        circulation[name] = cir
    }
  }
  loadCirculation()
  return circulation
}
