import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { deletePhoto } from "../lib/appwrite";
import { icons } from "../constants";

const PhotoCard = ({
  photo: { $id, title, photo, creator },
  user,
  onDelete,
}) => {
  const [liked, setLiked] = useState(photo.likes?.includes(user.$id));
  // Handle delete confirmation
  const handleDelete = () => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this video?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const success = await deletePhoto($id, photo);
            if (success) {
              Alert.alert("Success", "Post Delete!");
              onDelete?.(); // Call refetch function
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Handle liked/saved videos
  const handleLike = async () => {};

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="w-[46px] h-[46px] rounded-full border border-secondary justify-center items-center p-0.5">
          <Image
            source={{ uri: creator.avatar }}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1 ml-3">
          <Text
            className="text-xs text-gray-100 font-pregular"
            numberOfLines={1}
          >
            {creator.username}
          </Text>
          <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View className="pt-2 pr-5">
          <TouchableOpacity onPress={handleLike}>
            <Image
              source={icons.like}
              className="w-7 h-7"
              resizeMode="contain"
              tintColor={liked ? "red" : "white"}
            />
          </TouchableOpacity>
        </View>
        {user?.$id === creator?.$id && (
          <View className="pt-2">
            <TouchableOpacity onPress={handleDelete}>
              <Image
                source={icons.del}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Image
        source={photo ? { uri: photo } : require("../assets/placeholder.png")}
        className="w-full h-60 rounded-xl mt-3"
        resizeMode="cover"
      />
    </View>
  );
};
export default PhotoCard;
