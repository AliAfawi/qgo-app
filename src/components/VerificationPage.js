import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { firestore } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../services/firebase';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';

const translations = {
  ar: {
    title: '📱 التحقق من الهاتف',
    placeholder: 'أدخل رمز التحقق',
    verifyButton: 'تحقق من الرمز',
    errorMessage: 'يرجى إدخال رمز التحقق.',
    invalidCode: 'رمز التحقق غير صالح.',
    successMessage: 'تم التحقق بنجاح!',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
  he: {
    title: '📱 אימות טלפון',
    placeholder: 'הכנס קוד אימות',
    verifyButton: 'אמת קוד',
    errorMessage: 'אנא הכנס את קוד האימות.',
    invalidCode: 'הקוד שהוזן לא תקין.',
    successMessage: 'האימות בוצע בהצלחה!',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
};

const VerificationPage = ({ route, navigation }) => {
  const { businessName } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.he;

  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const fetchPhoneAndSendCode = async () => {
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
          const phone = userData.phoneNumber;
          setPhoneNumber(phone);
          await sendVerificationCode(phone);
        }
      } catch (error) {
        console.error('Error fetching phone number:', error.message);
      }
    };

    fetchPhoneAndSendCode();
  }, []);


  







  const confirmVerificationCode = () => {
    if (!code) {
      Alert.alert('Error', t.errorMessage);
      return;
    }

    if (code === verificationCode) {
      navigation.navigate('BusinessOptionsPage', { businessName });
    } else {
      Alert.alert('Error', t.invalidCode);
    }
  };

  const speakAll = () => {
    const message = `${t.title}. ${t.placeholder}. ${t.verifyButton}`;
    Speech.speak(message, {
      language: language === 'ar' ? 'ar-SA' : 'he-IL',
      rate: 0.9,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
      >
        <MaterialIcons name="accessibility" size={28} color="#9333EA" />
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setReaderMode(true); speakAll(); }}>
              <Text style={styles.modalOption}>{t.readAloud}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize((prev) => prev + 2)}>
              <Text style={styles.modalOption}>{t.enlargeText} +</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize((prev) => Math.max(prev - 2, 12))}>
              <Text style={styles.modalOption}>{t.shrinkText} -</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={[styles.title, { fontSize: fontSize + 4 }]}>{t.title}</Text>

      <TextInput
        style={[styles.input, { fontSize }]}
        placeholder={t.placeholder}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholderTextColor="#9CA3AF"
      />

      <TouchableOpacity style={styles.button} onPress={confirmVerificationCode}>
        <Text style={[styles.buttonText, { fontSize }]}>{t.verifyButton}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#9333EA',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    marginBottom: 20,
    color: '#111827',
    width: '100%',
  },
  button: {
    backgroundColor: '#9333EA',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalOption: {
    fontSize: 18,
    paddingVertical: 10,
    color: '#1F2937',
  },
  modalClose: {
    fontSize: 20,
    color: '#9333EA',
    marginTop: 10,
  },
});

export default VerificationPage;
