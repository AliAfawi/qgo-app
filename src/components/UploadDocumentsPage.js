import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  Dimensions,
  Modal,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { firestore } from '../services/firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import * as Speech from 'expo-speech';

// Pinata API keys
const PINATA_API_KEY = 'd8ff720eccc9212405c2';
const PINATA_API_SECRET = '870511c9f5e5912a3f8fac1266a872bf4817f507f1ff13f0dc2717b47cae0b98';

const businessNameTranslations = {
  "משרד הפנים": "وزارة الداخلية",
  "דואר ישראל": "بريد إسرائيل",
  'משטרת ישראל': 'الشرطة',
  "משרד החינוך": "وزارة التربية والتعليم",

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
"מסמכים רלוונטיים מהמסגרת החינוכית": "مستندات ذات صلة من الإطار التعليمي",
};

const translations = {
  ar: {
    title: 'تحميل المستندات المطلوبة لـ',
    upload: 'تحميل ملف PDF',
    uploading: 'جارٍ التحميل...',
    view: 'عرض الملف',
    delete: 'حذف الملف',
    noRequirements: 'لم يتم العثور على متطلبات لهذا النشاط التجاري.',
    successUpload: 'تم تحميل المستند بنجاح!',
    successDelete: 'تم حذف المستند بنجاح!',
    errorUpload: 'فشل في تحميل المستند.',
    errorDelete: 'فشل في حذف المستند.',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
  he: {
    title: 'העלאת מסמכים נדרשים עבור',
    upload: 'העלה קובץ PDF',
    uploading: 'מעלה...',
    view: 'צפה בקובץ',
    delete: 'מחק קובץ',
    noRequirements: 'לא נמצאו דרישות עבור עסק זה.',
    successUpload: 'המסמך הועלה בהצלחה!',
    successDelete: 'המסמך נמחק בהצלחה!',
    errorUpload: 'שגיאה בהעלאת המסמך.',
    errorDelete: 'שגיאה במחיקת המסמך.',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
};

const UploadDocumentsPage = ({ route }) => {
  const { businessName } = route.params;
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.he;
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    const fetchRequirements = async () => {
      try {
        const businessesCollection = collection(firestore, 'businesses');
        const q = query(businessesCollection, where('business_name', '==', businessName));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const businessData = snapshot.docs[0].data();
          const allRequirements = [];

          businessData.queue_types.forEach((queue) => {
            queue.requirements.forEach((req) => {
              if (!allRequirements.includes(req)) {
                allRequirements.push(req);
              }
            });
          });

          setRequirements(allRequirements);
        } else {
          Alert.alert('Error', t.noRequirements);
        }
      } catch (error) {
        console.error('Error fetching requirements:', error);
        Alert.alert('Error', t.noRequirements);
      } finally {
        setLoading(false);
      }
    };

    const fetchUploadedFiles = async () => {
      try {
        const filesCollection = collection(firestore, 'files');
        const q = query(filesCollection, where('user_id', '==', currentUser.uid), where('business_name', '==', businessName));
        const snapshot = await getDocs(q);

        const files = {};
        snapshot.forEach(doc => {
          const data = doc.data();
          files[data.requirement] = data.file_url;
        });

        setUploadedFiles(files);
      } catch (error) {
        console.error('Error fetching uploaded files:', error);
      }
    };

    fetchRequirements();
    fetchUploadedFiles();
  }, [businessName]);

  const handleUpload = async (requirement) => {
    if (!currentUser) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    if (uploadedFiles[requirement]) {
      Alert.alert('Notice', 'A file is already uploaded for this requirement. Please delete it to upload a new one.');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (result.canceled) return;

      setUploading((prev) => ({ ...prev, [requirement]: true }));

      const fileUri = result.assets[0].uri;
      const fileName = `${requirement}_${Date.now()}.pdf`;
      const file = { uri: fileUri, name: fileName, type: 'application/pdf' };

      const formData = new FormData();
      formData.append('file', file);

      const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
      const response = await axios.post(pinataEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      });

      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      const fileDocRef = doc(firestore, 'files', `${currentUser.uid}_${requirement}`);

      await setDoc(fileDocRef, {
        business_name: businessName,
        file_name: fileName,
        file_type: 'pdf',
        file_url: ipfsUrl,
        requirement,
        uploaded_at: new Date(),
        user_email: currentUser.email || 'unknown',
        user_id: currentUser.uid,
        user_name: currentUser.displayName || 'unknown',
      });

      setUploadedFiles((prev) => ({ ...prev, [requirement]: ipfsUrl }));
      Alert.alert('Success', t.successUpload);
    } catch (error) {
      console.error('Error uploading to Pinata:', error.response?.data || error.message);
      Alert.alert('Error', t.errorUpload);
    } finally {
      setUploading((prev) => ({ ...prev, [requirement]: false }));
    }
  };

  const handleDelete = async (requirement) => {
    try {
      const docId = `${currentUser.uid}_${requirement}`;
      await deleteDoc(doc(firestore, 'files', docId));
      setUploadedFiles((prev) => {
        const updated = { ...prev };
        delete updated[requirement];
        return updated;
      });
      Alert.alert('Success', t.successDelete);
    } catch (error) {
      console.error('Error deleting file:', error);
      Alert.alert('Error', t.errorDelete);
    }
  };

  const translateBusinessName = (name) => language === "ar" ? businessNameTranslations[name] || name : name;

  const speakAll = () => {
    if (!readerMode) return;
    const entries = requirements.map(req => requirementTranslations[req] || req);
    let index = 0;
    const speakNext = () => {
      if (index < entries.length) {
        setHighlightedIndex(index);
        Speech.speak(entries[index], {
          language: language === 'ar' ? 'ar-SA' : 'he-IL',
          rate: 0.9,
          onDone: () => {
            index++;
            speakNext();
          }
        });
      } else {
        setHighlightedIndex(null);
      }
    };
    speakNext();
  };

  const renderRequirement = ({ item, index }) => {
    const translatedReq = language === 'ar' ? (requirementTranslations[item] || item) : item;
    return (
      <View style={[styles.requirementCard, highlightedIndex === index && styles.highlighted]}>
        <Text style={[styles.requirementText, { fontSize }]}>{translatedReq}</Text>
        <View style={styles.actionButtons}>
          {uploadedFiles[item] ? (
            <>
              <TouchableOpacity onPress={() => Linking.openURL(uploadedFiles[item])}>
                <MaterialIcons name="visibility" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <FontAwesome name="trash" size={24} color="red" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={() => handleUpload(item)}>
              <Text style={styles.uploadButtonText}>
                {uploading[item] ? t.uploading : t.upload}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialIcons name="accessibility" size={28} color="#9333EA" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { fontSize: fontSize + 6 }]}>
        {t.title} {translateBusinessName(businessName)}
      </Text>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setReaderMode(true); speakAll(); }}>
              <Text style={styles.modalOption}>{t.readAloud}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize(f => f + 2)}>
              <Text style={styles.modalOption}>{t.enlargeText}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize(f => Math.max(f - 2, 12))}>
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
          data={requirements}
          renderItem={renderRequirement}
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
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  headerRow: {
    marginBottom: 10,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 20,
    textAlign: 'center',
  },
  requirementCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    width: Dimensions.get('window').width - 40,
    elevation: 3,
  },
  requirementText: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
  },
  highlighted: {
    borderColor: '#9333EA',
    borderWidth: 2,
  },
  uploadButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
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

export default UploadDocumentsPage;
