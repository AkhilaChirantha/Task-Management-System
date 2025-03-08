import mongoose, { Document, model, Schema } from "mongoose";

export interface IProject extends Document{
    name:string;
    description:string;
    createdBy:mongoose.Schema.Types.ObjectId; // referencce who is the create this project.
}

const ProjectSchema = new Schema<IProject>({
    name: { type:String, required: true},
    description: { type:String },
    createdBy:{ type:Schema.Types.ObjectId, ref: 'User', required: true},
}, {timestamps:true});

export default model<IProject>('Project', ProjectSchema);