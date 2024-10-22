'use client'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { signInSchema } from "@/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
// import  signIn  from "next-auth/react"

function signInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

const form = useForm<z.infer<typeof signInSchema>>({
  resolver: zodResolver(signInSchema),
  defaultValues:{
    identifier:'',
    password:'',
  }
})
const {toast} = useToast()
const router = useRouter()

const onSubmit = async (data:z.infer<typeof signInSchema>)=>{
  setIsSubmitting(true)
  const result = await signIn('credentials', {
    redirect: false,
    identifier: data.identifier,
    password: data.password,
  });
  console.log(result)
  if(result?.error){
    toast({
      title:"Login Failed",
      description:"Incorrect email or password",
      variant:"destructive"
    })
    setIsSubmitting(false)
  }
  if(result?.url){
    setIsSubmitting(false)
    router.replace("/dashboard") 
  }
  setIsSubmitting(false)
}



  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
          />
      <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        <Button type="submit" disabled={isSubmitting}>
          SignIn
          </Button>
        
      </form>

    </Form>
    <div className="text-center mt-4">
          <p>
            Register
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default signInPage