import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/core";

const upgrades = [
  { id: "1", name: "Больше очков за клик", cost: 10 },
  { id: "2", name: "Автокликер", cost: 50 },
  { id: "3", name: "Снижение стоимости улучшений", cost: 100 },
];

const ShopScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      loadScore();
    }, []) 
  );

  const loadScore = async () => {
    try {
      const storedScore = await AsyncStorage.getItem("score");
      if (storedScore !== null) {
        setScore(parseInt(storedScore));
      }
    } catch (error) {
      console.error("Ошибка загрузки очков", error);
    }
  };

  const saveScore = async (newScore) => {
    try {
      await AsyncStorage.setItem("score", newScore.toString());
      setScore(newScore);
    } catch (error) {
      console.error("Ошибка сохранения очков", error);
    }
  };

  const handlePurchase = (cost) => {
    if (score >= cost) {
      const newScore = score - cost;
      saveScore(newScore);
      alert("Улучшение куплено!");
    } else {
      alert("Недостаточно очков!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Магазин</Text>
      <Text style={styles.score}>Очки: {score}</Text>
      <FlatList
        data={upgrades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.button} onPress={() => handlePurchase(item.cost)}>
            <Text style={styles.buttonText}>{item.name} - {item.cost} очков</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  score: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ShopScreen;
