import express from 'express';

import codeRoute from './routes/codeRoute';
import MessageResponse from '../interfaces/MessageResponse';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'routes: code',
  });
});

router.use('/code', codeRoute);

export default router;
