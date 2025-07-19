import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TaskFormScreen from "./src/screens/TaskFormScreen";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#facc15",
          headerTitleAlign: "start",
          headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
        }}
        initialRouteName="Login"
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Entrar" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Sair" }}
        />
        <Stack.Screen
          name="TaskForm"
          component={TaskFormScreen}
          options={{ title: "Voltar Para Lista de Tarefas" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
