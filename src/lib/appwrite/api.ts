import { ID } from "appwrite";
import { INewUser } from "@/types";
import { account } from "./config";

export async function createUserAccount(user:INewUser) {
    try {
        const newAccount = await account.create (
            ID.unique(),
            user.email,
            user.password,
            user.name
        )
        console.log(newAccount)
        console.log("Try Block")
        return newAccount
    } catch (e) {
        console.log(e)
    }
}