import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function FingerprintSetup({ navigation }) {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  // Check if biometric authentication is available
  React.useEffect(() => {
    const checkBiometricSupport = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    };
    checkBiometricSupport();
  }, []);

  const handleFingerprintSetup = async () => {
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      return Alert.alert(
        'Biometric Record Not Found',
        'Please ensure you have set up biometrics in your device settings.'
      );
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      cancelLabel: 'Cancel',
      fallbackLabel: 'Enter Password',
    });

    if (result.success) {
      Alert.alert('Authentication Successful', 'You have successfully set up fingerprint authentication.');
      navigation.navigate('MainScreen');
    } else {
      Alert.alert('Authentication Failed', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Fingerprint Authentication</Text>
      {isBiometricSupported ? (
        <TouchableOpacity style={styles.fingerprintButton} onPress={handleFingerprintSetup}>
          <Text style={styles.fingerprintButtonText}>Set Up Fingerprint</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.errorText}>Fingerprint authentication is not supported on this device.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  fingerprintButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  fingerprintButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
  },
});