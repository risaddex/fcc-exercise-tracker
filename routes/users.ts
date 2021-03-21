import express from 'express';
const router = express.Router();
import userControllers from '../controllers/user.controller';

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post(
  '/exercise/new-user',
  function (req: express.Request, res: express.Response) {
    userControllers.createUser(req, res);
  }
);

router.get('/exercice/users', function (req, res) {
  userControllers.listUsers(req, res);
});

export default router;
