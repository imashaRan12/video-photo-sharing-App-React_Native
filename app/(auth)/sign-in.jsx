import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { getCurrentUser, signUp } from "../../lib/appwrite";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (form.email || form.password) {
      Alert.alert("Error", "Please fill in all the fields!");
    }

    setIsSubmitting(true);
    try {
      await signUp(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);

      Alert.alert("Success", "User signed in succesfully!");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={["#140018", "#3d0148"]} start={{ x: 0.1, y: 0.9 }}>
      <SafeAreaView className="h-full">
        <ScrollView>
          <View className="w-full justify-center min-h-[75vh] px-4 my-2">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[140px] h-[75px]"
            />
            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
              Sign In
            </Text>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-8"
              keyboardType="email-address"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-8"
            />

            <CustomButton
              title="Log In"
              handlePress={submit}
              containerStyles="mt-14"
              isLoading={isSubmitting}
            />

            <View className="justify-center pt-10 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-regular">
                Don't have an account?
              </Text>
              <Link
                href="/sign-up"
                className="text-lg font-psemibold text-secondary"
              >
                Sign Up
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignIn;
