// Firebase 초기화: Authentication(이메일/구글) + Firestore
// 실제 값은 .env(.local)에 VITE_FIREBASE_* 로 넣고, Vercel에도 같은 이름으로 환경변수를 등록하세요.
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, increment } from "firebase/firestore";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/* Analytics: 지원되는 브라우저에서만 조용히 켠다 (광고 차단기 등으로 실패해도 앱은 정상 동작) */
let analytics = null;
isSupported().then((ok) => {
  if (ok && firebaseConfig.measurementId) analytics = getAnalytics(app);
}).catch(() => {});

/* 로그인/가입 이벤트 기록: Analytics 대시보드용 + Firestore 문서에 직접 기록 */
export async function trackAuthEvent(kind, user) {
  // kind: 'login' | 'sign_up', method: 'google' | 'password'
  try {
    if (analytics) logEvent(analytics, kind === "sign_up" ? "sign_up" : "login", { method: user?.method || "unknown" });
  } catch (e) { /* 통계 실패가 앱을 막지 않도록 */ }
  try {
    if (user?.uid) {
      await setDoc(userDocRef(user.uid), {
        email: user.email || null,
        lastLoginAt: serverTimestamp(),
        loginCount: increment(1),
      }, { merge: true });
    }
  } catch (e) { /* 규칙/네트워크 문제 시 무시 */ }
}

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
};

/* Firestore 문서 구조: users/{uid} = { answers: {...동일한 형태의 로컬 answers 객체}, updatedAt } */
export function userDocRef(uid) {
  return doc(db, "users", uid);
}
