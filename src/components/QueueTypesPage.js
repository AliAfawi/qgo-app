
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { firestore } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';

// Arabic translations for specific queue types
const queueTypeTranslations = {
  'אשנב כל': 'شباك الجميع',
  'מטבע חוץ': 'العملات الأجنبية',
  'מסירת דואר ללקוח': 'تسليم البريد للعميل',


'הנפקת תעודות זהות ביומטריות': 'إصدار بطاقات هوية بيومترية',
'הנפקת דרכונים ביומטריים': 'إصدار جوازات سفر بيومترية',
'רישום נישואין': 'تسجيل الزواج',
'רישום לידה': 'تسجيل الولادة',
'רישום לשינוי שם': 'تسجيل تغيير الاسم',
'הנפקת ספח תעודת זהות': 'إصدار ملحق بطاقة الهوية',
'הנפקת תמצית רישום': 'إصدار ملخص تسجيل',
'הנפקת תעודת פטירה': 'إصدار شهادة وفاة',
'בקשות לאזרחות': 'طلبات الحصول على الجنسية',
'הנפקת אשרות שהייה': 'إصدار تصاريح الإقامة',

};

// Arabic translations for business names
const businessNameTranslations = {
  'דואר ישראל': 'بريد إسرائيل',
  'משרד הפנים': 'وزارة الداخلية',
};

const translations = {
  ar: {
    title: 'أنواع الطوابير لـ',
    noQueueTypes: 'لم يتم العثور على أنواع طوابير لهذا العمل.',
    fetchError: 'فشل في تحميل أنواع الطوابير. الرجاء المحاولة مرة أخرى.',
  },
  he: {
    title: 'סוגי התורים עבור',
    noQueueTypes: 'לא נמצאו סוגי תורים לעסק זה.',
    fetchError: 'שגיאה בטעינת סוגי התורים. נסה שוב מאוחר יותר.',
  },
};

const QueueTypesPage = ({ route, navigation }) => {
  const { language } = useContext(LanguageContext); // Get the selected language
  const t = translations[language] || translations.he; // Default to Hebrew

  const { businessName } = route.params;
  const [queueTypes, setQueueTypes] = useState([]);
  const [error, setError] = useState('');

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

  const handleQueueTypePress = (queueType) => {
    navigation.navigate('BranchesPage', { businessName, queueType });
  };

  const translateQueueType = (queueType) => {
    if (language === 'ar' && queueTypeTranslations[queueType]) {
      return queueTypeTranslations[queueType];
    }
    return queueType; // Default to the original name if not Arabic or translation unavailable
  };

  const translateBusinessName = (name) => {
    if (language === 'ar' && businessNameTranslations[name]) {
      return businessNameTranslations[name];
    }
    return name; // Default to the original name if not Arabic or translation unavailable
  };

  const renderQueueType = ({ item }) => (
    <TouchableOpacity
      style={styles.queueTypeCard}
      onPress={() => handleQueueTypePress(item)}
    >
      <Text style={styles.queueTypeName}>{translateQueueType(item)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${t.title} ${translateBusinessName(businessName)}`}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    alignItems: 'center',
  },
  queueTypeCard: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.9,
    alignItems: 'center',
    marginBottom: 15,
  },
  queueTypeName: {
    color: '#fff',
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

export default QueueTypesPage;
