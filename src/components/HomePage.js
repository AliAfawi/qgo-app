
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
  ScrollView,
  Modal,
} from 'react-native';
import { firestore } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';

const translations = {
  ar: {
    title: 'مرحبًا بكم في دليل الأعمال',
    searchPlaceholder: 'ابحث عن نشاط تجاري',
    error: 'حدث خطأ أثناء تحميل الشركات. يرجى المحاولة لاحقًا.',
    businessNames: {
      'משטרת ישראל': 'الشرطة',
      'משרד הפנים': 'وزارة الداخلية',
      'דואר ישראל': 'بريد اسرائيل',
      "משרד החינוך": "وزارة التربية والتعليم",

    },
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص'
  },
  he: {
    title: 'ברוכים הבאים למדריך העסקים',
    searchPlaceholder: 'חפש עסק',
    error: 'אירעה שגיאה בעת טעינת העסקים. אנא נסה שוב מאוחר יותר.',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט'
  },
};

const businessImages = {
  'משרד הפנים': require('../media/business1.png'),
  'דואר ישראל': require('../media/business2.png'),
  'משטרת ישראל': require('../media/business3.png'),
  'משרד החינוך': require('../media/business4.png'),

};

const HomePage = ({ navigation }) => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
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
    navigation.navigate('BusinessOptionsPage', { businessName });
  };

  const speakAll = () => {
    if (!readerMode) return;
    const sentences = [t.title, t.searchPlaceholder, ...filteredBusinesses.map(b => translateBusinessName(b.business_name))];
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

  const renderBusiness = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.businessCard, highlightedIndex === index + 2 && styles.highlighted]}
      onPress={() => {
        handleBusinessPress(item.business_name);
        if (readerMode) {
          Speech.stop();
          Speech.speak(translateBusinessName(item.business_name), {
            language: language === 'ar' ? 'ar-SA' : 'he-IL',
            pitch: 1,
            rate: 0.9,
          });
        }
      }}
    >
      <Image
        source={businessImages[item.business_name] || require('../media/business1.png')}
        style={styles.businessImage}
        resizeMode="cover"
      />
      <Text style={[styles.businessName, { fontSize }]}>{translateBusinessName(item.business_name)}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => navigation.navigate('ProfilePage')}
      >
        <Image source={require('../media/person.jpg')} style={styles.profileIcon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.accessIcon}>
        <MaterialIcons name="accessibility" size={28} color="#9333EA" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => {}}
      >
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

      <Text style={[styles.titleBlock, highlightedIndex === 0 && styles.highlighted, { fontSize: fontSize + 8 }]}> {t.title} </Text>

      <TextInput
        style={[styles.searchBar, highlightedIndex === 1 && styles.highlighted, { fontSize }]}
        placeholder={t.searchPlaceholder}
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {error ? <Text style={[styles.error, { fontSize }]}>{error}</Text> : null}

      <FlatList
        data={filteredBusinesses}
        renderItem={renderBusiness}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
    paddingBottom: 40,
  },
  profileIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  accessIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  titleBlock: {
    marginTop: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 20,
  },
  searchBar: {
    height: 45,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
    gap: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  businessCard: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.42,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  highlighted: {
    borderColor: '#9333EA',
    borderWidth: 2,
  },
  businessImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  businessName: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  error: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 20,
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

export default HomePage;