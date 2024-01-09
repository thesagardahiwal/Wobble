import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'
import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite';


function LikedPosts() {
  const { data: currentUser } = useGetCurrentUser();
  const posts = currentUser?.liked.map((LikedPosts: Models.Document)=>({
    ...LikedPosts,
    creator: {
      imageUrl: currentUser.imageUrl,
    }
  })) 
  return (
    <div className='liked-container'>
      
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {!currentUser?  <Loader />
        : <GridPostList posts={posts} showStats={false} />
        }
        {!(posts == null) && (<p className='text-light-4 mt-50 text-center w-full'>No Result Found</p>)}
      </div>
    </div>
  )
}

export default LikedPosts