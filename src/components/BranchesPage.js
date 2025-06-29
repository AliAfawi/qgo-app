
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';
import { firestore } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  he: {
    branchesOf: 'סניפים של',
    searchPlaceholder: 'חפש סניף',
    filterByLocation: 'סנן לפי מיקום',
    filterByAvailability: 'סנן לפי זמינות',
    locationDenied: 'הגישה למיקום נדחתה.',
    locationError: 'שגיאה בקבלת מיקום.',
    loading: 'טוען מיקום...',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
  ar: {
    branchesOf: 'فروع',
    searchPlaceholder: 'ابحث عن فرع',
    filterByLocation: 'التصفية حسب الموقع',
    filterByAvailability: 'التصفية حسب التوافر',
    locationDenied: 'تم رفض الوصول إلى الموقع.',
    locationError: 'حدث خطأ أثناء الحصول على الموقع.',
    loading: 'جارٍ تحميل الموقع...',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
};

const businessNameTranslations = {
  'משרד הפנים': 'وزارة الداخلية',
  'דואר ישראל': 'بريد اسرائيل',
  'משטרת ישראל': 'الشرطة',
  "משרד החינוך": "وزارة التربية والتعليم",

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
  "תחנת משטרת נצרת - פאולוס השישי": "محطة شرطة الناصرة - بولس السادس",
  "מחוז דרום - באר שבע": "المنطقة الجنوبية - بئر السبع",
  "מחוז צפון - נצרת עילית": "المنطقة الشمالية - الناصرة العليا",
  "משרד החינוך ירושלים - רחוב יפו": "وزارة التربية والتعليم - القدس - شارع يافا",
  "משרד החינוך תל אביב - דרך נמיר": "وزارة التربية والتعليم - تل أبيب - شارع نمير",
  "מחוז חיפה - שדרות בן גוריון": "المنطقة الحيفاوية - جادة بن غوريون",
};

const getNextAvailableSlot = async (branch, date = new Date()) => {
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
  const schedule = branch.working_hours?.find((sch) => sch.days.includes(dayName));
  if (!schedule) return null;

  const { from_time, to_time } = schedule;
  const start = new Date(`${date.toISOString().split('T')[0]}T${from_time}`);
  const end = new Date(`${date.toISOString().split('T')[0]}T${to_time}`);
  const now = new Date();
  const slots = [];

  while (start < end) {
    if (date.toDateString() !== now.toDateString() || start > now) {
      slots.push(new Date(start));
    }
    start.setMinutes(start.getMinutes() + 15);
  }

  const snapshot = await getDocs(query(
    collection(firestore, 'appointments'),
    where('branch_id', '==', branch.id),
    where('date', '==', date.toISOString().split('T')[0])
  ));

  const booked = snapshot.docs.map((doc) => doc.data().time?.seconds).map(s => new Date(s * 1000));
  const available = slots.filter((s) => !booked.some(b => b.toISOString() === s.toISOString()));

  return available.length > 0 ? available[0] : null;
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (angle) => (Math.PI / 180) * angle;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const BranchesPage = ({ route, navigation }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const { businessName } = route.params;
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const translateBranchName = (name) => {
    return language === 'ar' && branchNameTranslations[name] ? branchNameTranslations[name] : name;
  };

  const translateBusinessName = (name) => {
    return language === 'ar' && businessNameTranslations[name] ? businessNameTranslations[name] : name;
  };

  const speakAll = () => {
    if (!readerMode) return;
    const sentences = [
      `${t.branchesOf} ${translateBusinessName(businessName)}`,
      t.searchPlaceholder,
      ...filteredBranches.map((b) => translateBranchName(b.branch_name)),
    ];
    let index = 0;
    const speakNext = () => {
      if (index < sentences.length) {
        setHighlightedIndex(index);
        Speech.speak(sentences[index], {
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

  useEffect(() => {
    const fetchBranches = async () => {
      const branchesCollection = collection(firestore, 'businesses');
      const q = query(branchesCollection, where('business_name', '==', businessName));
      const snapshot = await getDocs(q);
      const branchList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBranches(branchList);
      setFilteredBranches(branchList);
    };
    fetchBranches();
  }, [businessName]);

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = branches.filter((branch) =>
      translateBranchName(branch.branch_name).toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBranches(filtered);
  };

  const filterByAvailability = async () => {
    setLoading(true);
    const slotResults = await Promise.all(
      branches.map(async (branch) => {
        const nextSlot = await getNextAvailableSlot(branch);
        return { branch, nextSlot };
      })
    );
    const sorted = slotResults
      .sort((a, b) => {
        if (!a.nextSlot) return 1;
        if (!b.nextSlot) return -1;
        return new Date(a.nextSlot) - new Date(b.nextSlot);
      })
      .map((item) => item.branch);

    setFilteredBranches(sorted);
    setLoading(false);
  };

  const filterByLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t.locationDenied);
        return;
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      };
      const branchListWithDistance = branches.map((branch) => {
        if (branch.latitude && branch.longitude) {
          const distance = haversineDistance(
            userCoords.latitude,
            userCoords.longitude,
            branch.latitude,
            branch.longitude
          );
          return { ...branch, distance };
        }
        return { ...branch, distance: Infinity };
      });
      const sortedBranches = branchListWithDistance.sort((a, b) => a.distance - b.distance);
      setFilteredBranches(sortedBranches);
    } catch (err) {
      console.error('Error filtering by location:', err.message);
      Alert.alert(t.locationError);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchPress = (branch) => {
    navigation.navigate('AppointmentsPage', { branch });
  };

  const renderBranch = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.branchCard, highlightedIndex === index + 2 && styles.highlighted]}
      onPress={() => handleBranchPress(item)}
    >
      <Text style={[styles.branchName, { fontSize }]}>{translateBranchName(item.branch_name || item.id)}</Text>
      {item.distance !== undefined && (
        <Text>{item.distance ? `${item.distance.toFixed(2)} km` : ''}</Text>
      )}
    </TouchableOpacity>
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

      <Text style={[styles.title, highlightedIndex === 0 && styles.highlighted, { fontSize: fontSize + 8 }]}> {t.branchesOf} {translateBusinessName(businessName)} </Text>

      <TextInput
        style={[styles.searchBar, highlightedIndex === 1 && styles.highlighted, { fontSize }]}
        placeholder={t.searchPlaceholder}
        value={searchTerm}
        onChangeText={handleSearch}
      />

      <View style={styles.filterContainer}>
        <Button title={t.filterByLocation} color="#1F2937" onPress={filterByLocation} />
        <Button title={t.filterByAvailability} color="#1F2937" onPress={filterByAvailability} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2196f3" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredBranches}
          renderItem={renderBranch}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#9333EA' },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff'
  },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  branchCard: {
    backgroundColor: '#1F2937',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  branchName: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  error: { color: 'red', textAlign: 'center', marginBottom: 20 },
  loadingIndicator: { marginTop: 20 },
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
  highlighted: {
    borderColor: '#9333EA',
    borderWidth: 2,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default BranchesPage;
