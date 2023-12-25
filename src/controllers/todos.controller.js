import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {Todos} from "../models/todos.model.js";
import {User} from "../models/users.model.js";


export const httpPostTodo = asyncHandler(async (req,res) => {
    const {username,title,todo,dueDate} = req.body;

    if(!(username && title)) throw new ApiError(400,"Author and Title field are required");

    const registeredUser = await User.findOne({username});

    if(!registeredUser) throw new ApiError(404,"User not registered");

    const Todo = await Todos.create({
        author: registeredUser._id,
        title,
        todo,
        dueDate
    });

    // const createdTodo = await Todo.findById(author._id);
    // const createdTodo = await Todos.findById(Todo._id).populate('author')
    // .select(" -password " "-email" "-updatedAt ");
    const createdTodo = await Todos.findById(Todo._id).populate('author', '-email -_id -password -createdAt -updatedAt -refreshToken -__v');

    if(!createdTodo) throw new ApiError(500,"Something went wrong whilst saving the todos");

    return res.status(201).json(
       new ApiResponse(200,createdTodo,"Todo saved succesfuly Alhumdullillah") 
    );
});

export const httpGetTodos = asyncHandler(async (req,res) => {
    const todos = await Todos.find({author: req.user._id});

    const message = (todos.length > 0)? ("Success"):("You have not set any todos yet. Why not start now and make your day more productive and organized?");

    return res.status(200).json( new ApiResponse(200,todos,message) );
});

export const httpUpdateTodo = asyncHandler(async (req,res) => {
    const {todoId,newTodo,index} = req.body;

    if(!(todoId && newTodo && index !== null || isNaN(index))) throw new ApiError(400,"All fields are required!");
    
    const updatedTodo = await Todos.findById(todoId);
    if(!updatedTodo) throw new ApiError(404, "Todo not found!");

    if(index >= updatedTodo.todo.length || index < 0){ 
        throw new ApiError(400,"Invalid index");
    }

    updatedTodo.todo[index].content = newTodo;
    await updatedTodo.save({validateBeforeSave:false});

    res.status(200).json( new ApiResponse(200,updatedTodo,"Todo Updated Successfuly") )

});

export const httpUpdateTodoTitle = asyncHandler(async (req,res) => {
    const {title,todoId} = req.body;
    
    if(!(title,todoId)) throw new ApiError(400,"All Fields are required!");

    const updatedTodo = await Todos.findByIdAndUpdate(
        todoId,
        {
            $set:{ title }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200,updatedTodo,"Title Updated Successfuly")
        );
});

export const httpToggleTodoTask = asyncHandler(async (req,res) => {
    const {todoId,index} = req.body;

    if(!(todoId,index !== null || isNaN(index))) throw new ApiError(400,"todoId and index are required");
    
    const todo = await Todos.findById(todoId);
    if(!(todo)) throw new ApiError(404,"Todo does not found");

    if(todo.author.toString() !== req.user._id.toString()) throw new ApiError(403,"You are not authorized to mark this todo as completed");

    await todo.markAsCompleted(index);

    res.status(200).json( new ApiResponse(200,{todo},"Marked as true successfully") );
    
});

export const httpDeleteSingleTodo = asyncHandler(async (req,res) => {
    const {todoId} = req.body;

    if(!todoId) throw new ApiError(400,"TodoId is required!");

    const deletedTodo = await Todos.deleteOne( { _id: todoId } );

    return res.status(200).json( new ApiResponse(200,deletedTodo,"Todo Deleted Successfuly") );
});