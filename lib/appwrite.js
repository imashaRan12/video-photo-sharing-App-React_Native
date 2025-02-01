import "react-native-url-polyfill/auto";
import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";
import SignUp from "../app/(auth)/sign-up";

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

//destructuring properties
const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  photoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    // Create a new account in Appwrite
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

export const signUp = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

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
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
