import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

const todosSchema = mongoose.Schema({
    author:{
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title: {
        type: String,
        required: true
    },
    todo:[
        {
            content:String,
            isCompleted:Boolean,
            index:Number,
        }
    ],
    dueDate: {
        type: Date,
        default: null
    },
},{timestamps:true});

todosSchema.methods.markAsCompleted = function(index){
    if(index <= this.todo.length){
        this.todo[index].isCompleted = true;
        this.save();
    }else{
        throw new ApiError(400,"Invalid index");
    }
}

todosSchema.methods.getProgress = function(){
    let completed = 0;
    for (const task of this.todo) {
        if(task.isCompleted){
            completed++;
        }
    }
    let percentage = (completed/this.todo.length) * 100;
    return percentage;
}

export const Todos = mongoose.model("Todos",todosSchema);