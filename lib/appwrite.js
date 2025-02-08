import "react-native-url-polyfill/auto";
import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_VIDEO_COLLECTION_ID,
  APPWRITE_PHOTO_COLLECTION_ID,
  APPWRITE_STORAGE_ID,
} from "@env";

export const config = {
  platform: "com.jsm.future-craft",
  endpoint: APPWRITE_ENDPOINT,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  userCollectionId: APPWRITE_USER_COLLECTION_ID,
  videoCollectionId: APPWRITE_VIDEO_COLLECTION_ID,
  photoCollectionId: APPWRITE_PHOTO_COLLECTION_ID,
  storageId: APPWRITE_STORAGE_ID,
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Account creation failed");

    // Generate an avatar URL
    const avatarUrl = avatars.getInitials(username);

    // Create a user document in the database
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username, // Include the username field
        avatar: avatarUrl,
      }
    );

    // Create a session for the user
    const session = await account.createEmailPasswordSession(email, password);

    return { newUser, session };
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

// Sign In User
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

//sign out the user
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

// Get all video Posts
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

// Get latest created video posts
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

// Get video and photo posts that matches search query
export const searchPosts = async (query) => {
  try {
    const videoPosts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.contains("title", query)]
    );

    const photoPosts = await databases.listDocuments(
      config.databaseId,
      config.photoCollectionId,
      [Query.contains("title", query)]
    );

    return [...videoPosts.documents, ...photoPosts.documents];
  } catch (error) {
    throw new Error(error);
  }
};

// Get video and photo posts created by user
export const getUserPosts = async (userId) => {
  try {
    const videoPosts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    const photoPosts = await databases.listDocuments(
      config.databaseId,
      config.photoCollectionId,
      [Query.equal("creator", userId)]
    );

    return [...videoPosts.documents, ...photoPosts.documents];
  } catch (error) {
    throw new Error(error);
  }
};

// Get all photo Posts
export const getAllPhotoPosts = async () => {
  try {
    return (
      await databases.listDocuments(
        config.databaseId,
        config.photoCollectionId,
        [Query.orderDesc("$createdAt")]
      )
    ).documents;
  } catch (error) {
    throw new Error(error);
  }
};

// Get File Preview
export const getFilePreview = async (fileId, type) => {
  try {
    if (type === "video") {
      return storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      // Reduce image size to 500x500 instead of 2000x2000
      return storage.getFilePreview(config.storageId, fileId, 500, 500);
    } else {
      throw new Error("Invalid file type");
    }
  } catch (error) {
    throw new Error(error);
  }
};

// Upload File
export const uploadFile = async (file, type) => {
  if (!file) return;

  const getFileName = (uri) => uri.split("/").pop();

  const { mimeType, ...rest } = file;
  const asset = {
    name: getFileName(file.uri),
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  const uploadedFile = await storage.createFile(
    config.storageId,
    ID.unique(),
    asset
  );

  return getFilePreview(uploadedFile.$id, type);
};

// Create Video Post
export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};

// Create Photo Post
export const createPhoto = async (form) => {
  try {
    const [photoUrl] = await Promise.all([uploadFile(form.photo, "image")]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.photoCollectionId,
      ID.unique(),
      {
        title: form.title,
        photo: photoUrl,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};

// Delete Video Post
export const deleteVideo = async (videoId, videoUrl) => {
  try {
    // Delete photo from database
    await databases.deleteDocument(
      config.databaseId,
      config.videoCollectionId,
      videoId
    );

    // Extract fileId correctly
    const urlParts = videoUrl.split("/files/");
    if (urlParts.length < 2) {
      console.warn("Invalid file URL format.");
      return false;
    }

    let fileId = urlParts[1].split("/")[0]; // Extract file ID correctly

    if (fileId) {
      await storage.deleteFile(config.storageId, fileId);
    } else {
      console.warn("File ID not found in the URL.");
    }
    return true;
  } catch (error) {
    console.error("Error deleting video:", error.message);
    return false;
  }
};

// Delete Photo Post
export const deletePhoto = async (photoId, photoUrl) => {
  try {
    // Delete photo from database
    await databases.deleteDocument(
      config.databaseId,
      config.photoCollectionId,
      photoId
    );

    // Extract fileId correctly
    const urlParts = photoUrl.split("/files/");
    if (urlParts.length < 2) {
      console.warn("Invalid file URL format.");
      return false;
    }

    let fileId = urlParts[1].split("/")[0]; // Extract file ID correctly

    if (fileId) {
      await storage.deleteFile(config.storageId, fileId);
    } else {
      console.warn("File ID not found in the URL.");
    }
    return true;
  } catch (error) {
    console.error("Error deleting photo:", error.message);
    return false;
  }
};

// Like a Post (Add/Remove Like)
export const toggleLikePost = async (postId, userId) => {
  try {
    // Fetch the current post
    const post = await databases.getDocument(
      config.databaseId,
      config.videoCollectionId, // Change to photoCollectionId if needed
      postId
    );

    let updatedLikes = post.likes || [];

    if (updatedLikes.includes(userId)) {
      // Unlike: Remove userId from likes array
      updatedLikes = updatedLikes.filter((id) => id !== userId);
    } else {
      // Like: Add userId to likes array
      updatedLikes.push(userId);
    }

    // Update the post
    await databases.updateDocument(
      config.databaseId,
      config.videoCollectionId, // Change to photoCollectionId if needed
      postId,
      { likes: updatedLikes }
    );
    console.log("Liking post with ID:", postId);
    return updatedLikes;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

// Fetch Liked Posts by Current User
export const getLikedPosts = async (userId) => {
  try {
    const likedVideos = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.contains("likes", userId)]
    );

    const likedPhotos = await databases.listDocuments(
      config.databaseId,
      config.photoCollectionId,
      [Query.contains("likes", userId)]
    );

    return [...likedVideos.documents, ...likedPhotos.documents];
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    throw error;
  }
};
