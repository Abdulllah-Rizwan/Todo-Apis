import cookieParser from 'cookie-parser';
import { api } from './routes/api.js';
import express from 'express';
import helmet from 'helmet';


export const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());

//Routes
app.use('/v1',api);
