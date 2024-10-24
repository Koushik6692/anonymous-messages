import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/user";

export async function DELETE(request:Request,{params}:{params:{messageId:string}}){
  const {messageId} = params
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
    const resopone =await UserModel.updateOne({_id:user._id},
      {$pull:{messages:{_id:messageId}}})
    if(resopone.modifiedCount==0){
      return Response.json({
        message:"Message not found ",
        success: false
      },{status:404}
      )
    }
    return Response.json({
      message:"Message deleted successfully",
      success: true
    },{status:200}
    )
  } catch (error) {
    console.log("Error deleting message",error);
    
    return Response.json({
      message:"Error deleting message",
      success: false
    },{status:500}
    )
  }

}