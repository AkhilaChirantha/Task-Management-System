import mongoose,{Document, Schema} from "mongoose";

export interface ITask extends Document{
    title: string,
    description: string,
    status:'To do' | 'In Progress' | 'Done',
    priority : 'Low' | 'Medium' | 'High',
    dueDate: Date,
    assignedTo: mongoose.Schema.Types.ObjectId, //reference to the user model
    createdBy: mongoose.Schema.Types.ObjectId   //reference to the user model

}

const TaskSchema : Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['To do', 'In Progress', 'Done'],
        default: 'To do'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    dueDate: {
        type: Date,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{timestamps: true});


export default mongoose.model<ITask>('Task', TaskSchema);


