import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View, Image } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";

export default function RootLayout() {
  return (
    <LinearGradient colors={["#140018", "#3d0148"]} start={{ x: 0.1, y: 0.9 }}>
      <SafeAreaView className="h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full justify-center items-center min-h-[85vh] px-2">
            <Image
              source={images.onboarding}
              className="max-w-[500px] w-full h-[310px]"
            />
            <View className="relative mt-10">
              <Text className="text-5xl text-white font-bold text-left px-8 tracking-wider">
                Discover a{"\n"}World Where Creativity Meets Innovation{"\n"}
                With
                {"\n"}
                <Text className="text-secondary-200">
                  FUTURE{" "}
                  <Text className="font-semibold text-cyan-500">CRAFT</Text>
                </Text>
              </Text>
            </View>

            <CustomButton
              title="Continue with Email"
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-[92%] mt-12"
            />
          </View>
        </ScrollView>

        <StatusBar backgroundColor="#161622" style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
}
