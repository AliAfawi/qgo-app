
import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { firestore } from '../services/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';

const translations = {
  he: {
    title: 'שחזור סיסמה',
    phoneNumberPlaceholder: 'הכנס מספר טלפון',
    verificationCodePlaceholder: 'הכנס קוד אימות',
    newPasswordPlaceholder: 'סיסמה חדשה',
    confirmPasswordPlaceholder: 'אשר סיסמה חדשה',
    sendCodeButton: 'שלח קוד',
    resetPasswordButton: 'שחזר סיסמה',
    errorPasswordsMismatch: 'הסיסמאות לא תואמות',
    errorInvalidPhone: 'מספר טלפון לא חוקי',
    errorPhoneExists: 'מספר הטלפון כבר בשימוש',
    errorCodeMismatch: 'הקוד לא תואם',
    errorNoUserFound: 'לא נמצא משתמש עם מספר טלפון זה',
    successPasswordReset: 'הסיסמה שוחזרה בהצלחה',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
  ar: {
    title: 'إعادة تعيين كلمة المرور',
    phoneNumberPlaceholder: 'أدخل رقم الهاتف',
    verificationCodePlaceholder: 'أدخل رمز التحقق',
    newPasswordPlaceholder: 'كلمة المرور الجديدة',
    confirmPasswordPlaceholder: 'تأكيد كلمة المرور الجديدة',
    sendCodeButton: 'إرسال الرمز',
    resetPasswordButton: 'إعادة تعيين كلمة المرور',
    errorPasswordsMismatch: 'كلمات المرور غير متطابقة',
    errorInvalidPhone: 'رقم الهاتف غير صالح',
    errorPhoneExists: 'رقم الهاتف مستخدم بالفعل',
    errorCodeMismatch: 'الرمز غير مطابق',
    errorNoUserFound: 'لم يتم العثور على مستخدم بهذا الرقم',
    successPasswordReset: 'تم إعادة تعيين كلمة المرور بنجاح',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
};

const ResetPasswordPage = ({ navigation }) => {
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+972');
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const isIsraeliPhoneNumber = (phone) => {
    const regex = /^\+9725[0-9]{8}$/;
    return regex.test(phone);
  };

  const speakFields = () => {
    if (!readerMode) return;
    const fields = [
      t.title,
      t.phoneNumberPlaceholder,
      t.verificationCodePlaceholder,
      t.newPasswordPlaceholder,
      t.confirmPasswordPlaceholder,
    ];
    let i = 0;
    const speakNext = () => {
      if (i < fields.length) {
        Speech.speak(fields[i], {
          language: language === 'ar' ? 'ar-SA' : 'he-IL',
          rate: 0.9,
          onDone: () => {
            i++;
            speakNext();
          },
        });
      }
    };
    speakNext();
  };

  const sendVerificationCode = async () => {
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);





      Alert.alert('Code Sent', 'A verification code has been sent to your phone.');
    } catch (error) {
      console.error('Error sending verification code:', error.message);
      Alert.alert('Error', `Failed to send verification code: ${error.message}`);
    }
  };

  const handleVerifyAndReset = async () => {
    setError('');

    if (inputCode !== generatedCode) {
      setError(t.errorCodeMismatch);
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t.errorPasswordsMismatch);
      return;
    }

    try {
      const usersCollection = collection(firestore, 'Users');
      const phoneQuery = query(usersCollection, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(phoneQuery);

      if (querySnapshot.empty) {
        setError(t.errorNoUserFound);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userDocRef = doc(firestore, 'Users', userDoc.id);
      await updateDoc(userDocRef, { password: newPassword });

      Alert.alert('Success', t.successPasswordReset);
      navigation.navigate('Login');
    } catch (err) {
      console.error('Error resetting password:', err.message);
      setError('An error occurred while resetting the password.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialIcons name="accessibility" size={28} color="#9333EA" />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setReaderMode(true); speakFields(); }}>
              <Text style={styles.modalOption}>{t.readAloud}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize((prev) => prev + 2)}>
              <Text style={styles.modalOption}>{t.enlargeText}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize((prev) => Math.max(prev - 2, 12))}>
              <Text style={styles.modalOption}>{t.shrinkText}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={[styles.title, { fontSize: fontSize + 6 }]}>{t.title}</Text>
      {error ? <Text style={[styles.error, { fontSize }]}>{error}</Text> : null}

      <TextInput
        style={[styles.input, { fontSize }]}
        placeholder={t.phoneNumberPlaceholder}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={sendVerificationCode}>
        <Text style={[styles.buttonText, { fontSize }]}>{t.sendCodeButton}</Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.input, { fontSize }]}
        placeholder={t.verificationCodePlaceholder}
        value={inputCode}
        onChangeText={setInputCode}
        keyboardType="number-pad"
      />

      <TextInput
        style={[styles.input, { fontSize }]}
        placeholder={t.newPasswordPlaceholder}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TextInput
        style={[styles.input, { fontSize }]}
        placeholder={t.confirmPasswordPlaceholder}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyAndReset}>
        <Text style={[styles.buttonText, { fontSize }]}>{t.resetPasswordButton}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  headerRow: {
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 20,
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
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#9333EA',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
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

export default ResetPasswordPage;






