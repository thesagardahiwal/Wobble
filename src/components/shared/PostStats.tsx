
import { useDeleteSavedPostMutation, useGetCurrentUser, useLikePostMutation, useSavePostMutation } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
    post: Models.Document;
    userId: string
}

function PostStats({post, userId}: PostStatsProps) {
    const likesList = post.likes.map((user: Models.Document)=> user.$id)

    
    const [like, setLike] = useState(likesList);
    const [isSave, setIsSave] = useState(false);
    
    const { mutate: likedPost } = useLikePostMutation();
    const { mutate: savedPost, isPending: isSavingPost } = useSavePostMutation();
    const { mutate: deletePost, isPending: isDeletingSaved } = useDeleteSavedPostMutation();
    
    const {data: currentUser } = useGetCurrentUser();
    const savedPostRecord = currentUser?.save.find((record: Models.Document)=> record.post.$id === post.$id);
   
    useEffect(()=>{
        setIsSave(!!savedPostRecord);
    }, [currentUser]) 
    
    
    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        let newLikes = [...like]
        let hasLiked = newLikes.includes(userId)
        if(hasLiked) {
            newLikes = newLikes.filter((id)=> id !== userId);
        } else {
            newLikes.push(userId);
        }
        
        setLike(newLikes);
        likedPost({postId: post.$id, likesArray: newLikes});
    }
    const handleSavedPost = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        
        if (savedPostRecord) {
            setIsSave(false);
            deletePost(savedPostRecord.$id);
            return;
        }

        savedPost({postId: post.$id, userId});
        setIsSave(true);
    }

    
  return (
    <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            <img
                src={checkIsLiked(like, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                width={20}
                height={20}
                onClick={handleLikePost}
                className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{like.length}</p>
        </div>
        <div className="flex gap-2">
            {isSavingPost || isDeletingSaved? <Loader/> :
            <img
                src={isSave ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                width={20}
                height={20}
                onClick={handleSavedPost}
                className="cursor-pointer"
            />
            }
        </div>
    </div>
  )
}

export default PostStats