const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL || ""),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID || ""),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID || ""),
  appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID || ""),
  appwriteLikesCollectionId: String(import.meta.env.VITE_APPWRITE_LIKES_COLLECTION_ID),
  appwriteCommentsCollectionId: "comments",
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID || ""),
  cloudinaryCloudName: String(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ""),
  cloudinaryUploadPreset: String(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ""),
  appwriteCommentLikesCollectionId: (import.meta.env.VITE_APPWRITE_COMMENTLIKES_COLLECTION_ID || ""),
  appwriteFollowsCollectionId: (import.meta.env.VITE_APPWRITE_FOLLOWS_COLLECTION_ID || ""),  
};
export default conf;