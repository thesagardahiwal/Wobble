import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite";



function Saved() {
  
  const {data: currentUser} = useGetCurrentUser();
  const posts = currentUser?.save.map((savedPost: Models.Document)=>({
    ...savedPost.post,
    creator: {
      imageUrl: currentUser.imageUrl,
    },
  }))


  return (
    <div className='saved-container'>
      <div className='saved-inner_container'>
      <h2 className="h3-bold md:h2-bold w-full">Saved Posts</h2>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {!currentUser?  <Loader />
        : <GridPostList posts={posts} showStats={false} />
        }
        {!(posts == null) && (<p className='text-light-4 mt-50 text-center w-full'>No Result Found</p>)}
      </div>
    </div>
  )
}

export default Saved