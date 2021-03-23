import express from 'express'
import usersService from '../services/user.services'
import debug from 'debug'
import { ILogParams } from '../models/types'

const log: debug.IDebugger = debug('app:users-controller')

class UsersController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await usersService.list(100, 0)
    res.status(200).send(users)
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = await usersService.readById(req.params.userId)
    res.status(200).send(user)
  }

  async createUser(req: express.Request, res: express.Response) {
    const user = await usersService.create(req.body.username)
    log(user)
    res.status(201).send(user)
  }

  async removeUser(req: express.Request, res: express.Response) {
    log(await usersService.deleteById(req.params.userId))
    res.status(204).send()
  }

  async addExerciseToUser(req: express.Request, res: express.Response) {
    //? Performs a date validation to keep mongoose format
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(req.body.date) &&
      req.body.date.length !== 0
    ) {
      res.send({ error: 'Invalid date' })
      return false
    }
    const exercise = await usersService.createExercise({
      description: req.body.description,
      userId: req.body.userId,
      duration: req.body.duration,
      date:
        req.body.date.length > 0 ? new Date(req.body.date) : new Date(),
    })
    res.status(201).send(exercise)
  }

  async getUserLogs(
    req: express.Request<{}, {}, {}, ILogParams | any>,
    res: express.Response
  ) {
    log (req.query)
    const QUERY_PARAMS: ILogParams = {
      userId: req?.query.userId,
      from: req.query.from ? new Date(req.query.from) : new Date(0),
      to: req.query.to? new Date(req.query.to) :  new Date(),
      limit: 100,
    }
    log (QUERY_PARAMS)
    const user = await usersService
      .getUserLogsById(QUERY_PARAMS)
      .then((user) => res.send(user))

    return user
  }
}

export default new UsersController()
