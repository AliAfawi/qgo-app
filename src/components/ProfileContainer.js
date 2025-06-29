import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "lucide-react-native";

const ProfileContainer = ({ children, username = "User" }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGlow} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.welcomeText}>Welcome, {username}</Text>
        <Text style={styles.subtitleText}>Manage your profile and settings</Text>
      </View>
      
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 16,
    width: "100%",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 24,
  },
  avatarGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(147, 51, 234, 0.3)",
    opacity: 0.7,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#9333EA",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#9333EA",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
  },
});

export default ProfileContainer;