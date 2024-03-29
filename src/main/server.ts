import 'module-alias/register'
import { MongoHelper } from '$/infra/db/mongodb/helpers/mongo-helper'
import env from '$/main/config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const { setupApp } = (await import('./config/app'))
    const app = await setupApp()
    app.listen(env.port, () => {
      console.log(`Server running at http://localhost: ${String(env.port)}`)
    })
  })
  .catch(console.error)
