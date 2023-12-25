import { userRouter } from './user.routes.js';
import { todoRouter } from './todo.routes.js';
import express from 'express';

export const api = express.Router();

api.use('/todos',todoRouter);
api.use('/users',userRouter);