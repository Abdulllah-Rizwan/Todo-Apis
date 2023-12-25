import { 
    httpPostTodo,
    httpGetTodos,
    httpUpdateTodo,
    httpToggleTodoTask,
    httpUpdateTodoTitle,
    httpDeleteSingleTodo
} from '../controllers/todos.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import express from 'express';


export const todoRouter = express.Router();

todoRouter.patch('/update-todoTitle',verifyJWT,httpUpdateTodoTitle);
todoRouter.post('/delete-todo',verifyJWT,httpDeleteSingleTodo);
todoRouter.patch('/toggle-task',verifyJWT,httpToggleTodoTask);
todoRouter.patch('/update-todo',verifyJWT,httpUpdateTodo);
todoRouter.post('/',verifyJWT,httpPostTodo);
todoRouter.get('/',verifyJWT,httpGetTodos);