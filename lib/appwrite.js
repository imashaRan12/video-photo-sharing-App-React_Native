import "react-native-url-polyfill/auto";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.future-craft",
  projectId: "67a50c760003f8b0f6eb",
  databaseId: "67a50ee30012f4a85b32",
  userCollectionId: "67a50f2c000a3c3bbad9",
  videoCollectionId: "67a50f710005a4f9d3c2",
  photoCollectionId: "67a50f7d001f3dfa3fd2",
  storageId: "67a512310023cdf5c9ee",
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
export const getAllPosts = async (limit = 5) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(limit)]
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

  console.log("FILE", file);

  const uploadedFile = await storage.createFile(
    config.storageId,
    ID.unique(),
    asset
  );

  console.log("UPLOAED", uploadedFile);
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
