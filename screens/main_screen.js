import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/core";

const MainScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [canClick, setCanClick] = useState(true);
  const [clickMultiplier, setClickMultiplier] = useState(1);  // Множитель для кликов
  const [autoClickerActive, setAutoClickerActive] = useState(false);  // Статус автокликера
  const autoClickerInterval = useRef(null);  // Используем useRef для хранения ID интервала

  useFocusEffect(
    React.useCallback(() => {
      loadScore();
      loadAutoClickerStatus();
      loadClickMultiplier();
      setCanClick(true);  // Разрешаем клик, когда экран активен

    }, [])
  );

  useEffect(() => {
      if (autoClickerActive) {
        const interval = setInterval(() => {
          const newScore = score + clickMultiplier;
          saveScore(newScore);
        }, 1000); // Автоклик каждую секунду
  
        return () => clearInterval(interval); // Очищаем интервал, когда автокликер выключен
      }
    }, [autoClickerActive, score, clickMultiplier]);

  const loadAutoClickerStatus = async () => {
    try {
      const status = await AsyncStorage.getItem("autoClicker");
      if (status === "true") {
        setAutoClickerActive(true);
      }
    } catch (error) {
      console.error("Ошибка загрузки статуса автокликера", error);
    }
  };


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

  const loadClickMultiplier = async () => {
    try {
      const storedMultiplier = await AsyncStorage.getItem("clickMultiplier");
      if (storedMultiplier !== null) {
        setClickMultiplier(parseInt(storedMultiplier));
      }
    } catch (error) {
      console.error("Ошибка загрузки множителя", error);
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
    if (canClick) {
      const newScore = score + clickMultiplier;  // Увеличиваем очки в зависимости от множителя
      saveScore(newScore);
    }
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Очки: {score}</Text>
      <Text style={styles.scoreText}>Очков за клик: {clickMultiplier}</Text>

      <TouchableOpacity
        style={styles.clickButton}
        onPress={handleClick}
        disabled={!canClick}
      >
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
  autoClickerButton: {
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MainScreen;
