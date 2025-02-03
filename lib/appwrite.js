import "react-native-url-polyfill/auto";
import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.future-craft",
  projectId: "6797ca46000a2f7ac5e1",
  databaseId: "6797cce3002ac14bae54",
  userCollectionId: "6797cd1a000b1156f683",
  videoCollectionId: "6797cd620016609f8e84",
  photoCollectionId: "6797cdd9002db035c3f7",
  storageId: "6797d19c002bcf901052",
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
      config.videoCollectionId
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
      await databases.listDocuments(config.databaseId, config.photoCollectionId)
    ).documents;
  } catch (error) {
    throw new Error(error);
  }
};
