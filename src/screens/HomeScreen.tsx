import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";

export default function HomeScreen({ navigation }) {
  const { token } = useAuthStore();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mensagem2, setMensagem2] = useState("");

  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskIdEditar, setTaskIdEditar] = useState(null);
  const [taskIdExcluir, setTaskIdExcluir] = useState(null);

  //Carregar Tarefas
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api-laravel-pgsql.onrender.com/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Resposta da API tasks:", response.data); // <-- aqui
      setTasks(response.data);
      setMensagem("");
    } catch (error: any) {
      setMensagem("Não foi possível carregas as tarefas !");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  //Abrir modal editar
  const abrirModalEditar = (task) => {
    setTaskIdEditar(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setModalEditar(true);
  };

  // Salvar edição
  const salvarEdicao = async () => {
    if (!title || !description) {
      setMensagem2("Preencha Todos os Campos !");
      return;
    }
    try {
      await axios.put(
        `https://api-laravel-pgsql.onrender.com/api/tasks/${taskIdEditar}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalEditar(false);
      fetchTasks();
      setMensagem2("");
    } catch {
      setMensagem2("Não foi possível salvar a tarefa");
    }
  };

  // abrir modal exclusão
  const abrirModalExcluir = (id) => {
    setTaskIdExcluir(id);
    setModalExcluir(true);
  };

  // Confirmar exclusão
  const confirmarExcluir = async () => {
    try {
      await axios.delete(
        `https://api-laravel-pgsql.onrender.com/api/tasks/${taskIdExcluir}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalExcluir(false);
      fetchTasks();
    } catch {
      setMensagem2("Não foi possível excluir a tarefa");
    }
  };

  return (
    <View className="flex-1 justify-start items-center p-4 bg-[#121212]">
      <View className="flex flex-row justify-between items-center w-full mb-8">
        <Text className="text-2xl font-bold mt-2 text-[#FFC600]">
          Minhas Tarefas
        </Text>
        <Image
          source={require("../../assets/tkx.png")}
          style={styles.img}
          resizeMode="contain"
        />
      </View>
      fetchTasks
      <TouchableOpacity
        className={`w-[150px] py-2 bg-[#FFC600] rounded-xl border mb-4 border-white ${
          loading ? "bg-[#FFC600" : "bg-[#FFC600]"
        }`}
        onPress={fetchTasks}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className="text-xl italic font-bold text-black text-center">
            Atualizar
          </Text>
        )}
      </TouchableOpacity>
      {mensagem !== "" && (
        <View className="w-full mb-2 px-4">
          <Text className="text-xl italic text-[#FFC600] text-center">
            {mensagem}
          </Text>
        </View>
      )}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={fetchTasks}
        renderItem={({ item }) => (
          <View className="border-2 border-[#FFC600] items-center rounded-xl mb-3 mx-2 p-5 w-[95%] self-center min-w-[300px]">
            <View className="flex-row justify-center items-center mb-3">
              <Text
                className="text-2xl italic font-bold text-center text-[#FFC600] flex-1"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
            </View>
            <Text
              className="text-xl text-white text-justify mb-2"
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>

            <View className="flex flex-row mt-2">
              <TouchableOpacity
                className="bg-[#FFC600] rounded-full p-2 mr-3"
                onPress={() => abrirModalEditar(item)}
              >
                <AntDesign name="edit" size={24} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-[#FF0033] rounded-full p-2 ml-3"
                onPress={() => abrirModalExcluir(item.id)}
              >
                <Feather name="trash-2" size={23} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* Modal de edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditar}
        onRequestClose={() => setModalEditar(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/80">
          <View className="bg-[#121212] rounded-xl p-6 w-[90%] border border-[#FFC600]">
            <View className="flex flex-row justify-between items-center w-full mb-4">
              <Text className="text-xl font-bold text-[#FFC600] ">
                Editar Tarefa
              </Text>
              <Image
                source={require("../../assets/tkx.png")}
                style={styles.img2}
                resizeMode="contain"
              />
            </View>

            {mensagem2 !== "" && (
              <View className="w-full mt-2">
                <Text className="text-xl italic text-[#FFC600]">
                  {mensagem2}
                </Text>
              </View>
            )}

            <TextInput
              className="border border-[#FFC600] text-[#FFC600] rounded-md p-2 mb-3"
              placeholder="Titulo"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="border border-[#FFC600] text-[#FFC600] rounded-md p-2 mb-4"
              placeholder="Descricao"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity
              className="bg-[#FFC600] rounded-md py-2 border-2 border-white"
              onPress={salvarEdicao}
            >
              <Text className="text-black text-center font-bold text-xl">
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal de Excluir */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalExcluir}
        onRequestClose={() => setModalExcluir(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/80">
          <View className="bg-[#121212] border border-[#FFC600] rounded-xl p-6 w-[80%]">
            <Text className="text-lg text-[#FFC600] font-bold mb-4 text-center">
              Deseja realmente excluir esta tarefa?
            </Text>

            <View className="flex flex-row justify-between">
              <TouchableOpacity
                className="bg-[#FFC600]  rounded-md px-4 py-2"
                onPress={() => setModalExcluir(false)}
              >
                <Text className="black">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-red-600 rounded-md px-4 py-2"
                onPress={confirmarExcluir}
              >
                <Text className="text-white">Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        className=" w-[250px] py-2 mb-5 border border-white  rounded bg-[#FFC600]"
        onPress={() => navigation.push("TaskForm")}
      >
        <Text className="text-2xl italic font-bold text-black text-center">
          Nova Tarefa
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 50,
    height: 50,
  },

  img2: {
    width: 35,
    height: 35,
  },
});
