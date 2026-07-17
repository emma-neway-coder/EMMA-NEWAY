# 반틈 with 핑티

반,짝임 · 2026 상반기 회고 프로그램. Vercel에 무료로 올려서 누구나 쓸 수 있게 배포하는 프로젝트입니다.

## 1. 로컬에서 확인하기 (선택)

```bash
npm install
npm run dev
```

터미널에 뜨는 주소(보통 http://localhost:5173)를 열어 확인해요.

## 2. Vercel에 배포하기

**방법 A — GitHub 연동 (가장 쉬움)**
1. 이 폴더를 GitHub 저장소로 올려요. 터미널에서:
   ```bash
   cd bantteum
   git init
   git add .
   git commit -m "반틈 with 핑티 첫 배포"
   # github.com에서 새 저장소(예: bantteum)를 만든 뒤:
   git remote add origin https://github.com/내아이디/bantteum.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) 가입 → "Add New Project" → 방금 만든 저장소 선택.
3. Framework Preset이 자동으로 **Vite**로 감지돼요. Build Command `npm run build`, Output Directory `dist`가 기본값으로 잡히면 그대로 Deploy를 눌러요.
4. 몇 분 뒤 `https://프로젝트이름.vercel.app` 같은 주소가 생겨요. 이 주소를 사람들과 공유하면 돼요.

**방법 B — CLI로 바로 배포**
```bash
npm install -g vercel
vercel        # 프로젝트 최초 연결 (질문에 기본값으로 답해도 됨)
vercel --prod # 실제 서비스 주소로 배포
```

무료 플랜(Hobby)으로 충분해요. 사람이 많이 몰려도 정적 사이트라 트래픽 걱정은 크게 없어요.

## 3. 아이콘은 이미 준비되어 있어요

`public/icons/` 폴더에 업로드해주신 고양이 아이콘으로 다음 파일들을 만들어 넣어뒀어요.
- `apple-touch-icon.png` (180×180) — 아이폰 홈 화면용
- `icon-192.png`, `icon-512.png` — 안드로이드 홈 화면·PWA용
- `icon-192-maskable.png`, `icon-512-maskable.png` — 안드로이드가 아이콘을 원형/둥근 사각형으로 잘라도 그림이 안 잘리도록 여백을 둔 버전
- `favicon.ico`, `favicon-16.png`, `favicon-32.png` — 브라우저 탭 아이콘

`index.html`과 `manifest.webmanifest`에서 이 파일들을 이미 연결해뒀기 때문에 따로 손댈 건 없어요.

## 4. 아이폰에서 "홈 화면에 추가"로 앱처럼 쓰기

1. 사파리로 배포된 주소를 열어요. (아이폰은 반드시 **사파리**여야 해요. 크롬 등 다른 브라우저는 이 기능이 없어요.)
2. 하단 공유 버튼(사각형에 위쪽 화살표)을 눌러요.
3. "홈 화면에 추가"를 선택해요.
4. 이름을 확인하고(기본값 "반틈") 추가를 누르면 끝이에요.

이후 홈 화면 아이콘으로 열면 사파리 주소창 없이 꽉 찬 화면으로, 앱스토어 앱처럼 실행돼요. (`apple-mobile-web-app-capable` 메타 태그 덕분이에요.)

## 5. 참고: 기록 저장 방식

지금 화면 안내 문구("적은 글은 이 기기에만 저장돼요")대로, 배포된 사이트에서는 각자의 브라우저(홈 화면 앱 포함) `localStorage`에 저장돼요. 다른 기기와 자동으로 동기화되진 않고, 사용자가 브라우저 데이터를 지우거나 다른 기기·다른 브라우저로 열면 기록이 보이지 않아요. 여러 기기 동기화가 필요해지면 그때 별도의 백엔드(예: Supabase, Vercel KV 등) 연동을 추가로 도와드릴 수 있어요.

## 5. 데이터 구조 (v2 — 2026-07 개편)

**Firestore**
```
users/{uid}                              # 계정 메타 (email, lastLoginAt, loginCount)
users/{uid}/answers/{programId__cardId}  # 카드 한 장 = 문서 한 개
  · text        답변 본문
  · programId   "2026-h1"
  · cardId      "q07" 등
  · clientTs    기기 간 병합 비교용 (Date.now)
  · updatedAt   serverTimestamp — 서버 권위 시각
```
- 전체 맵 덮어쓰기 대신 카드별 문서로 저장해 순서 역전·1MiB 한도 문제를 없앴어요.
- 같은 카드의 쓰기는 큐로 직렬화, 다른 카드는 병렬.
- 구버전 `users/{uid}.answers` 맵은 로그인 시 읽어 병합만 하고 새로 쓰지 않아요.
- 배포 시 `firestore.rules`를 Firebase 콘솔에 꼭 갱신하세요 (answers 하위 컬렉션 규칙 포함).

**로컬 저장 키**
```
bantteum:{uid}:2026-h1:answers   # 로그인 사용자별 영역
bantteum:anon:2026-h1:answers    # 로그인 전 체험 영역 (로그인 시 계정으로 병합 후 비움)
```
- 계정 간 기록이 섞이지 않도록 uid로 격리했어요.
- 구버전 공용 키(banjeol-2026-h1-answers)는 첫 실행 때 anon 영역으로 이관돼요.

**체험 게이트**
- 로그인 없이 각 덱(첫,눈 / 반,짝임)에서 3장까지 쓸 수 있어요.
- 4장째 입력면부터 로그인 안내가 떠요. 이미 쓴 3장은 계속 고칠 수 있어요.
