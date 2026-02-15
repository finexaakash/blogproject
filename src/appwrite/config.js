import conf from "../conf/conf.js"
import { Client, ID, Databases, Storage, Query } from "appwrite";
export class Service{
// LIKE SYSTEM
    async likePost(postId, userId) {
        try {
            return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteLikesCollectionId,
            ID.unique(),
            { postId, userId }
            );
        } catch (error) {
            console.log("Like error:", error);
            throw error;
        }
    }

    async unlikePost(documentId) {
    return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        documentId
    );
    }

    async getLikes(postId) {
    return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        [Query.equal("postId", postId)]
    );
    }

    async getUserLike(postId, userId) {
    return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        [
        Query.equal("postId", postId),
        Query.equal("userId", userId)
        ]
    );
    }

    // here end
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId,authorName}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                    authorName,   
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
        return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug,
            {
                title,
                content,
                featuredImage,
                status, 
            }
        )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                

            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // file upload service
    // CREATE COMMENT
    async addComment(postId, userId, userName, comment) {
    return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentsCollectionId,
        ID.unique(),
        { postId, userId, userName, comment }
    );
    }

    // GET COMMENTS
    async getComments(postId) {
    return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCommentsCollectionId,
        [Query.equal("postId", postId)]
    );
    }

    // DELETE COMMENT
    async deleteComment(commentId) {
    return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentsCollectionId,
        commentId
    );
    }
    // here end

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }
    async likeComment(commentId, userId) {
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCommentLikesCollectionId,
            ID.unique(),
            { commentId, userId }
        );
    }
    async unlikeComment(documentId) {
    return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentLikesCollectionId,
        documentId
    );
    }
    async getCommentLikes(commentId) {
    return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCommentLikesCollectionId,
        [Query.equal("commentId", commentId)]
    );
    }
    async getUserCommentLike(commentId, userId) {
    return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCommentLikesCollectionId,
        [
        Query.equal("commentId", commentId),
        Query.equal("userId", userId),
        ]
    );
    }
    getFilePreview(fileId) {
    return this.bucket.getFileView(
        conf.appwriteBucketId,
        fileId
    );
    }
// profile view
    async getPostsByUser(userId) {
    return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId", userId)]
    );
    }

    // FOLLOW USER
    async followUser(followerId, followingId) {
    return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteFollowsCollectionId,
        ID.unique(),
        { followerId, followingId }
    );
    }

    async unfollowUser(docId) {
    return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteFollowsCollectionId,
        docId
    );
    }

    // CHECK IF ALREADY FOLLOWING
    async getFollowRelation(followerId, followingId) {
    return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteFollowsCollectionId,
        [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId)
        ]
    );
    }

    // FOLLOWERS COUNT (Who follows this user)
    async getFollowersCount(userId) {
    return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteFollowsCollectionId,
        [Query.equal("followingId", userId)]
    );
    }

    // FOLLOWING COUNT (Whom this user follows)
    async getFollowingCount(userId) {
    return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteFollowsCollectionId,
        [Query.equal("followerId", userId)]
    );
    }
}
const service = new Service()
export default service

