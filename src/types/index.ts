export type INewUser = {
    name: string;
    username:string;
    email: string;
    password:string;

}

export type IUser = {
    id: string;
    name: string;
    username:string;
    email: string;
    imageUrl:string;
    bio:string;

}

export type IUpdatePost = {
    postId: string;
    captioin: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?:string;

}

export type INewPost = {
    userId: string;
    captioin: string;
    file: File[];
    location?: string;
    tags?:string;

}

export type IUpdateUser = {
    id: string;
    name: string;
    bio:string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
}

export type INavLink = {
    imageUrl: string;
    route: string;
    label: string;
}