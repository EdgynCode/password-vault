import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ContextProviders } from "./contexts/ContextProviders";
import {
  LanguageScreen,
  WelcomeScreen,
  GetInfoScreen,
  SignInScreen,
  PINCodeSetup,
  FingerprintSetup,
} from "./screens";
import {
  AddPasswordScreen,
  AddNoteScreen,
  MainScreen,
  NoteViewScreen,
  SettingScreen,
  UserSupportScreen,
} from "./screens/main";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "./contexts/ThemeContext";
import { lightTheme, darkTheme } from "./components/theme";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppMainScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Settings":
              iconName = focused ? "settings" : "settings-outline";
              break;
            case "Support":
              iconName = focused ? "help-circle" : "help-circle-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          display: "flex",
          backgroundColor: colors.background,
        },
        headerStyle: {
          backgroundColor: colors.headerBackground,
        },
        headerTintColor: colors.headerText,
      })}
    >
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
      <Tab.Screen name="Support" component={UserSupportScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const value = await AsyncStorage.getItem("isFirstLaunch");
      if (value === null) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch().catch((error) => {
      console.error("Error checking first launch status", error);
    });
  }, []);

  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem("isFirstLaunch", "false");
      setIsFirstLaunch(false);
    } catch (error) {
      console.error("Error setting first launch flag", error);
    }
  };

  if (isFirstLaunch === null) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ContextProviders>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isFirstLaunch ? "LanguageSelect" : "MainScreen"}
        >
          {isFirstLaunch && (
            <>
              <Stack.Screen
                name="LanguageSelect"
                component={LanguageScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="GetInfo"
                component={GetInfoScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignInScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PINCodeSetup"
                children={(props) => (
                  <PINCodeSetup
                    {...props}
                    handleFinishOnboarding={handleFinishOnboarding}
                  />
                )}
              />
              <Stack.Screen
                name="FingerprintSetup"
                children={(props) => (
                  <FingerprintSetup
                    {...props}
                    handleFinishOnboarding={handleFinishOnboarding}
                  />
                )}
              />
            </>
          )}
          <Stack.Screen
            name="MainScreen"
            component={AppMainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddPasswordScreen"
            component={AddPasswordScreen}
          />
          <Stack.Screen name="AddNoteScreen" component={AddNoteScreen} />
          <Stack.Screen name="NoteViewScreen" component={NoteViewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
