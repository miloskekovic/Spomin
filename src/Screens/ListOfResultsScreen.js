import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ImageBackground, FlatList } from 'react-native';
import { UserContext, ThemeContext, Colors } from '../Context';
import { ThemeText, CustomButton } from '../Components';
import { customPadding } from '../Constants/Dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { color } from '@rneui/base';

const ChocolateBackground = require('../../assets/background_11.webp');

const ListOfResultsScreen = ({ route, navigation }) => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const { score, gridSize } = route.params;
  const [selectedCategory, setSelectedCategory] = useState(gridSize || '3x4');
  const [scoreList, setScoreList] = useState([]);

  // Load and save scores for the specific category when there’s a new score, and load scores when category changes
  useEffect(() => {
    const saveNewScore = async () => {
      if (score && gridSize) {
        const categoryKey = `scoreList_${gridSize}`;
        let currentScores = [];

        // Load scores for the current grid size from AsyncStorage
        const storedScores = await AsyncStorage.getItem(categoryKey);
        currentScores = storedScores ? JSON.parse(storedScores) : [];

        const existingUser = currentScores.find((item) => item.user === user);

        if (existingUser) {
          // Update the score only if the new score is higher
          currentScores = currentScores.map((item) =>
            item.user === user ? { ...item, score: Math.max(item.score, score) } : item
          );
        } else {
          // Add new user and score to the list
          currentScores = [...currentScores, { user, score }];
        }

        // Sort scores in descending order
        currentScores.sort((a, b) => b.score - a.score);

        // Save the updated scores back to AsyncStorage for this specific category
        await AsyncStorage.setItem(categoryKey, JSON.stringify(currentScores));

        // Update scoreList immediately if the selected category matches gridSize
        if (selectedCategory === gridSize) {
          setScoreList(currentScores);
        }
      }
    };

    if (score) saveNewScore(); // Only save if a new score is provided
  }, [user, score, gridSize, selectedCategory]);

  // Separate effect to load scores when the selected category changes
  useEffect(() => {
    const loadScoresForCategory = async () => {
      const categoryKey = `scoreList_${selectedCategory}`;
      const storedScores = await AsyncStorage.getItem(categoryKey);
      const currentScores = storedScores ? JSON.parse(storedScores) : [];
      setScoreList(currentScores);
    };

    loadScoresForCategory();
  }, [selectedCategory]);

  // Reset the leaderboard for the current category
  const resetLeaderboard = async () => {
    const categoryKey = `scoreList_${selectedCategory}`;
    await AsyncStorage.removeItem(categoryKey);
    setScoreList([]);
  };

  // Render each item in the FlatList
  const renderItem = ({ item, index }) => (
    <View style={[styles.listItem, item.user === user && selectedCategory === gridSize ? styles.currentUserHighlight : null]}>
      <ThemeText type={'freeText'}>
        {`${index + 1}. ${item.user} - ${item.score.toFixed(2)}`}
      </ThemeText>
    </View>
  );

  return (
    <ImageBackground source={ChocolateBackground} style={styles.backgroundImage} resizeMode="stretch">
      <View style={styles.container}>
        <ThemeText type={'headerText'} style={{ textAlign: 'center', color: theme.primaryColor }}>
          {'Vodilna Lestvica'}
        </ThemeText>

        {/* Category Dropdown */}
        <Picker
          selectedValue={selectedCategory}
          style={{width: '100%',
            padding: customPadding,
            marginVertical: 10,backgroundColor: theme.secondaryColor}}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="3x4 Results" value="3x4" />
          <Picker.Item label="4x4 Results" value="4x4" />
          <Picker.Item label="5x4 Results" value="5x4" />
          <Picker.Item label="6x5 Results" value="6x5" />
          <Picker.Item label="6x6 Results" value="6x6" />
        </Picker>

        <FlatList
          data={scoreList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />

        {/* "Naslednji igralec" Button */}
        <CustomButton
          text="Naslednji igralec"
          type="secondary"
          style={styles.nextPlayerButton}
          onButtonPress={() => navigation.navigate('Home')}
        />

        {/* Reset Leaderboard Button */}
        {/* <CustomButton
          text="Reset Lestvica"
          type="secondary"
          style={styles.resetButton}
          onButtonPress={resetLeaderboard}
        /> */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '20%',
    height: '60%',
    //padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  listItem: {
    paddingVertical: 5,
  },
  currentUserHighlight: {
    backgroundColor: 'green',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  nextPlayerButton: {
    marginTop: 20,
    width: '90%',
  },
  resetButton: {
    marginTop: 10,
    width: '70%',
  },
});

export default ListOfResultsScreen;
