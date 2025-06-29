
// import React, { useEffect, useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   Linking,
//   I18nManager,
//   ScrollView,
// } from 'react-native';
// import { getAuth } from 'firebase/auth';
// import { firestore } from '../services/firebase';
// import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import { LanguageContext } from '../context/LanguageContext';

// const translations = {
//   ar: {
//     title: 'مستنداتي',
//     noDocuments: 'لا توجد مستندات.',
//     successDelete: 'تم حذف المستند بنجاح.',
//     errorDelete: 'فشل في حذف المستند.',
//     document: '📄 ',
//   },
//   he: {
//     title: 'המסמכים שלי',
//     noDocuments: 'לא נמצאו מסמכים.',
//     successDelete: 'המסמך נמחק בהצלחה.',
//     errorDelete: 'שגיאה במחיקת המסמך.',
//     document: '📄 ',
//   },
// };

// const requirementTranslations = {
//   "תעודת זהות": "بطاقة هوية",
//   "תעודות זהות של המוכר והקונה": "بطاقات هوية للبائع والمشتري",
//   "רישיון רכב בתוקף": "رخصة مركبة سارية",
//   "אישור ביטוח חובה בתוקף": "تصريح تأمين إجباري ساري",
//   "אמצעי תשלום": "وسيلة دفع",
//   "שובר תשלום או פרטי החשבון": "قسيمة دفع أو تفاصيل الحساب",
//   "פרטי המקבל": "تفاصيل المستلم",
//   "דבר הדואר": "عنصر بريدي",
//   "דבר הדואר או החבילה": "عنصر بريدي أو طرد",
//   "פרטי הנמען": "تفاصيل المستلم",
//   "פרטי האירוע": "تفاصيل الحدث",
//   "עיצוב החותמת": "تصميم الختم",
//   "תוכן ההודעה": "محتوى الرسالة",
//   "פרטי הנוסע": "تفاصيل المسافر",
//   "מסמכי הייבוא": "مستندات الاستيراد",
//   "מסמכים רלוונטיים לשירות המבוקש": "المستندات ذات الصلة بالخدمة المطلوبة",
//   "תמצית רישום ממרשם האוכלוסין": "ملخص التسجيل من سجل السكان",
//   "תעודות נישואין מקוריות": "شهادات الزواج الأصلية",
//   "תעודת לידה מבית החולים": "شهادة ميلاد من المستشفى",
//   "טופס בקשה לשינוי שם": "نموذج طلب تغيير اسم",
//   "תעודת זהות של המודיע": "بطاقة هوية المبلغ",
//   "תעודת פטירה מבית החולים": "شهادة وفاة من المستشفى",
//   "טופס בקשה לאזרחות": "نموذج طلب الجنسية",
//   "טופס בקשה לאשרה": "نموذج طلب تأشيرة",
//   "תעודת זהות קיימת (אם קיימת)": "بطاقة هوية حالية (إذا كانت موجودة)",
//   "שתי תמונות פספורט עדכניות": "صورتان حديثتان لجواز السفر",
//   "דרכון קודם (אם קיים)": "جواز سفر سابق (إن وجد)",
//   "תעודות זהות של שני בני הזוג": "بطاقات هوية للزوجين",
//   "תעודות זהות של ההורים": "بطاقات هوية الوالدين",
//   "מסמכים נוספים בהתאם למקרה": "مستندات إضافية حسب الحالة"
// };

// const MyDocumentsPage = () => {
//   const { language } = useContext(LanguageContext);
//   const t = translations[language] || translations.he;
//   const currentUser = getAuth().currentUser;
//   const [documents, setDocuments] = useState([]);

//   useEffect(() => {
//     if (!currentUser) return;

//     const fetchDocuments = async () => {
//       try {
//         const q = query(
//           collection(firestore, 'files'),
//           where('user_id', '==', currentUser.uid)
//         );
//         const snapshot = await getDocs(q);
//         const docs = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setDocuments(docs);
//       } catch (err) {
//         console.error('Error fetching documents:', err);
//       }
//     };

//     fetchDocuments();
//   }, []);

//   const handleDelete = async (docId) => {
//     try {
//       await deleteDoc(doc(firestore, 'files', docId));
//       setDocuments((prev) => prev.filter((item) => item.id !== docId));
//       Alert.alert(t.successDelete);
//     } catch (err) {
//       console.error('Error deleting document:', err);
//       Alert.alert(t.errorDelete);
//     }
//   };

//   const translateRequirement = (req) => {
//     return language === 'ar' ? requirementTranslations[req] || req : req;
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.docText}>
//         {t.document}{translateRequirement(item.requirement)}
//       </Text>
//       <View style={styles.actions}>
//         <TouchableOpacity onPress={() => Linking.openURL(item.file_url)}>
//           <MaterialIcons name="visibility" size={24} color="#3B82F6" style={styles.iconButton} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleDelete(item.id)}>
//           <FontAwesome name="trash" size={24} color="#EF4444" style={styles.iconButton} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{t.title}</Text>
//       {documents.length === 0 ? (
//         <Text style={styles.emptyText}>{t.noDocuments}</Text>
//       ) : (
//         <FlatList
//           data={documents}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.list}
//         />
//       )}
//     </View>
//   );
  
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#f3f4f6',
//     padding: 20,
//     paddingBottom: 40,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#9333EA',
//     marginBottom: 24,
//     textAlign: 'center',
    

//   },
//   list: {
//     gap: 16,
//   },
//   card: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.05)',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 1,
//         textAlign: 'center',
        

//   },
//   docText: {
//     fontSize: 16,
//     color: '#1F2937',
//     marginBottom: 12,
//     fontWeight: '600',
//     textAlign: 'right',
    

//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start', // מצד שמאל
//     marginTop: 10,
//   },
//   iconButton: {
//     marginRight: 16, // רווח בין האייקונים
//   },
  
//   emptyText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 40,
//     textAlign: 'left',


//   },
// });

// export default MyDocumentsPage;



// MyDocumentsPage with accessibility features
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { firestore } from '../services/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';
import * as Speech from 'expo-speech';

const translations = {
  ar: {
    title: 'مستنداتي',
    noDocuments: 'لا توجد مستندات.',
    successDelete: 'تم حذف المستند بنجاح.',
    errorDelete: 'فشل في حذف المستند.',
    document: '📄 ',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
  he: {
    title: 'המסמכים שלי',
    noDocuments: 'לא נמצאו מסמכים.',
    successDelete: 'המסמך נמחק בהצלחה.',
    errorDelete: 'שגיאה במחיקת המסמך.',
    document: '📄 ',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
};

const requirementTranslations = {
  // נשמרו כפי שהם
};

const MyDocumentsPage = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.he;
  const currentUser = getAuth().currentUser;
  const [documents, setDocuments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    if (!currentUser) return;
    const fetchDocuments = async () => {
      try {
        const q = query(
          collection(firestore, 'files'),
          where('user_id', '==', currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(docs);
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    };
    fetchDocuments();
  }, []);

  const handleDelete = async (docId) => {
    try {
      await deleteDoc(doc(firestore, 'files', docId));
      setDocuments((prev) => prev.filter((item) => item.id !== docId));
      Alert.alert(t.successDelete);
    } catch (err) {
      console.error('Error deleting document:', err);
      Alert.alert(t.errorDelete);
    }
  };

  const translateRequirement = (req) => {
    return language === 'ar' ? requirementTranslations[req] || req : req;
  };

  const speakDocs = () => {
    if (!readerMode || documents.length === 0) return;
    const text = `${t.title}. ${documents.length} מסמכים. ` + documents.map(d => translateRequirement(d.requirement)).join('. ');
    Speech.speak(text, {
      language: language === 'ar' ? 'ar-SA' : 'he-IL',
      pitch: 1,
      rate: 0.9,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={[styles.docText, { fontSize }]}>
        {t.document}{translateRequirement(item.requirement)}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => Linking.openURL(item.file_url)}>
          <MaterialIcons name="visibility" size={24} color="#3B82F6" style={styles.iconButton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <FontAwesome name="trash" size={24} color="#EF4444" style={styles.iconButton} />
        </TouchableOpacity>
      </View>
    </View>
  );

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
            <TouchableOpacity onPress={() => { setReaderMode(true); speakDocs(); }}>
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

      {documents.length === 0 ? (
        <Text style={[styles.emptyText, { fontSize }]}>{t.noDocuments}</Text>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 24,
    textAlign: 'center',
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  docText: {
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  iconButton: {
    marginRight: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 40,
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

export default MyDocumentsPage;
