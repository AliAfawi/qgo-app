
// import React, { useState, useContext } from 'react';
// import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
// import { auth, firestore } from '../services/firebase';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
// import { LanguageContext } from '../context/LanguageContext';

// const translations = {
//   he: {
//     title: 'הרשמה',
//     fullNamePlaceholder: 'שם מלא',
//     emailPlaceholder: 'אימייל',
//     phoneNumberPlaceholder: 'מספר טלפון (לדוגמה, 972548764647+)',
//     passwordPlaceholder: 'סיסמה',
//     confirmPasswordPlaceholder: 'אישור סיסמה',
//     signUpButton: 'הרשם',
//     loginLink: 'יש לך חשבון? התחבר',
//     errorPasswordsMismatch: 'הסיסמאות לא תואמות',
//     errorInvalidPhone: 'מספר טלפון לא חוקי',
//     errorPhoneExists: 'מספר הטלפון כבר בשימוש',
//   },
//   ar: {
//     title: 'إنشاء حساب',
//     fullNamePlaceholder: 'الاسم الكامل',
//     emailPlaceholder: 'البريد الإلكتروني',
//     phoneNumberPlaceholder: 'رقم الهاتف (مثل 972546784747+)',
//     passwordPlaceholder: 'كلمة المرور',
//     confirmPasswordPlaceholder: 'تأكيد كلمة المرور',
//     signUpButton: 'إنشاء حساب',
//     loginLink: 'هل لديك حساب؟ تسجيل الدخول',
//     errorPasswordsMismatch: 'كلمات المرور غير متطابقة',
//     errorInvalidPhone: 'رقم الهاتف غير صالح',
//     errorPhoneExists: 'رقم الهاتف مستخدم بالفعل',
//   },
// };

// const SignUpScreen = ({ navigation }) => {
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [phoneNumber, setNumberPhone] = useState('');
//   const [error, setError] = useState('');
//   const { language } = useContext(LanguageContext);

//   const t = translations[language];

//   const isIsraeliPhoneNumber = (phone) => {
//     const regex = /^\(\+972|0\)?5[0-9]{8}$/;
//     return regex.test(phone);
//   };

//   const checkPhoneNumberExists = async (phone) => {
//     const usersCollection = collection(firestore, 'Users');
//     const phoneQuery = query(usersCollection, where('phoneNumber', '==', phone));
//     const querySnapshot = await getDocs(phoneQuery);
//     return !querySnapshot.empty;
//   };

//   const handleSignUp = async () => {
//     if (password !== confirmPassword) {
//       setError(t.errorPasswordsMismatch);
//       return;
//     }

//     if (!isIsraeliPhoneNumber(phoneNumber)) {
//       setError(t.errorInvalidPhone);
//       return;
//     }

//     try {
//       const phoneExists = await checkPhoneNumberExists(phoneNumber);
//       if (phoneExists) {
//         setError(t.errorPhoneExists);
//         return;
//       }

//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       await updateProfile(user, { displayName: fullName });

//       const userDocRef = doc(firestore, 'Users', user.uid);
//       await setDoc(userDocRef, {
//         fullName,
//         email: user.email,
//         phoneNumber,
//         createdAt: new Date().toISOString(),
//       });

//       navigation.navigate('HomePage', { email: user.email });
//     } catch (err) {
//       console.error('Error during sign-up:', err.message);
//       setError(err.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{t.title}</Text>
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <TextInput
//         style={styles.input}
//         placeholder={t.fullNamePlaceholder}
//         value={fullName}
//         onChangeText={setFullName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder={t.emailPlaceholder}
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder={t.phoneNumberPlaceholder}
//         value={phoneNumber}
//         onChangeText={setNumberPhone}
//         keyboardType="phone-pad"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder={t.passwordPlaceholder}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TextInput
//         style={styles.input}
//         placeholder={t.confirmPasswordPlaceholder}
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         secureTextEntry
//       />
//       <Button title={t.signUpButton} onPress={handleSignUp} />
//       <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
//         {t.loginLink}
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
//     textAlign: 'center',
//   },
//   link: {
//     color: 'blue',
//     marginTop: 10,
//     textAlign: 'center',
//   },
// });

// export default SignUpScreen;


import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';

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
  },
};

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setNumberPhone] = useState('+972');
  const [error, setError] = useState('');
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.title}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder={t.fullNamePlaceholder}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder={t.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t.phoneNumberPlaceholder}
        value={phoneNumber}
        onChangeText={(text) => {
          if (text.startsWith('+972')) {
            setNumberPhone(text);
          }
        }}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder={t.passwordPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder={t.confirmPasswordPlaceholder}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title={t.signUpButton} onPress={handleSignUp} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        {t.loginLink}
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
  link: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SignUpScreen;
