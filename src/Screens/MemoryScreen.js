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
const containerHeight = screenHeight * 0.8;

// Shuffle and select unique pairs based on the required pair count
const shuffleAndSelectCards = (pairCount) => {
    // Shuffle the Cards array and pick the first `pairCount` unique cards
    const shuffledCards = [...Cards].sort(() => Math.random() - 0.5);
    
    // Select the first `pairCount` unique cards
    const uniqueCards = [];
    for (let i = 0; i < shuffledCards.length && uniqueCards.length < pairCount; i++) {
      const card = shuffledCards[i];
      
      // Ensure the card is unique by checking its ID
      if (!uniqueCards.some(selectedCard => selectedCard.id === card.id)) {
        uniqueCards.push(card);
      }
    }
  
    // Duplicate each selected card to form pairs
    const pairedCards = [...uniqueCards, ...uniqueCards];
    
    // Shuffle the paired cards to randomize their positions on the grid
    return pairedCards.sort(() => Math.random() - 0.5);
  };

const MemoryScreen = ({ route, navigation }) => {
    const { user } = useContext(UserContext);
    const { gridSize } = route.params;
    const pairCount = {
      '3x4': 6,
      '4x4': 8,
      '5x4': 10,
      '6x5': 15,
      '6x6': 18
    }[gridSize] || 6;
    
    const [userResultPopupVisibility, setUserResultPopupVisibility] = useState(false);
    const [cards, setCards] = useState(shuffleAndSelectCards(pairCount));
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [lastClickedCardName, setLastClickedCardName] = useState('');
    const [timer, setTimer] = useState(0);
    const [score, setScore] = useState(0);

    const numCols = parseInt(gridSize.split('x')[1]);
    const numRows = parseInt(gridSize.split('x')[0]);
    const cardMargin = 5;

    // Calculate card size based on container size and grid layout
    const cardWidth = (containerWidth - cardMargin * (numCols + 1)) / numCols;
    const cardHeight = (containerHeight - cardMargin * (numRows + 1)) / numRows;
    const cardSize = Math.min(cardWidth, cardHeight);

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

    const calculateScore = () => {
        const timePenalty = timer * 2;
        const turnPenalty = turns * 50;
        const baseScore = 10000;
        const finalScore = Math.max(0, baseScore - timePenalty - turnPenalty);
        setScore(finalScore);
        console.log("Score calculated:", finalScore); // Debug log for score calculation
    };

    const resetGame = () => {
        setCards(shuffleAndSelectCards(pairCount));
        setFlippedCards([]);
        setMatchedCards([]);
        setTurns(0);
        setLastClickedCardName('');
        setTimer(0);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    function renderUserResultPopup() {
        return (
            <Popup
                isVisible={userResultPopupVisibility}
                titleText={'Rezultat Spomina'}
                messageText = {`Bravo, ${user}!\nZa zmago si potreboval/-a ${turns} potez!\nUpoštevajoč tvoj čas, je tvoj rezultat: ${score}`}
                cancelOption={true}
                onClose={() => setUserResultPopupVisibility(false)}
                onRightButtonPress={() => {setUserResultPopupVisibility(false); navigation.navigate('ListOfResultsScreen', { score, gridSize })}}                    
            />
        )
    }

    useEffect(() => {
        timerInterval = setInterval(() => {
            setTimer((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    useEffect(() => {
        if (matchedCards.length === pairCount) {
            clearInterval(timerInterval);
            calculateScore();
            setUserResultPopupVisibility(true);
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
                        <ThemeText type='headerText'>Klikni kartico, da vidiš njeno ime</ThemeText>
                    )}
                </View>
                <View style={styles.clockContainer}>
                    <View style={styles.timerContainer}>
                        <ThemeText type='headerText'>{formatTime(timer)}</ThemeText>
                    </View>
                </View>
            </View>
            <View style={styles.centralContainer}>
                {renderUserResultPopup()}
                <View style={styles.grid}>
                    {cards.map((card, index) => {
                        const isFlipped = flippedCards.includes(index) || matchedCards.includes(card.id);
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.card,
                                    {
                                        width: (screenWidth * 0.8 / numCols) - (screenHeight * 0.01),
                                        height: (screenHeight * 0.8 / numRows) - (screenHeight * 0.01),
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
            <View style={styles.headerContainer}>
                
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
      //backgroundColor: 'blue'
  },
  footerContainer: {
      flex: screenHeight * 0.1,
      width: '100%',
      backgroundColor: 'red'
  },
  centralContainer: {
      width: screenWidth * 0.9,
      height: screenHeight * 0.8,
      alignItems: 'center',
      justifyContent: 'center',
      //backgroundColor: 'green'
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
      alignItems: 'center'
  },
  timerContainer: {
      padding: screenHeight * 0.005,
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
      //backgroundColor: 'yellow',
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
