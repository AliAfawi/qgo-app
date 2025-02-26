
// import React, { useState, useContext } from 'react';
// import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { auth } from '../services/firebase';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { LanguageContext } from '../context/LanguageContext';

// const translations = {
//   he: {
//     login: 'התחבר',
//     emailPlaceholder: 'אימייל',
//     passwordPlaceholder: 'סיסמה',
//     logInButton: 'התחבר',
//     signUpLink: 'אין לך חשבון? הירשם',
//     forgotPasswordLink: 'שכחת את הסיסמה? שחזר כאן',
//     toggleLanguage: 'عربي',
//   },
//   ar: {
//     login: 'تسجيل الدخول',
//     emailPlaceholder: 'البريد الإلكتروني',
//     passwordPlaceholder: 'كلمة المرور',
//     logInButton: 'تسجيل الدخول',
//     signUpLink: 'ليس لديك حساب؟ سجل هنا',
//     forgotPasswordLink: 'نسيت كلمة المرور؟ استعدها هنا',
//     toggleLanguage: 'עברית',
//   },
// };

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { language, toggleLanguage } = useContext(LanguageContext);

//   const t = translations[language];

//   const handleLogin = async () => {
//     try {
//       console.log('Attempting to log in user with email:', email);

//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       console.log('User logged in successfully:', user);

//       navigation.navigate('HomePage', { email: user.email });
//     } catch (err) {
//       console.error('Error during login:', err.message);
//       setError(err.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
//         <Text style={styles.languageButtonText}>{t.toggleLanguage}</Text>
//       </TouchableOpacity>
//       <Text style={styles.title}>{t.login}</Text>
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <TextInput
//         style={styles.input}
//         placeholder={t.emailPlaceholder}
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder={t.passwordPlaceholder}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title={t.logInButton} onPress={handleLogin} />
//       <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
//         {t.signUpLink}
//       </Text>
//       <Text style={styles.link} onPress={() => navigation.navigate('resetPassword')}>
//         {t.forgotPasswordLink}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 8,
//     borderRadius: 5,
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   link: {
//     color: 'blue',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   languageButton: {
//     alignSelf: 'flex-end',
//     marginBottom: 20,
//   },
//   languageButtonText: {
//     fontSize: 16,
//     color: 'blue',
//   },
// });

// export default LoginScreen;




import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  he: {
    login: 'התחבר',
    emailPlaceholder: 'אימייל',
    passwordPlaceholder: 'סיסמה',
    logInButton: 'התחבר',
    signUpLink: 'אין לך חשבון? הירשם',
    forgotPasswordLink: 'שכחת את הסיסמה? שחזר כאן',
    toggleLanguage: 'عربي',
  },
  ar: {
    login: 'تسجيل الدخول',
    emailPlaceholder: 'البريد الإلكتروني',
    passwordPlaceholder: 'كلمة المرور',
    logInButton: 'تسجيل الدخول',
    signUpLink: 'ليس لديك حساب؟ سجل هنا',
    forgotPasswordLink: 'نسيت كلمة المرور؟ استعدها هنا',
    toggleLanguage: 'עברית',
  },
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { language, toggleLanguage } = useContext(LanguageContext);

  const t = translations[language];

  const handleLogin = async () => {
    try {
      console.log('Attempting to log in user with email:', email);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User logged in successfully:', user);

      navigation.navigate('HomePage', { email: user.email });
    } catch (err) {
      console.error('Error during login:', err.message);
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
        <Text style={styles.languageButtonText}>{t.toggleLanguage}</Text>
      </TouchableOpacity>
      
      {/* Add the logo image */}
      {/* <Image source={require('../media/QGoLogo.png')} style={styles.logo} /> */}
      
      <Text style={styles.title}>{t.login}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder={t.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t.passwordPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={t.logInButton} onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        {t.signUpLink}
      </Text>
      <Text style={styles.link} onPress={() => navigation.navigate('resetPassword')}>
        {t.forgotPasswordLink}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150, // Adjust the width as needed
    height: 150, // Adjust the height as needed
    resizeMode: 'contain',
    alignSelf: 'center', // Center the logo horizontally
    marginBottom: 20, // Add space below the logo
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
  },
  link: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
  languageButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  languageButtonText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default LoginScreen;
