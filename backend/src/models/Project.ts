import mongoose, { Document, model, Schema } from "mongoose";

export interface IProject extends Document{
    name:string;
    description:string;
    startDate:Date;
    endDate:Date;
    projectManager:string;
    createdBy:mongoose.Schema.Types.ObjectId; // referencce who is the create this project.
}

const ProjectSchema = new Schema<IProject>({
    name: { type:String, required: true},
    description: { type:String },
    startDate: { type:Date},
    endDate: { type:Date },
    projectManager: { type:String, required: true},
    createdBy:{ type:Schema.Types.ObjectId, ref: 'User', required: true},
}, {timestamps:true});

export default model<IProject>('Project', ProjectSchema);