import express from 'express'
import usersService from '../services/user.services'
import debug from 'debug'
import { ILogParams, IExerciseParams } from '../models/types'

const log: debug.IDebugger = debug('app:users-controller')

const dateFormatter: (date: Date) => string = (date) => {
  const dateFormatter = new Intl.DateTimeFormat('en-Us', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'short',
    weekday: 'short',
    year: 'numeric',
  })

  return dateFormatter.format(date).replace(/,/g, '')
}

class UsersController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await usersService.list()
    res.status(200).send(users)
  }

  async createUser(req: express.Request, res: express.Response) {
    if (!req.body.username) {
      res.sendStatus(400)
      return
    }

    await usersService
      .create(req.body.username)
      .then(({ _id, username }) => {
        res.status(200).send({
          _id,
          username,
        })
      })
      .catch((err) => {
        log(err)
        res.status(400).json({
          error: 'username already taken',
        })
      })
  }

  async addExerciseToUser(req: express.Request, res: express.Response) {
    const { body }: { body: IExerciseParams } = req
    //? Performs a date validation to keep mongoose format

    if (!body.userId) {
      res.sendStatus(400)
      return
    }

    if (body.duration <= 0 || body?.description?.length === 0) {
      res.status(403).send({ error: 'Invalid parameter types' })

      return
    }

    // if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date) && body?.date?.length !== 0) {
    //   res.status(403).send({ error: 'Invalid date' })
    //   return false
    // }
    const { description, duration, userId } = body
    const timeDate =
      body.date && body?.date?.length > 0
        ? dateFormatter(new Date(body.date))
        : dateFormatter(new Date())

    await usersService
      .createExercise({
        description,
        userId,
        duration,
        date: timeDate,
      })
      .then(({ _id, username }) => {
        res.status(200).send({
          _id,
          username,
          description,
          duration: Number(duration),
          date: timeDate,
        })
      })
      .catch((err) => {
        log(err)
        res.status(400).send({ error: 'invalid parameters' })
      })
  }

  async getUserLogs(
    req: express.Request<{}, {}, {}, ILogParams | any>,
    res: express.Response
  ) {
    log(req.query)
    const QUERY_PARAMS: ILogParams = {
      userId: req?.query.userId,
      from: req.query.from ? new Date(req.query.from) : new Date(0),
      to: req.query.to ? new Date(req.query.to) : new Date(),
      limit: req.query.limit ? req.query.limit : 100,
    }
    log(QUERY_PARAMS)
    await usersService
      .getUserLogsById(QUERY_PARAMS)
      .then((user) => {
        log(user)

        const logs = user.exercises?.filter(
          (exercise) =>
            new Date(exercise.date) >= QUERY_PARAMS.from &&
            new Date(exercise.date) <= QUERY_PARAMS.to
        )
        res.status(200).send({
          _id: user._id,
          username: user.username,
          count: logs?.slice(0, QUERY_PARAMS.limit).length,
          log: logs?.slice(0, QUERY_PARAMS.limit),
        })
      })
      .catch((error) => {
        log(error)
      })
  }
}

export default new UsersController()
