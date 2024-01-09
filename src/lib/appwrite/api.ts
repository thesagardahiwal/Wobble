import { ID, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, database, storage } from "./config";



export async function createUserAccount(user:INewUser) {
    try {
        const newAccount = await account.create (
            ID.unique(),
            user.email,
            user.password,
            user.name
        );
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB ({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        });
        
        return newUser
    } catch (e) {
        console.log(e)
    }
}

export async function saveUserToDB(user:{
    accountId: string,
    email: string,
    name: string,
    imageUrl: URL,
    username?: string
}) {
    try {
        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )

        return newUser;
    } catch (e) {
        console.log(e)
    }
}

export async function signInAccount(user:{
    email: string;
    password: string;
}) {
    try {
        const session = account.createEmailSession(
            user.email,
            user.password
        )
        return session;
    } catch (e) {
        console.log(e)
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        
        if (!currentAccount) throw Error;

        const currentUser = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0]

    }catch (e) {
        console.log(e)
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current')
        return session;
    } catch (e) {
        console.log(e)
    }
}

export async function createPost(post:INewPost) {
    try {
        const uploadedFile = await uploadFile (post.file[0]);

        if(!uploadedFile) throw Error;

        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        const tags = post.tags?.replace(/ /g, "").split(",") || [];
        const newPost = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectinoId,
            ID.unique(),
            {
              creator: post.userId,
              caption: post.caption,
              imageUrl: fileUrl,
              imageId: uploadedFile.$id,
              location: post.location,
              tags: tags,
            }
          );
        if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
        }
    
        return newPost;


    } catch (e) {
        console.log(e)
    }
}

export async function uploadFile (file:File) {
    try {
        const uploadedFile = await storage.createFile (
            appwriteConfig.storageId,
            ID.unique(),
            file
        )
        return uploadedFile;
    }
    catch (e){
        console.log(e)
    }
}

export function getFilePreview (fileId: string) {
    try {
        const fileUrl = storage.getFilePreview (
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
        );
        
        if (!fileId) throw Error;

        return fileUrl;

    } catch (e) {
        console.log(e)
    }
}
export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }

export async function getRecentPosts() {
const post = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectinoId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
)

if (!post) throw Error;

return post;
}

export async function likedPost(postId:string, likesArray: string[]) {
    try {
        const updatedPost = await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectinoId,
            postId,
            {
                likes:likesArray
            }
        )
        if(!updatedPost) throw Error;
        return updatedPost;

    } catch (e) {
        console.log(e)
    }
}


export async function savePost(postId:string, userId: string) {
    try {
        const savedPost = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savedCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )
        if(!savedPost) throw Error;
        return savedPost;

    } catch (e) {
        console.log(e)
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await database.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savedCollectionId,
            savedRecordId
        )
        if(!statusCode) throw Error;
        return {status: 'OK'}; 

    } catch (e) {
        console.log(e)
    }
}


export async function getPostById(postId:string) {
    try {
        const post = await database.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectinoId,
            postId
        )

        if(!post) throw Error;

        return post

    } catch (e) {
        console.log(e)
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;
  
    try {
      let image = {
        imageUrl: post.imageUrl,
        imageId: post.imageId,
      };
  
      if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;
  
        // Get new file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error;
        }
  
        image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      //  Update post
      const updatedPost = await database.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectinoId,
        post.postId,
        {
          caption: post.caption,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
          location: post.location,
          tags: tags,
        }
      );
  
      // Failed to update
      if (!updatedPost) {
        // Delete new file that has been recently uploaded
        if (hasFileToUpdate) {
          await deleteFile(image.imageId);
        }
  
        // If no new file uploaded, just throw error
        throw Error;
      }
  
      // Safely delete old file after successful update
      if (hasFileToUpdate) {
        await deleteFile(post.imageId);
      }
  
      return updatedPost;
    } catch (error) {
      console.log(error);
    }
  }
  

export async function deletePost(postId:string, imageId: string) {

    if( !postId || !imageId ) throw Error;
    try {
        await database.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectinoId,
            postId
        )
        return {'status': 'OK'}

    } catch (e) {
        console.log(e)
    }
}

export async function getInfinitePost({ pageParams }: {pageParams: number}) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]

    if (pageParams) {
        queries.push(Query.cursorAfter(pageParams.toString()));
    }

    try {
        const posts = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectinoId,
            queries
        )

        if (!posts) throw Error;
        return posts;

    } catch (e) {
        console.log(e)
    }
}

export async function searchPost(searchTerm:string) {
    try {
        const posts = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectinoId,
            [Query.search('caption', searchTerm)]
        )

        if(!posts) throw Error;

        return posts;

    } catch (e) {
        console.log(e)
    }
}

export async function getUserById(userId: string) {
    try {
      const user = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
      );
  
      if (!user) throw Error;
  
      return user;
    } catch (error) {
      console.log(error);
    }
  }

export async function getUsers(limit?: number) {
    const queries: any[] = [Query.orderDesc("$createdAt")];

    if (limit) {
        queries.push(Query.limit(limit));
    }

    try {
        const users = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        queries
        );

        if (!users) throw Error;

        return users;
    } catch (error) {
        console.log(error);
    }
}

export async function updateUser (user: IUpdateUser) {
    try {
        const hasFileToUpdate = user.file? user.file.length > 0 : false;
        let image = {
            imageUrl: user.imageUrl,
            imageId: user.imageId,
          };
        
        if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await uploadFile(user.file[0]);
        if (!uploadedFile) throw Error;
    
        // Get new file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }
    
        image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }
        const updatedUser = await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.id,
            {
                name: user.name,
                bio: user.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
              }
        );
        // Failed to update
        if (!updatedUser) {
            // Delete new file that has been recently uploaded
            if (hasFileToUpdate) {
            await deleteFile(image.imageId);
            }
    
            // If no new file uploaded, just throw error
            throw Error;
        }
    
        // Safely delete old file after successful update
        if (hasFileToUpdate) {
            await deleteFile(user.imageId);
        }

        return updatedUser;

    } catch (e) {
        console.log(e);
        console.log("API.ts");
        console.log()
    }
}