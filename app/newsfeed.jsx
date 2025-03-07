import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { FIREBASE_APP } from "../lib/firebaseConfig";

const FIRESTORE_DB = getFirestore(FIREBASE_APP);

const Newsfeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const newsCollection = collection(FIRESTORE_DB, "news");
      const newsSnapshot = await getDocs(newsCollection);
      const newsList = newsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNews(newsList);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <LinearGradient
      colors={["#140018", "#3d0148"]}
      start={{ x: 0.1, y: 0.9 }}
      className="h-full"
    >
      <SafeAreaView className="h-full">
        <ScrollView className="px-4 my-6 w-full max-w-lg">
          <View className="justify-center items-center mt-6 mb-6 px-4">
            <Text className="text-2xl text-white font-psemibold">
              News Feed 📰
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            news.map((item) => (
              <View key={item.id} className="mb-6 p-4 rounded-lg shadow-lg">
                <Text className="text-xl text-white font-bold mt-2 mb-3">
                  {item.title}
                </Text>
                <Image
                  source={{ uri: item.image_url }}
                  className="w-full h-60 rounded-lg"
                />
                <Text className="text-gray-300 mt-2">{item.details}</Text>
              </View>
            ))
          )}
        </ScrollView>
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Newsfeed;
