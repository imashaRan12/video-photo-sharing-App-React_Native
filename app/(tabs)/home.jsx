import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import {
  getAllPosts,
  getLatestPosts,
  getAllPhotoPosts,
} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import PhotoCard from "../../components/PhotoCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { data: posts, refetch: refetchPosts } = useAppwrite(() =>
    getAllPosts(5)
  );
  const { data: latestPosts, refetch: refetchLatestPosts } =
    useAppwrite(getLatestPosts);
  const { data: photos, refetch: refetchPhotos } =
    useAppwrite(getAllPhotoPosts);
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchPosts(), refetchLatestPosts(), refetchPhotos()]);
    setRefreshing(false);
  };

  return (
    <LinearGradient colors={["#140018", "#3d0148"]} start={{ x: 0.1, y: 0.9 }}>
      <SafeAreaView className="h-full">
        <FlatList
          data={[...(posts || []), ...(photos || [])].sort(
            (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
          )}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) =>
            item.video ? <VideoCard video={item} /> : <PhotoCard photo={item} />
          }
          ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
              <View className="justify-between items-start flex-row mb-6">
                <View>
                  <Image
                    source={images.logoSmall}
                    className="w-16 h-16"
                    resizeMode="contain"
                  />
                </View>

                <View className="mt-1.5">
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="font-psemibold text-2xl text-white">
                    {user?.username}
                  </Text>
                </View>
              </View>

              <SearchInput />

              <View className="w-full flex-1 pt-6 pb-8">
                <Text className="text-gray-100 text-lg font-pregular mb-3">
                  Latest Videos
                </Text>
                <Trending posts={latestPosts ?? []} />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No videos and Photos Found"
              subtitle="Be the first one to upload a video or photo"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;
