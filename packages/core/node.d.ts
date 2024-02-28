import { Relations } from '@truth-cli/shared'

declare function genBaseRelation(): Relations

declare async function genRelations(): Promise<Relations>
