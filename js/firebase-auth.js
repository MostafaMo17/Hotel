import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const config = window.WANDERLY_FIREBASE_CONFIG;
const EMAIL_LINK_KEY = "wanderly:email-link-address";

function publicUser(user) {
  return user ? {
    id: user.uid,
    name: user.displayName || user.email?.split("@")[0] || "Wanderly Traveler",
    email: user.email || "",
    avatar: user.photoURL || "",
    role: "Explorer",
    authProvider: "firebase"
  } : null;
}

async function setupFirebaseAuth() {
  if (!config?.apiKey || !config?.projectId) throw new Error("Firebase configuration is missing.");
  const app = initializeApp(config);
  const auth = getAuth(app);
  await setPersistence(auth, browserLocalPersistence);

  const api = {
    isConfigured: true,
    async signInEmail(email, password) {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return publicUser(result.user);
    },
    async registerEmail(name, email, password) {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(result.user, { displayName: name });
      await sendEmailVerification(auth.currentUser);
      return publicUser(auth.currentUser);
    },
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
    async sendEmailSignInLink(email) {
      const actionCodeSettings = {
        url: `${window.location.origin}${window.location.pathname}`,
        handleCodeInApp: true
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem(EMAIL_LINK_KEY, email);
    },
    async signInProvider(providerName) {
      let provider;
      if (providerName === "google") provider = new GoogleAuthProvider();
      else throw new Error("Unsupported sign-in provider.");
      const result = await signInWithPopup(auth, provider);
      return publicUser(result.user);
    },
    signOut: () => signOut(auth)
  };

  onAuthStateChanged(auth, (user) => {
    window.dispatchEvent(new CustomEvent("wanderly:firebase-auth-state", { detail: publicUser(user) }));
  });

  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = localStorage.getItem(EMAIL_LINK_KEY);
    if (!email) email = window.prompt("Confirm the email address used to request this sign-in link:");
    if (email) {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      localStorage.removeItem(EMAIL_LINK_KEY);
      history.replaceState({}, document.title, `${location.pathname}${location.hash}`);
      window.dispatchEvent(new CustomEvent("wanderly:firebase-email-link-complete", { detail: publicUser(result.user) }));
    }
  }
  return api;
}

window.WANDERLY_FIREBASE_READY = setupFirebaseAuth().catch((error) => {
  console.error("Firebase Authentication could not start.", error);
  return null;
});
