import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { firestore } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../services/firebase';
import axios from 'axios';

const VerificationPage = ({ route, navigation }) => {
  const { businessName } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          Alert.alert('Error', 'User not logged in.');
          return;
        }

        const userDocRef = doc(firestore, 'Users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPhoneNumber(userData.phoneNumber);
          console.log('Fetched phone number:', userData.phoneNumber);
        } else {
          console.error('User document not found.');
        }
      } catch (error) {
        console.error('Error fetching phone number:', error.message);
      }
    };

    fetchPhoneNumber();
  }, []);

  const sendVerificationCode = async () => {
    try {
      if (!phoneNumber) {
        Alert.alert('Error', 'Phone number not found.');
        return;
      }
  
      // Generate a random 6-digit number
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(generatedCode);
      console.log('Generated verification code:', generatedCode);
  
      // Twilio Credentials

  
      // Send SMS
      await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        new URLSearchParams({
          To: phoneNumber,
          From: fromPhone,
          Body: `Your verification code is: ${generatedCode}`,
        }),
        {
          auth: {
            username: accountSid,
            password: authToken,
          },
        }
      );
  
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        Alert.alert('Error', `Failed to send verification code: ${error.response.data.message}`);
      } else {
        console.error('Error:', error.message);
        Alert.alert('Error', `Failed to send verification code: ${error.message}`);
      }
    }
  };
  
  const confirmVerificationCode = async () => {
    try {
      if (!code) {
        Alert.alert('Error', 'Please enter the verification code.');
        return;
      }

      if (code === verificationCode) {
        navigation.navigate('BusinessOptionsPage', { businessName });
      } else {
        Alert.alert('Error', 'Invalid verification code.');
      }
    } catch (error) {
      console.error('Error verifying code:', error.message);
      Alert.alert('Error', 'An error occurred during verification.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Verification</Text>
      <Button title="Send Code" onPress={sendVerificationCode} disabled={!phoneNumber} />
      <TextInput
        style={styles.input}
        placeholder="Enter verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      <Button title="Verify Code" onPress={confirmVerificationCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 },
});
export default VerificationPage;