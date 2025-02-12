import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import EmptyState from "../../components/EmptyState";
import { getUserPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import PhotoCard from "../../components/PhotoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const setting = () => {
    router.push("../edit/user");
  };

  const logout = async () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            await signOut();
            setUser(null);
            setIsLoggedIn(false);
            router.replace("/sign-in");
          },
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <LinearGradient colors={["#140018", "#3d0148"]} start={{ x: 0.1, y: 0.9 }}>
      <SafeAreaView className="h-full">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) =>
            item.video ? (
              <VideoCard video={item} onDelete={refetch} user={user} />
            ) : (
              <PhotoCard photo={item} onDelete={refetch} user={user} />
            )
          }
          ListHeaderComponent={() => (
            <View className="w-full justify-center items-center mt-6 mb-12 px-4">
              <View className="w-full flex-row justify-between mb-10">
                <TouchableOpacity onPress={setting}>
                  <Image
                    source={icons.settings}
                    resizeMode="contain"
                    className="w-7 h-7"
                    tintColor="white"
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={logout}>
                  <Image
                    source={icons.logout}
                    resizeMode="contain"
                    className="w-7 h-7"
                    tintColor="white"
                  />
                </TouchableOpacity>
              </View>

              <View className="w-20 h-20 border border-secondary rounded-full justify-center items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-[92%] h-[92%] rounded-full"
                  resizeMode="cover"
                />
              </View>

              <InfoBox
                title={user?.username}
                containerStyles="mt-5"
                titleStyles="text-lg"
              />

              <View className="mt-5 flex-row">
                <InfoBox
                  title={posts.length || 0}
                  subtitle="Posts"
                  containerStyles="mr-10"
                  titleStyles="text-xl"
                />
                <InfoBox
                  title="1.2k"
                  subtitle="Followers"
                  titleStyles="text-xl"
                />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos and Photos Found"
              subtitle="No videos and photos found for this search query "
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

export default Profile;
