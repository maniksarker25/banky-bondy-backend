import { model, Schema } from "mongoose";
import { IChatGroup } from "./chatGroup.interface";

const chatGroupSchema = new Schema<IChatGroup>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    profile_image: { type: String, default: "" },
    totalAmount: { type: Number, default: 0 },
    totalPoint: { type: Number, default: 0 }
}, { timestamps: true });

const chatGroupModel = model<IChatGroup>("ChatGroup", chatGroupSchema);
export default chatGroupModel;