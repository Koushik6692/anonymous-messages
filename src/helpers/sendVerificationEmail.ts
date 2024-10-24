import nodemailer from "nodemailer"
import { ApiResponse } from "@/types/ApiResponse"


export async function sendVerificationEmail(email : string, 
  username: string, 
  verifyCode: string): Promise <ApiResponse>{
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW,
      },
    });
  
    var mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "VERIFICATION-CODE",
      text: `Hello ${username}, your verification code is: ${verifyCode}` ,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
      
      
      return {success:true , message: "Verification code sent successfully!!"}
    } catch (error) {
      console.log("Error while sending verificationcode",error);
      return {success:false , message: "Verification code can't send"}
      
    }
      
}
