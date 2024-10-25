"use client"
import * as z from "zod"
import axios, { AxiosError } from "axios"
import {useState, useEffect} from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from 'usehooks-ts'
import { ApiResponse } from "@/types/ApiResponse"
import { SignUpSchema } from "@/schemas/signUpSchema"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { set } from "mongoose"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function SignUpPage() {
  const[username , setUsername] = useState('');
  const[usernameMessage,setUsernameMessge] = useState('');
  const[isCheckingUsername, setIsCheckingUsername] = useState(false)
  const[isSubmitting, setIsSubmitting] = useState(false) 
  const debounced = useDebounceCallback(setUsername,500)

  const router = useRouter()
  const {toast} = useToast();

  const form = useForm<z.infer<typeof SignUpSchema>>(
    {
      resolver: zodResolver(SignUpSchema),
      defaultValues: {
      username:'',
      email:'',
      password:'',
      }
   });

   useEffect(()=>{
    const checkUsernameUnique = async()=>{
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessge('')
      }
      try {
        const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
        setUsernameMessge(response.data.message);
      } catch (error) {
        console.error(error);
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessge(axiosError.response?.data.message??'Error checking username')
      }finally{
        setIsCheckingUsername(false)
      }
    }
    checkUsernameUnique();
   },[username])
   
   const onsubmit = async(data:z.infer<typeof SignUpSchema>)=>{
    setIsSubmitting(true)
    try {
      console.log(data)
      const response = await axios.post<ApiResponse>('/api/sign-up',data)

      toast({
        title: 'Sign up successful',
        description: response.data.message,
      })
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    }catch(error){
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
   }


  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Gostly Notes
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
      <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} onChange={(e)=>{
                  field.onChange(e);
                  debounced(e.target.value)
                }}/>
              </FormControl>
              {
                 isCheckingUsername && <Loader2 className="animate-spin"/>
                }
                <p className={`text-sm ${usernameMessage==="Username available" ? 'text-green-500':'text-red-500'}`}>{usernameMessage}</p>
              <FormMessage />
            </FormItem>
          )}
          />
      <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
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
        {
          isSubmitting ? (
            <>
          <Loader2 className="mr-2 w-4 h-4 animate-spin"/> 
          please wait
          </>) : ('SignUp')
        }
          </Button>
        
      </form>

    </Form>
    <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
          </div>
        </div>
      </div>
    </>
  )
}

