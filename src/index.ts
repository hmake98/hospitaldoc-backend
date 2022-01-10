import { hash } from 'bcrypt';
import { server } from './server'

const PORT = process.env.PORT || 4002;

(async () => {
  const hashedPassword = await hash('admin', 10)
  console.log(hashedPassword);
  
})();
server.listen({ port: PORT }).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`)
})
