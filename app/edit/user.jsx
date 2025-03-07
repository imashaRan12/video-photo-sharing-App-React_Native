import { View, Text, Image, Alert, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../../context/GlobalProvider";
import InfoBox from "../../components/InfoBox";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import { router } from "expo-router";
import { updateUser, updatePassword } from "../../lib/appwrite";

const User = () => {
  const { user } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const submit = async () => {
    setIsSubmitting(true);

    try {
      // console.log("User ID for update:", user?.$id); // Ensure this is correct
      if (!user?.$id) {
        Alert.alert("Error", "User document ID not found.");
        setIsSubmitting(false);
        return;
      }

      if (
        !form.username &&
        !form.email &&
        !form.oldPassword &&
        !form.newPassword
      ) {
        Alert.alert("Error", "Please update at least one field.");
        setIsSubmitting(false);
        return;
      }

      // Update only changed fields
      await updateUser(
        user.$id,
        form.username || user.username,
        form.email || user.email
      );

      //Validate and update password
      if (form.oldPassword && form.newPassword) {
        const passwordUpdated = await updatePassword(
          form.oldPassword,
          form.newPassword
        );
        if (!passwordUpdated) {
          Alert.alert("Error", "Old password is incorrect.");
          setIsSubmitting(false);
          return;
        }
      }

      Alert.alert("Success", "User details updated successfully.");
      router.push("/profile"); // Redirect after update
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={["#140018", "#3d0148"]} start={{ x: 0.1, y: 0.9 }}>
      <SafeAreaView className="h-full">
        <ScrollView className="px-4 my-6 w-full max-w-lg">
          <View className="justify-center items-center mt-6 mb-6 px-4">
            <Text className="text-2xl text-white font-psemibold">
              Edit User Account Settings
            </Text>
            <View className="w-20 h-20 border border-secondary rounded-full justify-center items-center mt-5">
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
          </View>
          <FormField
            title="Username"
            value={form.username}
            placeholder={user?.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
          />

          <FormField
            title="Email"
            value={form.email}
            placeholder={user?.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-8"
            keyboardType="email-address"
          />

          <FormField
            title="Old Password"
            value={form.oldPassword}
            handleChangeText={(e) => setForm({ ...form, oldPassword: e })}
            otherStyles="mt-8"
          />

          <FormField
            title="New Password"
            value={form.newPassword}
            handleChangeText={(e) => setForm({ ...form, newPassword: e })}
            otherStyles="mt-8"
          />

          <CustomButton
            title="Save"
            handlePress={submit}
            containerStyles="mt-14"
            isLoading={isSubmitting}
          />
        </ScrollView>
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default User;
