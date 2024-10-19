import {z} from "zod"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/user"
import { usernameSchema } from "@/schemas/signUpSchema"
import { log } from "console"

const usernameQueySchema = z.object({
  username: usernameSchema
})

export async function GET(request:Request) {
  await dbConnect()
try {
    const {searchParams} = new URL(request.url)
    const queryParam = {
      username: searchParams.get('username')
    }
    //validation with zod
    const res = usernameQueySchema.safeParse(queryParam)
    console.log(res);
    

    if(!res.success){
      const error = res.error.format().username?._errors || []
      return Response.json({
        success: false,
        message: error?.length>0 ?error.join(','):"Invalid username"
      },{status:400})
    }

    const {username} = res.data
    
      const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

      if(existingVerifiedUser){
        return Response.json({
          success: false,
          message: "Username already exists"
        },{status:400})
      }
      return Response.json({
        success: true,
        message: "Username available"
      },{status:200})

} catch (error) {
  console.error("Error while checking unique",error)
  return Response.json(
    {
      message:"Error while checking username",
      success: false,

    },{status: 500}
  )

  }
}



