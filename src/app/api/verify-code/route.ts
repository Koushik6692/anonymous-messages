import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

export async function POST(request:Request) {
  await dbConnect();
  try {
    const {username,code} = await request.json();
    const decodedUsername = decodeURIComponent(username)

    console.log(decodedUsername)
    const user = await UserModel.findOne({username :decodedUsername});
    if(!user){
      // console.log("User not found");
      
      return Response.json({
        success:false,
        message:"User not found"
      },{status:400})
    }
    const isCodeValid = user.verificationCode = code
    const isCodeNotExpierd = new Date(user.verificationCodeExpiry)> new Date()
    if( isCodeValid && isCodeNotExpierd){
      user.isVerified = true
      await user.save()
      return Response.json({
        success:true,
        message:"Account verified successfully"
      },{status:200})
    }
    else if(!isCodeNotExpierd){
      // console.log("Verification code expired use new code");
      
      return Response.json({
        success:false,
        message:"Verification code expired use new code"
      },{status:400})
    }else{
      // console.log("Invalid  verification code");
      
      return Response.json({
        success:false,
        message:"Invalid  verification code"
      },{status:400})
    }

  } catch (error) {
    console.error("Error while verifying code",error)
  return Response.json(
    {
      message:"Error while checking username",
      success: false,

    },{status: 500})
  } 
}