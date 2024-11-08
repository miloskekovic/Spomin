import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Image } from 'react-native';
import { UserContext, ThemeContext, Colors } from '../Context';
import Toast from 'react-native-toast-message';
import { fontSize } from '../Constants/Dimensions';
import Cards from '../Constants/Cards';
import { ThemeInput, CustomButton, ThemeText, Popup } from '../Components';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ChocolateBackground = require('../../assets/Resized_Final_Background_4K_UHD.jpg');
const BackgroundImage = require('../../assets/chocolate-background.webp');
let timerInterval;
const containerWidth = screenWidth * 0.9;
const containerHeight = screenHeight * 0.9;

// Shuffle and duplicate cards to create pairs
const shuffleCards = () => {
  const duplicatedCards = [...Cards, ...Cards];
  return duplicatedCards.sort(() => Math.random() - 0.5);
};

const MemoryScreen = ({ navigation }) => {
  const [cards, setCards] = useState(shuffleCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [lastClickedCardName, setLastClickedCardName] = useState('');
  const [timer, setTimer] = useState(0);

  // Set grid layout explicitly to 6x6
  const numCards = Cards.length * 2;
  const numCols = Math.ceil(Math.sqrt(numCards));
  const numRows = Math.ceil(numCards / numCols);
  const cardMargin = 5;

  // Calculate card size based on container size and grid layout
  const cardWidth = (containerWidth - cardMargin * (columns + 1)) / columns;
  const cardHeight = (containerHeight - cardMargin * (rows + 1)) / rows;
  const cardSize = Math.min(cardWidth, cardHeight); // Ensure square shape

  const handleCardPress = (index) => {
      if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(cards[index].id)) {
          return;
      }

      const newFlippedCards = [...flippedCards, index];
      setFlippedCards(newFlippedCards);
      setLastClickedCardName(cards[index].name);

      if (newFlippedCards.length === 2) {
          checkForMatch(newFlippedCards);
      }
  };

  const checkForMatch = (newFlippedCards) => {
      const [firstIndex, secondIndex] = newFlippedCards;
      if (cards[firstIndex].id === cards[secondIndex].id) {
          setMatchedCards([...matchedCards, cards[firstIndex].id]);
          setFlippedCards([]);
      } else {
          setTimeout(() => setFlippedCards([]), 1000);
      }
      setTurns(turns + 1);
  };

  const resetGame = () => {
      setCards(shuffleCards());
      setFlippedCards([]);
      setMatchedCards([]);
      setTurns(0);
      setLastClickedCardName('');
  };

  const formatTime = (time) => {
      const minutes = Math.floor(time / 60).toString().padStart(2, '0');
      const seconds = (time % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
  };

  useEffect(() => {
      timerInterval = setInterval(() => {
          setTimer((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
      if (matchedCards.length === Cards.length) {
          Alert.alert('Congratulations!', `You won in ${turns} turns!`, [{ text: 'Play Again', onPress: resetGame }]);
      }
  }, [matchedCards]);

  return (
      <ImageBackground source={BackgroundImage} style={styles.backgroundImage} resizeMode="stretch">
          <View style={styles.headerContainer}>
              <View style={styles.turnsContainer}>
                  <ThemeText type='headerText'>Poteze: {turns}</ThemeText>
              </View>
              <View style={styles.cardNameContainer}>
                  {lastClickedCardName ? (
                      <ThemeText type='headerText'>{lastClickedCardName}</ThemeText>
                  ) : (
                      <ThemeText type='headerText'>Click a card to see its name</ThemeText>
                  )}
              </View>
              <View style={styles.clockContainer}>
                  <View style={styles.timerContainer}>
                      <Text style={styles.timerText}>{formatTime(timer)}</Text>
                  </View>
              </View>
          </View>
          <View style={styles.centralContainer}>
            <View style={styles.grid}>
                {cards.map((card, index) => {
                    const isFlipped = flippedCards.includes(index) || matchedCards.includes(card.id);
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.card,
                                {
                                    width: (screenWidth * 0.83 / numCols) - (screenHeight * 0.02),   // Adjust for horizontal margins
                                    height: (screenHeight * 0.79 / numRows) - (screenHeight * 0.02), // Adjust for vertical margins within the 80% height container
                                },
                                isFlipped && styles.cardFlipped
                            ]}
                            onPress={() => handleCardPress(index)}
                        >
                            {isFlipped ? (
                                <Image 
                                    source={card.image} 
                                    style={styles.cardImage} 
                                    resizeMode="contain"
                                />
                            ) : (
                                <Text style={styles.cardText}>?</Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
        <View style={styles.footerContainer}>
        </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
      flex: 1,
      backgroundColor: '#f8f8f8',
      alignItems: 'center',
      justifyContent: 'center',
  },
  headerContainer: {
      flex: screenHeight * 0.1,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
  },
  footerContainer: {
      flex: screenHeight * 0.1,
      width: '100%',
  },
  centralContainer: {
      width: screenWidth * 0.9,
      height: screenHeight * 0.8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'green'
  },
  turnsContainer: {
      width: '20%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
  },
  cardNameContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
  },
  clockContainer: {
      width: '20%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
  },
  timerContainer: {
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 5,
  },
  timerText: {
      color: '#fff',
      fontSize: fontSize,
      fontWeight: 'bold',
  },
  grid: {
      width: '100%', // Ensure the grid is centered and occupies 80% of the screen width
      height: '100%', // Ensure grid takes up 100% of the centralContainer
      backgroundColor: 'yellow',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
  },
  card: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      margin: screenHeight * 0.005,
      backgroundColor: '#ccc',
  },
  cardFlipped: {
      backgroundColor: '#fff'
  },
  cardImage: {
      width: '80%',
      height: '80%',
      borderRadius: 8,
  },
  cardText: {
      fontSize: fontSize * 1.5,
      color: '#000',
  },
});

export default MemoryScreen;
