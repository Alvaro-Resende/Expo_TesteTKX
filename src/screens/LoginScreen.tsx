import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginScreen({ navigation }) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMenagem] = useState("");
  const { setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !senha) {
      setMenagem("Preencha todos os Campos!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://api-laravel-pgsql.onrender.com/api/login",
        {
          email,
          senha,
        }
      );

      const token = response.data.access_token;
      setToken(token);
      console.log("Token salvo com sucesso:", token);
      navigation.navigate("Home");
    } catch (error: any) {
      if (error.response) {
        setMenagem("Email ou senha inválidos");
      } else {
        setMenagem("Erro de conexão com o servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/truck.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View className="flex-1 justify-start items-center bg-black/65 p-10">
        <Image
          source={require("../../assets/tkx.png")}
          style={styles.img}
          resizeMode="contain"
        />

        <Text className="text-4xl italic font-bold mb-4 text-[#FFC600] mt-2">
          Login
        </Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          autoCapitalize="none"
          placeholderTextColor="#FFC600"
          className="border border-[#FFC600] text-[#FFC600] w-full p-2 rounded mb-3 ]"
        />

        <View className="flex flex-row w-full mb-5 relative">
          <TextInput
            placeholder="Senha"
            secureTextEntry={!senhaVisivel}
            value={senha}
            onChangeText={(text) => setSenha(text.toLowerCase())}
            autoCapitalize="none"
            placeholderTextColor="#FFC600"
            className="border w-full p-2 rounded border-[#FFC600] text-[#FFC600] ]"
          />
          <TouchableOpacity
            onPress={() => setSenhaVisivel(!senhaVisivel)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Feather
              name={senhaVisivel ? "eye-off" : "eye"}
              size={22}
              color="#FFC600"
            />
          </TouchableOpacity>
        </View>

        {mensagem !== "" && (
          <Text className="text-xl italic text-[#FFC600] mb-2">{mensagem}</Text>
        )}

        <TouchableOpacity
          className={`w-[150px] py-2 bg-[#FFC600] rounded-xl border border-white ${
            loading ? "bg-[#FFC600" : "bg-[#FFC600]"
          }`}
          onPress={login}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text className="text-xl italic font-bold text-black text-center">
              Entrar
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 150,
    height: 150,
  },

  background: {
    flex: 1,
    justifyContent: "center",
  },
});
