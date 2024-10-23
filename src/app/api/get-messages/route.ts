import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user";
import mongoose from "mongoose";


export async function GET(request:Request) {
  await dbConnect();
  const session = await getServerSession(authOptions)
  const user = session?.user

  if(!session || !session.user){
    return Response.json({
      message:"user not logged-in",
      success: false
    },{status:400}
    )
  }

  const userId = new mongoose.Types.ObjectId(user._id)
  try {
    // console.log(userId);
    // console.log(user)
    
    const fetchedUser = await UserModel.aggregate([
      {$match: {_id:userId}},
      {$unwind:'$messages' },
      {$sort:{'messages.createdAt':-1}},
      {$group:{_id:'$_id', messages: {$push: '$messages'}}}
    ]).exec();
    console.log(fetchedUser);
    

    if(!fetchedUser || fetchedUser.length ===0){
      return Response.json({
        message:"User not found!",
        success: false
      },{status: 400}
      )
    }
    return Response.json({
      messages: fetchedUser[0].messages,
      success: false
    },{status:200}
    )

    
  } catch (error) {
    console.log("Error while fetching User messages",error);
    return Response.json({
      message:"Error while fetching User messages",
      success: false
    },{status:500}
    )
    
  }
}