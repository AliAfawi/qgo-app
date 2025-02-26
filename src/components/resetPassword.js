


import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { getAuth, updatePassword } from 'firebase/auth';
import { firestore } from '../services/firebase'; // Ensure correct path to Firestore setup
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import axios from 'axios';

const resetPassword = ({ navigation }) => {
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [phoneNumber, setNumberPhone] = useState('+972');

  const sendVerificationCode = async () => {
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      console.log('Generated verification code:', code);



      await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        new URLSearchParams({
          To: phoneNumber,
          From: fromPhone,
          Body: `Your verification code is: ${code}`,
        }),
        {
          auth: {
            username: accountSid,
            password: authToken,
          },
        }
      );

      Alert.alert('Code Sent', 'A verification code has been sent to your phone.');
      console.log('Verification code sent successfully to:', phoneNumber);
    } catch (error) {
      console.error('Error sending verification code:', error.message);
      Alert.alert('Error', `Failed to send verification code: ${error.message}`);
    }
  };

  const handleVerifyAndReset = async () => {
    setError('');

    if (inputCode !== generatedCode) {
      setError('Invalid verification code.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      console.log('Attempting to find user with phone number:', phoneNumber);

      const usersCollection = collection(firestore, 'Users');
      const phoneQuery = query(usersCollection, where('numberphone', '==', phoneNumber));
      const querySnapshot = await getDocs(phoneQuery);

      if (querySnapshot.empty) {
        setError('No user found with this phone number.');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      console.log('User found:', userData);

      const userDocRef = doc(firestore, 'Users', userDoc.id);
      await updateDoc(userDocRef, { password: newPassword });

      Alert.alert('Success', 'Password reset successfully.');
      navigation.navigate('Login');
    } catch (err) {
      console.error('Error resetting password:', err.message);
      setError('An error occurred while resetting the password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        value={phoneNumber}
        onChangeText={(text) => {
          if (text.startsWith('+972')) {
            setNumberPhone(text);
          }
        }}
        keyboardType="phone-pad"
      />
      <Button title="Send Code" onPress={sendVerificationCode} />
      <TextInput
        style={styles.input}
        placeholder="Enter verification code"
        value={inputCode}
        onChangeText={setInputCode}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Reset Password" onPress={handleVerifyAndReset} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default resetPassword;
