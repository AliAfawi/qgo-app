
import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert,
  Platform,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Button, Card, Title, Provider as PaperProvider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { LanguageContext } from '../context/LanguageContext';
import { firestore, auth } from '../services/firebase';
import { collection, getDocs, query, where, addDoc, doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

function formatDateForCalendar(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

const translations = {
  he: {
    bookAppointment: 'קבע תור',
    errorMessage: 'נכשל ביצירת הפגישה. אנא נסה שוב מאוחר יותר.',
    successMessage: 'הפגישה נקבעה בהצלחה.',
    datePickerPlaceholder: 'בחר תאריך',
    selectTime: 'בחר שעה',
    closedMessage: 'הסניף סגור ביום זה.',
    readAloud: 'הקראה',
    enlargeText: 'הגדל טקסט',
    shrinkText: 'הקטן טקסט',
  },
  ar: {
    bookAppointment: 'حجز موعد',
    errorMessage: 'فشل إنشاء الموعد. حاول مرة أخرى لاحقاً.',
    successMessage: 'تم حجز الموعد بنجاح.',
    datePickerPlaceholder: 'اختر تاريخاً',
    selectTime: 'اختر الوقت',
    closedMessage: 'الفرع مغلق في هذا اليوم.',
    readAloud: 'قراءة',
    enlargeText: 'تكبير النص',
    shrinkText: 'تصغير النص',
  },
  en: {
    bookAppointment: 'Book Appointment',
    errorMessage: 'Failed to create appointment. Please try again later.',
    successMessage: 'Appointment booked successfully.',
    datePickerPlaceholder: 'Select Date',
    selectTime: 'Select Time',
    closedMessage: 'Branch closed on this day.',
    readAloud: 'Read Aloud',
    enlargeText: 'Increase Text',
    shrinkText: 'Decrease Text',
  },
};

const AppointmentsPage = ({ route }) => {
  const { branch } = route.params;
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [selectedDay, setSelectedDay] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [workingHours, setWorkingHours] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    if (branch?.working_hours) setWorkingHours(branch.working_hours);
    else setError('Branch hours not available.');

    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'Users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullName(userData.fullName);
          setPhoneNumber(userData.phoneNumber);
        }
      } catch (err) {
        setError('Failed to fetch user info.');
      }
    };

    fetchUser();
  }, [branch]);

  useEffect(() => {
    if (workingHours.length > 0) generateAvailableSlots(selectedDay);
  }, [selectedDay, workingHours]);

  const speakAll = () => {
    if (!readerMode) return;
    const sentences = [t.bookAppointment, t.selectTime, ...availableSlots.map(slot => slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))];
    let index = 0;
    const speakNext = () => {
      if (index < sentences.length) {
        Speech.speak(sentences[index], {
          language: language === 'ar' ? 'ar-SA' : language === 'he' ? 'he-IL' : 'en-US',
          pitch: 1,
          rate: 0.9,
          onDone: () => {
            index++;
            speakNext();
          },
        });
      }
    };
    speakNext();
  };

  const generateAvailableSlots = async (date) => {
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    const schedule = workingHours.find((sch) => sch.days.includes(dayName));
    if (!schedule) {
      setAvailableSlots([]);
      return setError(t.closedMessage);
    }

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
    const free = slots.filter((s) => !booked.some(b => b.toISOString() === s.toISOString()));

    setAvailableSlots(free);
    setSelectedSlot(null);
    setError('');
  };

const handleBooking = async () => {
  if (!selectedSlot) return;

  const dateFormatted = selectedDay.toISOString().split('T')[0];
  const time = selectedSlot;

  try {
    await addDoc(collection(firestore, 'appointments'), {
      branch_id: branch.id,
      branch_name: branch.branch_name,
      business_name: branch.business_name,
      time,
      date: dateFormatted,
      customer_name: fullName,
      email: auth.currentUser.email,
      phoneNumber,
    });

    const branchLocation = branch?.location || branch.branch_name;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branchLocation)}`;
    const msg = language === 'ar'
      ? `لقد تم حجز موعدك بنجاح - ${branchLocation} بتاريخ ${dateFormatted} في تمام الساعة ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
      : `הפגישה שלך הוזמנה בהצלחה ב- ${branchLocation} בתאריך ${dateFormatted} בשעה ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;

    const fullMessage = `${msg}\n\n${branchLocation}: ${mapsUrl}`;





    Alert.alert(
      language === 'ar' ? 'نجاح' : 'הצלחה',
      t.successMessage,
      [
        {
          text: language === 'ar' ? 'لا' : 'לא',
          style: 'cancel',
        },
        {
          text: language === 'ar' ? 'نعم، أضف إلى التقويم' : 'כן, הוסף ליומן',
          onPress: () => {
            const title = `תור ל־${branch.branch_name}`;
            const startTime = new Date(time);
            const endTime = new Date(startTime.getTime() + 30 * 60000);

            const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDateForCalendar(startTime)}/${formatDateForCalendar(endTime)}&details=${encodeURIComponent('תור נקבע באפליקציה QGo')}&location=${encodeURIComponent(branch.branch_name)}`;

            Linking.openURL(calendarUrl);
          },
        },
      ]
    );

    generateAvailableSlots(selectedDay);
  } catch (err) {
    console.error(err.message);
    Alert.alert('Error', t.errorMessage);
  }
};


  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <MaterialIcons name="accessibility" size={28} color="#9333EA" />
          </TouchableOpacity>
        </View>

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

        <ScrollView>
          <Title style={[styles.title, { fontSize: fontSize + 4 }]}>{t.bookAppointment}</Title>

          {error ? (
            <Card style={styles.errorCard}>
              <Card.Content>
                <Text style={[styles.errorText, { fontSize }]}>{error}</Text>
              </Card.Content>
            </Card>
          ) : null}

          <Card style={styles.card}>
            <Card.Content>
              <Title style={{ fontSize }}>{t.datePickerPlaceholder}</Title>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={{ marginTop: 10 }}
              >
                {format(selectedDay, 'PP')}
              </Button>
{Platform.OS === 'web' ? (
  <input
    type="date"
    value={selectedDay.toISOString().split('T')[0]}
    onChange={(e) => setSelectedDay(new Date(e.target.value))}
    style={{
      padding: 10,
      borderRadius: 5,
      borderColor: '#ccc',
      borderWidth: 1,
      fontSize,
      marginTop: 10,
    }}
  />
) : (
  showDatePicker && (
    <DateTimePicker
      value={selectedDay}
      mode="date"
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      onChange={(event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
          setSelectedDay(selectedDate);
        }
      }}
      minimumDate={new Date()}
    />
  )
)}

            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={{ fontSize }}>{t.selectTime}</Title>
              <View style={styles.timeGrid}>
                {availableSlots.map((slot, i) => (
                  <Button
                    key={i}
                    mode={selectedSlot?.toISOString() === slot.toISOString() ? "contained" : "outlined"}
                    onPress={() => setSelectedSlot(slot)}
                    style={styles.timeButton}
                    labelStyle={{ fontSize }}
                  >
                    {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Button>
                ))}
              </View>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            disabled={!selectedSlot}
            onPress={handleBooking}
            style={styles.bookButton}
            labelStyle={{ fontSize }}
          >
            {t.bookAppointment}
          </Button>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  headerRow: {  marginBottom: 5, width: '100%' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20,    color: '#9333EA',  },
  card: { marginBottom: 16, elevation: 4 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
  timeButton: { width: '30%', marginBottom: 8 },
  bookButton: { marginTop: 16, marginBottom: 32, padding: 8 },
  errorCard: {
    backgroundColor: '#ffe6e6',
    borderLeftWidth: 6,
    borderLeftColor: '#ff4d4d',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  errorText: {
    color: '#cc0000',
    textAlign: 'center',
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

export default AppointmentsPage;

















