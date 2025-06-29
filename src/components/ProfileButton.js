import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const ProfileButton = ({ icon, label, onPress, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.highlight} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 100,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  iconContainer: {
    marginBottom: 10,
  },
  label: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  highlight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#9333EA',
    opacity: 0,
  },
});

export default ProfileButton;