
// import React, { useContext } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { LanguageContext } from '../context/LanguageContext';

// const translations = {
//   he: {
//     optionsFor: 'אפשרויות עבור',
//     bookAppointment: 'קבע פגישה',
//     openingHours: 'שעות פתיחה של הסניפים',
//     requiredDocuments: 'מסמכים נדרשים',
//     uploadDocuments: 'העלה מסמכים',
//   },
//   ar: {
//     optionsFor: 'خيارات ل',
//     bookAppointment: 'حجز موعد',
//     openingHours: 'ساعات عمل الفروع',
//     requiredDocuments: 'المستندات المطلوبة',
//     uploadDocuments: 'رفع المستندات',
//   },
// };

// const businessNameTranslations = {
//   he: {
//     'משרד הפנים': 'משרד הפנים', // Hebrew name
//     'משטרה': 'משטרה', // Hebrew name
//     'דואר ישראל': 'דואר ישראל', // Arabic translation

//   },
//   ar: {
//     'משרד הפנים': 'وزارة الداخلية',
//     'משטרה': 'الشرطة', // Arabic translation
//     'דואר ישראל': 'بريد اسرائيل', // Arabic translation
    
//   },
// };

// const BusinessOptionsPage = ({ route, navigation }) => {
//   const { language } = useContext(LanguageContext);
//   const t = translations[language];
//   const businessNameDict = businessNameTranslations[language];

//   const { businessName } = route.params;
//   const translatedBusinessName = businessNameDict[businessName] || businessName; // Default to original name if no translation exists

//   const handleBookAppointment = () => {
//     navigation.navigate('QueueTypesPage', { businessName });
//   };
  
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>
//         {t.optionsFor} {translatedBusinessName}
//       </Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleBookAppointment}
//       >
//         <Text style={styles.buttonText}>{t.bookAppointment}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => alert(t.openingHours)}
//       >
//         <Text style={styles.buttonText}>{t.openingHours}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => alert(t.requiredDocuments)}
//       >
//         <Text style={styles.buttonText}>{t.requiredDocuments}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => alert(t.uploadDocuments)}
//       >
//         <Text style={styles.buttonText}>{t.uploadDocuments}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   button: {
//     backgroundColor: '#4caf50',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default BusinessOptionsPage;







import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  he: {
    optionsFor: 'אפשרויות עבור',
    bookAppointment: 'קבע פגישה',
    openingHours: 'שעות פתיחה של הסניפים',
    requiredDocuments: 'מסמכים נדרשים',
    uploadDocuments: 'העלה מסמכים',
  },
  ar: {
    optionsFor: 'خيارات ل',
    bookAppointment: 'حجز موعد',
    openingHours: 'ساعات عمل الفروع',
    requiredDocuments: 'المستندات المطلوبة',
    uploadDocuments: 'رفع المستندات',
  },
};

const businessNameTranslations = {
  he: {
    'משרד הפנים': 'משרד הפנים', // Hebrew name
    'משטרה': 'משטרה', // Hebrew name
    'דואר ישראל': 'דואר ישראל', // Arabic translation
  },
  ar: {
    'משרד הפנים': 'وزارة الداخلية',
    'משטרה': 'الشرطة', // Arabic translation
    'דואר ישראל': 'بريد اسرائيل', // Arabic translation
  },
};

const BusinessOptionsPage = ({ route, navigation }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const businessNameDict = businessNameTranslations[language];

  const { businessName } = route.params;
  const translatedBusinessName = businessNameDict[businessName] || businessName; // Default to original name if no translation exists

  const handleBookAppointment = () => {
    navigation.navigate('QueueTypesPage', { businessName });
  };

  const handleOpeningHours = () => {
    navigation.navigate('OpeningHoursPage', { businessName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t.optionsFor} {translatedBusinessName}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleBookAppointment}
      >
        <Text style={styles.buttonText}>{t.bookAppointment}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleOpeningHours}
      >
        <Text style={styles.buttonText}>{t.openingHours}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert(t.requiredDocuments)}
      >
        <Text style={styles.buttonText}>{t.requiredDocuments}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert(t.uploadDocuments)}
      >
        <Text style={styles.buttonText}>{t.uploadDocuments}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusinessOptionsPage;
