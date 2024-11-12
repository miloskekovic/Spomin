import React, { useContext, useState, useCallback } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { ThemeContext, UserContext } from '../Context';
import { ThemeInput, CustomButton } from '../Components';
import { fontSize as FS } from '../Constants/Dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const BackgroundImage = require('../../assets/background_memory.jpg');

const HomeScreen = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [userName, setUserName] = useState('');
  const [gridSize, setGridSize] = useState('3x4'); // Default grid size

  // Clear the TextInput when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setUserName(''); // Clear the userName input
    }, [])
  );

  return (
    <ImageBackground 
      source={BackgroundImage} 
      style={styles.backgroundImage} 
      resizeMode="stretch"
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }}>
        <ThemeInput
          style={{ marginTop: FS * 0.5}}
          label="Tvoje ime in priimek"
          required={true}
          returnKeyType="done"
          blurOnSubmit={false}
          clearButtonMode="always"
          multiline={false}
          value={userName}
          placeholder="Vpiši svoje ime in priimek"
          onChangeText={(text) => setUserName(text)}
        />

        <Picker
          selectedValue={gridSize}
          style={{ padding: FS * 0.1, width: '25%', backgroundColor: theme.secondaryColor, marginTop: FS * 0.5, borderRadius: FS * 0.5 }}
          onValueChange={(itemValue) => setGridSize(itemValue)}
        >
          <Picker.Item label="3x4 (12 cards)" value="3x4" />
          <Picker.Item label="4x4 (16 cards)" value="4x4" />
          <Picker.Item label="5x4 (20 cards)" value="5x4" />
          <Picker.Item label="6x5 (30 cards)" value="6x5" />
          <Picker.Item label="6x6 (36 cards)" value="6x6" />
        </Picker>
        <View style={{ marginTop: FS * 0.5 }}>
          <CustomButton
            text="Začni s kvizom"
            type="primary"            
            onButtonPress={() => {
              if (userName) {
                setUser(userName); // Set the user name in context
                navigation.navigate('MemoryScreen', { gridSize }); // Pass grid size to MemoryScreen
              } else {
                Toast.show({
                  type: 'info',
                  text1: 'Najprej vnesi svoje ime in priimek',
                  visibilityTime: 2500,
                });
              }
            }}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  }
});

export default HomeScreen;
