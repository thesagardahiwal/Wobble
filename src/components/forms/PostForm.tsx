
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

import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { Input } from "../ui/input"
import { PostValidation } from "@/lib/validations"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useCreatePostMutaion } from "@/lib/react-query/queriesAndMutations"

type PostFormProps = {
  post?: Models.Document;
}

function PostForm({ post }: PostFormProps) {
  const {mutateAsync: createPost, isPending: isCreating } = useCreatePostMutaion();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post? post?.caption: "",
      file:[],
      location: post? post?.location:"",
      tags: post? post.tags.joint(',') : ''

    },
  })

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    const newPost = await createPost({
      ...values,
      userId: user.id,
    })
    if(!newPost) {
      return (
        toast({title: "Please try again!"})
      )
    }

    navigate('/')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">File Upload</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange = {field.onChange}
                  mediaUrl = {post?.mediaUrl}
                /> 
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Tags</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input"
                placeholder="Art, Expression, Learn"
                {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">

        <Button type="button"
          className="shad-button_primary"
        >Cancel</Button>
        <Button type="submit"
          className="shad-button_primary"
        >Submit</Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm