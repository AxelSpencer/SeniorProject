import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../App';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons'; 

type SettingsPageNavigationProp = StackNavigationProp<StackParamList>;

const SettingsPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bioCharCount, setBioCharCount] = useState(0);
  const navigation = useNavigation<SettingsPageNavigationProp>();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setEmail(userData.email || '');
          setBio(userData.bio || '');
          setProfilePic(userData.profilePic || null);
          setBioCharCount(userData.bio ? userData.bio.length : 0);
        }
      } catch (error) {
        console.error('Error loading user data', error);
      }
    };

    loadUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const userData = { firstName, lastName, email, bio, profilePic };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      Alert.alert('Success', 'Changes saved.');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving user data', error);
      Alert.alert('Error', 'Failed to save changes.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await AsyncStorage.removeItem('user');
      Alert.alert('Success', 'Account deleted.');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error deleting account', error);
      Alert.alert('Error', 'Failed to delete account.');
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleBioChange = (text: string) => {
    if (text.length <= 150) {
      setBio(text);
      setBioCharCount(text.length);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="white" />
            <Text style={styles.headerTitle}>Back</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handlePickImage} style={styles.profilePicContainer}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <Icon name="person-circle-outline" size={100} color="#089083" />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#D3D3D3"
        />
        <View style={styles.bioContainer}>
          <TextInput
            style={styles.bioInput}
            placeholder="Bio"
            value={bio}
            onChangeText={handleBioChange}
            placeholderTextColor="#D3D3D3"
            multiline
          />
          <Text style={styles.bioCharCount}>{`${bioCharCount}/150`}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>
            <Button title="Save Changes" onPress={handleSaveChanges} color="#089083" />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Delete Account" onPress={handleDeleteAccount} color="#d9534f" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0D1117',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    marginLeft: 8,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#24292F',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#24292F',
    color: '#fff',
  },
  bioContainer: {
    width: '100%',
    marginBottom: 12,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingHorizontal: 16,
    backgroundColor: '#24292F',
    color: '#fff',
    borderColor: '#24292F',
    borderWidth: 1,
    borderRadius: 8,
  },
  bioCharCount: {
    color: '#D3D3D3',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'right',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default SettingsPage;
