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
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, increment, collection, getDocs, writeBatch } from "firebase/firestore";
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

let app, _auth, _db, _googleProvider;
try {
  app = initializeApp(firebaseConfig);
  _auth = getAuth(app);
  _db = getFirestore(app);
  _googleProvider = new GoogleAuthProvider();
} catch (e) {
  console.error("[firebase] 초기화 실패 — Vercel 환경변수(VITE_FIREBASE_*)를 확인해주세요.", e);
}
export const auth = _auth;
export const db = _db;
export const googleProvider = _googleProvider;

/* Analytics: 지원되는 브라우저에서만 조용히 켠다 (광고 차단기 등으로 실패해도 앱은 정상 동작) */
let analytics = null;
if (app) {
  isSupported().then((ok) => {
    if (ok && firebaseConfig.measurementId) analytics = getAnalytics(app);
  }).catch(() => {});
}

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
  collection,
  getDocs,
  writeBatch,
};

/* Firestore 문서 구조 (v2):
   users/{uid}                              = { email, lastLoginAt, loginCount }
   users/{uid}/answers/{programId__cardId}  = { text, programId, cardId, clientTs, updatedAt }
   - 카드 한 장 = 문서 한 개. 전체 맵 덮어쓰기·1MiB 한도 문제를 없앤다.
   - clientTs 는 기기 간 병합 비교용, updatedAt 은 서버 권위 시각.
   (구버전 users/{uid}.answers 맵은 로그인 시 읽어 병합만 하고 새로 쓰지 않는다) */
export function userDocRef(uid) {
  return doc(db, "users", uid);
}
export function answersColRef(uid) {
  return collection(db, "users", uid, "answers");
}
export function answerDocRef(uid, docId) {
  return doc(db, "users", uid, "answers", docId);
}
