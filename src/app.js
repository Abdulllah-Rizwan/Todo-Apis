import { api } from './routes/api.js';
import express from 'express';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//Routes
app.use('/v1',api);
