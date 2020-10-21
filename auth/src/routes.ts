import { Router, Response, Request } from 'express'
import { saveUser, listUsers, login, forgotPassword } from './controller/UserController'

import { auth } from './middlewares/auth'

const routes = Router()

routes.get('/', (request: Request, response: Response) => {
    return response.json({ message: 'oiiii'})
})

routes.post('/session', login)
routes.post('/users', saveUser)
routes.post('/forgot-password', forgotPassword)

routes.use(auth)

routes.get('/users', listUsers)

export default routes