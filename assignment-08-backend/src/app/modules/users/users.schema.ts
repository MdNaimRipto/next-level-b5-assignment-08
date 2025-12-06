import { model, Schema } from "mongoose";
import { IUser } from "./users.interface";
import bcrypt from "bcrypt";
import config from "../../../config/config";
import { AccountStatusEnums, RoleEnums } from "./user.constant";

export const usersSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    profileImage: {
      type: String,
      required: true,
      default: "https://i.ibb.co/dcHVrp8/User-Profile-PNG-Image.png",
    },
    password: { type: String, required: true },
    location: { type: String, required: true, default: "Not Updated Yet!" },
    activeStatus: { type: Boolean, required: true, default: true },
    role: {
      type: String,
      enum: RoleEnums,
      required: true,
    },
    bio: { type: String, required: true, default: "Not Updated Yet!" },
    interests: [{ type: String, required: true, default: [] }],
    ratingAvg: { type: Number, required: true, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, required: true, default: 0, min: 0 },
    accountStatus: {
      type: String,
      enum: AccountStatusEnums,
      required: true,
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

usersSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.salt_round));
  next();
});

export const Users = model<IUser>("Users", usersSchema);
