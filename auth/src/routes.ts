import { Router, Response, Request } from 'express'
import { saveUser, listUsers, login } from './controller/UserController'

import { auth } from './middlewares/auth'

const routes = Router()

routes.get('/', (request: Request, response: Response) => {
    return response.json({ message: 'oiiii'})
})

routes.post('/session', login)

routes.use(auth)

routes.get('/users', listUsers)
routes.post('/users', saveUser)

export default routes