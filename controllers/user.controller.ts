import express from 'express';
import usersService from '../services/user.services';
import debug from 'debug';


const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
    async listUsers(req: express.Request, res: express.Response) {
        const users = await usersService.list(100, 0);
        res.status(200).send(users);
    }

    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(req.params.userId);
        res.status(200).send(user);
    }

    async createUser(req: express.Request, res: express.Response) {
        const user = await usersService.create(req.body.username)
        log(user)
        res.status(201).send(user);
    }

    async removeUser(req: express.Request, res: express.Response) {
        log(await usersService.deleteById(req.params.userId));
        res.status(204).send();
    }

}

export default new UsersController();