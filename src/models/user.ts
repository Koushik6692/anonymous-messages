import mongoose , {Schema , Document} from "mongoose";

export interface Message extends Document {
  _id: string;
  content: string;
  createdAt: Date;
}

const MessageSchema : Schema<Message> = new mongoose.Schema({
  content:{
    type: String,
    required: true
  },
  createdAt:{
    type: Date,
    required:true,
    default: Date.now
  }
})

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode: string;
  verificationCodeExpiry: Date;
  isAcceptingMessages: boolean;
  messages: [Message];
}

const UserSchema : Schema<User> = new mongoose.Schema({
  username:{
    type: String,
    required: [true,"Username is required"],
    unique:true,
    trim: true,
    lowercase: true,
  },
  password:{
    type: String,
    required:[true,"Password is required"],
  },
  email:{
    type: String,
    required: [true,"Email is required"],
    unique:true,
    trim: true,
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  verificationCode:{
   type: String,
   required: [true,"Verification code is required"] 
  },
  verificationCodeExpiry:{
    type:Date,
    required: [true,"Verification code expiry is required"]
  },isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages:[MessageSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User',UserSchema)

export default UserModel