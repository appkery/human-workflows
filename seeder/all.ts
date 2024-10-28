import { main as childComments } from './childComments'
import { main as comments } from './comments'
import { main as posts } from './posts'
import { main as users } from './users'

async function main() {
  await users()
  await posts()
  await comments()
  // await childComments()
}

main()
  .then(async () => {
    console.log('All inserted successfully')
    process.exit()
  })
  .catch(async err => {
    console.error(err)
    process.exit(1)
  })
