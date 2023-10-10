import express from 'express';
import {getCode} from '../controllers/codeController';

const router = express.Router();

// TODO: Add auth middleware
router.route('/').get(getCode);

export default router;
