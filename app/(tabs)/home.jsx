import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  console.log(posts);
  return (
    <LinearGradient colors={["#140018", "#3d0148"]} start={{ x: 0.1, y: 0.9 }}>
      <SafeAreaView className="h-full">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
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
                    Imasha
                  </Text>
                </View>
              </View>

              <SearchInput />

              <View className="w-full flex-1 pt-5 pb-8">
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
