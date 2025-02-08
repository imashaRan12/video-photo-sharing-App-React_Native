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

const User = () => {
  const { user } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const submit = () => {};
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
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, oldPassword: e })}
            otherStyles="mt-8"
          />

          <FormField
            title="New Password"
            value={form.password}
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
