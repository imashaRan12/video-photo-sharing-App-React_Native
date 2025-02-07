import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { deletePost } from "../lib/appwrite";
import { icons } from "../constants";

const PhotoCard = ({
  photo: {
    title,
    photo,
    creator: { username, avatar },
  },
}) => {
  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="w-[46px] h-[46px] rounded-full border border-secondary justify-center items-center p-0.5">
          <Image
            source={{ uri: avatar }}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1 ml-3">
          <Text
            className="text-xs text-gray-100 font-pregular"
            numberOfLines={1}
          >
            {username}
          </Text>
          <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View className="pt-2">
          <TouchableOpacity>
            <Image
              source={icons.menu}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
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
