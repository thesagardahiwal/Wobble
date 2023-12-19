import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
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
        const updatedPost = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savedCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )
        if(!updatedPost) throw Error;
        return updatedPost;

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