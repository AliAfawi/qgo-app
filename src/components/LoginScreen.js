
import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LanguageContext } from '../context/LanguageContext';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';

const translations = {
  ar: {
    login: 'تسجيل الدخول',
    emailPlaceholder: 'البريد الإلكتروني',
    passwordPlaceholder: 'كلمة المرور',
    logInButton: 'تسجيل الدخول',
    signUpLink: 'ليس لديك حساب؟ سجل هنا',
    forgotPasswordLink: 'نسيت كلمة المرور؟ استعدها هنا',
    toggleLanguage: 'עברית',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص'
  },
  he: {
    login: 'התחבר',
    emailPlaceholder: 'אימייל',
    passwordPlaceholder: 'סיסמה',
    logInButton: 'התחבר',
    signUpLink: 'אין לך חשבון? הירשם',
    forgotPasswordLink: 'שכחת את הסיסמה? שחזר כאן',
    toggleLanguage: 'عربي',
    readAloud: 'הקראה',
    enlargeText: 'הגדלת טקסט'
  },
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highlightedKey, setHighlightedKey] = useState(null);
  const { language, toggleLanguage } = useContext(LanguageContext);

  const t = translations[language];

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('HomePage', { email: userCredential.user.email });
    } catch (err) {
      setError(err.message);
    }
  };

  const speakAll = () => {
    if (!readerMode) return;
    const items = [
      { key: 'login', text: t.login },
      { key: 'email', text: t.emailPlaceholder },
      { key: 'password', text: t.passwordPlaceholder },
      { key: 'logInButton', text: t.logInButton },
      { key: 'signUpLink', text: t.signUpLink },
      { key: 'forgotPasswordLink', text: t.forgotPasswordLink },
    ];
    let index = 0;
    const speakNext = () => {
      if (index < items.length) {
        setHighlightedKey(items[index].key);
        Speech.speak(items[index].text, {
          language: language === 'ar' ? 'ar-SA' : 'he-IL',
          rate: 0.9,
          onDone: () => {
            index++;
            speakNext();
          },
        });
      } else {
        setHighlightedKey(null);
      }
    };
    speakNext();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topControls}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
          <MaterialIcons name="accessibility" size={24} color="#9333EA" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleLanguage}>
          <Text style={[styles.languageButtonText, { fontSize }]}>{t.toggleLanguage}</Text>
        </TouchableOpacity>


      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setReaderMode(true); setModalVisible(false); speakAll(); }}>
              <Text style={styles.modalOption}>{t.readAloud}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFontSize((prev) => prev + 2); setModalVisible(false); }}>
              <Text style={styles.modalOption}>{t.enlargeText} +</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFontSize((prev) => Math.max(prev - 2, 12)); setModalVisible(false); }}>
              <Text style={styles.modalOption}>{t.enlargeText} -</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={[styles.title, highlightedKey === 'login' && styles.highlighted, { fontSize: fontSize + 8 }]}>{t.login}</Text>
      {error ? <Text style={[styles.error, { fontSize }]}>{error}</Text> : null}

      <TextInput
        style={[styles.input, highlightedKey === 'email' && styles.highlighted, { fontSize }]}
        placeholder={t.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, highlightedKey === 'password' && styles.highlighted, { fontSize }]}
        placeholder={t.passwordPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={[styles.buttonText, highlightedKey === 'logInButton' && styles.highlightedText, { fontSize }]}>{t.logInButton}</Text>
      </TouchableOpacity>

      <Text style={[styles.link, highlightedKey === 'signUpLink' && styles.highlightedText, { fontSize }]} onPress={() => navigation.navigate('SignUp')}>
        {t.signUpLink}
      </Text>
      <Text style={[styles.link, highlightedKey === 'forgotPasswordLink' && styles.highlightedText, { fontSize }]} onPress={() => navigation.navigate('resetPassword')}>
        {t.forgotPasswordLink}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  topControls: {
    justifyContent: 'space-between',

    flexDirection: 'row',
    marginBottom: 10,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#9333EA',
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
  languageButtonText: {
    color: '#9333EA',
  },
  iconButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
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
  highlighted: {
    borderColor: '#9333EA',
    borderWidth: 2,
  },
  highlightedText: {
    backgroundColor: '#e9d5ff',
  },
});

export default LoginScreen;




























// // src/components/LoginScreen.js
// import React, { useState, useContext } from 'react';
// import {
//   View,
//   TextInput,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
// } from 'react-native';
// import { auth } from '../services/firebase';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { LanguageContext } from '../context/LanguageContext';
// import * as Speech from 'expo-speech';
// import { MaterialIcons } from '@expo/vector-icons';

// const translations = {
//   ar: {
//     login: 'تسجيل الدخول',
//     emailPlaceholder: 'البريد الإلكتروني',
//     passwordPlaceholder: 'كلمة المرور',
//     logInButton: 'تسجيل الدخول',
//     signUpLink: 'ليس لديك حساب؟ سجل هنا',
//     forgotPasswordLink: 'نسيت كلمة المرور؟ استعدها هنا',
//     toggleLanguage: 'עברית',
//     readAloud: 'قراءة',
//     enlargeText: 'تكبير النص'
//   },
//   he: {
//     login: 'התחבר',
//     emailPlaceholder: 'אימייל',
//     passwordPlaceholder: 'סיסמה',
//     logInButton: 'התחבר',
//     signUpLink: 'אין לך חשבון? הירשם',
//     forgotPasswordLink: 'שכחת את הסיסמה? שחזר כאן',
//     toggleLanguage: 'عربي',
//     readAloud: 'הקראה',
//     enlargeText: 'הגדלת טקסט'
//   },
// };

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [readerMode, setReaderMode] = useState(false);
//   const [fontSize, setFontSize] = useState(16);
//   const [highlightedKey, setHighlightedKey] = useState(null);
//   const { language, toggleLanguage } = useContext(LanguageContext);

//   const t = translations[language];

//   const handleLogin = async () => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       navigation.navigate('HomePage', { email: userCredential.user.email });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const speakAll = () => {
//     if (!readerMode) return;
//     const items = [
//       { key: 'login', text: t.login },
//       { key: 'email', text: t.emailPlaceholder },
//       { key: 'password', text: t.passwordPlaceholder },
//       { key: 'logInButton', text: t.logInButton },
//       { key: 'signUpLink', text: t.signUpLink },
//       { key: 'forgotPasswordLink', text: t.forgotPasswordLink },
//     ];
//     let index = 0;
//     const speakNext = () => {
//       if (index < items.length) {
//         setHighlightedKey(items[index].key);
//         Speech.speak(items[index].text, {
//           language: language === 'ar' ? 'ar-SA' : 'he-IL',
//           rate: 0.9,
//           onDone: () => {
//             index++;
//             speakNext();
//           },
//         });
//       } else {
//         setHighlightedKey(null);
//       }
//     };
//     speakNext();
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.topControls}>
//         <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
//           <MaterialIcons name="accessibility" size={24} color="#9333EA" />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={toggleLanguage}>
//           <Text style={[styles.languageButtonText, { fontSize }]}>{t.toggleLanguage}</Text>
//         </TouchableOpacity>
//       </View>

//       <Modal transparent visible={modalVisible} animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity onPress={() => { setReaderMode(true); setModalVisible(false); speakAll(); }}>
//               <Text style={styles.modalOption}>{t.readAloud}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => { setFontSize((prev) => prev + 2); setModalVisible(false); }}>
//               <Text style={styles.modalOption}>{t.enlargeText} +</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => { setFontSize((prev) => Math.max(prev - 2, 12)); setModalVisible(false); }}>
//               <Text style={styles.modalOption}>{t.enlargeText} -</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Text style={styles.modalClose}>✕</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Text style={[styles.title, highlightedKey === 'login' && styles.highlighted, { fontSize: fontSize + 8 }]}>{t.login}</Text>
//       {error ? <Text style={[styles.error, { fontSize }]}>{error}</Text> : null}

//       <TextInput
//         style={[styles.input, highlightedKey === 'email' && styles.highlighted, { fontSize }]}
//         placeholder={t.emailPlaceholder}
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={[styles.input, highlightedKey === 'password' && styles.highlighted, { fontSize }]}
//         placeholder={t.passwordPlaceholder}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={[styles.buttonText, highlightedKey === 'logInButton' && styles.highlightedText, { fontSize }]}>{t.logInButton}</Text>
//       </TouchableOpacity>

//       <Text style={[styles.link, highlightedKey === 'signUpLink' && styles.highlightedText, { fontSize }]} onPress={() => navigation.navigate('SignUp')}>
//         {t.signUpLink}
//       </Text>
//       <Text style={[styles.link, highlightedKey === 'forgotPasswordLink' && styles.highlightedText, { fontSize }]} onPress={() => navigation.navigate('resetPassword')}>
//         {t.forgotPasswordLink}
//       </Text>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#f3f4f6',
//   },
//   topControls: {
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   title: {
//     marginBottom: 20,
//     textAlign: 'center',
//     fontWeight: 'bold',
//     color: '#9333EA',
//   },
//   input: {
//     height: 50,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     marginBottom: 20,
//     color: '#111827',
//   },
//   button: {
//     backgroundColor: '#9333EA',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   link: {
//     color: '#9333EA',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   languageButtonText: {
//     color: '#9333EA',
//   },
//   iconButton: {
//     paddingHorizontal: 8,
//     justifyContent: 'center',
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   modalContent: {
//     width: 250,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//   },
//   modalOption: {
//     fontSize: 18,
//     paddingVertical: 10,
//     color: '#1F2937',
//   },
//   modalClose: {
//     fontSize: 20,
//     color: '#9333EA',
//     marginTop: 10,
//   },
//   highlighted: {
//     borderColor: '#9333EA',
//     borderWidth: 2,
//   },
//   highlightedText: {
//     backgroundColor: '#e9d5ff',
//   },
// });

// export default LoginScreen;







// LoginScreen.js
// import React from 'react';
// import { View, Text } from 'react-native';

// const LoginScreen = () => {
//   return (
//     <View>
//       <Text>Welcome to LoginScreen Page</Text>
//     </View>
//   );
// };

// export default LoginScreen;
