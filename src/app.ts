import cors from 'cors';
import debug from 'debug';
import express from 'express';
import * as http from 'http';
import morgan from 'morgan';
import path from 'path';
import usersRouter from './routes/users';


//! MODEL > SERVICE > CONTROLLER > ROUTER > APP
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const debugLog: debug.IDebugger = debug('app:express');
// here we are adding middleware to parse all incoming requests as JSON
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// here we are adding middleware to allow cross-origin requests
app.use(express.static('public'));
app.use(cors());

app.use('/api', usersRouter);

app.get('/', function (req, res, next) {
  res.sendFile('index.html', { root: path.join(__dirname, '../src/views') });
});

server.listen(port, () => {
  debugLog(`Server running at http://localhost:${port}`);
});
