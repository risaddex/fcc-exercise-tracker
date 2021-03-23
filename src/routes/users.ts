import debug from 'debug'
import express from 'express'
import userControllers from '../controllers/user.controller'
const router = express.Router()

const log = debug('app:user-routes')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post(
  '/exercise/new-user',
  function (req: express.Request, res: express.Response) {
    userControllers.createUser(req, res)
  }
)

router.get('/exercise/users', function (req, res) {
  userControllers.listUsers(req, res)
})

router.post('/exercise/add', function (req, res) {
  userControllers.addExerciseToUser(req, res)
})

router.get('/exercise/log', function (req, res) {
  log(req.query)
  if (Object.keys(req.query).length === 0) {
    res.send({ error: 'missing userId' })
  } else {
    userControllers.getUserLogs(req, res)
  }
})

export default router
