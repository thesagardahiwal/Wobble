
import FileUploader from "@/components/shared/FileUploader";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useGetCurrentUser, useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import { UserValidation } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";


function UpdateProfile() {
  const { data: currentUser } = useGetCurrentUser();
  const {mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      name: currentUser? currentUser.name : "",
      bio: currentUser? currentUser.bio? currentUser.bio: "Null" : "",
      file: currentUser? currentUser.file : "",
    },
  });
  async function onSubmit(values: z.infer<typeof UserValidation>){
    if (currentUser) {
      const updatedUser = await updateUser({
        ...values,
        id: currentUser.$id ,
        imageId: currentUser.imageId,
        imageUrl: currentUser.imageUrl.imageUrl,
      });
      if (!updatedUser) {
        toast({
          title: `Update user failed. Please try again.`,
        });
      }
      return navigate(`/profile/${currentUser.$id}`)
    }


  }
  return (
    <div className="container">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Textarea className="shad-input custom-scrollbar" {...field} />
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
              <FormControl className="object-cover"> 
                
                <FileUploader
                  fieldChange = {field.onChange}
                  mediaUrl = {currentUser?.imageUrl}
                /> 
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bio</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">

        <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => (console.log("Clicked"))}>
            Cancel
          </Button>
        <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isUpdating}
            >
            {(isUpdating) && <Loader />}
            Update
          </Button>
        </div>
      </form>
    </Form>
    </div>
  )
}


export default UpdateProfile