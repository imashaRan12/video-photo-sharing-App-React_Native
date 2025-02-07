import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { useVideoPlayer, VideoView } from "expo-video";
import { deleteVideo } from "../lib/appwrite";

const VideoCard = ({
  video: { $id, title, thumbnail, video, creator },
  user,
  onDelete,
}) => {
  const [play, setPlay] = useState(false);
  const player = useVideoPlayer(video, (player) => {
    player.loop = false;
    player.staysActiveInBackground = true;
    player.onEnd = () => setPlay(false);
  });

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
            const success = await deleteVideo($id, video); // Make sure 'video' is the file ID
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

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-star">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-full border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: creator.avatar }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator.username}
            </Text>
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
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

      {play ? (
        <VideoView
          player={player}
          style={{
            width: "100%",
            height: 215,
            borderRadius: 15,
            marginTop: 12, // Equivalent to mt-3
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
          contentFit="cover"
          allowsFullscreen
          allowsPictureInPicture
          startsPictureInPictureAutomatically
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
