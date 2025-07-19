import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export default function TaskFormScreen({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const token = useAuthStore((state) => state.token);

  const adicionar = async () => {
    if (!titulo || !descricao) {
      setMensagem("Preencha todos os Campos !");
      return;
    }
    try {
      const response = await axios.post(
        "https://api-laravel-pgsql.onrender.com/api/tasks",
        { title: titulo, description: descricao },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensagem("Tarefa adicionada com sucesso!");
      setTitulo("");
      setDescricao("");

      
    } catch (error: any) {
      console.log("Erro ao adicionar:", error.response?.data || error.message);
      setMensagem("Erro ao Adicionar Tarefa. Verifique os dados ou o token.");
    }
  };

  return (
    <View className="flex-1 justify-start items-center p-4 bg-[#121212]">
      <View className="flex flex-row justify-between items-center w-full mb-8">
        <Text className="text-2xl font-bold mt-2 text-[#FFC600]">
          Adicionar Tarefa
        </Text>
        <Image
          source={require("../../assets/tkx.png")}
          style={styles.img}
          resizeMode="contain"
        />
      </View>

      <TextInput
        placeholder="Tarefa"
        value={titulo}
        onChangeText={setTitulo}
        placeholderTextColor="#FFC600"
        className="border border-[#FFC600] text-[#FFC600] w-full p-2 rounded mb-3"
      />

      <TextInput
        placeholder="Descricao"
        value={descricao}
        onChangeText={setDescricao}
        placeholderTextColor="#FFC600"
        className="border border-[#FFC600] text-[#FFC600] w-full p-2 rounded mb-4"
        multiline
      />

      <TouchableOpacity
        className=" w-[250px] py-2 mt-3 border border-white  rounded bg-[#FFC600]"
        onPress={adicionar}
      >
        <Text className="text-2xl italic font-bold text-black text-center">
          Adicionar
        </Text>
      </TouchableOpacity>

      {mensagem !== "" && (
        <View className="w-full mt-3">
          <Text className="text-xl italic text-[#FFC600] text-center">
            {mensagem}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 50,
    height: 50,
  },
});
