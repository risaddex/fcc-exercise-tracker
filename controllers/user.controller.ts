import express from 'express'
import usersService from '../services/user.services'
import debug from 'debug'
import { IExercise } from '../models/types'

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

  async addExerciseToUser(
    req: { body: IExercise },
    res: express.Response
  ) {

    if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.date) || req.body.date.length !== 0) {
      res.send({error: 'Invalid date'})
      return false
    }
    const exercise = await usersService.createEsxercise({
      description: req.body.description,
      userId: req.body.userId,
      duration: req.body.duration,
      date:
        req.body.date.length > 0
          ? new Date(req.body.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
    })
    res.status(201).send(exercise)
  }

  async getUserLogs(req: express.Request, res: express.Response) {
    // @ts-ignore
    const userLogs = await usersService.getUserLogsById(req.query.userId)
    res.send(userLogs)
  }
}

export default new UsersController()
