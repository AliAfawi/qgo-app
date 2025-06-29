// GoogleSignIn.js
import React, { useEffect } from 'react';
import { Button, View, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

// Google OAuth2 discovery endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

const redirectUri = AuthSession.makeRedirectUri({
  useProxy: Constants.appOwnership === 'expo',
});
console.log('Redirect URI:', redirectUri);


export default function GoogleSignIn() {
  // Set up the authentication request with the required scopes
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '655702596984-qqkmphl9a9k80mpksqnu1sih3ekgoj1r.apps.googleusercontent.com', // Your OAuth Client ID
      scopes: [
        'openid',
        'profile',
        'email',
        'https://www.googleapis.com/auth/drive.file',
      ],
      redirectUri, // This must match your settings in Google Cloud Console
    },
    discovery
  );

  // Handle the authentication response
  useEffect(() => {
    if (response?.type === 'success') {
      // Extract the access token from the response parameters
      const { access_token } = response.params;
      Alert.alert('Success', 'Signed in with Google!\nAccess token: ' + access_token);
      // Now you can use the access token to call the Google Drive API.
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        disabled={!request}
        title="Sign in with Google"
        onPress={() => {
          promptAsync({ useProxy: Constants.appOwnership === 'expo' });
        }}
      />
    </View>
  );
}
