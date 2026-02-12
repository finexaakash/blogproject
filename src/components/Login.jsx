import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import {Button, Input, Logo} from "./index"
import {useDispatch} from "react-redux"
import authService from "../appwrite/auth"
import {useForm} from "react-hook-form"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")

    const login = async(data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(authLogin(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div
    className='flex items-center justify-center w-full'
    >
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)} className='mt-8'>
            <div className='space-y-5'>
                <Input
                label="Email: "
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                    required: true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
                })}
                />
                <Input
                label="Password: "
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                    required: true,
                })}
                />
                <Button
                type="submit"
                className="w-full"
                >Sign in</Button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default Login
// import conf from "../conf/conf.js";
// import { Client, Account, ID } from "appwrite";

// export class AuthService {
//     client = new Client();
//     account;

//     constructor() {
//         this.client
//             .setEndpoint(conf.appwriteUrl)          // Example: https://fra.cloud.appwrite.io/v1
//             .setProject(conf.appwriteProjectId);    // Your Project ID

//         this.account = new Account(this.client);
//     }

//     // ------------------------------
//     // Create Account + Auto Login
//     // ------------------------------
//     async createAccount({ email, password, name }) {
//         try {
//             const userAccount = await this.account.create(
//                 ID.unique(),
//                 email,
//                 password,
//                 name
//             );

//             if (userAccount) {
//                 return this.login({ email, password });
//             }

//             return userAccount;
//         } catch (error) {
//             console.log("Create Account Error:", error);
//             throw error;
//         }
//     }

//     // ------------------------------
//     // Login User
//     // ------------------------------
//     async login({ email, password }) {
//         try {
//             const session = await this.account.createEmailPasswordSession(
//                 email,
//                 password
//             );
//             return session;
//         } catch (error) {
//             console.log("Login Error:", error);
//             throw error;
//         }
//     }

//     // ------------------------------
//     // Get current logged-in user
//     // ------------------------------
//     async getCurrentUser() {
//         try {
//             // Check if session exists
//             let session = null;
//             try {
//                 session = await this.account.getSession("current");
//             } catch (err) {
//                 return null; // Guest user
//             }

//             if (!session) return null;

//             // Fetch user
//             return await this.account.get();
//         } catch (error) {
//             console.log("GetCurrentUser Error:", error);
//             return null;
//         }
//     }

//     // ------------------------------
//     // Logout
//     // ------------------------------
//     async logout() {
//         try {
//             await this.account.deleteSessions();
//             return true;
//         } catch (error) {
//             console.log("Logout Error:", error);
//             return false;
//         }
//     }
// }

// const authService = new AuthService();
// export default authService;
