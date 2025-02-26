
// import React, { useEffect, useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Dimensions,
//   TextInput,
//   Image,
// } from 'react-native';
// import { firestore } from '../services/firebase';
// import { collection, getDocs } from 'firebase/firestore';
// import { LanguageContext } from '../context/LanguageContext';

// const translations = {
//   ar: {
//     title: 'مرحبًا بكم في دليل الأعمال',
//     searchPlaceholder: 'ابحث عن نشاط تجاري',
//     error: 'حدث خطأ أثناء تحميل الشركات. يرجى المحاولة لاحقًا.',
//     businessNames: {
//       'משטרה': 'الشرطة',
//       'משרד הפנים': 'وزارة الداخلية',
//       'דואר ישראל': 'بريد اسرائيل',
//     },
//   },
//   he: {
//     title: 'ברוכים הבאים למדריך העסקים',
//     searchPlaceholder: 'חפש עסק',
//     error: 'אירעה שגיאה בעת טעינת העסקים. אנא נסה שוב מאוחר יותר.',
//   },
// };

// // Map business names to their respective image files in src/media
// const businessImages = {
//   'משטרה': require('../media/business1.png'),
//   'משרד הפנים': require('../media/business1.png'),
//   'דואר ישראל': require('../media/business2.png'),
// };


// const HomePage = ({ navigation }) => {
//   const [businesses, setBusinesses] = useState([]);
//   const [filteredBusinesses, setFilteredBusinesses] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState('');
//   const { language } = useContext(LanguageContext);

//   const t = translations[language] || translations.he;

//   useEffect(() => {
//     const fetchBusinesses = async () => {
//       try {
//         const businessesCollection = collection(firestore, 'businesses');
//         const snapshot = await getDocs(businessesCollection);
//         const businessList = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         const uniqueBusinesses = Array.from(
//           new Map(businessList.map((item) => [item.business_name, item])).values()
//         );

//         setBusinesses(uniqueBusinesses);
//         setFilteredBusinesses(uniqueBusinesses);
//       } catch (err) {
//         setError(t.error);
//       }
//     };

//     fetchBusinesses();
//   }, [t.error]);

//   const translateBusinessName = (name) => {
//     if (language === 'ar') {
//       return t.businessNames[name] || name;
//     }
//     return name;
//   };

//   const handleSearch = (text) => {
//     setSearchTerm(text);
//     const filtered = businesses.filter((business) =>
//       translateBusinessName(business.business_name).toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredBusinesses(filtered);
//   };

//   const handleBusinessPress = (businessName) => {
//     navigation.navigate('VerificationPage', { businessName });
//   };  
  
//   // const handleBusinessPress = (businessName) => {
//   //   navigation.navigate('BusinessOptionsPage', { businessName });
//   // };

  

//   const renderBusiness = ({ item }) => (
//     <TouchableOpacity
//       style={styles.businessCard}
//       onPress={() => handleBusinessPress(item.business_name)}
//     >
//       {/* Dynamically load the image */}
//       <Image
//         source={businessImages[item.business_name] || require('../media/business1.png')} 
//         style={styles.businessImage}
//         resizeMode="cover"
//       />
//       <Text style={styles.businessName}>{translateBusinessName(item.business_name)}</Text>
//     </TouchableOpacity>
//   );
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{t.title}</Text>
//       <TextInput
//         style={styles.searchBar}
//         placeholder={t.searchPlaceholder}
//         value={searchTerm}
//         onChangeText={handleSearch}
//       />
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <FlatList
//         data={filteredBusinesses}
//         renderItem={renderBusiness}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         columnWrapperStyle={styles.row}
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   businessImage: {
//     width: '100%', // Maintain the width as full width of the card
//     height: 150, // Increase the height for a longer image
//     borderRadius: 10,
//     marginBottom: 10,
//   },
  
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   searchBar: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//   },
//   listContainer: {
//     alignItems: 'center',
//   },
//   row: {
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   businessCard: {
//     backgroundColor: '#f8f9fa',
//     padding: 10,
//     borderRadius: 10,
//     width: Dimensions.get('window').width * 0.45,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   businessImage: {
//     width: '100%',
//     height: 120,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   businessName: {
//     color: '#333',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   error: {
//     color: 'red',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
// });

// export default HomePage;




import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
} from 'react-native';
import { firestore } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  ar: {
    title: 'مرحبًا بكم في دليل الأعمال',
    searchPlaceholder: 'ابحث عن نشاط تجاري',
    error: 'حدث خطأ أثناء تحميل الشركات. يرجى المحاولة لاحقًا.',
    businessNames: {
      'משטרה': 'الشرطة',
      'משרד הפנים': 'وزارة الداخلية',
      'דואר ישראל': 'بريد اسرائيل',
    },
  },
  he: {
    title: 'ברוכים הבאים למדריך העסקים',
    searchPlaceholder: 'חפש עסק',
    error: 'אירעה שגיאה בעת טעינת העסקים. אנא נסה שוב מאוחר יותר.',
  },
};

const businessImages = {
  'משטרה': require('../media/business1.png'),
  'משרד הפנים': require('../media/business1.png'),
  'דואר ישראל': require('../media/business2.png'),
};

const HomePage = ({ navigation }) => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const { language } = useContext(LanguageContext);

  const t = translations[language] || translations.he;

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const businessesCollection = collection(firestore, 'businesses');
        const snapshot = await getDocs(businessesCollection);
        const businessList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const uniqueBusinesses = Array.from(
          new Map(businessList.map((item) => [item.business_name, item])).values()
        );

        setBusinesses(uniqueBusinesses);
        setFilteredBusinesses(uniqueBusinesses);
      } catch (err) {
        setError(t.error);
      }
    };

    fetchBusinesses();
  }, [t.error]);

  const translateBusinessName = (name) => {
    if (language === 'ar') {
      return t.businessNames[name] || name;
    }
    return name;
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = businesses.filter((business) =>
      translateBusinessName(business.business_name).toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBusinesses(filtered);
  };

  const handleBusinessPress = (businessName) => {
    navigation.navigate('VerificationPage', { businessName });
  };

  // const handleBusinessPress = (businessName) => {
  //   navigation.navigate('BusinessOptionsPage', { businessName });
  // };

  const renderBusiness = ({ item }) => (
    <TouchableOpacity
      style={styles.businessCard}
      onPress={() => handleBusinessPress(item.business_name)}
    >
      <Image
        source={businessImages[item.business_name] || require('../media/business1.png')}
        style={styles.businessImage}
        resizeMode="cover"
      />
      <Text style={styles.businessName}>{translateBusinessName(item.business_name)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => navigation.navigate('ProfilePage')} // Navigate to MyQueuesPage
      >
        <Image
          source={require('../media/person.jpg')} // Replace with your profile icon
          style={styles.profileIcon}
        />
      </TouchableOpacity>

      <Text style={styles.title}>{t.title}</Text>
      <TextInput
        style={styles.searchBar}
        placeholder={t.searchPlaceholder}
        value={searchTerm}
        onChangeText={handleSearch}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={filteredBusinesses}
        renderItem={renderBusiness}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  profileIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  profileIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  listContainer: {
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  businessCard: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.45,
    alignItems: 'center',
    marginBottom: 15,
  },
  businessImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  businessName: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomePage;
