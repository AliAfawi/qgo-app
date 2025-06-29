// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import { getAuth, updateProfile } from 'firebase/auth';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { firestore } from '../services/firebase';
// import { LanguageContext } from '../context/LanguageContext';

// const translations = {
//   en: {
//     title: 'My Account',
//     fullName: 'Full Name',
//     email: 'Email',
//     phone: 'Phone Number',
//     password: 'Password',
//     save: 'Save Changes',
//     placeholderName: 'Full Name',
//     placeholderEmail: 'Email',
//     placeholderPhone: 'Phone Number',
//     success: 'Profile updated successfully.',
//     fail: 'Failed to update profile.',
//     fetchError: 'Failed to fetch user data.',
//   },
//   ar: {
//     title: 'حسابي',
//     fullName: 'الاسم الكامل',
//     email: 'البريد الإلكتروني',
//     phone: 'رقم الهاتف',
//     password: 'كلمة المرور',
//     save: 'حفظ التغييرات',
//     placeholderName: 'الاسم الكامل',
//     placeholderEmail: 'البريد الإلكتروني',
//     placeholderPhone: 'رقم الهاتف',
//     success: 'تم تحديث الحساب بنجاح.',
//     fail: 'فشل في تحديث الحساب.',
//     fetchError: 'فشل في جلب بيانات المستخدم.',
//   },
//   he: {
//     title: 'החשבון שלי',
//     fullName: 'שם מלא',
//     email: 'אימייל',
//     phone: 'מספר טלפון',
//     password: 'סיסמה',
//     save: 'שמור שינויים',
//     placeholderName: 'שם מלא',
//     placeholderEmail: 'אימייל',
//     placeholderPhone: 'מספר טלפון',
//     success: 'הפרופיל עודכן בהצלחה.',
//     fail: 'עדכון הפרופיל נכשל.',
//     fetchError: 'שגיאה בקבלת נתוני המשתמש.',
//   },
// };

// const MyAccountPage = () => {
//   const { language } = useContext(LanguageContext);
//   const t = translations[language];

//   const auth = getAuth();
//   const currentUser = auth.currentUser;
//   const [displayName, setDisplayName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [passwordPlaceholder] = useState('********');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         if (currentUser) {
//           const userRef = doc(firestore, 'Users', currentUser.uid);
//           const docSnap = await getDoc(userRef);
//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setDisplayName(data.fullName || currentUser.displayName || '');
//             setPhone(data.phoneNumber || currentUser.phoneNumber || '');
//             setEmail(data.email || currentUser.email || '');
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         Alert.alert('Error', t.fetchError);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleUpdate = async () => {
//     try {
//       if (currentUser) {
//         const userRef = doc(firestore, 'Users', currentUser.uid);
//         await updateDoc(userRef, {
//           fullName: displayName,
//           phoneNumber: phone,
//           email: email,
//         });

//         await updateProfile(currentUser, {
//           displayName: displayName,
//         });

//         Alert.alert(t.title, t.success);
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       Alert.alert('Error', t.fail);
//     }
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ marginTop: 40 }} color="#9333EA" />;
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>{t.title}</Text>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>{t.fullName}</Text>
//         <TextInput
//           style={styles.input}
//           value={displayName}
//           onChangeText={setDisplayName}
//           placeholder={t.placeholderName}
//           placeholderTextColor="#9CA3AF"
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>{t.email}</Text>
//         <TextInput
//           style={styles.input}
//           value={email}
//           onChangeText={setEmail}
//           placeholder={t.placeholderEmail}
//           keyboardType="email-address"
//           placeholderTextColor="#9CA3AF"
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>{t.phone}</Text>
//         <TextInput
//           style={styles.input}
//           value={phone}
//           onChangeText={setPhone}
//           placeholder={t.placeholderPhone}
//           keyboardType="phone-pad"
//           placeholderTextColor="#9CA3AF"
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>{t.password}</Text>
//         <TextInput
//           style={[styles.input, { backgroundColor: '#e5e7eb', color: '#6B7280' }]}
//           value={passwordPlaceholder}
//           secureTextEntry={true}
//           editable={false}
//         />
//       </View>

//       <TouchableOpacity style={styles.button} onPress={handleUpdate}>
//         <Text style={styles.buttonText}>{t.save}</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 24,
//     backgroundColor: '#ffffff',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#9333EA',
//     marginBottom: 32,
//     textAlign: 'center',
//   },
//   inputGroup: {
//     marginBottom: 24,
//   },
//   label: {
//     color: '#374151',
//     fontSize: 16,
//     marginBottom: 6,
//     fontWeight: '600',
//   },
//   input: {
//     backgroundColor: '#f3f4f6',
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: '#111827',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//   },
//   button: {
//     marginTop: 16,
//     backgroundColor: '#9333EA',
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   buttonText: {
//     color: '#F9FAFB',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default MyAccountPage;




// MyAccountPage with accessibility features
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../services/firebase';
import { LanguageContext } from '../context/LanguageContext';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';

const translations = {
  en: {
    title: 'My Account',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    password: 'Password',
    save: 'Save Changes',
    placeholderName: 'Full Name',
    placeholderEmail: 'Email',
    placeholderPhone: 'Phone Number',
    success: 'Profile updated successfully.',
    fail: 'Failed to update profile.',
    fetchError: 'Failed to fetch user data.',
    readAloud: 'Read Aloud',
    enlargeText: 'Increase Text',
    shrinkText: 'Decrease Text',
  },
  ar: {
    title: 'حسابي',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    password: 'كلمة المرور',
    save: 'حفظ التغييرات',
    placeholderName: 'الاسم الكامل',
    placeholderEmail: 'البريد الإلكتروني',
    placeholderPhone: 'رقم الهاتف',
    success: 'تم تحديث الحساب بنجاح.',
    fail: 'فشل في تحديث الحساب.',
    fetchError: 'فشل في جلب بيانات المستخدم.',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
  he: {
    title: 'החשבון שלי',
    fullName: 'שם מלא',
    email: 'אימייל',
    phone: 'מספר טלפון',
    password: 'סיסמה',
    save: 'שמור שינויים',
    placeholderName: 'שם מלא',
    placeholderEmail: 'אימייל',
    placeholderPhone: 'מספר טלפון',
    success: 'הפרופיל עודכן בהצלחה.',
    fail: 'עדכון הפרופיל נכשל.',
    fetchError: 'שגיאה בקבלת נתוני המשתמש.',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
};

const MyAccountPage = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [passwordPlaceholder] = useState('********');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const userRef = doc(firestore, 'Users', currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setDisplayName(data.fullName || currentUser.displayName || '');
            setPhone(data.phoneNumber || currentUser.phoneNumber || '');
            setEmail(data.email || currentUser.email || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', t.fetchError);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const speakContent = () => {
    if (!readerMode) return;
    const text = `${t.title}. ${t.fullName}, ${displayName}. ${t.email}, ${email}. ${t.phone}, ${phone}.`;
    Speech.speak(text, {
      language: language === 'ar' ? 'ar-SA' : language === 'he' ? 'he-IL' : 'en-US',
      pitch: 1,
      rate: 0.9,
    });
  };

  const handleUpdate = async () => {
    try {
      if (currentUser) {
        const userRef = doc(firestore, 'Users', currentUser.uid);
        await updateDoc(userRef, {
          fullName: displayName,
          phoneNumber: phone,
          email: email,
        });
        await updateProfile(currentUser, { displayName });
        Alert.alert(t.title, t.success);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', t.fail);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} color="#9333EA" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
      >
        <MaterialIcons name="accessibility" size={28} color="#9333EA" />
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setReaderMode(true); speakContent(); }}>
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

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { fontSize: fontSize + 4 }]}>{t.title}</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize }]}>{t.fullName}</Text>
          <TextInput
            style={[styles.input, { fontSize }]}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder={t.placeholderName}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize }]}>{t.email}</Text>
          <TextInput
            style={[styles.input, { fontSize }]}
            value={email}
            onChangeText={setEmail}
            placeholder={t.placeholderEmail}
            keyboardType="email-address"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize }]}>{t.phone}</Text>
          <TextInput
            style={[styles.input, { fontSize }]}
            value={phone}
            onChangeText={setPhone}
            placeholder={t.placeholderPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize }]}>{t.password}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#e5e7eb', color: '#6B7280', fontSize }]}
            value={passwordPlaceholder}
            secureTextEntry={true}
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={[styles.buttonText, { fontSize }]}>{t.save}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#374151',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#9333EA',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#F9FAFB',
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

export default MyAccountPage;