
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
import { firestore, auth } from '../services/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LanguageContext } from '../context/LanguageContext';
import axios from 'axios'; // Add at the top

// Translations for UI text
const translations = {
  he: {
    bookAppointment: 'קבע תור',
    errorMessage: 'נכשל ביצירת משבצות. אנא נסה שוב מאוחר יותר.',
    successMessage: 'התור נקבע בהצלחה.',
    datePickerPlaceholder: 'בחר תאריך',
  },
  ar: {
    bookAppointment: 'حجز موعد',
    errorMessage: 'فشل إنشاء الفتحات. حاول مرة أخرى لاحقاً.',
    successMessage: 'تم حجز الموعد بنجاح.',
    datePickerPlaceholder: 'اختر تاريخاً',
  },
};

const AppointmentsPage = ({ route }) => {
  const { branch } = route.params;
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [workingHours, setWorkingHours] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Add phone number state

  useEffect(() => {
    if (!branch) {
      setError('Branch details are missing.');
      return;
    }

    if (branch.working_hours) {
      setWorkingHours(branch.working_hours);
    } else {
      setError('Working hours are not available for this branch.');
    }
  }, [branch]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDoc = doc(firestore, 'Users', auth.currentUser.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setFullName(userData.fullName);
          setPhoneNumber(userData.phoneNumber); // Fetch and set phone number
        } else {
          setError('Failed to fetch user details.');
        }
      } catch (err) {
        setError('Failed to fetch user details.');
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (workingHours.length > 0) {
      generateAvailableSlots(selectedDay);
    }
  }, [selectedDay, workingHours]);

  const generateAvailableSlots = async (date) => {
    try {
      const dayIndex = date.getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const selectedDayName = dayNames[dayIndex];

      const daySchedule = workingHours.find((schedule) =>
        schedule.days.includes(selectedDayName)
      );

      if (!daySchedule) {
        setAvailableSlots([]);
        setError('This branch is closed on the selected day.');
        return;
      }

      const { from_time, to_time } = daySchedule;

      const startTime = new Date(`${date.toISOString().split('T')[0]}T${from_time}`);
      const endTime = new Date(`${date.toISOString().split('T')[0]}T${to_time}`);
      const now = new Date();
      console.log(now);

      const slots = [];

      while (startTime < endTime) {
        if (date.toDateString() !== now.toDateString() || startTime > now) {
          slots.push(new Date(startTime));
        }
        startTime.setMinutes(startTime.getMinutes() + 15);
      }

      const bookedSlots = await fetchBookedSlots(date);
      const filteredSlots = slots.filter(
        (slot) =>
          !bookedSlots.some(
            (bookedSlot) =>
              new Date(bookedSlot.seconds * 1000).toISOString() === slot.toISOString()
          )
      );

      setAvailableSlots(filteredSlots);
      setBookedSlots(bookedSlots.map((slot) => new Date(slot.seconds * 1000)));
      setError('');
    } catch (err) {
      setError(t.errorMessage);
    }
  };

  const fetchBookedSlots = async (date) => {
    const appointmentsRef = collection(firestore, 'appointments');
    const q = query(
      appointmentsRef,
      where('branch_id', '==', branch.id),
      where('date', '==', date.toISOString().split('T')[0])
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data().time);
  };


  const handleBooking = async (slot) => {
    try {
      const appointmentRef = collection(firestore, 'appointments');
      const dateFormatted = selectedDay.toISOString().split('T')[0];
  
      // Save the appointment details, including the user's email
      await addDoc(appointmentRef, {
        branch_id: branch.id,
        branch_name: branch.branch_name,
        business_name: branch.business_name,
        time: slot,
        date: dateFormatted,
        customer_name: fullName,
        email: auth.currentUser?.email, // Save the authenticated user's email
      });
  

  
      const messageBody = `הפגישה שלך הוזמנה בהצלחה ב- ${branch.branch_name} בסניף ${dateFormatted} בשעה ${slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
      const messageBody1 = `لقد تم حجز موعدك بنجاح -  ${branch.branch_name} في فرع ${dateFormatted} في تمام الساعة ${slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
  
      if (language === 'ar') {
        await axios.post(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          new URLSearchParams({
            To: phoneNumber,
            From: fromPhone,
            Body: messageBody1,
          }),
          {
            auth: {
              username: accountSid,
              password: authToken,
            },
          }
        );
        Alert.alert('تم بنجاح', t.successMessage);
      } else {
        await axios.post(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          new URLSearchParams({
            To: phoneNumber,
            From: fromPhone,
            Body: messageBody,
          }),
          {
            auth: {
              username: accountSid,
              password: authToken,
            },
          }
        );
        Alert.alert('התור נקבע בהצלחה', t.successMessage);
      }
  
      generateAvailableSlots(selectedDay);
    } catch (err) {
      console.error('Error booking appointment:', err.message);
      Alert.alert('Error', t.errorMessage);
    }
  };

  


  const renderSlot = ({ item }) => {
    const isBooked = bookedSlots.some(
      (bookedSlot) => bookedSlot.toISOString() === item.toISOString()
    );
    return (
      <TouchableOpacity
        style={[styles.slotCard, isBooked && styles.bookedSlot]}
        onPress={() => !isBooked && handleBooking(item)}
        disabled={isBooked}
      >
        <Text style={styles.slotText}>
          {item.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.bookAppointment}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <DateTimePicker
        value={selectedDay}
        mode="date"
        display="default"
        onChange={(event, date) => date && setSelectedDay(date)}
      />

      <FlatList
        data={availableSlots}
        renderItem={renderSlot}
        keyExtractor={(item, index) => index.toString()}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  listContainer: {
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  slotCard: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    width: Dimensions.get('window').width * 0.4,
    alignItems: 'center',
  },
  bookedSlot: {
    backgroundColor: '#ff4d4d',
  },
  slotText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default AppointmentsPage;
