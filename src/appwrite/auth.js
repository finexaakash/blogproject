// // import conf from "../conf/conf.js"
// // import { Client, Account, ID } from "appwrite";


// // export class AuthService {
// //     client = new Client();
// //     account;

// //     constructor() {
// //         this.client
// //             .setEndpoint(conf.appwriteUrl)
// //             .setProject(conf.appwriteProjectId)
// //         this.account = new Account(this.client);
            
// //     }

// //     async createAccount({email, password, name}) {
// //         try {
// //             // FIX: Use the correct object syntax for .create()
// //             // const userAccount = await this.account.create({
// //             //     userId: ID.unique(), 
// //             //     email, 
// //             //     password, 
// //             //     name 
// //             // });
// //             await this.account.create(ID.unique(), email, password, name);

// //             if (userAccount) {
// //                 // call another method
// //                 return this.login({email, password});
// //             } else {
// //                return  userAccount;
// //             }
// //         } catch (error) {
// //             throw error;
// //         }
// //     }

// //     async login({email, password}) {
// //   try {
// //     const session = await this.account.createEmailSession(email, password);
// //     if (session) return session;     // Important
// //   } catch (error) {
// //     console.error("Login failed:", error);
// //     return null;
// //   }
// // }

// //     async getCurrentUser() {
// //         try{
// //             return await this.account.get();
// //         }catch(error){ 
// //             console.log("Appwrite serive :: getCurrentUser :: error", error); // Logs 401
// //         }
// //         return null; // App proceeds as if user is logged out
// //     }

// //     async logout() {

// //         try {
// //             await this.account.deleteSessions();
// //         } catch (error) {
// //             console.log("Appwrite serive :: logout :: error", error);
// //         }
// //     }
// // }

// // const authService = new AuthService();

// // export default authService
// import conf from "../conf/conf.js";
// import { Client, Account, ID } from "appwrite";

// export class AuthService {
//     client = new Client();
//     account;

//     constructor() {
//         this.client
//             .setEndpoint(conf.appwriteUrl)          // Example: "https://cloud.appwrite.io/v1"
//             .setProject(conf.appwriteProjectId);    // Your Project ID

//         this.account = new Account(this.client);
//     }

//     // Create Account + Auto Login
//     async createAccount({ email, password, name }) {
//         try {
//             // Correct syntax for create()
//             const userAccount = await this.account.create(
//                 ID.unique(),
//                 email,
//                 password,
//                 name
//             );

//             // Auto login
//             if (userAccount) {
//                 return this.login({ email, password });
//             }

//             return userAccount;
//         } catch (error) {
//             console.error("Create Account Error:", error);
//             throw error;
//         }
//     }

//     // Login
//     async login({ email, password }) {
//         try {
//             const session = await this.account.createEmailPasswordSession(
//                 email,
//                 password
//             );

//             return session;
//         } catch (error) {
//             console.error("Login Error:", error);
//             throw error;
//         }
//     }

//     // Get Current Logged In User
//     // async getCurrentUser() {
//     //     try {
//     //         // Check if session exists
//     //         const session = await this.account.getSession("current");
//     //         if (!session) return null;

//     //         // If session exists, return user object
//     //         return await this.account.get();
//     //     } catch (error) {
//     //         console.error("getCurrentUser Error:", error);
//     //         return null;
//     //     }
//     // }
//     async getCurrentUser() {
//     try {
//         // Session check with safe try
//         let session = null;
//         try {
//             session = await this.account.getSession("current");
//         } catch (err) {
//             return null; // Guest user → stop
//         }

//         if (!session) return null;

//         // Now safely get user
//         try {
//             return await this.account.get();
//         } catch (err) {
//             return null;
//         }

//     } catch (error) {
//         return null;
//     }
// }


//     // Logout
//     async logout() {
//         try {
//             await this.account.deleteSessions();
//             return true;
//         } catch (error) {
//             console.error("Logout Error:", error);
//             return false;
//         }
//     }
// }

// const authService = new AuthService();
// export default authService;
import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)          
            .setProject(conf.appwriteProjectId);    
        this.account = new Account(this.client);
    }
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );

            if (userAccount) {
                return this.login({ email, password });
            }

            return userAccount;
        } catch (error) {
            console.log("Create Account Error:", error);
            throw error;
        }
    }

    
    // Login User
    async login({ email, password }) {
        try {
            const session = await this.account.createEmailPasswordSession(
                email,
                password
            );
            return session;
        } catch (error) {
            console.log("Login Error:", error);
            throw error;
        }
    }

  
    // Get current logged-in user
   
    async getCurrentUser() {
        try {
            // Check if session exists
            let session = null;
            try {
                session = await this.account.getSession("current");
            } catch (err) {
                return null; // Guest user
            }

            if (!session) return null;

            // Fetch user
            return await this.account.get();
        } catch (error) {
            console.log("GetCurrentUser Error:", error);
            return null;
        }
    }

    // ------------------------------
    // Logout
    // ------------------------------
    async logout() {
        try {
            await this.account.deleteSessions();
            return true;
        } catch (error) {
            console.log("Logout Error:", error);
            return false;
        }
    }
}

const authService = new AuthService();
export default authService;
