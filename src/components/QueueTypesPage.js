import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { firestore } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const queueTypeTranslations = {
  // כללי
  'אשנב כל': 'شباك الجميع',
  'מטבע חוץ': 'العملات الأجنبية',
  'מסירת דואר ללקוח': 'تسليم البريد للعميل',

  // משרד הפנים - Ministry of Interior
  "הנפקת תעודות זהות ביומטריות": "إصدار بطاقات هوية بيومترية",
  "הנפקת דרכונים ביומטריים": "إصدار جوازات سفر بيومترية",
  "רישום נישואין": "تسجيل الزواج",
  "רישום לידה": "تسجيل الولادة",
  "רישום לשינוי שם": "تسجيل تغيير الاسم",
  "הנפקת ספח תעודת זהות": "إصدار ملحق بطاقة هوية",
  "הנפקת תמצית רישום": "إصدار ملخص تسجيل",
  "הנפקת תעודת פטירה": "إصدار شهادة وفاة",
  "בקשות לאזרחות": "طلبات الجنسية",
  "הנפקת אשרות שהייה": "إصدار تأشيرات إقامة",

  // משטרה - Police
  "הגשת תלונה": "تقديم شكوى",
  "תעודת יושר (תעודת רישום פלילי)": "شهادة حسن سيرة وسلوك (سجل جنائي)",
  "חידוש רישיון נשק": "تجديد رخصة سلاح",
  "בדיקת תנועה / תאונה": "فحص مروري / حادث",
  "אישור שהייה בתחנה": "شهادة تواجد في المحطة",

  // דואר ישראל - Israel Post
  "העברת בעלות רכב": "نقل ملكية مركبة",
  "תשלום חשבונות ואגרות": "دفع الفواتير والرسوم",
  "שירותי מטבע חוץ": "خدمات الصرف الأجنبي",
  "הנפקת כרטיסים נטענים (מאסטרקארד/ויזה)": "إصدار بطاقات مسبقة الدفع (ماستركارد/فيزا)",
  "שירותי Western Union (העברת כספים לחו\"ל)": "خدمات ويسترن يونيون (تحويل الأموال للخارج)",
  "פתיחת תיבת דואר אישית": "فتح صندوق بريد شخصي",
  "שירותי משרד הפנים (בסניפים נבחרים)": "خدمات وزارة الداخلية (في فروع مختارة)",
  "העברת כספים בארץ (מזומן בזמן)": "تحويل الأموال داخل البلاد (نقدًا في الوقت)",
  "שירותי דואר רשום": "خدمات البريد المسجل",
  "שירותי שליחים": "خدمات التوصيل",
  "הנפקת חותמות מיוחדות לרגל אירועים": "إصدار أختام خاصة للمناسبات",
  "שירותי פקס ומברקים": "خدمات الفاكس والبرقيات",
  "תשלום אגרות מעבר במסופי הגבול היבשתיים": "دفع رسوم العبور في المعابر الحدودية البرية",
  "העברת כספים בינלאומית (EuroGiro)": "تحويل الأموال دوليًا (EuroGiro)",
  "שירותי עמילות מכס בייבוא": "خدمات التخليص الجمركي للاستيراد",

  // שירותי דואר כלליים
  "איסוף דואר רשום": "استلام بريد مسجل",
  "שליחת חבילה": "إرسال طرد",
  "קבלת חבילה": "استلام طرد",
  "שירותי בנק הדואר": "خدمات بنك البريد",
  "שליחת מכתבים": "إرسال رسائل",
  "רישום לשנת הלימודים": "تسجيل للسنة الدراسية",
  "העברת מוסד חינוכי": "نقل إلى مؤسسة تعليمية",
  "סיוע בשכר לימוד": "مساعدة في دفع القسط الدراسي",
  "הנפקת אישור זכאות לבגרות": "إصدار شهادة استحقاق للبجروت",
  "פתרון בעיות תלמידים": "حل مشاكل الطلاب" ,
};

const businessNameTranslations = {
  'דואר ישראל': 'بريد إسرائيل',
  'משרד הפנים': 'وزارة الداخلية',
  'משטרת ישראל': 'الشرطة',
  "משרד החינוך": "وزارة التربية والتعليم",

};

const translations = {
  ar: {
    title: 'أنواع الطوابير لـ',
    noQueueTypes: 'لم يتم العثور على أنواع طوابير لهذا العمل.',
    fetchError: 'فشل في تحميل أنواع الطوابير. الرجاء المحاولة مرة أخرى.',
    requirements: 'المتطلبات:',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
  he: {
    title: 'סוגי התורים עבור',
    noQueueTypes: 'לא נמצאו סוגי תורים לעסק זה.',
    fetchError: 'שגיאה בטעינת סוגי התורים. נסה שוב מאוחר יותר.',
    requirements: 'דרישות:',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
};

const QueueTypesPage = ({ route, navigation }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.he;
  const { businessName } = route.params;

  const [queueTypes, setQueueTypes] = useState([]);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  useEffect(() => {
    const fetchQueueTypes = async () => {
      try {
        const businessesCollection = collection(firestore, 'businesses');
        const q = query(businessesCollection, where('business_name', '==', businessName));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const businessData = snapshot.docs[0].data();
          setQueueTypes(businessData.queue_types || []);
        } else {
          setError(t.noQueueTypes);
        }
      } catch (err) {
        console.error('Error fetching queue types:', err.message);
        setError(t.fetchError);
      }
    };

    fetchQueueTypes();
  }, [businessName, t]);

  const speakAll = () => {
    if (!readerMode) return;
    const businessTranslated = translateBusinessName(businessName);
    const items = [`${t.title} ${businessTranslated}`, ...queueTypes.map(q => translateQueueType(q.type))];

    let index = 0;
    const speakNext = () => {
      if (index < items.length) {
        setHighlightedIndex(index);
        Speech.speak(items[index], {
          language: language === 'ar' ? 'ar-SA' : 'he-IL',
          pitch: 1,
          rate: 0.9,
          onDone: () => {
            index++;
            speakNext();
          },
        });
      } else {
        setHighlightedIndex(null);
      }
    };
    speakNext();
  };

  const handleQueueTypePress = (queueType) => {
    navigation.navigate('BranchesPage', { businessName, queueType });
  };

  const translateQueueType = (queueType) => {
    return language === 'ar' ? queueTypeTranslations[queueType] || queueType : queueType;
  };

  const translateBusinessName = (name) => {
    return language === 'ar' ? businessNameTranslations[name] || name : name;
  };

  const renderQueueType = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.queueTypeCard, highlightedIndex === index + 1 && styles.highlighted]}
      onPress={() => {
        handleQueueTypePress(item.type);
        if (readerMode) {
          Speech.stop();
          Speech.speak(translateQueueType(item.type), {
            language: language === 'ar' ? 'ar-SA' : 'he-IL',
            pitch: 1,
            rate: 0.9,
          });
        }
      }}
    >
      <Text style={[styles.queueTypeName, { fontSize }]}>{translateQueueType(item.type)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Accessibility Icon */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.accessIcon}>
        <MaterialIcons name="accessibility" size={28} color="#9333EA" />
      </TouchableOpacity>

      {/* Modal for Accessibility Options */}
      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => {}}>
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

      <Text style={[styles.title, highlightedIndex === 0 && styles.highlighted, { fontSize: fontSize + 6 }]}>
        {`${t.title} ${translateBusinessName(businessName)}`}
      </Text>

      {error ? <Text style={[styles.error, { fontSize }]}>{error}</Text> : null}

      <FlatList
        data={queueTypes}
        renderItem={renderQueueType}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  accessIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#9333EA',
  },
  listContainer: {
    alignItems: 'center',
  },
  queueTypeCard: {
    backgroundColor: '#1F2937',
    padding: 15,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.9,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  queueTypeName: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 20,
  },
  highlighted: {
    borderColor: '#9333EA',
    borderWidth: 2,
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

export default QueueTypesPage;
