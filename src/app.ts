require('dotenv').config();
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import {createServer} from 'http';
import {Server} from 'socket.io';

import {notFound, errorHandler} from './middlewares';
import api from './api';
import {ClientToServerEvents, ServerToClientEvents} from './interfaces/Socket';
import {updateCode} from './api/controllers/codeController';
import {User} from './interfaces/User';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`${socket.id} user just connected`);
  socket.on('disconnect', () => {
    console.log('user just disconnected');
  });
  socket.on('update', (data) => {
    const userData = data as unknown as User;
    if (updateCode(userData)) {
      socket.broadcast.emit('updateCode', 'true');
    } else {
      socket.broadcast.emit('updateCode', 'false');
    }
  });
});

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

export default httpServer;
