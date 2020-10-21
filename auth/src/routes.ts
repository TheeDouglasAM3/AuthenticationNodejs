import { Router, Response, Request } from 'express'
import { saveUser } from './controller/UserController'

const routes = Router()

routes.get('/', (request: Request, response: Response) => {
    return response.json({ message: 'oiiii'})
})

routes.post('/users', saveUser)

export default routes