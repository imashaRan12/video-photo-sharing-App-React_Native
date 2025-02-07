import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import PhotoCard from "../../components/PhotoCard";
import { useLocalSearchParams } from "expo-router";

const Bookmark = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <LinearGradient colors={["#140018", "#3d0148"]} start={{ x: 0.1, y: 0.9 }}>
      <SafeAreaView className="h-full">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) =>
            item.video ? <VideoCard video={item} /> : <PhotoCard photo={item} />
          }
          ListHeaderComponent={() => (
            <View className="my-6 px-4 pt-5">
              <Text className="font-psemibold text-2xl text-white">
                Saved Videos and Photos
              </Text>

              <View className="mt-6 mt-8">
                <SearchInput />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos and Photos Found"
              subtitle="No videos and photos found for this search query "
            />
          )}
        />
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Bookmark;
