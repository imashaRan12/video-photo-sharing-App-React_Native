import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { icons } from "../../constants";
import { router } from "expo-router";
import { createPhoto } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const CreatePic = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    photo: null,
  });

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, photo: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (!form.title || !form.photo) {
      return Alert.alert("Please fill in all the fields");
    }

    setUploading(true);

    try {
      await createPhoto({
        ...form,
        userId: user.$id,
      });
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({ title: "", photo: null });
      setUploading(false);
    }
  };

  return (
    <LinearGradient colors={["#140018", "#3d0148"]} start={{ x: 0.1, y: 0.9 }}>
      <SafeAreaView className="h-full">
        <ScrollView className="px-4 my-6 w-full max-w-lg">
          <Text className="text-2xl text-white font-psemibold">
            Upload Photo
          </Text>

          <FormField
            title="Photo Title"
            value={form.title}
            placeholder="Give your image a catch title..."
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyles="mt-10"
          />

          <View className="mt-7 space-y-2">
            <Text className="text-base text-gray-100 font-pmedium">
              Upload Photo
            </Text>

            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.photo ? (
                <Image
                  source={{ uri: form.photo.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-60 px-4 bg-violet-900 rounded-2xl justify-center items-center border-2 border-violet-700">
                  <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                      tintColor="gray"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Submit & Publish"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={uploading}
          />
        </ScrollView>
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CreatePic;
