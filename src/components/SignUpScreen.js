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
import { auth, firestore } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';

const translations = {
  he: {
    title: 'הרשמה',
    fullNamePlaceholder: 'שם מלא',
    emailPlaceholder: 'אימייל',
    phoneNumberPlaceholder: 'מספר טלפון (לדוגמה, 548764647)',
    passwordPlaceholder: 'סיסמה',
    confirmPasswordPlaceholder: 'אישור סיסמה',
    signUpButton: 'הרשם',
    loginLink: 'יש לך חשבון? התחבר',
    errorPasswordsMismatch: 'הסיסמאות לא תואמות',
    errorInvalidPhone: 'מספר טלפון לא חוקי',
    errorPhoneExists: 'מספר הטלפון כבר בשימוש',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
  ar: {
    title: 'إنشاء حساب',
    fullNamePlaceholder: 'الاسم الكامل',
    emailPlaceholder: 'البريد الإلكتروني',
    phoneNumberPlaceholder: 'رقم الهاتف (مثل 548764647)',
    passwordPlaceholder: 'كلمة المرور',
    confirmPasswordPlaceholder: 'تأكيد كلمة المرور',
    signUpButton: 'إنشاء حساب',
    loginLink: 'هل لديك حساب؟ تسجيل الدخول',
    errorPasswordsMismatch: 'كلمات المرور غير متطابقة',
    errorInvalidPhone: 'رقم الهاتف غير صالح',
    errorPhoneExists: 'رقم الهاتف مستخدم بالفعل',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
};

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+972');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const isIsraeliPhoneNumber = (phone) => {
    const regex = /^\+9725[0-9]{8}$/;
    return regex.test(phone);
  };

  const checkPhoneNumberExists = async (phone) => {
    const usersCollection = collection(firestore, 'Users');
    const phoneQuery = query(usersCollection, where('phoneNumber', '==', phone));
    const querySnapshot = await getDocs(phoneQuery);
    return !querySnapshot.empty;
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError(t.errorPasswordsMismatch);
      return;
    }

    if (!isIsraeliPhoneNumber(phoneNumber)) {
      setError(t.errorInvalidPhone);
      return;
    }

    try {
      const phoneExists = await checkPhoneNumberExists(phoneNumber);
      if (phoneExists) {
        setError(t.errorPhoneExists);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      const userDocRef = doc(firestore, 'Users', user.uid);
      await setDoc(userDocRef, {
        fullName,
        email: user.email,
        phoneNumber,
        createdAt: new Date().toISOString(),
      });

      navigation.navigate('HomePage', { email: user.email });
    } catch (err) {
      console.error('Error during sign-up:', err.message);
      setError(err.message);
    }
  };

  const speakFields = () => {
    if (!readerMode) return;
    const fields = [
      t.title,
      t.fullNamePlaceholder,
      t.emailPlaceholder,
      t.phoneNumberPlaceholder,
      t.passwordPlaceholder,
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
        placeholder={t.fullNamePlaceholder}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={[styles.input, { fontSize }]}
        placeholder={t.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { fontSize }]}
        placeholder={t.phoneNumberPlaceholder}
        value={phoneNumber}
        onChangeText={(text) => {
          if (text.startsWith('+972')) setPhoneNumber(text);
        }}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[styles.input, { fontSize }]}
        placeholder={t.passwordPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={[styles.input, { fontSize }]}
        placeholder={t.confirmPasswordPlaceholder}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={[styles.buttonText, { fontSize }]}>{t.signUpButton}</Text>
      </TouchableOpacity>

      <Text
        style={[styles.link, { fontSize }]}
        onPress={() => navigation.navigate('Login')}
      >
        {t.loginLink}
      </Text>
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
  link: {
    color: '#9333EA',
    textAlign: 'center',
    marginTop: 10,
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

export default SignUpScreen;
