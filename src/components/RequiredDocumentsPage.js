import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { firestore } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

// Translations
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

const requirementTranslations = {
  "תעודת זהות קיימת (אם קיימת)": "بطاقة هوية قائمة (إن وُجدت)",
  "שתי תמונות פספורט עדכניות": "صورتان حديثتان بحجم جواز السفر",
  "אמצעי תשלום​": "وسيلة دفع",
  "תעודת זהות": "بطاقة هوية",
  "דרכון קודם (אם קיים)​": "جواز سفر سابق (إن وُجد)",
  "תעודות זהות של שני בני הזוג":"بطاقات هوية للزوجين",
  "תמצית רישום ממרשם האוכלוסין": "مستخلص تسجيل من سجل السكان",
  "תעודות נישואין מקוריות": "شهادات زواج أصلية",
  "תעודות זהות של ההורים": "بطاقات هوية للوالدين",
  "תעודת לידה מבית החולים": "شهادة ميلاد من المستشفى",
  "טופס בקשה לשינוי שם": "نموذج طلب لتغيير الاسم",
  "הנפקת תעודות זהות ביומטריות": "إصدار بطاقات هوية بيومترية",
  "הנפקת דרכונים ביומטריים": "إصدار جوازات سفر بيومترية",
  "רישום נישואין": "تسجيل الزواج",
  "רישום לידה": "تسجيل المواليد",
  "רישום לשינוי שם": "تسجيل لتغيير الاسم",
  "הנפקת ספח תעודת זהות": "إصدار ملحق بطاقة الهوية",
  "הנפקת תמצית רישום": "إصدار مستخلص تسجيل",
  "הנפקת תעודת פטירה": "إصدار شهادة وفاة",
  "תעודת פטירה מבית החולים": "شهادة وفاة من المستشفى",
  "תעודת זהות של המודיע":"بطاقة هوية المُبلِّغ",
  "בקשות לאזרחות": "طلبات للحصول على الجنسية",
  "טופס בקשה לאזרחות": "نموذج طلب للجنسية",
  "מסמכים נוספים בהתאם למקרה​": "مستندات إضافية حسب الحالة",
  "הנפקת אשרות שהייה": "إصدار تصاريح إقامة",
  "טופס בקשה לאשרה": "نموذج طلب لتصريح الإقامة",
  "מסמכים נוספים בהתאם למקרה": "مستندات إضافية حسب الحالة",
  "תעודת זהות": "بطاقة هوية",
"כל מסמך או הוכחה רלוונטיים למקרה": "أي مستند أو دليل ذو صلة بالقضية",
"טופס בקשה ממולא": "نموذج طلب مُعبأ",
"רישיון נשק קודם": "رخصة سلاح سابقة",
"אישור רפואי": "تصريح طبي",
"מסמכי רכב": "وثائق المركبة",
"רישיון נהיגה": "رخصة قيادة",
"פרטי התאונה": "تفاصيل الحادث",
"תעודות זהות של המוכר והקונה": "بطاقات هوية للبائع والمشتري",
"רישיון רכב בתוקף": "رخصة مركبة سارية المفعول",
"אישור ביטוח חובה בתוקף": "تصريح تأمين إجباري ساري المفعول",
"אמצעי תשלום": "وسيلة دفع",
"שובר תשלום או פרטי החשבון": "قسيمة دفع أو تفاصيل الحساب",
"פרטי המקבל": "تفاصيل المستلم",
"מסמכים רלוונטיים לשירות המבוקש": "مستندات ذات صلة بالخدمة المطلوبة",
"דבר הדואר": "المادة البريدية",
"פרטי הנמען": "تفاصيل المستلم",
"דבר הדואר או החבילה": "المادة البريدية أو الطرد",
"פרטי האירוע": "تفاصيل الحدث",
"עיצוב החותמת": "تصميم الختم",
"תוכן ההודעה": "محتوى الرسالة",
"פרטי הנוסע": "تفاصيل المسافر",
"מסמכי הייבוא": "وثائق الاستيراد",
"דרכון קודם (אם קיים)": "جواز سفر سابق (إن وُجد)",
"תעודת זהות של ההורה": "بطاقة هوية ولي الأمر",
"תעודת לידה של התלמיד": "شهادة ميلاد الطالب",
"אישור כתובת מגורים": "إثبات عنوان السكن",
"תעודת זהות": "بطاقة الهوية",
"אישור מעבר דירה": "إثبات الانتقال للسكن الجديد",
"מכתב נימוק להעבר": "رسالة توضيحية لطلب النقل",
"אישור הכנסה": "إثبات الدخل",
"טופס בקשה לסיוע": "نموذج طلب مساعدة",
"טופס בקשה": "نموذج الطلب",
"שובר תשלום": "قسيمة الدفع",
"פנייה בכתב": "طلب مكتوب",
"מסמכים רלוונטיים מהמסגרת החינוכית": "مستندات ذات صلة من الإطار التعليمي"
};


const businessNameTranslations = {
  "משרד הפנים": "وزارة الداخلية",
  "דואר ישראל": "بريد إسرائيل",
  'משטרת ישראל': 'الشرطة',
  "משרד החינוך": "وزارة التربية والتعليم",

};

const translations = {
  ar: {
    title: "المتطلبات لأنواع الطوابير في",
    noQueueTypes: "لم يتم العثور على أنواع طوابير لهذا العمل.",
    fetchError: "فشل في تحميل أنواع الطوابير. الرجاء المحاولة مرة أخرى.",
    requirements: "المتطلبات:",
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
  he: {
    title: "דרישות עבור סוגי התורים ב",
    noQueueTypes: "לא נמצאו סוגי תורים לעסק זה.",
    fetchError: "שגיאה בטעינת סוגי התורים. נסה שוב מאוחר יותר.",
    requirements: "דרישות:",
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
};

const RequiredDocumentsPage = ({ route }) => {
  const { businessName } = route.params;
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.he;

  const [queueTypes, setQueueTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  useEffect(() => {
    const fetchQueueTypes = async () => {
      try {
        const businessesCollection = collection(firestore, "businesses");
        const q = query(businessesCollection, where("business_name", "==", businessName));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const businessData = snapshot.docs[0].data();
          const uniqueQueueTypes = [];
          const seenTypes = new Set();

          businessData.queue_types.forEach((queue) => {
            if (!seenTypes.has(queue.type)) {
              seenTypes.add(queue.type);
              uniqueQueueTypes.push(queue);
            }
          });

          setQueueTypes(uniqueQueueTypes);
        } else {
          Alert.alert("Error", t.noQueueTypes);
        }
      } catch (error) {
        console.error("Error fetching queue types:", error);
        Alert.alert("Error", t.fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueTypes();
  }, [businessName]);

  const translateQueueType = (queueType) => {
    return language === "ar" ? queueTypeTranslations[queueType] || queueType : queueType;
  };

  const translateRequirement = (requirement) => {
    return language === "ar" ? requirementTranslations[requirement] || requirement : requirement;
  };

  const translateBusinessName = (name) => {
    return language === "ar" ? businessNameTranslations[name] || name : name;
  };

  const speakAll = () => {
    if (!readerMode) return;
    const entries = queueTypes.flatMap((item) => {
      const type = translateQueueType(item.type);
      const reqs = item.requirements.map((r) => translateRequirement(r));
      return [`${type}`, `${t.requirements}:`, ...reqs];
    });

    let index = 0;
    const speakNext = () => {
      if (index < entries.length) {
        setHighlightedIndex(index);
        Speech.speak(entries[index], {
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

  const renderQueueType = ({ item, index }) => {
    const baseIndex = index * (2 + item.requirements.length);
    return (
      <View style={[styles.queueCard, highlightedIndex === baseIndex && styles.highlighted]}>
        <Text style={[styles.queueTitle, { fontSize }]}>{translateQueueType(item.type)}</Text>
        <Text style={[styles.subTitle, { fontSize }]}>{t.requirements}</Text>
        {item.requirements.map((req, i) => (
          <Text
            key={i}
            style={[
              styles.queueText,
              highlightedIndex === baseIndex + 2 + i && styles.highlighted,
              { fontSize },
            ]}
          >
            • {translateRequirement(req)}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Accessibility Modal Trigger */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialIcons name="accessibility" size={28} color="#9333EA" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { fontSize: fontSize + 6 }]}>
        {t.title} {translateBusinessName(businessName)}
      </Text>

      {/* Accessibility Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setReaderMode(true); speakAll(); }}>
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

      {loading ? (
        <ActivityIndicator size="large" color="#9333EA" />
      ) : (
        <FlatList
          data={queueTypes}
          renderItem={renderQueueType}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  headerRow: {
    marginBottom: 10,
    textAlign: "left",

  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#9333EA",
  },
  listContainer: {
    paddingBottom: 20,
  },
  queueCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  highlighted: {
    borderColor: '#9333EA',
    borderWidth: 2,
    
  },
  queueTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "right",
  },
  subTitle: {
    fontWeight: "bold",
    color: "#555",
    marginTop: 5,
    textAlign: "right",
  },
  queueText: {
    color: "#333",
    marginBottom: 3,
    textAlign: "right",
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

export default RequiredDocumentsPage;
