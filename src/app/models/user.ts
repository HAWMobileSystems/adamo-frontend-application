

// import { UuidV4Random } from "uuid/v4";

// export class User {
//     private id: number;
//     private username: string;
//     private password: string;
//     private firstName: string;
//     private lastName: string;
// }

export class User {


    constructor() {}

    private uid: string
    private email: String
    private password: string
    private lastlogin: string
    private firstname: string
    private lastname: string
    private profile: string

    public getUid() { return this.uid; } 
}