import { model, Schema } from "mongoose";
import { IProjectJoinRequest } from "./projectJoinRequest.interface";

const projectJoinRequestSchema = new Schema<IProjectJoinRequest>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    profile_image: { type: String, default: "" },
    totalAmount: { type: Number, default: 0 },
    totalPoint: { type: Number, default: 0 }
}, { timestamps: true });

const projectJoinRequestModel = model<IProjectJoinRequest>("ProjectJoinRequest", projectJoinRequestSchema);
export default projectJoinRequestModel;