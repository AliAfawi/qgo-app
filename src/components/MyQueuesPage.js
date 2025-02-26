import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { firestore, auth } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const MyQueuesPage = ({ navigation }) => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const userId = auth.currentUser?.email;
        if (!userId) {
          Alert.alert('Error', 'User not logged in.');
          return;
        }
        console.log(userId);
        const queuesCollection = collection(firestore, 'appointments');
        const q = query(queuesCollection, where('email', '==', userId));
        const snapshot = await getDocs(q);

        const userQueues = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQueues(userQueues);
      } catch (err) {
        console.error('Error fetching queues:', err.message);
        Alert.alert('Error', 'Failed to fetch your queues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQueues();
  }, []);

  const renderQueue = ({ item }) => {
    const formattedDate =
      typeof item.date === 'string'
        ? item.date
        : item.date.toDate().toISOString().split('T')[0];

    const formattedTime =
      typeof item.time === 'string'
        ? item.time
        : item.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={styles.queueCard}>
        <Text style={styles.queueText}>שם הסניף: {item.branch_name}</Text>
        <Text style={styles.queueText}>תאריך: {formattedDate}</Text>
        <Text style={styles.queueText}>שעה: {formattedTime}</Text>
        <Text style={styles.queueText}>שם: {item.business_name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Queues</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading your queues...</Text>
      ) : queues.length === 0 ? (
        <Text style={styles.noQueuesText}>You have no queues.</Text>
      ) : (
        <FlatList
          data={queues}
          renderItem={renderQueue}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  noQueuesText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  listContainer: {
    paddingVertical: 20,
  },
  queueCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
    textAlign: 'center',

  },
  queueText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',

    marginBottom: 5,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MyQueuesPage;
