import { Account, Client, Databases, Avatars, Storage } from "appwrite";


export const appwriteConfig = {
    url: import.meta.env.VITE_APPERITE_URL,
    projectId: import.meta.env.VITE_APPERITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPERITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPERITE_STORAGE_ID,
    userCollectionId: import.meta.env.VITE_APPERITE_USERS_COLLECTION_ID,
    postCollectinoId: import.meta.env.VITE_APPERITE_POSTS_COLLECTION_ID,
    savedCollectionId: import.meta.env.VITE_APPERITE_SAVED_COLLECTION_ID,
    followCollectionId: import.meta.env.VITE_APPERITE_FOLLOW_COLLECTION_ID
}


export const client = new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);


export const account = new Account(client);
export const database = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);