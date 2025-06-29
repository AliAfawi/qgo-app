import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { firestore } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);


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
  "תחנת משטרת נצרת - פאולוס השישי": "محطة شرطة الناصرة - بولس السادس",
  "מחוז דרום - באר שבע": "المنطقة الجنوبية - بئر السبع",
  "מחוז צפון - נצרת עילית": "المنطقة الشمالية - الناصرة العليا",
  "משרד החינוך ירושלים - רחוב יפו": "وزارة التربية والتعليم - القدس - شارع يافا",
  "משרד החינוך תל אביב - דרך נמיר": "وزارة التربية والتعليم - تل أبيب - شارع نمير",
  "מחוז חיפה - שדרות בן גוריון": "المنطقة الحيفاوية - جادة بن غوريون"
};

const daysTranslations = {
  he: {
    Sunday: 'ראשון',
    Monday: 'שני',
    Tuesday: 'שלישי',
    Wednesday: 'רביעי',
    Thursday: 'חמישי',
    Friday: 'שישי',
    Saturday: 'שבת',
  },
  ar: {
    Sunday: 'الأحد',
    Monday: 'الإثنين',
    Tuesday: 'الثلاثاء',
    Wednesday: 'الأربعاء',
    Thursday: 'الخميس',
    Friday: 'الجمعة',
    Saturday: 'السبت',
  },
};

const translations = {
  he: {
    title: 'שעות פתיחה לסניפים',
    searchPlaceholder: 'חפש סניף...',
    days: 'ימים:',
    hours: 'שעות פתיחה:',
    loading: 'טוען...',
    noBranches: 'לא נמצאו סניפים לעסק זה.',
    error: 'שגיאה',
    errorMessage: 'נכשל בקבלת פרטי הסניפים. אנא נסה שוב.',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
  ar: {
    title: 'ساعات عمل الفروع',
    searchPlaceholder: 'ابحث عن فرع...',
    days: 'الأيام:',
    hours: 'ساعات العمل:',
    loading: 'جارٍ التحميل...',
    noBranches: 'لم يتم العثور على فروع لهذا النشاط التجاري.',
    error: 'خطأ',
    errorMessage: 'فشل في جلب بيانات الفروع. الرجاء المحاولة مرة أخرى.',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
};

const OpeningHoursPage = ({ route }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const daysTranslation = daysTranslations[language];
  const { businessName } = route.params;

  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const branchesCollection = collection(firestore, 'businesses');
        const branchQuery = query(branchesCollection, where('business_name', '==', businessName));
        const querySnapshot = await getDocs(branchQuery);

        if (!querySnapshot.empty) {
          const branchList = querySnapshot.docs.map((doc) => doc.data());
          setBranches(branchList);
          setFilteredBranches(branchList);
        } else {
          Alert.alert(t.noBranches);
        }
      } catch (error) {
        console.error('Error fetching branches:', error.message);
        Alert.alert(t.error, t.errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [businessName]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const normalizedText = text.toLowerCase().trim();

    const filtered = branches.filter((branch) => {
      const branchName = language === 'ar'
        ? branchNameTranslations[branch.branch_name] || branch.branch_name
        : branch.branch_name;

      const normalizedBranchName = branchName.toLowerCase().trim();
      return normalizedBranchName.includes(normalizedText);
    });

    setFilteredBranches(filtered);
  };

  const speakAll = () => {
    if (!readerMode) return;
    const entries = filteredBranches.flatMap((branch) => {
      const name = language === 'ar' ? branchNameTranslations[branch.branch_name] || branch.branch_name : branch.branch_name;
      const schedules = branch.working_hours.map((s) => {
        const days = s.days.map((d) => daysTranslation[d] || d).join(', ');
        return `${t.days} ${days}, ${t.hours} ${s.from_time} - ${s.to_time}`;
      });
      return [name, ...schedules];
    });

    let index = 0;
    const speakNext = () => {
      if (index < entries.length) {
        setHighlightedIndex(index);
        Speech.speak(entries[index], {
          language: language === 'ar' ? 'ar-SA' : 'he-IL',
          rate: 0.9,
          pitch: 1,
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

  const renderBranch = ({ item, index }) => {
    const name = language === 'ar'
      ? branchNameTranslations[item.branch_name] || item.branch_name
      : item.branch_name;

    return (
      <View style={[styles.branchContainer, highlightedIndex === index * 2 && styles.highlighted]}>
        <Text style={[styles.branchName, { fontSize }]}>{name}</Text>
        {item.working_hours.map((schedule, idx) => (
          <View key={idx}>
            <Text style={[styles.days, { fontSize }]}>
              {t.days}{' '}
              {schedule.days.map((day) => daysTranslation[day] || day).join(', ')}
            </Text>
            <Text style={[styles.days, { fontSize }]}>
              {t.hours} {schedule.from_time} - {schedule.to_time}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Accessibility Icon */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.accessIcon}>
        <MaterialIcons name="accessibility" size={28} color="#9333EA" />
      </TouchableOpacity>

      {/* Modal */}
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

      <Text style={[styles.title, { fontSize: fontSize + 6 }]}>{t.title}</Text>

      <TextInput
        style={[styles.searchInput, { fontSize }]}
        placeholder={t.searchPlaceholder}
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading ? (
        <Text>{t.loading}</Text>
      ) : (
        <FlatList
          data={filteredBranches}
          renderItem={renderBranch}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
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
    direction: 'rtl',
  },
  accessIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#9333EA',
  },
  searchInput: {
    height: 45,
    borderColor: '#d1d5db',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    textAlign: 'right',
  },
  list: {
    paddingBottom: 20,
  },
  branchContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  highlighted: {
    borderColor: '#9333EA',
    borderWidth: 2,
  },
  branchName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1F2937',
    textAlign: 'left',
  },
  days: {
    marginBottom: 5,
    color: '#6B7280',
    textAlign: 'left',
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

export default OpeningHoursPage;
