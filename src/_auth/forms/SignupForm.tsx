import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validations"
import { useState } from "react"
import Loader from "@/components/shared/Loader"
import { Link } from "react-router-dom"
import { createUserAccount } from "@/lib/appwrite/api"


export default function SignupForm() {
    const [isLoading, setIsLoading] = useState(true);
    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: ""
        },
    })
    async function onSubmit(values: z.infer<typeof SignupValidation>) {
        console.log("Handler")
        const newUser = await createUserAccount (values);
        console.log(newUser);
    }

    return (
<>
    <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" alt="logo" />
            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                Create a new account
            </h2>
            <p className="text-light-3 small-medium md:base-regular mt-2">
                To use Wobble, Please enter your details
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col gap-3 flex w-full mt-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type="text"
                                    className="shad-input"
                                    placeholder="eg: Sagar" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input type="text"
                                    className="shad-input"
                                    placeholder="eg: Sagar_07" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email"
                                    className="shad-input"
                                    placeholder="eg: Sagar_07@email.com" {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password"
                                    className="shad-input"
                                    placeholder="eg: 12345@#!" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="btn mt-5 pt-3 bg-blue-600"
                    
                >
                    {isLoading? 'Submit' : (
                        <>
                        <div className="flex-center gap-2">
                        <Loader /> Please wait ...
                        </div>
                        </>
                    )}
                </Button>
            </form>
            <p className="mt-2 text-small-regular text-light-2 text-center">
                Already have an account?
                <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Log In</Link>
            </p>
        </div>
    </Form>
</>
    )
}


