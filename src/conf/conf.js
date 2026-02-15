const conf = {
  appwriteUrl: import.meta.env.VITE_APPWRITE_URL,
  appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  appwriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,

  // Posts
  appwriteCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,

  // Storage
  appwriteBucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,

  // Likes on Post
  appwriteLikesCollectionId: import.meta.env.VITE_APPWRITE_LIKES_COLLECTION_ID,

  // Comments
  appwriteCommentsCollectionId: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,

  // Comment Likes
  appwriteCommentLikesCollectionId:
    import.meta.env.VITE_APPWRITE_COMMENTLIKES_COLLECTION_ID,

  // Follow System
  appwriteFollowsCollectionId:
    import.meta.env.VITE_APPWRITE_FOLLOWS_COLLECTION_ID,
};

export default conf;
