import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/user";


export async function POST(request:Request) {
  await dbConnect()

  const {username, content} =await request.json()
  try {
    const user = await UserModel.findOne({username})
    if (!user) {
      return Response.json({
        message:"User not found!",
        success: false
      },{status:404}
      )
    }
    // check if user accepting messages
    if(!user.isAcceptingMessages){
      return Response.json({
        message:"User not accepting messages!",
        success: false
      },{status:403}
      )
    }
    const newMessage = {content, createdAt: new Date()}
    user.messages.push(newMessage as Message)
    await user.save()
    return Response.json({
      message:"Message sent successfullyt",
      success: true
    },{status:200}
    )
  } catch (error) {
    console.log("An unexpected message occured",error);
    
    return Response.json({
      message:"Error while sending message",
      success: false
    },{status:500}
    )
  }
}