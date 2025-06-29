// import React, { useEffect, useState, useContext } from 'react';
// import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
// import { getAuth } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { firestore } from '../services/firebase';
// import { LanguageContext } from '../context/LanguageContext';

// const translations = {
//   en: {
//     welcome: 'Welcome',
//     myAccount: 'My Account',
//     myQueues: 'My Queues',
//     myDocuments: 'My Documents',
//   },
//   ar: {
//     welcome: 'مرحبًا',
//     myAccount: 'حسابي',
//     myQueues: 'طوابيري',
//     myDocuments: 'مستنداتي',
//   },
//   he: {
//     welcome: 'ברוך הבא',
//     myAccount: 'החשבון שלי',
//     myQueues: 'התורים שלי',
//     myDocuments: 'המסמכים שלי',
//   },
// };

// const ProfileButton = ({ icon, label, onPress, style }) => {
//   return (
//     <TouchableOpacity 
//       style={[buttonStyles.button, style]} 
//       onPress={onPress}
//       activeOpacity={0.7}
//     >
//       <View style={buttonStyles.iconContainer}>
//         {icon}
//       </View>
//       <Text style={buttonStyles.label}>{label}</Text>
//       <View style={buttonStyles.highlight} />
//     </TouchableOpacity>
//   );
// };

// const buttonStyles = StyleSheet.create({
//   button: {
//     width: '100%',
//     height: 100,
//     backgroundColor: '#1F2937',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//     overflow: 'hidden',
//   },
//   iconContainer: {
//     marginBottom: 10,
//   },
//   label: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   highlight: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: '100%',
//     height: 3,
//     backgroundColor: '#9333EA',
//     opacity: 0,
//   },
// });

// const ProfileContainer = ({ children, username = "User", welcomeText }) => {
//   return (
//     <View style={containerStyles.container}>
//       <View style={containerStyles.profileHeader}>
//         <View style={containerStyles.avatarContainer}>
//           <View style={containerStyles.avatarGlow} />
//           <View style={containerStyles.avatar}>
//             <Text style={containerStyles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
//           </View>
//         </View>
//         <Text style={containerStyles.welcomeText}>{welcomeText}, {username}</Text>
//       </View>
//       {children}
//     </View>
//   );
// };

// const containerStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 48,
//     paddingHorizontal: 16,
//     width: "100%",
//   },
//   profileHeader: {
//     alignItems: "center",
//     marginBottom: 40,
//   },
//   avatarContainer: {
//     position: "relative",
//     marginBottom: 24,
//   },
//   avatarGlow: {
//     position: "absolute",
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "rgba(147, 51, 234, 0.3)",
//     opacity: 0.7,
//   },
//   avatar: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     backgroundColor: "#9333EA",
//     borderWidth: 4,
//     borderColor: "rgba(255, 255, 255, 0.1)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarText: {
//     fontSize: 36,
//     color: "white",
//     fontWeight: "bold",
//   },
//   welcomeText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#9333EA",
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitleText: {
//     fontSize: 16,
//     color: "#6B7280",
//     marginBottom: 32,
//   },
// });

// const ProfilePage = ({ navigation }) => {
//   const { language } = useContext(LanguageContext);
//   const t = translations[language];
//   const [username, setUsername] = useState('User');

//   useEffect(() => {
//     const fetchUsername = async () => {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (user) {
//         const docRef = doc(firestore, 'Users', user.uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setUsername(data.fullName || 'User');
//         }
//       }
//     };

//     fetchUsername();
//   }, []);

//   return (
//     <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#f3f4f6' }}>
//       <ProfileContainer username={username} welcomeText={t.welcome}>
//         <View style={{ width: '100%', gap: 16 }}>
//           <ProfileButton
//             icon={<FontAwesome name="user" size={28} color="white" />}
//             label={t.myAccount}
//             onPress={() => navigation.navigate('MyAccountPage')}
//           />
//           <ProfileButton
//             icon={<MaterialIcons name="event-note" size={28} color="white" />}
//             label={t.myQueues}
//             onPress={() => navigation.navigate('MyQueuesPage')}
//           />
//           <ProfileButton
//             icon={<MaterialIcons name="insert-drive-file" size={28} color="white" />}
//             label={t.myDocuments}
//             onPress={() => navigation.navigate('MyDocumentsPage')}
//           />
//         </View>
//       </ProfileContainer>
//     </ScrollView>
//   );
// };

// export default ProfilePage;



// ProfilePage with accessibility features
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../services/firebase';
import { LanguageContext } from '../context/LanguageContext';
import * as Speech from 'expo-speech';

const translations = {
  en: {
    welcome: 'Welcome',
    myAccount: 'My Account',
    myQueues: 'My Queues',
    myDocuments: 'My Documents',
    readAloud: 'Read Aloud',
    enlargeText: 'Increase Text',
    shrinkText: 'Decrease Text',
  },
  ar: {
    welcome: 'مرحبًا',
    myAccount: 'حسابي',
    myQueues: 'طوابيري',
    myDocuments: 'مستنداتي',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
  he: {
    welcome: 'ברוך הבא',
    myAccount: 'החשבון שלי',
    myQueues: 'התורים שלי',
    myDocuments: 'המסמכים שלי',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
};

const ProfileButton = ({ icon, label, onPress, style, fontSize }) => {
  return (
    <TouchableOpacity 
      style={[buttonStyles.button, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={buttonStyles.iconContainer}>{icon}</View>
      <Text style={[buttonStyles.label, { fontSize }]}>{label}</Text>
      <View style={buttonStyles.highlight} />
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    width: '100%',
    height: 100,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  iconContainer: { marginBottom: 10 },
  label: { color: 'white', fontWeight: '600' },
  highlight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#9333EA',
    opacity: 0,
  },
});

const ProfileContainer = ({ children, username = "User", welcomeText, fontSize }) => (
  <View style={containerStyles.container}>
    <View style={containerStyles.profileHeader}>
      <View style={containerStyles.avatarContainer}>
        <View style={containerStyles.avatarGlow} />
        <View style={containerStyles.avatar}>
          <Text style={containerStyles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
        </View>
      </View>
      <Text style={[containerStyles.welcomeText, { fontSize: fontSize + 4 }]}>
        {welcomeText}, {username}
      </Text>
    </View>
    {children}
  </View>
);

const containerStyles = StyleSheet.create({
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
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 16,
    width: "100%",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 24,
  },
  avatarGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(147, 51, 234, 0.3)",
    opacity: 0.7,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#9333EA",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
  },
  welcomeText: {
    fontWeight: "bold",
    color: "#9333EA",
    marginBottom: 8,
    textAlign: 'center',
  },
});

const ProfilePage = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const [username, setUsername] = useState('User');
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const fetchUsername = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(firestore, 'Users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.fullName || 'User');
        }
      }
    };
    fetchUsername();
  }, []);

  const speakProfile = () => {
    if (!readerMode) return;
    const text = `${t.welcome}, ${username}. ${t.myAccount}, ${t.myQueues}, ${t.myDocuments}`;
    Speech.speak(text, {
      language: language === 'ar' ? 'ar-SA' : language === 'he' ? 'he-IL' : 'en-US',
      pitch: 1,
      rate: 0.9,
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#f3f4f6' }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
      >
        <MaterialIcons name="accessibility" size={28} color="#9333EA" />
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={containerStyles.modalOverlay}>
          <View style={containerStyles.modalContent}>
            <TouchableOpacity onPress={() => { setReaderMode(true); speakProfile(); }}>
              <Text style={containerStyles.modalOption}>{t.readAloud}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize((prev) => prev + 2)}>
              <Text style={containerStyles.modalOption}>{t.enlargeText} +</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize((prev) => Math.max(prev - 2, 12))}>
              <Text style={containerStyles.modalOption}>{t.shrinkText} -</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={containerStyles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ProfileContainer username={username} welcomeText={t.welcome} fontSize={fontSize}>
        <View style={{ width: '100%', gap: 16 }}>
          <ProfileButton
            icon={<FontAwesome name="user" size={28} color="white" />}
            label={t.myAccount}
            onPress={() => navigation.navigate('MyAccountPage')}
            fontSize={fontSize}
          />
          <ProfileButton
            icon={<MaterialIcons name="event-note" size={28} color="white" />}
            label={t.myQueues}
            onPress={() => navigation.navigate('MyQueuesPage')}
            fontSize={fontSize}
          />
          <ProfileButton
            icon={<MaterialIcons name="insert-drive-file" size={28} color="white" />}
            label={t.myDocuments}
            onPress={() => navigation.navigate('MyDocumentsPage')}
            fontSize={fontSize}
          />
        </View>
      </ProfileContainer>
    </ScrollView>
  );
};

export default ProfilePage;
