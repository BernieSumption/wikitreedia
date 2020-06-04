import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import React, { useEffect } from 'react';

firebase.initializeApp({
  apiKey: 'AIzaSyAQtMZCuht67HHJtlsobQulMHqXHwPpkNg',
  authDomain: 'wikitreedia.firebaseapp.com',
  databaseURL: 'https://wikitreedia.firebaseio.com',
  projectId: 'wikitreedia',
  storageBucket: 'wikitreedia.appspot.com',
  messagingSenderId: '4050578244',
  appId: '1:4050578244:web:fd8b179ca5e516be3f8511',
});
let app = firebase.app();

export default function App() {
  const [count, setCount] = React.useState(0);
  const [user, setUser] = React.useState(firebase.auth().currentUser);
  useEffect(() => {
    app.auth().onAuthStateChanged(setUser);
    if (app.auth().isSignInWithEmailLink(document.location.href)) {
      app
        .auth()
        .signInWithEmailLink('bernie@berniecode.com', document.location.href);
    }
    app
      .firestore()
      .collection('trees')
      .get()
      .then((result) => {
        console.log(result.docs[0].data());
      });
  }, []);
  console.log(user);
  return <div className="App">{user ? <div>app</div> : <LoginForm />}</div>;
}

const LoginForm = () => {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <div>
      {submitted ? (
        <p>A link has been sent to your email.</p>
      ) : (
        <p>
          <input
            type="submit"
            value="Sign in bernie@berniecode.com"
            onClick={async () => {
              try {
                setErrorMessage('');
                await app
                  .auth()
                  .sendSignInLinkToEmail(emailRef.current!.value, {
                    url: document.location.href,
                    handleCodeInApp: true,
                  });
                setSubmitted(true);
              } catch (e) {
                setErrorMessage(String(e));
              }
            }}
          />
        </p>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};
