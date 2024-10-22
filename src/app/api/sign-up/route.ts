import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { log } from "console";

export async function POST(request: Request) {
  await dbConnect()
  try {
    const {username,email,password}=await request.json()
    // console.log(username,email,password)//////////

     const existingUserVerifiedByUserName= await UserModel.findOne({
      username,
      isVerified: true
    })
    console.log(existingUserVerifiedByUserName)

    if(existingUserVerifiedByUserName){
      return  Response.json(
        { success:false,
          message:"UserName already Taken"
        },
        { status:400 }
        )
    }
    const existingUserByEmail = await UserModel.findOne({email});
    let verifyCode = Math.floor(100000 + Math.random()*900000).toString();

    if(existingUserByEmail){
      if(existingUserByEmail.isVerified){
        // console.log("User already exists with this email nd verified");
        
        return Response.json({success: false, message: "User already exists with this email"},{status:400})
      }else{
        const hashedPassword = await bcrypt.hash(password,10)
        existingUserByEmail.password = hashedPassword,
        existingUserByEmail.verificationCode = verifyCode,
        existingUserByEmail.verificationCodeExpiry = new Date(Date.now()+3600000);
        await existingUserByEmail.save()
      }
    }else{
      const hashedPassword = await bcrypt.hash(password,10)
      const expiry = new Date();
      expiry.setHours(expiry.getHours()+1)

      const newUser = new UserModel({
        username,
        email,
        password:hashedPassword,
        verificationCode : verifyCode,
        verificationCodeExpiry: expiry,
        isVerified: false,
        isAcceptingMessages: true,
        messages: []
      })

      await newUser.save();
    }

    //sending verification email
    const emailResponse = await sendVerificationEmail(email,username,verifyCode);

    if(!emailResponse.success){
      // console.log("verification code cant send")
      return Response.json(
        {
          success:false,
          message:  "verification code cant send",
        },
        { status:500 }
      )
    }

    return Response.json({
      success : true,
      message: "User registerd successfully. Please Verify your account"
    },
  {status:201})

  } catch (error) {
    console.error("error registring user",error)
    return Response.json({
      success: false,
      message: "error while regestring user!"
    },
    {
      status:500
    }
  )
  }
}