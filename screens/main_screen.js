import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/core";


const MainScreen = ({ navigation }) => {
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

  const handleClick = () => {
    const newScore = score + 1;
    saveScore(newScore);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Очки: {score}</Text>
      <TouchableOpacity style={styles.clickButton} onPress={handleClick}>
        <Text style={styles.buttonText}>Кликни!</Text>
      </TouchableOpacity>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 20,
  },
  clickButton: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MainScreen;
