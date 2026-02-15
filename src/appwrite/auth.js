
import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";
export class AuthService {
    client = new Client();
  account;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      if (userAccount) {
        return this.login({ email, password });
      }
      return userAccount;
    } catch (error) {
      console.log("Create Account Error:", error);
      throw error;}

    }

  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(email, password);

      // 🔥 Force session sync
      await this.account.get();

      return session;
    } catch (error) {
      console.log("Login Error:", error);
      throw error;
    }
  }


  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      return null;
    }
  }
  async updateName(name) {
    try {
      return await this.account.updateName(name);
    } catch (error) {
      console.log("Update Name Error:", error);
      throw error;
    }
  }
  async updatePassword(oldPassword, newPassword) {
    try {
      return await this.account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      console.log("Update Password Error:", error);
      throw error;
    }
  }


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
