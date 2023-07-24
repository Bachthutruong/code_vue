import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { bodyLoginSocial } from 'src/services/auth/model';

export const signInGoogleWithPopup = () => {
  return new Promise((resolve, reject) => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    auth.languageCode = 'en';
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential: any = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const body: bodyLoginSocial = {
          access_token: token,
          type: 'GOOGLE',
        };
        resolve(body);
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;

        const errorMessage = error.message;
        console.log('errorMessage', errorMessage);

        // The email of the user's account used.
        const email = error.customData.email;
        console.log('email', email);

        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log('credential', credential);
        reject(errorMessage);
        // ...
      });
  });
};
