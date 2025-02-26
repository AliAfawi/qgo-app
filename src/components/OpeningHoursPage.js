
// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet, FlatList, TextInput, Alert, I18nManager } from 'react-native';
// import { firestore } from '../services/firebase';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { LanguageContext } from '../context/LanguageContext';

// // Force RTL for Arabic
// I18nManager.allowRTL(true);
// I18nManager.forceRTL(true);

// // Translations for branch names
//   const branchNameTranslations = {
//     'אשקלון רחוב הרצל 18': 'أشكلون شارع هرتسل 18',
//     'אשקלון רחוב אורט 24': 'أشكلون شارع أورط 24',
//     'באר שבע שדרות דוד טוביהו 125': 'بئر السبع شارع دافيد طوبياهو 125',
//     'באר שבע שדרות יצחק רגר 31': 'بئر السبع شارع يتسحاق ريجر 31',
//     'אשדוד רחוב שבי ציון 6': 'أشدود شارع شافي تسيون 6',
//     'אשדוד רחוב העצמאות 85': 'أشدود شارع الاستقلال 85',
//     'דימונה שדרות הרצל 1': 'ديمونا شارع هرتسل 1',
//     'דימונה רחוב ז\'בוטינסקי 5': 'ديمونا شارع جابوتنسكي 5',
//     'אילת רחוב קאמן 8': 'إيلات شارع كامن 8',
//     'אילת רחוב התמרים 1': 'إيلات شارع التمرين 1',
//     'קריית גת שדרות לכיש 15': 'كريات جات شارع لحيش 15',
//     'קריית גת שדרות מלכי ישראל 178': 'كريات جات شارع ملوك إسرائيل 178',
//     'קריית מלאכי רחוב בן גוריון 2': 'كريات ملاخي شارع بن غوريون 2',
//     'קריית מלאכי רחוב ויצמן 18': 'كريات ملاخي شارع فايتسمان 18',
//     'נתיבות רחוב ירושלים 1': 'نتيفوت شارع القدس 1',
//     'נתיבות אזור תעשייה קריית יהודית': 'نتيفوت منطقة صناعية كريات يهوديت',
//     'רהט רחוב הראשי 100': 'رهط الشارع الرئيسي 100',
//     'רהט שכונה 7': 'رهط الحي السابع',
//     'שדרות רחוב הרצל 5': 'سديروت شارع هرتسل 5',
//     'שדרות רחוב בן יהודה 10': 'سديروت شارع بن يهودا 10',
//     'חורה רחוב הראשי': 'حورة الشارع الرئيسي',
//     'לקיה רחוב הראשי': 'اللقية الشارع الرئيسي',
//     'כסייפה רחוב הראשי': 'كسيفة الشارع الرئيسي',
//     'ערערה בנגב רחוב הראשי': 'عرعرة في النقب الشارع الرئيسي',
//     'שגב שלום רחוב הראשי': 'شقيب السلام الشارع الرئيسي',
//     'עומר מרכז מסחרי': 'عومر المركز التجاري',
//     'מיתר מרכז מסחרי': 'ميتار المركز التجاري',
//     'להבים מרכז מסחרי': 'لهافيم المركز التجاري',
//     'נווה זוהר רחוב הראשי': 'نيفيه زوهر الشارع الرئيسي',
//     'עין יהב מרכז היישוב': 'عين يهاف مركز البلدة',
//     'שדרות רחוב הרצל 1': 'سديروت شارع هرتسل 1',
//     'באר שבע שדרות שז"ר 31': 'بئر السبع شارع شازار 31',
//     'אשקלון רחוב נחל 1 מרכז צימר': 'أشكلون شارع ناحال 1 مركز تسيمر',
//     'אשדוד רחוב הכלנית 13': 'أشدود شارع هكلانيت 13',
//     'אילת רחוב חטיבת גולני 2': 'إيلات شارع حطيفات جولاني 2',
//   };
// // Translations for days of the week
// const daysTranslations = {
//   he: {
//     Sunday: 'ראשון',
//     Monday: 'שני',
//     Tuesday: 'שלישי',
//     Wednesday: 'רביעי',
//     Thursday: 'חמישי',
//     Friday: 'שישי',
//     Saturday: 'שבת',
//   },
//   ar: {
//     Sunday: 'الأحد',
//     Monday: 'الإثنين',
//     Tuesday: 'الثلاثاء',
//     Wednesday: 'الأربعاء',
//     Thursday: 'الخميس',
//     Friday: 'الجمعة',
//     Saturday: 'السبت',
//   },
// };

// // Translations for UI elements
// const translations = {
//   he: {
//     title: 'שעות פתיחה לסניפים',
//     searchPlaceholder: 'חפש סניף...',
//     branchName: 'שם הסניף:',
//     days: 'ימים:',
//     hours: 'שעות פתיחה:',
//     loading: 'טוען...',
//     noBranches: 'לא נמצאו סניפים לעסק זה.',
//     error: 'שגיאה',
//     errorMessage: 'נכשל בקבלת פרטי הסניפים. אנא נסה שוב.',
//   },
//   ar: {
//     title: 'ساعات عمل الفروع',
//     searchPlaceholder: 'ابحث عن فرع...',
//     branchName: 'اسم الفرع:',
//     days: 'الأيام:',
//     hours: 'ساعات العمل:',
//     loading: 'جارٍ التحميل...',
//     noBranches: 'لم يتم العثور على فروع لهذا النشاط التجاري.',
//     error: 'خطأ',
//     errorMessage: 'فشل في جلب بيانات الفروع. الرجاء المحاولة مرة أخرى.',
//   },
// };

// const OpeningHoursPage = ({ route }) => {
//   const { language } = useContext(LanguageContext);
//   const t = translations[language];
//   const daysTranslation = daysTranslations[language];
//   const { businessName } = route.params;

//   const [branches, setBranches] = useState([]);
//   const [filteredBranches, setFilteredBranches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         setLoading(true);

//         // Fetch branches from Firestore
//         const branchesCollection = collection(firestore, 'businesses');
//         const branchQuery = query(branchesCollection, where('business_name', '==', businessName));
//         const querySnapshot = await getDocs(branchQuery);

//         if (!querySnapshot.empty) {
//           const branchList = querySnapshot.docs.map((doc) => doc.data());
//           setBranches(branchList);
//           setFilteredBranches(branchList); // Initialize filtered list
//         } else {
//           Alert.alert(t.noBranches);
//         }
//       } catch (error) {
//         console.error('Error fetching branches:', error.message);
//         Alert.alert(t.error, t.errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBranches();
//   }, [businessName]);

//   const handleSearch = (text) => {
//     setSearchQuery(text);

//     const filtered = branches.filter((branch) =>
//       branch.branch_name
//         .toLowerCase()
//         .includes(text.toLowerCase())
        
//     );

//     setFilteredBranches(filtered);
//   };



  

//   const renderBranch = ({ item }) => (
//     <View style={styles.branchContainer}>
//       <Text style={styles.branchName}>
//         {t.branchName}{' '}
//         {language === 'ar'
//           ? branchNameTranslations[item.branch_name] || item.branch_name
//           : item.branch_name}
//       </Text>
//       {item.working_hours.map((schedule, index) => (
//         <View key={index}>
//           <Text style={styles.dayss}>
//             {t.days}{' '}
//             {schedule.days
//               .map((day) => daysTranslation[day] || day) // Translate day names
//               .join(', ')}
//           </Text>
//           <Text style={styles.dayss}>
//             {t.hours} {schedule.from_time} - {schedule.to_time}
//           </Text>
//         </View>
//       ))}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{t.title}</Text>
//       <TextInput
//         style={styles.searchInput}
//         placeholder={t.searchPlaceholder}
//         value={searchQuery}
//         onChangeText={handleSearch}
//       />
//       {loading ? (
//         <Text>{t.loading}</Text>
//       ) : (
//         <FlatList
//           data={filteredBranches}
//           renderItem={renderBranch}
//           keyExtractor={(item, index) => index.toString()}
//           contentContainerStyle={styles.list}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//     direction: 'rtl', // Set RTL for the entire container
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center', // Align text to the right
//     marginBottom: 20,
//   },
//   searchInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingHorizontal: 8,
//     borderRadius: 5,
//     textAlign: 'right', // Align input text to the right
//   },
//   list: {
//     paddingBottom: 20,
//   },
//   branchContainer: {
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//     branchName: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 5,
//         textAlign: 'left', // Align text to the right
//       },   
      
//       dayss: {
//         marginBottom: 5,
//         textAlign: 'left', // Align text to the right
//       },
// });

// export default OpeningHoursPage;



import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, I18nManager } from 'react-native';
import { firestore } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';

// Force RTL for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Translations for branch names
  const branchNameTranslations = {
    'אשקלון רחוב הרצל 18': 'أشكلون شارع هرتسل 18',
    'אשקלון רחוב אורט 24': 'أشكلون شارع أورط 24',
    'באר שבע שדרות דוד טוביהו 125': 'بئر السبع شارع دافيد طوبياهو 125',
    'באר שבע שדרות יצחק רגר 31': 'بئر السبع شارع يتسحاق ريجر 31',
    'אשדוד רחוב שבי ציון 6': 'أشدود شارع شافي تسيون 6',
    'אשדוד רחוב העצמאות 85': 'أشدود شارع الاستقلال 85',
    'דימונה שדרות הרצל 1': 'ديمونا شارع هرتسل 1',
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
  };

// Translations for days of the week
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

// Translations for UI elements
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

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);

        // Fetch branches from Firestore
        const branchesCollection = collection(firestore, 'businesses');
        const branchQuery = query(branchesCollection, where('business_name', '==', businessName));
        const querySnapshot = await getDocs(branchQuery);

        if (!querySnapshot.empty) {
          const branchList = querySnapshot.docs.map((doc) => doc.data());
          setBranches(branchList);
          setFilteredBranches(branchList); // Initialize filtered list
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

  const renderBranch = ({ item }) => (
    <View style={styles.branchContainer}>
      <Text style={styles.branchName}>
        {t.branchName}{' '}
        {language === 'ar'
          ? branchNameTranslations[item.branch_name] || item.branch_name
          : item.branch_name}
      </Text>
      {item.working_hours.map((schedule, index) => (
        <View key={index}>
          <Text style={styles.dayss} >
            {t.days}{' '}
            {schedule.days
              .map((day) => daysTranslation[day] || day) // Translate day names
              .join(', ')}
          </Text>
          <Text style={styles.dayss}>
            {t.hours} {schedule.from_time} - {schedule.to_time}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.title}</Text>
      <TextInput
        style={styles.searchInput}
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
    backgroundColor: '#f8f9fa',
    direction: 'rtl', // Set RTL for the entire container
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // Align text to the right
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
    borderRadius: 5,
    textAlign: 'right', // Align input text to the right
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
  branchName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left', // Align text to the right
  },

        dayss: {
        marginBottom: 5,
        textAlign: 'left', // Align text to the right
      },
});

export default OpeningHoursPage;
