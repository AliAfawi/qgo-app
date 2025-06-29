
// import React, { useEffect, useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Modal,
// } from 'react-native';
// import { firestore, auth } from '../services/firebase';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { LanguageContext } from '../context/LanguageContext';
// import * as Speech from 'expo-speech';
// import { MaterialIcons } from '@expo/vector-icons';

// const translations = {
//   he: {
//     title: 'התורים שלי',
//     loading: 'טוען את התורים שלך...',
//     noQueues: 'אין לך תורים',
//     back: 'חזרה',
//     branch: 'שם הסניף',
//     date: 'תאריך',
//     time: 'שעה',
//     business: 'שם העסק',
//     readAloud: 'הקראה',
//     enlargeText: 'הגדל טקסט',
//     shrinkText: 'הקטן טקסט',
//   },
//   ar: {
//     title: 'مواعيدي',
//     loading: 'جاري تحميل المواعيد...',
//     noQueues: 'لا يوجد لديك مواعيد.',
//     back: 'رجوع',
//     branch: 'اسم الفرع',
//     date: 'التاريخ',
//     time: 'الوقت',
//     business: 'اسم المؤسسة',
//     readAloud: 'قراءة',
//     enlargeText: 'تكبير النص',
//     shrinkText: 'تصغير النص',
//   },
// };

// const businessNameTranslations = {
//   'משרד הפנים': 'وزارة الداخلية',
//   'דואר ישראל': 'بريد إسرائيل',
// };

// const branchNameTranslations = {
//   'אשקלון רחוב הרצל 18': 'أشكلون شارع هرتسل 18',
//   // ... המשך שמות הסניפים כפי ששלחת
// };

// const MyQueuesPage = () => {
//   const { language } = useContext(LanguageContext);
//   const t = translations[language] || translations.he;
//   const [queues, setQueues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [readerMode, setReaderMode] = useState(false);
//   const [fontSize, setFontSize] = useState(16);

//   const translateBusinessName = (name) => {
//     if (language === 'ar') return businessNameTranslations[name] || name;
//     return name;
//   };

//   const translateBranchName = (name) => {
//     if (language === 'ar') return branchNameTranslations[name] || name;
//     return name;
//   };

//   const speakQueues = () => {
//     if (!readerMode || queues.length === 0) return;
//     const text = `${t.title}. ${queues.length} תורים. ` + queues.map(q => `${translateBusinessName(q.business_name)}, ${translateBranchName(q.branch_name)} ${q.date}`).join('. ');
//     Speech.speak(text, {
//       language: language === 'ar' ? 'ar-SA' : language === 'he' ? 'he-IL' : 'en-US',
//       pitch: 1,
//       rate: 0.9,
//     });
//   };

//   useEffect(() => {
//     const fetchQueues = async () => {
//       try {
//         const userId = auth.currentUser?.email;
//         if (!userId) {
//           Alert.alert('Error', 'User not logged in.');
//           return;
//         }

//         const qRef = query(collection(firestore, 'appointments'), where('email', '==', userId));
//         const snapshot = await getDocs(qRef);
//         const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

//         setQueues(data);
//       } catch (err) {
//         console.error('Error fetching queues:', err.message);
//         Alert.alert('Error', 'Failed to fetch your queues. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQueues();
//   }, []);

//   const renderQueue = ({ item }) => {
//     const formattedDate = typeof item.date === 'string' ? item.date : item.date.toDate().toISOString().split('T')[0];
//     const formattedTime = typeof item.time === 'string' ? item.time : item.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//     return (
//       <View style={styles.card}>
//         <Text style={[styles.text, { fontSize }]}>📍 {t.branch}: {translateBranchName(item.branch_name)}</Text>
//         <Text style={[styles.text, { fontSize }]}>📅 {t.date}: {formattedDate}</Text>
//         <Text style={[styles.text, { fontSize }]}>⏰ {t.time}: {formattedTime}</Text>
//         <Text style={[styles.text, { fontSize }]}>🏢 {t.business}: {translateBusinessName(item.business_name)}</Text>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={() => setModalVisible(true)}
//         style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
//       >
//         <MaterialIcons name="accessibility" size={28} color="#9333EA" />
//       </TouchableOpacity>

//       <Modal transparent visible={modalVisible} animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity onPress={() => { setReaderMode(true); speakQueues(); }}>
//               <Text style={styles.modalOption}>{t.readAloud}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setFontSize((prev) => prev + 2)}>
//               <Text style={styles.modalOption}>{t.enlargeText} +</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setFontSize((prev) => Math.max(prev - 2, 12))}>
//               <Text style={styles.modalOption}>{t.shrinkText} -</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Text style={styles.modalClose}>✕</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Text style={[styles.title, { fontSize: fontSize + 4 }]}>{t.title}</Text>

//       {loading ? (
//         <Text style={[styles.loading, { fontSize }]}>{t.loading}</Text>
//       ) : queues.length === 0 ? (
//         <Text style={[styles.noQueues, { fontSize }]}>{t.noQueues}</Text>
//       ) : (
//         <FlatList
//           data={queues}
//           renderItem={renderQueue}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.list}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
//   title: { fontWeight: 'bold', color: '#9333EA', marginBottom: 20, textAlign: 'center' },
//   loading: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
//   noQueues: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
//   list: { paddingBottom: 20 },
//   card: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderColor: '#E5E7EB',
//     borderWidth: 1,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 1,
//   },
//   text: { color: '#1F2937', marginBottom: 6, textAlign: 'right' },
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
// });

// export default MyQueuesPage;







// MyQueuesPage.js – Updated to show only future queues

import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { firestore, auth } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';

const translations = {
  he: {
    title: 'התורים שלי',
    loading: 'טוען את התורים שלך...',
    noQueues: 'אין לך תורים',
    back: 'חזרה',
    branch: 'שם הסניף',
    date: 'תאריך',
    time: 'שעה',
    business: 'שם העסק',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
  ar: {
    title: 'مواعيدي',
    loading: 'جاري تحميل المواعيد...',
    noQueues: 'لا يوجد لديك مواعيد.',
    back: 'رجوع',
    branch: 'اسم الفرع',
    date: 'التاريخ',
    time: 'الوقت',
    business: 'اسم المؤسسة',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
};

const businessNameTranslations = {
  'משרד הפנים': 'وزارة الداخلية',
  'דואר ישראל': 'بريد إسرائيل',
};


const branchNameTranslations = {
  'אשקלון רחוב הרצל 18': 'أشكلون شارع هرتسل 18',
  'דימונה שדרות הרצל 1': 'ديمونا شارع هرتسل 1',
  'אשקלון רחוב אורט 24': 'أشكلون شارع أورط 24',
    'באר שבע שדרות דוד טוביהו 125': 'بئر السبع شارع دافيد طوبياهو 125',
    'באר שבע שדרות יצחק רגר 31': 'بئر السبع شارع يتسحاق ريجر 31',
    'אשדוד רחוב שבי ציון 6': 'أشدود شارع شافي تسيون 6',
    'אשדוד רחוב העצמאות 85': 'أشدود شارع الاستقلال 85',
    'שדרות רחוב הרצל 1': 'ديمونا شارع هرتسل 1',
    'דימונה רחוב ז\'בוטינסקי 5': 'ديمونا شارع جابوتنسكي 5',
    'אילת רחוב קאמן 8': 'إيلات شارع كامن 8',
    'אילת רחוב התמרים 1': 'إيلات شارع التمرين 1',
    'קריית גת שדרות לכיש 15': 'كريات جات شارع لحيش 15',
    'קריית גת שדרות מלכי ישראל 178': 'كريات جات شارع ملوك إسرائيل 178',
    'קריית מלאכי רחוב בן גוריון 2': 'كريات ملاخي شارع بن غوريون 2',
    'קריית מלאכי רחוב ויצמן 18': 'كريات ملاخي شارع فايتسمان 18',
    'נתיבות רחוב ירושלים 1': 'نتيفوت شارع القدس 1',
    'נתיבות אזור תעשייה קריית יהודית': 'نتيفوت منطقة صناعية كريات يهوديت',
    'רהט רחוב הראשי 100': 'رهط الشارع الرئيسي 100',
    'רהט שכונה 7': 'رهط الحي السابع',
    'שדרות רחוב הרצל 5': 'سديروت شارع هرتسل 5',
    'שדרות רחוב בן יהודה 10': 'سديروت شارع بن يهودا 10',
    'חורה רחוב הראשי': 'حورة الشارع الرئيسي',
    'לקיה רחוב הראשי': 'اللقية الشارع الرئيسي',
    'כסייפה רחוב הראשי': 'كسيفة الشارع الرئيسي',
    'ערערה בנגב רחוב הראשי': 'عرعرة في النقب الشارع الرئيسي',
    'שגב שלום רחוב הראשי': 'شقيب السلام الشارع الرئيسي',
    'עומר מרכז מסחרי': 'عومر المركز التجاري',
    'מיתר מרכז מסחרי': 'ميتار المركز التجاري',
    'להבים מרכז מסחרי': 'لهافيم المركز التجاري',
    'נווה זוהר רחוב הראשי': 'نيفيه زوهر الشارع الرئيسي',
    'עין יהב מרכז היישוב': 'عين يهاف مركز البلدة',
    'שדרות רחוב הרצל 1': 'سديروت شارع هرتسل 1',
    'באר שבע שדרות שז"ר 31': 'بئر السبع شارع شازار 31',
      'אשקלון רחוב נחל 1 מרכז צימר': 'أشكلون شارع ناحال 1 مركز تسيمر',
      'אשדוד רחוב הכלנית 13': 'أشدود شارع هكلانيت 13',
      'אילת רחוב חטיבת גולני 2': 'إيلات شارع حطيفات جولاني 2',
  "תחנת משטרת תל אביב - יפת 42": "محطة شرطة تل أبيب - يافيت 42",
  "תחנת משטרת ירושלים - שלם": "محطة شرطة القدس - شاليم",
  "תחנת משטרת באר שבע - שלמה המלך": "محطة شرطة بئر السبع - شلومو هاميلخ",
  "תחנת משטרת חיפה - מוריה": "محطة شرطة حيفا - موريا",
  "תחנת משטרת אשדוד - הבושם": "محطة شرطة أشدود - هابوسيم",
  "תחנת משטרת אילת - שדרות התמרים": "محطة شرطة إيلات - شارع التمرين",
  "תחנת משטרת נתניה - שמואל הנציב": "محطة شرطة نتانيا - شموئيل هنَتسيف",
  "תחנת משטרת רמלה - הרצל": "محطة شرطة الرملة - هرتسل",
  "תחנת משטרת לוד - הרצל": "محطة شرطة اللد - هرتسل",
  "תחנת משטרת נצרת - פאולוס השישי": "محطة شرطة الناصرة - بولس السادس"
};


const MyQueuesPage = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.he;
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const translateBusinessName = (name) => {
    if (language === 'ar') return businessNameTranslations[name] || name;
    return name;
  };

  const translateBranchName = (name) => {
    if (language === 'ar') return branchNameTranslations[name] || name;
    return name;
  };

  const speakQueues = () => {
    if (!readerMode || queues.length === 0) return;
    const text = `${t.title}. ${queues.length} תורים. ` + queues.map(q => `${translateBusinessName(q.business_name)}, ${translateBranchName(q.branch_name)} ${q.date}`).join('. ');
    Speech.speak(text, {
      language: language === 'ar' ? 'ar-SA' : language === 'he' ? 'he-IL' : 'en-US',
      pitch: 1,
      rate: 0.9,
    });
  };

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const userId = auth.currentUser?.email;
        if (!userId) {
          Alert.alert('Error', 'User not logged in.');
          return;
        }

        const qRef = query(collection(firestore, 'appointments'), where('email', '==', userId));
        const snapshot = await getDocs(qRef);
        const now = new Date();
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((q) => {
            const time = q.time?.toDate?.() || new Date(`${q.date}T00:00`);
            return time >= now;
          });

        setQueues(data);
      } catch (err) {
        console.error('Error fetching queues:', err.message);
        Alert.alert('Error', 'Failed to fetch your queues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQueues();
  }, []);

  const renderQueue = ({ item }) => {
    const formattedDate = typeof item.date === 'string' ? item.date : item.date.toDate().toISOString().split('T')[0];
    const formattedTime = typeof item.time === 'string' ? item.time : item.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={styles.card}>
        <Text style={[styles.text, { fontSize }]}>📍 {t.branch}: {translateBranchName(item.branch_name)}</Text>
        <Text style={[styles.text, { fontSize }]}>📅 {t.date}: {formattedDate}</Text>
        <Text style={[styles.text, { fontSize }]}>⏰ {t.time}: {formattedTime}</Text>
        <Text style={[styles.text, { fontSize }]}>🏢 {t.business}: {translateBusinessName(item.business_name)}</Text>
      </View>
    );
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
            <TouchableOpacity onPress={() => { setReaderMode(true); speakQueues(); }}>
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

      {loading ? (
        <Text style={[styles.loading, { fontSize }]}>{t.loading}</Text>
      ) : queues.length === 0 ? (
        <Text style={[styles.noQueues, { fontSize }]}>{t.noQueues}</Text>
      ) : (
        <FlatList
          data={queues}
          renderItem={renderQueue}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  title: { fontWeight: 'bold', color: '#9333EA', marginBottom: 20, textAlign: 'center' },
  loading: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  noQueues: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  text: { color: '#1F2937', marginBottom: 6, textAlign: 'right' },
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

export default MyQueuesPage;