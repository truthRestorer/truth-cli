import minimist from "minimist"
const argv = minimist(process.argv.slice(2))

// 开启网页
if(argv['W']) {
  console.log('web')
}

console.log(argv)