import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/core";

const upgrades = [
  { id: "1", name: "Больше очков за клик", cost: 10, effect: "increaseClick" },
  { id: "2", name: "Автокликер", cost: 50, effect: "autoClick" },
  { id: "3", name: "Снижение стоимости улучшений", cost: 100, effect: "discount" },
];

const ShopScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [clickMultiplier, setClickMultiplier] = useState(1); // Множитель для очков за клик
  const [purchasedUpgrades, setPurchasedUpgrades] = useState({});
  const [autoClickerActive, setAutoClickerActive] = useState(false);
  const [discountActive, setDiscountActive] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadScore();
      loadClickMultiplier();
      loadPurchasedUpgrades();
      loadAutoClickerStatus();
      loadDiscountStatus();
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

  const loadPurchasedUpgrades = async () => {
    try {
      const storedUpgrades = await AsyncStorage.getItem("purchasedUpgrades");
      if (storedUpgrades !== null) {
        setPurchasedUpgrades(JSON.parse(storedUpgrades));
      }
    } catch (error) {
      console.error("Ошибка загрузки покупок", error);
    }
  };

  const savePurchasedUpgrades = async (newUpgrades) => {
    try {
      await AsyncStorage.setItem("purchasedUpgrades", JSON.stringify(newUpgrades));
      setPurchasedUpgrades(newUpgrades);
    } catch (error) {
      console.error("Ошибка сохранения покупок", error);
    }
  };

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

  const loadDiscountStatus = async () => {
    try {
      const status = await AsyncStorage.getItem("discountActive");
      if (status === "true") {
        setDiscountActive(true);
      }
    } catch (error) {
      console.error("Ошибка загрузки статуса скидки", error);
    }
  };

  const handlePurchase = (upgrade) => {
    if (score >= upgrade.cost) {
      const newScore = score - upgrade.cost;
      saveScore(newScore);

      const updatedUpgrades = { ...purchasedUpgrades, [upgrade.id]: true };
      savePurchasedUpgrades(updatedUpgrades);

      if (upgrade.effect === "increaseClick") {
        const newMultiplier = clickMultiplier + 1;
        setClickMultiplier(newMultiplier);
        AsyncStorage.setItem("clickMultiplier", newMultiplier.toString());
      }

      if (upgrade.effect === "autoClick") {
        setAutoClickerActive(true);
        AsyncStorage.setItem("autoClicker", "true");
      }

      if (upgrade.effect === "discount") {
        setDiscountActive(true);
        AsyncStorage.setItem("discountActive", "true");
      }

      alert("Улучшение куплено!");
    } else {
      alert("Недостаточно очков!");
    }
  };

  const getDiscountedCost = (cost) => {
    if (discountActive) {
      return Math.max(1, cost - Math.floor(cost * 0.2)); // Скидка 20%
    }
    return cost;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Магазин</Text>
      <Text style={styles.score}>Очки: {score}</Text>
      <Text style={styles.score}>Очков за клик: {clickMultiplier}</Text>

      <FlatList
        data={upgrades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePurchase(item)}
            disabled={purchasedUpgrades[item.id]}
          >
            <Text style={styles.buttonText}>
              {item.name} - {getDiscountedCost(item.cost)} очков
              {purchasedUpgrades[item.id] && " (Куплено)"}
            </Text>
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
