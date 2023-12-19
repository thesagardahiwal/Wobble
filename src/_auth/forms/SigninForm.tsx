import { zodResolver } from "@hookform/resolvers/zod"
import { SigninValidation } from "@/lib/validations"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import {useSignInAccountMutation } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
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
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"


export default function SigninForm() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    const {mutateAsync: signInAccount} = useSignInAccountMutation();

    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: { 
            email: "",
            password: ""
        },
    })
    async function onSubmit(values: z.infer<typeof SigninValidation>) {

        if (!signInAccount) {
            return toast({
                title: "SignUp Failed!",
                variant: "destructive"
              })

        }
        const session = await signInAccount({
            email: values.email,
            password: values.password
        })

        const isLoggedIn = await checkAuthUser();
        if (isLoggedIn) {
            form.reset();
            navigate('/');
        } else {
            return toast({title: 'Sign Up Failed, Please try again.', variant: "destructive"})
        }
    }


    return (
<>
    <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" alt="logo" />
            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                Log in to your account
            </h2>
            <p className="text-light-3 small-medium md:base-regular mt-2">
                Welcome back! Please enter your details
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col gap-3 flex w-full mt-4">
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
                    {!isUserLoading? 'Sign in' : (
                        <>
                        <div className="flex-center gap-2">
                        <Loader /> Please wait ...
                        </div>
                        </>
                    )}
                </Button>
            </form>
            <p className="mt-2 text-small-regular text-light-2 text-center">
                Don't have an account?
                <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
            </p>
        </div>
    </Form>
</>
    )
}


