import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user";

export async function POST(request:Request) {

  await dbConnect()

  const session = await getServerSession(authOptions)

  const user = session?.user
  if(!session || !user){
    return Response.json({
      message:"User not logged-in",
      success: false
    },{status:400}
    )
  }

  const userId = user._id

  const {acceptMessageStatus} = await request.json()

  try {
    const updatedUser =await UserModel.findByIdAndUpdate(userId,{
      isAcceptingMessages: acceptMessageStatus
    }, {new:true})

    if(updatedUser){
      return Response.json({
        message:"Message status updated successfully",
        success: true,
      },{status:200})
    }
    return Response.json({
      message:"failed while updating accpet messages status",
      success: false
    },{status:400}
    )

  } catch (error) {
    console.log("failed while updating accpet messages status")
    return Response.json({
      message:"failed while updating accpet messages status",
      success: false
    },{status:500}
    )

  }

}

export async function GET(request:Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  const user = session?.user

  if(!session || !session.user){
    return Response.json({
      message:"user not logged-in",
      success: false
    },{status:400}
    )
  }

  try {
    const fetchedUser =await UserModel.findById(user?._id)
    if(!fetchedUser){
      return Response.json({
        message:"failed while fetching accpet messages status",
        success: false
      },{status:404
      }
      )
    }
    return Response.json({
      message:"succesfully fetched status",
      success: true,
      isAcceptingMessages: fetchedUser.isAcceptingMessages
    },{status:200}
    )
  } catch (error) {
    console.log("Error while fetching accept status")
    return Response.json({
      message:"failed while fetching accpet messages status",
      success: false
    },{status:500}
    )
  }

}