import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"
import { ApiError } from "next/dist/server/api-utils";


export async function sendVerificationEmail(email : string, 
  username: string, 
  verifyCode: string): Promise<ApiResponse>{
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Anonymus messages || VerificationCode',
      react: VerificationEmail({username,otp :verifyCode}),
    });
    if(error){
      return {success:false , message:"something went wrong while sending verification code!!"}
    }

    return {success:true , message: "Verification code sent successfully!!"}
    
  } catch (emailError) {
    console.error("Verification code cannot be sent!",emailError)
    return {message:"Verification code cannot be sent!", success:false}
  }
}
