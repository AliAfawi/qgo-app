import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { LanguageContext } from '../context/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const translations = {
  he: {
    optionsFor: 'אפשרויות עבור',
    bookAppointment: 'קבע פגישה',
    openingHours: 'שעות פתיחה של הסניפים',
    requiredDocuments: 'מסמכים נדרשים',
    uploadDocuments: 'העלה מסמכים',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
  ar: {
    optionsFor: 'خيارات ل',
    bookAppointment: 'حجز موعد',
    openingHours: 'ساعات عمل الفروع',
    requiredDocuments: 'المستندات المطلوبة',
    uploadDocuments: 'رفع المستندات',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
};

const businessNameTranslations = {
  he: {
    'משרד הפנים': 'משרד הפנים',
    'משטרת ישראל': 'משטרת ישראל',
    'דואר ישראל': 'דואר ישראל',
  },
  ar: {
    'משרד הפנים': 'وزارة الداخلية',
    'משטרת ישראל': 'الشرطة',
    'דואר ישראל': 'بريد اسرائيل',
    "משרד החינוך": "وزارة التربية والتعليم",

  },
};

const BusinessOptionsPage = ({ route, navigation }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const businessNameDict = businessNameTranslations[language];
  const { businessName } = route.params;
  const translatedBusinessName = businessNameDict[businessName] || businessName;

  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const speakAll = () => {
    if (!readerMode) return;
    const sentences = [
      `${t.optionsFor} ${translatedBusinessName}`,
      t.bookAppointment,
      t.openingHours,
      t.requiredDocuments,
      t.uploadDocuments,
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        {t.optionsFor} {translatedBusinessName}
      </Text>

      <TouchableOpacity
        style={[styles.button, highlightedIndex === 1 && styles.highlighted]}
        onPress={() => {
          navigation.navigate('QueueTypesPage', { businessName });
          if (readerMode) {
            Speech.stop();
            Speech.speak(t.bookAppointment, {
              language: language === 'ar' ? 'ar-SA' : 'he-IL',
              pitch: 1,
              rate: 0.9,
            });
          }
        }}
      >
        <Text style={[styles.buttonText, { fontSize }]}>{t.bookAppointment}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, highlightedIndex === 2 && styles.highlighted]}
        onPress={() => {
          navigation.navigate('OpeningHoursPage', { businessName });
          if (readerMode) {
            Speech.stop();
            Speech.speak(t.openingHours, {
              language: language === 'ar' ? 'ar-SA' : 'he-IL',
              pitch: 1,
              rate: 0.9,
            });
          }
        }}
      >
        <Text style={[styles.buttonText, { fontSize }]}>{t.openingHours}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, highlightedIndex === 3 && styles.highlighted]}
        onPress={() => {
          navigation.navigate('RequiredDocumentsPage', { businessName });
          if (readerMode) {
            Speech.stop();
            Speech.speak(t.requiredDocuments, {
              language: language === 'ar' ? 'ar-SA' : 'he-IL',
              pitch: 1,
              rate: 0.9,
            });
          }
        }}
      >
        <Text style={[styles.buttonText, { fontSize }]}>{t.requiredDocuments}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, highlightedIndex === 4 && styles.highlighted]}
        onPress={() => {
          navigation.navigate('UploadDocumentsPage', { businessName });
          if (readerMode) {
            Speech.stop();
            Speech.speak(t.uploadDocuments, {
              language: language === 'ar' ? 'ar-SA' : 'he-IL',
              pitch: 1,
              rate: 0.9,
            });
          }
        }}
      >
        <Text style={[styles.buttonText, { fontSize }]}>{t.uploadDocuments}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3f4f6',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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

export default BusinessOptionsPage;
