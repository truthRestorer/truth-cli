import { execa } from 'execa'

execa('pnpm', ['run', 'init'], {
  stdio: 'inherit',
})
