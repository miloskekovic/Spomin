import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { UserContext, ThemeContext } from '../Context';
import Toast from 'react-native-toast-message';
import { fontSize } from '../Constants/Dimensions';
import Cards from '../Constants/Cards';
import { ThemeInput, CustomButton, ThemeText, Popup } from '../Components';
const { height, width } = Dimensions.get('window');

const ChocolateBackground = require('../../assets/Resized_Final_Background_4K_UHD.jpg');
let timerInterval;

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
  
    const handleCardPress = (index) => {
      if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(cards[index].id)) {
        return;
      }
  
      const newFlippedCards = [...flippedCards, index];
      setFlippedCards(newFlippedCards);
  
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
    };
  
    useEffect(() => {
      if (matchedCards.length === Cards.length) {
        Alert.alert('Congratulations!', `You won in ${turns} turns!`, [{ text: 'Play Again', onPress: resetGame }]);
      }
    }, [matchedCards]);
  
    return (
      <View style={styles.container}>
        <Text style={styles.turnsText}>Turns: {turns}</Text>
        <View style={styles.grid}>
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedCards.includes(card.id);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.card, isFlipped && styles.cardFlipped]}
                onPress={() => handleCardPress(index)}
              >
                <Text style={styles.cardText}>{isFlipped ? card.emoji : '?'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>Reset Game</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f8f8',
      alignItems: 'center',
    },
    turnsText: {
      fontSize: 18,
      marginBottom: 20,
    },
    grid: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
    },
    card: {
      width: '22%', // Approximate width to fit four cards per row with padding
      aspectRatio: 1, // Keeps the card square
      margin: 8,
      backgroundColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    cardFlipped: {
      backgroundColor: '#ffcc00',
    },
    cardText: {
      fontSize: 24,
    },
    resetButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#ff6347',
      borderRadius: 5,
    },
    resetButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });

export default MemoryScreen;
