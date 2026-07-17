import { useState, useEffect, useRef, useCallback } from "react";

/* ── 반틈 with 핑티 · 상반기 회고 프로그램 〈반,짝임〉 · by EMMA ──
   근거 기반 회고: 각 카드에 심리학·정신의학·뇌과학 연구 배경을 분야와 함께 담았어요. */

const PINGTY = "/assets/pingty.png";
const IMG_OUTRO = "/assets/outro.png";
const IMG_INTRO = "/assets/intro.png";
/* 각 이미지는 여기서 딱 한 번만 선언하고, 아래에서는 전부 참조만 해요 (중복 임베드 방지) */
const IMG_COVER = "/assets/cover.png";
const IMG_WARM = "/assets/warm.png";
const IMG_LIKED = "/assets/liked.png";
const IMG_TRACE = "/assets/trace.png";
const IMG_BODY = "/assets/body.png";
const IMG_MIRROR = "/assets/mirror.png";
const IMG_WORK = "/assets/work.png";
const IMG_PEOPLE = "/assets/people.png";
const IMG_FINAL = "/assets/final.png";
const IMG_GALMURI = "/assets/galmuri.png";
const IMG_Q01 = "/assets/q01.png";
const IMG_Q02 = "/assets/q02.png";
const IMG_Q04 = "/assets/q04.png";
const IMG_Q06 = "/assets/q06.png";
const IMG_Q07 = "/assets/q07.png";
const IMG_Q04W = "/assets/q04w.png";

const P_IMGS = {
  warm: IMG_WARM, liked: IMG_LIKED, trace: IMG_TRACE,
  body: IMG_BODY, mirror: IMG_MIRROR, work: IMG_WORK, people: IMG_PEOPLE, final: IMG_FINAL,
  q01: IMG_Q01, q02: IMG_Q02, q04: IMG_Q04, q06: IMG_Q06, q07: IMG_Q07, q04w: IMG_Q04W,
};
const CAT_IMGS = {
  "몸풀기": IMG_WARM,
  "좋아한 것": IMG_LIKED,
  "남은 흔적": IMG_TRACE,
  "몸과 마음": IMG_BODY,
  "나를 마주하기": IMG_MIRROR,
  "일하는 나": IMG_WORK,
  "곁의 사람들": IMG_PEOPLE,
  "갈무리": IMG_GALMURI,
  "마지막": IMG_FINAL,
};

const CARDS = [
  { id: "01", cat: "몸풀기",
    q: "자, 첫 장면부터 함께 볼까요.\n상반기를 통째로 정리하지 않아도 돼요. 지금 가장 먼저 스치는 장면 하나면 충분해요.\n언제, 어디서, 누구와 있었나요?\n그 장면에 한 단어로 제목을 붙인다면요?",
    ex: "예: 첫 출근, 무너짐, 햇살",
    basis: "인지심리학 · 절정-대미 법칙 (Peak-End Rule)",
    why: "기억은 지나간 모든 순간을 고르게 남기지 않아요. 특히 감정이 강했던 순간과 마지막 장면이 그 시기의 인상을 크게 좌우합니다. 가장 먼저 떠오른 장면은 회고를 여는 좋은 실마리예요." },
  { id: "02", cat: "좋아한 것",
    q: "올해 새로 시작한 활동이나 도전 하나를 골라보세요.\n시작하기 전엔 무엇을 기대했나요?\n막상 해보니 무엇이 달랐나요?\n좋아할 줄 알았는데 손이 가지 않은 것도 있다면 함께 적어요. 무엇이 달랐는지까지요.",
    basis: "사회심리학 · 정서 예측 (Affective Forecasting)",
    why: "우리는 무엇을 얼마나 좋아할지 곧잘 예상하지만, 그 크기와 지속 시간은 자주 빗나가요. 기대와 실제가 어긋난 자리를 알아두면 다음 선택이 한결 또렷해집니다." },
  { id: "03", cat: "좋아한 것",
    q: "상반기에 만난 책, 영화, 드라마, 음악, 전시 가운데 지금도 떠오르는 하나를 골라보세요.\n어떤 문장이나 장면, 소리가 남아 있나요?\n왜 그것이 오래 남았을까요?",
    basis: "긍정심리학 · 음미하기 (Savoring)",
    why: "좋았던 경험을 천천히 다시 떠올리며 머무르는 걸 '음미하기'라고 해요. 이렇게 되짚는 과정은 그때의 긍정적인 감정을 다시, 조금 더 오래 느끼게 해줍니다." },
  { id: "04", cat: "좋아한 것",
    q: "평범한 하루를 조금 낫게 만들어준 순간 세 가지를 적어보세요. 아주 사소해도 좋아요.\n기분 좋은 냄새, 짧은 대화, 예상보다 잘해낸 순간, 우연히 본 풍경.\n무엇이 좋았는지 구체적으로요.",
    basis: "긍정심리학 · 좋았던 세 가지 (Three Good Things)",
    why: "좋았던 순간을 찾아 적다 보면 평소 지나치기 쉬운 경험이 눈에 들어와요. 작은 기쁨을 알아차리는 연습이 하루를 조금 다르게 보게 해줍니다." },
  { id: "05", cat: "남은 흔적", note: "천천히 살펴봐도 돼요.",
    q: "카드나 은행 앱을 열어 상반기 소비를 함께 살펴봐요.\n1. 가장 많이 쓴 분야 세 가지를 순서대로 적어요.\n2. 지출이 유독 늘었던 시기가 있었나요?\n3. 그때 어떤 상황을 지나고 있었나요?\n4. 그 소비는 그 시절의 나에게 무엇을 채워주었나요?",
    basis: "인지심리학 · 장밋빛 회상 (Rosy Retrospection)",
    why: "지난 경험은 실제보다 좋게 기억되기 쉬워요. 그래서 감정에만 기대면 놓치는 부분이 생깁니다. 남아 있는 기록을 함께 펼치면 생활의 흐름이 더 정확하게 보여요." },
  { id: "06", cat: "남은 흔적",
    q: "지금 결제 중인 구독 서비스를 하나씩 떠올려 적어보세요.\nOTT, 음악, 클라우드, 앱, 뉴스레터… 무엇이든요.\n각 항목 옆에 표시해요.\n마지막으로 쓴 때 · 유지 / 해지 / 조금 더 지켜보기\n해지로 정한 것 중 하나는, 지금 실제로 해지해봐요.",
    basis: "건강심리학 · 지각된 통제감 (Perceived Control)",
    why: "삶의 모든 걸 마음대로 바꿀 순 없지만, 내가 정할 수 있는 영역을 알아보고 직접 고르는 감각은 중요한 심리적 자원이 돼요. 작은 결정 하나가 생활을 다시 쥐고 있다는 느낌을 되돌려줍니다." },
  { id: "07", cat: "남은 흔적",
    q: "요즘의 평일 하루와 주말 하루를 하나씩 골라요.\n1. 평일에 가장 많은 시간을 쓴 활동 세 가지\n2. 주말에 가장 많은 시간을 쓴 활동 세 가지\n3. 더 쓰고 싶었던 시간은 무엇인가요?\n4. 실제로는 왜 그러지 못했을까요?\n5. 다음 주엔 어떤 시간을 줄이거나 늘리고 싶나요?",
    basis: "시간 사용 연구 (Time-Use Research)",
    why: "시간을 적어보면 내가 반복하는 하루의 모습이 드러나요. 지금의 시간 배분과 내가 바라는 방향을 나란히 놓으면, 바꾸고 싶은 지점과 현실의 제약이 함께 보입니다." },
  { id: "08", cat: "몸과 마음",
    q: "상반기 동안 몸이 보낸 신호를 돌아봐요.\n잠은 대체로 어땠나요?\n자주 피곤했던 시기가 있었나요?\n반복해서 아프거나 불편했던 곳은요?\n유독 힘들었던 때, 그 무렵 어떤 시기를 지나고 있었나요?\n원인을 진단하려 애쓰지 말고, 반복된 신호만 적어요.",
    basis: "수면·정서 연구 (Sleep and Emotion Research)",
    why: "잠과 피로는 기분, 집중, 판단, 감정 조절과 촘촘히 얽혀 있어요. 몸의 상태를 함께 돌아보면 그때의 마음과 행동을 더 넓은 맥락에서 이해할 수 있습니다." },
  { id: "09", cat: "몸과 마음",
    q: "상반기에 자주 찾아온 감정 두세 가지를 적어보세요.\n'좋았다', '힘들었다'보다 조금 더 정확한 이름으로요.\n예: 안도감, 서운함, 초조함, 뿌듯함, 외로움, 답답함\n각 감정 옆에 짝지어 적어요.\n주로 언제 · 어떤 상황에서 · 누구와 있을 때",
    basis: "정서신경과학 · 감정 명명 (Affect Labeling)",
    why: "감정에 정확한 이름을 붙이면 막연하던 느낌을 한 발짝 떨어져 바라보게 돼요. 감정을 말로 옮기는 순간 정서적 반응이 누그러진다는 뇌 영상 연구도 있습니다." },
  { id: "10", cat: "몸과 마음", note: "다 적었다면, 지금 딱 1분만 그 방법으로 쉬어봐요.",
    q: "'제대로 쉬었다' 싶었던 방법 하나를 구체적으로 적어보세요.\n무엇을 했나요?\n얼마나 오래?\n그 뒤 몸과 마음은 어떻게 달라졌나요?\n반대로 쉰다고 했는데 오히려 더 지친 활동이 있었다면 그것도 하나 적어줘요.",
    basis: "조직심리학 · 심리적 분리 (Psychological Detachment)",
    why: "회복은 활동을 멈추는 것만으로 끝나지 않아요. 맡은 역할과 걱정에서 마음이 충분히 떨어져 나올 때 비로소 피로가 풀립니다. 나에게 맞는 회복법을 아는 것, 그게 쉼의 기술이에요." },
  { id: "11", cat: "나를 마주하기",
    q: "아무도 알아주지 않았지만 스스로는 잘했다고 느낀 행동이나 태도 하나를 적어보세요.\n결과보다 내가 실제로 한 것에 집중해요.\n무엇을 시작했나요?\n무엇을 견뎠나요?\n어떤 태도를 지켰나요?\n그 장면은 나의 어떤 힘을 보여주나요?",
    basis: "사회인지이론 · 자기효능감 (Self-Efficacy)",
    why: "직접 해낸 경험은 '다음에도 해볼 수 있다'는 믿음을 쌓는 가장 단단한 재료예요. 작은 성취라도 구체적인 행동으로 기억하면 내 능력을 더 정확히 가늠하게 됩니다." },
  { id: "12", cat: "나를 마주하기", note: "버겁다면 잠시 건너뛰어도 돼요.",
    q: "상반기에 가장 위축되거나 초라하게 느껴졌던 장면 하나를 떠올려요.\n그때 나는 나에게 어떤 기준을 들이댔나요?\n그 기준은 지금 봐도 공정한가요?\n같은 상황을 겪은 친구라면, 뭐라고 말해줄까요?\n친구에게 건넬 그 말을, 그대로 나에게 적어줘요.",
    basis: "임상·긍정심리학 · 자기연민 (Self-Compassion)",
    why: "자기연민은 실수를 무조건 덮어주는 태도가 아니에요. 힘든 자리에 있는 나를 과하게 몰아세우지 않고, 사실에 맞게 친절히 바라보는 방식입니다." },
  { id: "13", cat: "나를 마주하기",
    q: "상반기에 그만둔 활동, 거절한 제안, 놓아준 관계나 습관 가운데 하나를 떠올려요.\n무엇을 멈추거나 거절했나요?\n그 선택으로 지키고 싶었던 건 무엇인가요?\n지금 다시 돌아가도 같은 선택을 할까요?\n다음엔 무엇을 다르게 하고 싶나요?",
    basis: "성격·임상심리학 · 반추와 성찰 (Rumination and Reflection)",
    why: "자신을 돌아보는 생각에는 두 갈래가 있어요. 같은 후회를 곱씹는 반추, 그리고 경험에서 의미를 찾는 성찰이에요. '왜 그만뒀지'라고 물으면 반추로 흐르기 쉽지만, '무엇을 지켰지'라고 물으면 성찰로 이어져 자책 대신 나만의 기준이 남습니다." },
  { id: "14", cat: "나를 마주하기",
    q: "'내가 이런 선택도 하네' 싶었던 순간 하나를 떠올려요.\n어떤 상황이었나요?\n평소의 나라면 어떻게 했을까요?\n실제로는 무엇을 말하고, 느끼고, 골랐나요?\n그 장면에서 발견한 새로운 내 모습은요?\n마지막 답은 한 문장으로 적어봐요.",
    basis: "성격심리학 · 자기개념 (Self-Concept)",
    why: "내가 아는 '나'는 고정된 설명이 아니라, 경험에 따라 계속 고쳐 쓰이는 초안에 가까워요. 평소와 달랐던 행동은 내가 알던 나의 테두리를 넓혀줍니다." },
  { id: "15", cat: "일하는 나",
    q: "상반기에 꾸준히 맡아온 역할을 떠올려봐요.\n직장 일뿐 아니라 공부, 육아, 돌봄, 집안일, 창작, 프로젝트까지 모두 포함돼요.\n그중 세 장면을 하나씩 골라, 각각 무슨 경험이었고 무엇을 알게 됐는지 적어요.\n1. 가장 몰입했던 순간\n2. 가장 버거웠던 순간\n3. 처음 시도했던 순간\n마지막으로, 그때 얻은 배움을 다음에 어디에 써보고 싶은지 한 줄로 적어봐요.",
    basis: "학습심리학 · 경험학습 (Experiential Learning)",
    why: "겪었다고 모든 경험이 저절로 배움이 되진 않아요. 경험을 돌아보고, 의미를 추리고, 다음 행동으로 이을 때 비로소 꺼내 쓸 수 있는 배움이 됩니다." },
  { id: "16", cat: "곁의 사람들",
    q: "상반기의 사람 세 명을 떠올려요.\n1. 새롭게 가까워진 사람\n2. 부럽거나 질투가 났던 사람\n3. 가장 고마웠던 사람\n이름 대신 관계만 적어도 돼요. 같은 사람이 두 칸에 들어가도 괜찮고요.\n각자 옆에 이유를 한 줄씩 적어요. 부러웠던 사람은 그 사람 전체가 아니라, 정확히 어떤 모습이 부러웠는지 적어요.",
    basis: "사회심리학 · 선의의 부러움 (Benign Envy)",
    why: "부러움은 나와 남을 견줄 때 자연스레 이는 감정이에요. 어떤 부러움은 나를 주저앉히지만, 어떤 부러움은 내가 가고 싶은 방향을 가리키는 화살표가 됩니다. 무엇이 부러웠는지 분명히 하면 내가 중요히 여기는 것이 보여요." },
  { id: "17", cat: "곁의 사람들",
    q: "상반기에 자주 만난 사람을 최대 다섯 명까지 적어요.\n각 사람을 만나고 난 뒤의 나를 표시해요.\n힘이 났다 · 크게 달라지지 않았다 · 지쳤다 · 상황에 따라 달랐다\n그중 믿을 만한 한 사람에게 물어봐요.\n\"요즘 저를 한 단어로 표현하면 뭐가 떠올라요?\"\n답이 오면 이 카드에 함께 적어둬요. 정답이 아니라, 나를 비추는 또 하나의 시선으로요.",
    basis: "발달·사회심리학 · 관계의 질 (Relationship Quality)",
    why: "가까운 사이에서는 사람 수만큼이나 관계의 질이 중요해요. 오래 이어진 성인발달 연구에서도 만족스러운 관계가 건강·행복과 꾸준히 이어져 있었습니다. 믿을 만한 사람의 시선은 내가 미처 못 본 나를 비춰주는 참고가 돼요." },
  { id: "18", cat: "갈무리",
    q: "상반기에 시작했지만 마치지 못한 계획이나 과제를 떠오르는 만큼 적어요.\n각 항목을 셋으로 나눠요.\n하반기에도 계속하기 · 이제 놓기 · 아직 결정 못 함\n1. 계속할 것 중 하나를 골라, 무엇을 언제 할지 적어요.\n2. 놓기로 한 것엔, 놓는 이유를 한 줄 남겨요.",
    basis: "목표심리학 · 미완료 목표를 위한 계획 세우기 (Plan Making for Unfulfilled Goals)",
    why: "마치지 못한 목표는 다른 일을 하는 동안에도 자꾸 떠올라 마음 한켠을 붙잡아요. 전부 당장 끝내지 않아도 괜찮아요. 구체적인 다음 계획을 세워두는 것만으로 그 잔상이 옅어집니다." },
  { id: "19", cat: "갈무리",
    q: "지금까지 쓴 카드를 처음부터 다시 읽어봐요.\n상반기를 가장 잘 설명하는 단어 셋을 골라 적어요.\n감정도, 태도도, 장면도, 동사도 좋아요.\n각 단어 아래 그 단어를 고른 이유를 한 줄씩 적어봐요.",
    basis: "성격심리학 · 서사 정체성 (Narrative Identity)",
    why: "흩어져 있던 경험을 잇고 이름을 붙이면 하나의 이야기가 돼요. 그렇게 엮인 이야기는 내가 어떤 시간을 지나왔고 어떤 사람이 되어가는지를 비춰줍니다." },
  { id: "20", cat: "갈무리", rest: true,
    q: "여기까지 오느라 애쓰셨어요.\n마지막은 적지 않아도 돼요.\n눈을 감고, 천천히 숨을 들이쉬었다가\n딱 세 번만 조금 더 길게 내쉬어봐요.\n애쓴 나에게, 짧은 쉼을 건네보세요.\n그동안 떠올린 것들은 제가 여기 잘 담아둘게요.",
    basis: "심리생리학 · 느린 호흡과 이완 (Slow Breathing)",
    why: "길게 내쉬는 숨은 몸을 쉬게 하는 신경을 깨워, 긴장을 풀고 마음을 가라앉히는 데 도움이 돼요. 돌아보느라 애쓴 나에게 건네는, 짧지만 온전한 쉼이에요." },
  { id: "21", cat: "마지막",
    q: "여기까지 왔어요. 이 카드의 뒷면은 비어 있어요. 하고 싶은 말이 남았다면 적어요.",
    basis: "임상심리학 · 표현적 글쓰기 (Expressive Writing)",
    why: "형식 없이 마음을 적는 것만으로도 감정이 정리되고 회복이 빨라져요. 수십 년 글쓰기 연구의 한결같은 결론이에요." },
];

const PRACTICE = [
  { id: "p01", n: "01", tag: "오늘 날짜", img: "q01",
    q: "오늘 날짜를 적어요. 나중에 이 카드를 다시 읽을 때 언제의 나였는지 알 수 있게요.",
    ex: "예: 2026년 7월 9일" },
  { id: "p02", n: "02", tag: "요즘 자주 하는 말", img: "q02",
    q: "요즘 내가 자주 하거나 자주 듣는 말 한마디를 적어요. 누가 한 말이든 상관없어요.",
    ex: "예: \"밥 먹었어?\", \"오늘 하루도 무사히\"" },
  { id: "p03", n: "03", tag: "요즘 웃은 순간", img: "liked",
    q: "최근 일주일 안에서, 내가 웃었던 순간 하나를 적어요. 아주 사소해도 좋아요." },
  { id: "p04", n: "04", tag: "요즘 자주 가는 곳", img: "q04w",
    q: "요즘 자주 가는 장소 하나를 적어요. 그곳에서 나는 주로 무엇을 하나요?" },
  { id: "p05", n: "05", tag: "오늘 컨디션", img: "mirror",
    q: "지금 내 몸 상태를 한 단어로 표현해요.",
    ex: "예: 피곤함, 개운함, 뻐근함" },
  { id: "p06", n: "06", tag: "요즘 신경 쓰이는 일", img: "q04",
    q: "요즘 마음에 자꾸 걸리는 일 하나를 적어요. 해결하지 않아도 괜찮아요, 적기만 해요." },
  { id: "p07", n: "07", tag: "요즘 어때요", img: "q06",
    q: "누가 \"요즘 어때?\"라고 물으면 나는 보통 뭐라고 대답하나요? 그 대답을 그대로 적어요." },
  { id: "p08", n: "08", tag: "요즘 나는", img: "mirror",
    q: "요즘 나에 대해 문득 궁금해진 것이 있나요? 답하지 않아도 괜찮아요, 질문만 적어도 돼요.",
    ex: "예: 나는 왜 이럴 때 짜증이 날까, 나는 뭘 할 때 제일 편할까" },
  { id: "p09", n: "09", tag: "더 물어봐도 될까요", img: "q07",
    q: "방금 적은 궁금증, 조금 더 파고들어도 괜찮을 것 같나요? 아니면 아직은 가볍게 두고 싶나요? 둘 중 편한 쪽을 적어요." },
  { id: "p10", n: "10", tag: "오늘의 한 줄, 그리고", img: "final",
    q: "오늘의 나를 한 문장으로 요약해요. 그리고 그 옆에, 다음에 조금 더 깊이 물어봐도 좋을 것 같은 주제를 하나 적어봐요.",
    ex: "예: 요즘 자주 가는 곳 — 사실 그 이유가 궁금해요" },
];

const CATS = [...new Set(CARDS.map((c) => c.cat))];
const COVER_CATS = CATS.filter((c) => !["몸풀기", "갈무리", "마지막"].includes(c));
/* 표지 미리보기: 스토리텔링과 짝을 이루는 두 장.
   p03 「요즘 웃은 순간」 — "편안한 마음으로" / p08 「요즘 나는」 — "나를 알아가는 일" */
const PREVIEW_CARDS = ["p03", "p08"].map((id) => PRACTICE.find((c) => c.id === id));
const PROGRAM_ID = "2026-h1";
/* 로컬 키: 사용자(uid)별·프로그램별로 격리 — 계정 간 기록 섞임을 구조적으로 차단 */
const keyFor = (uid) => `bantteum:${uid || "anon"}:${PROGRAM_ID}:answers`;
const LEGACY_KEY = "banjeol-2026-h1-answers"; // 구버전 공용 키 (첫 실행 때 anon 영역으로 이관)
const answerDocId = (cardId) => `${PROGRAM_ID}__${cardId}`;
/* 로그인해야 볼 수 있는 화면 — 보관함, 그리고 각 덱의 4장째부터 */
const GATED_VIEWS = new Set(["archive"]);
/* 체험 한도: 덱마다 앞 3장까지 열람·작성, 4장째부터 로그인 */
const TRIAL_LIMIT = 3;
const sentences = (t) =>
  t.includes("\n")
    ? t.split("\n").map((s) => s.trim()).filter(Boolean)
    : (t.match(/[^.?!]+[.?!]+["')\]]*\s*|[^.?!]+$/g) || [t]).map((s) => s.trim()).filter(Boolean);
const fmtDate = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/* 저장 안전망: 아티팩트 저장소 → 브라우저 저장소 → 임시 메모리 순으로 시도 */
const store = {
  mode: null, // 'cloud' | 'local' | 'memory'
  mem: null,
  async load(key) {
    try {
      const r = await window.storage.get(key);
      this.mode = "cloud";
      return r?.value ?? null;
    } catch (e) { /* 키 없음 또는 API 없음 */ }
    if (this.mode !== "cloud") {
      try {
        const v = window.localStorage.getItem(key);
        this.mode = "local";
        return v;
      } catch (e) { /* localStorage 불가 */ }
      this.mode = "memory";
    }
    return this.mem;
  },
  async save(key, value) {
    try {
      await window.storage.set(key, value);
      this.mode = "cloud";
      return "cloud";
    } catch (e) { /* 다음 단계로 */ }
    try {
      window.localStorage.setItem(key, value);
      this.mode = "local";
      return "local";
    } catch (e) { /* 다음 단계로 */ }
    this.mem = value;
    this.mode = "memory";
    return "memory";
  },
  /* 로그아웃 시 이 기기에 남은 기록 비우기 (공용 기기 대비) */
  async clear(key) {
    try { await window.storage.delete(key); } catch (e) { /* 없거나 미지원 */ }
    try { window.localStorage.removeItem(key); } catch (e) { /* 불가 */ }
    this.mem = null;
  },
};

const Spark = ({ size = 16, color = "var(--orange)", className = "", delay = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" className={`spark ${className}`}
    style={{ animationDelay: `${delay}s` }} aria-hidden="true">
    <path d="M10 1 Q11 8 19 10 Q11 12 10 19 Q9 12 1 10 Q9 8 10 1 Z" fill={color} />
  </svg>
);

const Pingty = ({ size = 64, className = "" }) => (
  <img src={PINGTY} alt="" aria-hidden="true" className={className}
    style={{ width: size, height: "auto", display: "block" }} />
);

/* ── 계정 동기화 (이메일/구글 로그인 시 자동 백업) ── */
import {
  auth, googleProvider, userDocRef, answersColRef, answerDocRef,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, signOut, onAuthStateChanged,
  sendPasswordResetEmail, getDoc, getDocs, setDoc, writeBatch, serverTimestamp,
  db, trackAuthEvent,
} from "./firebase";

/* 로컬 기록과 서버 기록을 ts(마지막 수정 시각) 기준으로 병합 — 최신 것이 이김 */
function mergeAnswers(local, remote) {
  const out = { ...(remote || {}) };
  for (const id of Object.keys(local || {})) {
    const l = local[id];
    const r = out[id];
    if (!r || (l?.ts ?? 0) >= (r?.ts ?? 0)) out[id] = l;
  }
  return out;
}

const AuthPanel = ({ open, onClose, user, onAuthed, onRequestSignOut, notice }) => {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, pw);
        trackAuthEvent("sign_up", { uid: cred.user.uid, email: cred.user.email, method: "password" });
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, pw);
        trackAuthEvent("login", { uid: cred.user.uid, email: cred.user.email, method: "password" });
      }
      onAuthed?.();
      onClose();
    } catch (e2) {
      const map = {
        "auth/invalid-email": "이메일 형식을 확인해주세요.",
        "auth/email-already-in-use": "이미 가입된 이메일이에요. 로그인해주세요.",
        "auth/weak-password": "비밀번호는 6자 이상이어야 해요.",
        "auth/invalid-credential": "이메일 또는 비밀번호가 맞지 않아요.",
        "auth/user-not-found": "가입되지 않은 이메일이에요.",
      };
      setErr(map[e2.code] || "잠시 후 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setErr(""); setBusy(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      trackAuthEvent("login", { uid: cred.user.uid, email: cred.user.email, method: "google" });
      onAuthed?.();
      onClose();
    } catch (e2) {
      setErr("구글 로그인에 실패했어요.");
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!email) { setErr("비밀번호를 재설정할 이메일을 먼저 입력해주세요."); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (e2) {
      setErr("재설정 메일 전송에 실패했어요.");
    }
  };

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
        {user ? (
          <>
            <h3>계정</h3>
            <p className="auth-email">{user.email}</p>
            <p className="auth-note">이 기기가 아니어도 로그인하면 기록을 그대로 볼 수 있어요.</p>
            <button className="ghost" onClick={() => onRequestSignOut?.()}>로그아웃</button>
          </>
        ) : (
          <>
            {notice && (
              <div className="trial-notice">
                <p className="tn-head">여기까지 세 장, 잘 적었어요.</p>
                <p className="tn-body">이어서 쓰려면 로그인해요.<br />적은 카드는 계정에 담겨서<br />언제 다시 와도 그대로 있고,<br />다른 기기에서도 이어 볼 수 있어요.</p>
              </div>
            )}
            <div className="auth-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={mode === "login"}
                className={mode === "login" ? "on" : ""} onClick={() => { setMode("login"); setErr(""); }}>로그인</button>
              <button type="button" role="tab" aria-selected={mode === "signup"}
                className={mode === "signup" ? "on" : ""} onClick={() => { setMode("signup"); setErr(""); }}>회원가입</button>
            </div>
            {!notice && <p className="auth-note">기록을 계정에 백업해두면 기기를 바꾸거나 오래 쉬었다 와도 사라지지 않아요.</p>}
            <button type="button" className="google-btn" onClick={google} disabled={busy}>
              <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 0 1-2 3.018v2.51h3.232C18.51 15.836 19.6 13.273 19.6 10.227Z" fill="#4285F4" />
                <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.51c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59C2.71 17.76 6.09 20 10 20Z" fill="#34A853" />
                <path d="M4.405 11.9A5.99 5.99 0 0 1 4.09 10c0-.66.114-1.3.314-1.9V5.51H1.064A9.98 9.98 0 0 0 0 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59Z" fill="#FBBC04" />
                <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.96.991 12.695 0 10 0 6.09 0 2.71 2.241 1.064 5.51l3.34 2.59C5.19 5.737 7.395 3.977 10 3.977Z" fill="#E94235" />
              </svg>
              Google로 계속하기
            </button>
            <div className="auth-divider">또는</div>
            <form onSubmit={submit} className="auth-form">
              <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="비밀번호 (6자 이상)" value={pw} onChange={(e) => setPw(e.target.value)} minLength={6} required />
              {err && <p className="auth-err">{err}</p>}
              {sent && <p className="auth-sent">재설정 메일을 보냈어요.</p>}
              <button type="submit" className="primary" disabled={busy}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
                  stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
                  <path d="M3.6 7 12 12.8 20.4 7" />
                </svg>
                {mode === "login" ? "이메일로 로그인" : "이메일로 가입하기"}
              </button>
            </form>
            <div className="auth-switch">
              {mode === "login" && (
                <button type="button" onClick={reset}>비밀번호를 잊었어요</button>
              )}
            </div>
          </>
        )}
        <button className="modal-x" onClick={onClose} aria-label="닫기">✕</button>
      </div>
    </div>
  );
};

/* 로그아웃 확인 시트 — step: 'confirm'(정상) | 'failed'(마지막 백업 실패) */
const LogoutSheet = ({ step, busy, onStay, onConfirm, onForce }) => {
  if (!step) return null;
  const failed = step === "failed";
  return (
    <div className="modal-back" onClick={busy ? undefined : onStay}>
      <div className="modal logout-sheet" onClick={(e) => e.stopPropagation()}
        role="alertdialog" aria-modal="true">
        {failed ? (
          <>
            <h3>잠깐, 마지막 답변을 아직 못 담았어요</h3>
            <p className="ls-body">
              인터넷 연결을 확인하고 다시 눌러주세요.<br />
              지금 로그아웃하면 방금 적은 카드가 이 기기에만 남아요.
            </p>
            <div className="ls-actions">
              <button className="primary" onClick={onConfirm} disabled={busy}>
                {busy ? "담는 중…" : "다시 시도"}
              </button>
              <button className="ghost" onClick={onForce} disabled={busy}>그냥 로그아웃</button>
            </div>
          </>
        ) : (
          <>
            <h3>오늘은 여기까지 할까요?</h3>
            <p className="ls-body">
              적던 카드는 계정에 담아둘게요.<br />
              다음에 로그인하면 그 자리에 그대로 있어요.
            </p>
            <div className="ls-actions">
              <button className="primary" onClick={onStay} disabled={busy}>조금 더 쓸래요</button>
              <button className="ghost" onClick={onConfirm} disabled={busy}>
                {busy ? "담는 중…" : "로그아웃"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* 아카이브 답변: 길면 접어두고 '더 읽기'로 펼친다 */
const ARCH_CLAMP_CHARS = 240;
const ARCH_CLAMP_LINES = 7;
const ArchAnswer = ({ text }) => {
  const [open, setOpen] = useState(false);
  const lines = text.split("\n");
  const isLong = text.length > ARCH_CLAMP_CHARS || lines.length > ARCH_CLAMP_LINES;
  return (
    <>
      <div className={`arch-a ${isLong && !open ? "clamped" : ""}`}>
        {lines.map((ln, i) => <p key={i}>{ln || "\u00A0"}</p>)}
      </div>
      {isLong && (
        <button className="arch-more" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? "접기" : "더 읽기"}
        </button>
      )}
    </>
  );
};

export default function App() {
  const [view, setView] = useState("cover");     // cover | intro | deck | bridge | outro | archive
  const [deckMode, setDeckMode] = useState("main"); // main | practice
  const [storyOpen, setStoryOpen] = useState(false);
  const [introBasis, setIntroBasis] = useState(false);
  const [coverBasis, setCoverBasis] = useState(false); // 표지: 핑티가 덧붙이는 근거
  const [pvFlip, setPvFlip] = useState({});            // 표지 미리보기 카드 뒤집힘 상태
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});    // {id:{text, ts}}
  const [flipped, setFlipped] = useState(false);
  const [peek, setPeek] = useState(false);   // 첫,눈: 질문 살짝 보기 (내비게이션과 무관)
  const [draft, setDraft] = useState("");
  const [showWhy, setShowWhy] = useState(false);
  const [toast, setToast] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState("");  // '' | saving | saved
  const [askReset, setAskReset] = useState(false);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false); // 첫 인증 확인이 끝났는지
  const [authOpen, setAuthOpen] = useState(false);
  const [logoutAsk, setLogoutAsk] = useState(null);  // null | 'confirm' | 'failed'
  const [outBusy, setOutBusy] = useState(false);     // 로그아웃 처리 중
  const taRef = useRef(null);
  const toastT = useRef(null);
  const autoT = useRef(null);
  const answersRef = useRef({});
  const dirtyRef = useRef(null);      // {id, text} — 아직 저장 안 된 입력
  const touchRef = useRef(null);      // 스와이프 시작점
  const pendingAction = useRef(null); // 로그인 후 이어서 할 동작
  const prevUidRef = useRef(undefined); // undefined=첫 확인 전 · null=비로그인 · string=로그인

  useEffect(() => { answersRef.current = answers; }, [answers]);
  const userRef = useRef(null);
  useEffect(() => { userRef.current = user; }, [user]);
  /* 지금 이 화면의 기록이 저장되는 로컬 키 (비로그인=anon 영역, 로그인=uid 영역) */
  const activeKeyRef = useRef(keyFor(null));
  /* 카드별 클라우드 쓰기 큐: 같은 카드는 순차, 다른 카드는 병렬 — 순서 역전 방지 */
  const writeQueues = useRef(new Map());
  /* 마지막 클라우드 쓰기가 실패한 카드들 (로그아웃 전 재시도 대상) */
  const cloudDirty = useRef(new Set());

  /* 카드 한 장을 계정에 저장 (큐 직렬화 + clientTs 로 병합 기준 보존) */
  const queueCloudWrite = useCallback((uid, cardId, entry) => {
    const prev = writeQueues.current.get(cardId) || Promise.resolve();
    const p = prev
      .then(() => setDoc(answerDocRef(uid, answerDocId(cardId)), {
        text: entry?.text ?? "",
        programId: PROGRAM_ID,
        cardId,
        clientTs: entry?.ts ?? Date.now(),
        updatedAt: serverTimestamp(),
      }))
      .then(() => { cloudDirty.current.delete(cardId); })
      .catch(() => { cloudDirty.current.add(cardId); });
    writeQueues.current.set(cardId, p);
    return p;
  }, []);

  /* 화면을 벗어날 때 미저장 입력 즉시 저장 */
  useEffect(() => {
    const flush = () => {
      const d = dirtyRef.current;
      if (!d) return;
      dirtyRef.current = null;
      const next = { ...answersRef.current, [d.id]: { text: d.text, ts: Date.now() } };
      answersRef.current = next;
      setAnswers(next);
      store.save(activeKeyRef.current, JSON.stringify(next));
      const u = userRef.current;
      if (u) queueCloudWrite(u.uid, d.id, next[d.id]);
    };
    const onVis = () => { if (document.hidden) flush(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", flush);
    };
  }, [queueCloudWrite]);

  /* 불러오기: anon 영역에서 시작 (+구버전 공용 키 이관, +구버전 문자열 마이그레이션) */
  useEffect(() => {
    (async () => {
      try {
        let v = await store.load(keyFor(null));
        if (!v) {
          /* 구버전 공용 키가 남아 있으면 anon 영역으로 옮기고 비운다 */
          const legacy = await store.load(LEGACY_KEY);
          if (legacy) {
            v = legacy;
            await store.save(keyFor(null), legacy);
            await store.clear(LEGACY_KEY);
          }
        }
        if (v) {
          const raw = JSON.parse(v);
          const norm = {};
          for (const k of Object.keys(raw)) {
            const val = raw[k];
            norm[k] = typeof val === "string" ? { text: val, ts: null } : val;
          }
          setAnswers(norm);
        }
      } catch (e) { /* 첫 방문 */ }
      setLoaded(true);
    })();
  }, []);

  const memNoticeShown = useRef(false);
  /* 저장: 로컬엔 전체(가볍고 같은 기기라 안전), 계정엔 바뀐 카드 한 장만 */
  const persist = useCallback(async (next, changedId) => {
    setSaveState("saving");
    const mode = await store.save(activeKeyRef.current, JSON.stringify(next));
    setSaveState(mode === "memory" ? "temp" : "saved");
    setTimeout(() => setSaveState(""), 1600);
    if (mode === "memory" && !memNoticeShown.current) {
      memNoticeShown.current = true;
      popToast("이 화면에선 기록이 임시로만 저장돼요");
    }
    const u = userRef.current;
    if (u && changedId) queueCloudWrite(u.uid, changedId, next[changedId]);
  }, [queueCloudWrite]);

  /* ── 세션 초기화: 카드/입력/모달 상태를 모두 비우고 표지로 ──
     wipeLocal=true  : 이 기기에서 떠나는 사용자의 기록을 지운다 (자발적 로그아웃, 백업 성공 후)
     wipeLocal=false : 기록은 그 사용자의 로컬 영역에 남긴다 (세션 만료 등 비자발적) —
                       화면에서는 비워서 공용 기기에서 남이 보지 못하게 하고,
                       같은 사용자가 다시 로그인하면 그 영역에서 복구된다 */
  const resetSession = useCallback(({ wipeLocal = true } = {}) => {
    clearTimeout(autoT.current);
    dirtyRef.current = null;
    pendingAction.current = null;

    const departingKey = activeKeyRef.current;
    if (wipeLocal) store.clear(departingKey);
    /* 화면과 메모리는 항상 비우고, 이후 기록은 anon 영역으로 */
    answersRef.current = {};
    setAnswers({});
    activeKeyRef.current = keyFor(null);
    writeQueues.current = new Map();
    cloudDirty.current = new Set();

    setView("cover");
    setDeckMode("main");
    setIdx(0);
    setDraft("");
    setFlipped(false);
    setPeek(false);
    setShowWhy(false);
    setPvFlip({});
    setCoverBasis(false);
    setIntroBasis(false);
    setStoryOpen(false);
    setAskReset(false);
    setShowAbout(false);
    setAuthOpen(false);
    setLogoutAsk(null);
    setOutBusy(false);
    setSaveState("");
    window.scrollTo(0, 0);
  }, []);

  /* 로그아웃 실행.
     force=false: 계정 백업(카드별 쓰기 완료)에 실패하면 로그아웃을 멈추고 '실패 시트'로 넘긴다.
     force=true : 백업이 안 돼도 진행하되, 이 기기의 기록은 지우지 않는다. */
  const userSignOutRef = useRef(false); // 자발적 로그아웃 표시 (리스너의 비자발 처리와 구분)
  const doSignOut = useCallback(async ({ force = false } = {}) => {
    setOutBusy(true);
    const u = userRef.current;

    // 1) 아직 저장 안 된 입력(자동저장 0.9초 대기 중인 글)부터 확정
    clearTimeout(autoT.current);
    let next = answersRef.current;
    const d = dirtyRef.current;
    if (d) {
      dirtyRef.current = null;
      next = { ...next, [d.id]: { text: d.text, ts: Date.now() } };
      answersRef.current = next;
      setAnswers(next);
      try { await store.save(activeKeyRef.current, JSON.stringify(next)); } catch (e) { /* 아래에서 처리 */ }
      if (u) queueCloudWrite(u.uid, d.id, next[d.id]);
    }

    // 2) 계정 백업 확인 — 실패했던 카드는 한 번 더 시도하고, 큐가 다 비워질 때까지 기다린다
    let backedUp = !u;
    if (u) {
      for (const id of [...cloudDirty.current]) {
        if (next[id] !== undefined) queueCloudWrite(u.uid, id, next[id]);
      }
      try { await Promise.all([...writeQueues.current.values()]); } catch (e) { /* 개별 catch 처리됨 */ }
      backedUp = cloudDirty.current.size === 0;
    }

    // 3) 실패했고 강행이 아니면 — 사용자를 붙잡아 둔다
    if (!backedUp && !force) {
      setOutBusy(false);
      setLogoutAsk("failed");
      return;
    }

    // 4) 로그아웃. 정리는 여기서 직접 하므로
    //    리스너가 한 번 더 초기화하지 않도록 표시를 남기고 prevUid를 미리 비운다.
    userSignOutRef.current = true;
    prevUidRef.current = null;
    try { await signOut(auth); } catch (e) { /* 이미 만료된 세션 등 */ }

    resetSession({ wipeLocal: backedUp });
    popToast(
      backedUp
        ? "로그아웃했어요. 회고는 계정에 있어요"
        : "못 담은 카드는 이 기기에 남겨뒀어요. 다시 로그인하면 담을게요"
    );
  }, [resetSession, queueCloudWrite]);

  /* 로그인 감지 + 로그인 시점 병합.
     디스크 기준 3원 병합: 계정(카드별 문서 + 구버전 맵) ↔ 그 사용자의 로컬 영역 ↔ anon(체험) 영역.
     최신 수정분(ts)이 이기고, 로컬이 이긴 카드만 계정에 다시 올린다. */
  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = onAuthStateChanged(auth, async (u) => {
        const prevUid = prevUidRef.current;   // undefined = 아직 첫 확인 전
        prevUidRef.current = u?.uid ?? null;
        setUser(u);
        setAuthReady(true);

        if (!u) {
          if (userSignOutRef.current) { userSignOutRef.current = false; return; } // 자발적 — doSignOut이 정리함
          // 비자발적(세션 만료·다른 탭·네트워크): 화면만 비우고 이 기기의 기록은 남긴다
          if (prevUid) resetSession({ wipeLocal: false });
          return;
        }
        try {
          // 1) 계정: 카드별 문서 (+ 구버전 users/{uid}.answers 맵은 병합 재료로만 읽음)
          const remote = {};
          try {
            const col = await getDocs(answersColRef(u.uid));
            col.forEach((docSnap) => {
              const data = docSnap.data() || {};
              if (data.programId === PROGRAM_ID && data.cardId) {
                remote[data.cardId] = { text: data.text || "", ts: data.clientTs ?? 0 };
              }
            });
          } catch (e) { /* 컬렉션 없음 등 */ }
          try {
            const snap = await getDoc(userDocRef(u.uid));
            const legacy = snap.exists() ? (snap.data().answers || {}) : {};
            for (const k of Object.keys(legacy)) {
              const val = legacy[k];
              const entry = typeof val === "string" ? { text: val, ts: 0 } : { text: val?.text || "", ts: val?.ts ?? 0 };
              const r = remote[k];
              if (!r || (entry.ts ?? 0) > (r.ts ?? 0)) remote[k] = entry;
            }
          } catch (e) { /* 구버전 없음 */ }

          // 2) 로컬: 이 사용자의 영역 + anon(체험) 영역 — 메모리가 아니라 디스크 기준으로,
          //    직전 다른 계정의 잔상이 섞이지 않게 한다
          const readKey = async (key) => {
            try {
              const v = await store.load(key);
              if (!v) return {};
              const raw = JSON.parse(v);
              const out = {};
              for (const k of Object.keys(raw)) {
                const val = raw[k];
                out[k] = typeof val === "string" ? { text: val, ts: null } : val;
              }
              return out;
            } catch (e) { return {}; }
          };
          const userLocal = await readKey(keyFor(u.uid));
          const anonLocal = await readKey(keyFor(null));

          // 3) 병합 (최신 ts 승, 동률이면 로컬 우선 — 손끝의 기록이 더 최근일 가능성이 높다)
          let merged = mergeAnswers(userLocal, remote);
          merged = mergeAnswers(anonLocal, merged);

          // 4) 반영: 화면·이 사용자의 로컬 영역. anon 영역은 계정으로 옮겨졌으니 비운다
          activeKeyRef.current = keyFor(u.uid);
          answersRef.current = merged;
          setAnswers(merged);
          await store.save(keyFor(u.uid), JSON.stringify(merged));
          await store.clear(keyFor(null));

          // 5) 로컬이 이긴 카드만 계정에 올린다 (전체 재업로드 금지)
          for (const id of Object.keys(merged)) {
            const m = merged[id];
            const r = remote[id];
            if (!r || (m?.ts ?? 0) > (r?.ts ?? 0)) queueCloudWrite(u.uid, id, m);
          }
          popToast("계정에 기록을 담아뒀어요");
        } catch (e) {
          popToast("계정 동기화 중 문제가 있었어요, 잠시 후 다시 시도해주세요");
        }
      });
    } catch (e) {
      console.error("Firebase Auth 초기화 실패 — 환경변수를 확인해주세요.", e);
      setAuthReady(true);
    }
    return () => unsub();
  }, [resetSession, queueCloudWrite]);

  /* 안전망: 어떤 경로로든 비로그인 상태에서 로그인 전용 화면에 남아 있으면 표지로 되돌린다 */
  useEffect(() => {
    if (!authReady || user) return;
    if (GATED_VIEWS.has(view)) resetSession({ wipeLocal: false });
  }, [authReady, user, view, resetSession]);

  const popToast = (m) => {
    setToast(m);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(""), 1900);
  };

  const DECK = deckMode === "practice" ? PRACTICE : CARDS;
  const card = DECK[Math.min(idx, DECK.length - 1)];
  const getText = (id) => (answers[id]?.text || "").trim();
  const deckWritable = DECK.filter((c) => !c.rest);
  const doneCount = deckWritable.filter((c) => getText(c.id)).length;
  const allDone = doneCount === deckWritable.length;
  const MAIN_WRITABLE = CARDS.filter((c) => !c.rest);
  const mainDone = MAIN_WRITABLE.filter((c) => getText(c.id)).length;
  const pracDone = PRACTICE.filter((c) => getText(c.id)).length;
  const requireAuth = (fn) => {
    if (userRef.current) { fn(); return; }
    pendingAction.current = fn;
    setAuthOpen(true);
  };
  /* ── 체험 게이트: 비로그인은 덱마다 앞 3장까지 열람·작성.
     4장째부터는 질문도 베일로 가려지고 로그인해야 열린다. */
  const [authNotice, setAuthNotice] = useState(false);
  const trialSheetShown = useRef(false); // 시트는 세션당 자동으로 한 번만
  const trialGated = (cardId) => {
    if (user) return false;
    const list = deckMode === "practice" ? PRACTICE : CARDS;
    return list.findIndex((c) => c.id === cardId) >= TRIAL_LIMIT;
  };
  const openTrialAuth = () => { setAuthNotice(true); setAuthOpen(true); };
  const maybeShowTrialSheet = (cardId) => {
    if (trialGated(cardId) && !trialSheetShown.current) {
      trialSheetShown.current = true;
      openTrialAuth();
    }
  };
  const enterDeck = (mode, at = 0, write = false) => {
    const deck = mode === "practice" ? PRACTICE : CARDS;
    const target = deck[Math.min(at, deck.length - 1)];
    setDeckMode(mode); setIdx(at); setShowWhy(false); setView("deck");
    if (write) {
      setDraft((answersRef.current[target.id]?.text || ""));
      setPeek(false);                       // 연습 덱: 바로 쓰는 면
      setFlipped(mode === "main");          // 본 덱: 바로 뒷면
      if (mode === "main") setTimeout(() => taRef.current?.focus(), 580);
    } else {
      setFlipped(false);
      setPeek(mode === "practice");
    }
  };

  /* 화면이 바뀌면 스크롤을 맨 위로 */
  useEffect(() => { window.scrollTo(0, 0); }, [view]);
  const lastTs = Math.max(0, ...Object.values(answers).map((a) => a?.ts || 0));

  const commit = useCallback((id, text) => {
    if (dirtyRef.current?.id === id) dirtyRef.current = null;
    const next = { ...answersRef.current, [id]: { text, ts: Date.now() } };
    answersRef.current = next;
    setAnswers(next);
    persist(next, id);
    return next;
  }, [persist]);

  /* 연습 덱: 카드 이동 시 답안 동기화 (+체험 한도에 닿으면 안내 시트) */
  useEffect(() => {
    if (deckMode === "practice" && loaded) {
      setDraft(answersRef.current[card.id]?.text || "");
      if (!peek) maybeShowTrialSheet(card.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, deckMode, loaded]);

  /* 자동 저장 (입력 멈춘 뒤 0.9초) */
  const onDraft = (v) => {
    setDraft(v);
    dirtyRef.current = { id: card.id, text: v };
    clearTimeout(autoT.current);
    autoT.current = setTimeout(() => commit(card.id, v), 900);
  };
  /* 입력창에서 포커스가 빠지면 즉시 저장 */
  const flushDraft = () => {
    if (dirtyRef.current?.id === card.id) {
      clearTimeout(autoT.current);
      commit(card.id, draft);
    }
  };

  const openBack = () => {
    setDraft(answers[card.id]?.text || "");
    setShowWhy(false);
    setFlipped(true);
    maybeShowTrialSheet(card.id);
    if (!trialGated(card.id)) setTimeout(() => taRef.current?.focus(), 580);
  };
  const closeBack = () => {
    clearTimeout(autoT.current);
    if (!trialGated(card.id)) commit(card.id, draft);
    setFlipped(false);
    popToast(trialGated(card.id) ? "질문 카드를 덮어두었어요" : draft.trim() ? "카드 뒷면에 적어두었어요" : "빈 카드로 두었어요");
  };
  const go = (d) => {
    if (flipped) {
      clearTimeout(autoT.current);
      if (!trialGated(card.id)) commit(card.id, draft);
      setFlipped(false);
    }
    setShowWhy(false);
    setPeek(deckMode === "practice");
    setIdx((i) => Math.min(DECK.length - 1, Math.max(0, i + d)));
  };

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") {
        if (logoutAsk) { if (!outBusy) setLogoutAsk(null); return; }
        if (showAbout) { setShowAbout(false); return; }
        if (askReset) { setAskReset(false); return; }
        if (view === "deck" && deckMode === "main" && flipped) { closeBack(); return; }
        return;
      }
      if (view !== "deck") return;
      const tag = e.target?.tagName;
      if (tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Enter") {
        if (deckMode === "practice") return;
        if (tag === "BUTTON" || tag === "A") return; // 버튼 활성화와 겹치지 않게
        openBack();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  /* 스와이프로 카드 넘기기 (질문 면이 보일 때만) */
  const canSwipe = deckMode === "main" ? !flipped : peek;
  const onTouchStart = (e) => {
    if (e.target?.tagName === "TEXTAREA") { touchRef.current = null; return; }
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const s = touchRef.current;
    touchRef.current = null;
    if (!s || !canSwipe) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x, dy = t.clientY - s.y;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
  };

  const copyAll = async () => {
    /* 아카이브에서 보고 있는 덱(deckMode)의 기록만 복사한다 */
    const isPrac = deckMode === "practice";
    const title = isPrac
      ? "첫,눈 · 처음 만나는 회고 — 반틈 with 핑티"
      : "반,짝임 · 2026 상반기 회고 — 반틈 with 핑티";
    const body = isPrac
      ? PRACTICE.map((c) => `${c.n} ${c.tag}\n→ ${getText(c.id) || "(빈 카드)"}\n`)
      : CARDS.filter((c) => !c.rest).map((c) => `${c.id} [${c.cat}] ${c.q.replace(/\n/g, " ")}\n→ ${getText(c.id) || "(빈 카드)"}\n`);
    const txt = [title, ""].concat(body).join("\n");
    try { await navigator.clipboard.writeText(txt); popToast(isPrac ? "첫,눈 기록을 복사했어요" : "반,짝임 기록을 복사했어요"); }
    catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = txt;
        ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        popToast(isPrac ? "첫,눈 기록을 복사했어요" : "반,짝임 기록을 복사했어요");
      } catch { popToast("복사에 실패했어요"); }
    }
  };
  /* 기록 비우기: 계정 삭제가 '확인된 뒤에만' 로컬을 지우고 완료를 알린다.
     실패하면 아무것도 지우지 않고 다시 시도할 수 있게 남겨둔다. */
  const [resetBusy, setResetBusy] = useState(false);
  const doReset = async () => {
    const u = userRef.current;
    setResetBusy(true);
    if (u) {
      try {
        const col = await getDocs(answersColRef(u.uid));
        const batch = writeBatch(db);
        col.forEach((docSnap) => {
          if (docSnap.id.startsWith(`${PROGRAM_ID}__`)) batch.delete(docSnap.ref);
        });
        /* 구버전 answers 맵도 비운다 — merge 빈맵은 지워지지 않으므로 필드 교체(update)로.
           문서가 없으면 update가 실패하니 먼저 존재를 보장한다. */
        await setDoc(userDocRef(u.uid), { email: u.email || null }, { merge: true });
        batch.update(userDocRef(u.uid), { answers: {} });
        await batch.commit();
      } catch (e) {
        setResetBusy(false);
        popToast("지우지 못했어요. 연결을 확인하고 다시 시도해주세요");
        return; // 데이터는 그대로 보존
      }
    }
    dirtyRef.current = null;
    answersRef.current = {};
    setAnswers({});
    try { await store.save(activeKeyRef.current, JSON.stringify({})); } catch (e) { /* 무시 */ }
    writeQueues.current = new Map();
    cloudDirty.current = new Set();
    setResetBusy(false);
    setIdx(0); setAskReset(false); setView("cover"); popToast("모두 비웠어요");
  };

  const catDone = (cat) => {
    const list = CARDS.filter((c) => c.cat === cat && !c.rest);
    return `${list.filter((c) => getText(c.id)).length}/${list.length}`;
  };

  return (
    <div className="app">
      <style>{css}</style>

      {/* 헤더 */}
      <header className="top">
        <button className="brand" onClick={() => { setFlipped(false); setView("cover"); }}>
          <Pingty size={26} className="brand-face" />
          반틈 <span className="withp">with 핑티</span>
        </button>
        <div className="top-right">
          {(view === "deck" || view === "archive") && (
            <button
              className={`link-btn ${view === "archive" ? "on" : ""}`}
              onClick={() => { setFlipped(false); setView("archive"); }}
            >
              아카이브 {mainDone === MAIN_WRITABLE.length && <i className="dot" />}
            </button>
          )}
          <button
            className={`account-btn ${user ? "quiet" : "solid"}`}
            onClick={() => setAuthOpen(true)}
            aria-label={user ? "계정 정보 열기" : "로그인 또는 회원가입"}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="3.6" />
              <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
            </svg>
            {user ? "계정" : "로그인"}
          </button>
        </div>
      </header>

      <AuthPanel
        open={authOpen}
        onClose={() => { setAuthOpen(false); setAuthNotice(false); }}
        user={user}
        notice={authNotice}
        onAuthed={() => {
          setAuthNotice(false);
          const fn = pendingAction.current;
          pendingAction.current = null;
          if (fn) fn();
        }}
        onRequestSignOut={() => { setAuthOpen(false); setLogoutAsk("confirm"); }}
      />

      <LogoutSheet
        step={logoutAsk}
        busy={outBusy}
        onStay={() => { if (!outBusy) setLogoutAsk(null); }}
        onConfirm={() => doSignOut({ force: false })}
        onForce={() => doSignOut({ force: true })}
      />

      {(view === "deck" || view === "archive") && (
        <nav className="deck-switch" aria-label="카드덱 첫 장으로 이동">
          <div className="ds-chips">
            <button
              className={`ds-chip ${deckMode === "practice" ? "on" : ""}`}
              onClick={() => {
                if (view === "archive") { setDeckMode("practice"); return; }
                flushDraft();
                setDeckMode("practice"); setFlipped(false); setShowWhy(false); setView("intro");
              }}
            >
              첫<em>,</em>눈
            </button>
            <button
              className={`ds-chip ${deckMode === "main" ? "on" : ""}`}
              onClick={() => {
                if (view === "archive") { setDeckMode("main"); return; }
                flushDraft();
                setDeckMode("main"); setFlipped(false); setShowWhy(false); setView("welcome");
            }}
          >
            반<em>,</em>짝임
          </button>
          </div>
          {view === "deck" && (
            <div className="ds-progress" role="status" aria-label={`${deckWritable.length}장 중 ${doneCount}장 작성`}>
              <span className="bar"><i style={{ width: `${(doneCount / deckWritable.length) * 100}%` }} /></span>
              <span className="num">{doneCount}<em>/{deckWritable.length}</em></span>
            </div>
          )}
        </nav>
      )}

      {/* ── 표지 ── */}
      {view === "cover" && (
        <main className="cover">
          <div className="cover-card">
            <p className="kicker">2026 상반기 회고 프로그램</p>
            <img src={IMG_COVER} alt="" aria-hidden="true" className="scene" />
            <div className="title-wrap">
              <Spark size={15} color="var(--orange)" className="s1" delay={0} />
              <Spark size={10} color="var(--olive)" className="s2" delay={0.7} />
              <h1 className="prog-title">
                <span className="t-big">반</span><span className="comma">,</span><span className="t-small">짝임</span>
              </h1>
              <Spark size={13} color="var(--orange)" className="s3" delay={1.3} />
              <Spark size={8} color="var(--olive)" className="s4" delay={1.9} />
            </div>
            <p className="prog-sub">반틈 with 핑티</p>
            <p className="intro story">
              안녕, 나는 핑티예요.<br />
              매일 밤 하루를 조금씩 되감아 보며 산답니다.<br />
              별건 아니고… 오늘 뭐가 좋았지, 왜 그때 기분이 상했지,<br />
              그런 걸 혼자 중얼거리다 잠드는 거예요.<br /><br />
              그런데 하다 보니 이상한 일이 생기더라고요.<br />
              내가 뭘 좋아하는 사람인지,<br />
              어떤 말에 마음이 무너지는 사람인지,<br />
              조금씩 알게 되는 거예요.<br /><br />
              나를 아는 일은 돌아보는 데서 시작하더라고요.<br />
              회고는 그 맨 처음 순서인 셈이에요.
            </p>

            <div className={`why intro-why ${coverBasis ? "open" : ""}`}>
              <button className="why-toggle" onClick={() => setCoverBasis((v) => !v)} aria-expanded={coverBasis}>
                {coverBasis ? "근거 접기" : "나만 그런 게 아니래요 · 근거 보기"}
              </button>
              {coverBasis && (
                <>
                  <p className="why-text">
                    <b className="why-tag">긍정심리학</b>
                    웃었던 순간을 하나씩 찾아 적다 보면, 평소 그냥 지나치던 좋은 일들이 눈에 들어온대요. 작은 기쁨을 알아차리는 것만으로 하루가 조금 달리 보인다고 해요. (Three Good Things)
                  </p>
                  <p className="why-text">
                    <b className="why-tag">성격심리학</b>
                    내가 아는 '나'는 정해진 설명이 아니라, 겪은 일에 따라 계속 고쳐 쓰는 초안 같은 거래요. 요즘의 나를 물어보는 것만으로 그 초안이 한 줄 늘어나요. (Self-Concept)
                  </p>
                </>
              )}
            </div>

            <p className="intro story invite">
              회고란 잘 살았는지 채점하는 시간이 아니에요.<br />
              틀린 답도 없고, 다 못 채워도 괜찮아요.<br /><br />
              편안한 마음으로,<br />
              나를 알아가는 일을 시작해볼까요?
            </p>

            <div className="cat-legend">
              {COVER_CATS.map((c) => <span key={c}>{c}</span>)}
            </div>

            {/* 미리보기 카드 — 로그인 전에 실제 카드를 뒤집어볼 수 있게 */}
            <p className="pv-lead">이런 질문이에요. 한번 뒤집어봐요.</p>
            <div className="preview-row">
              {PREVIEW_CARDS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`pv-flip ${pvFlip[c.id] ? "isFlipped" : ""}`}
                  onClick={() => setPvFlip((m) => ({ ...m, [c.id]: !m[c.id] }))}
                  aria-pressed={!!pvFlip[c.id]}
                  aria-label={`미리보기 카드: ${c.tag}. 눌러서 ${pvFlip[c.id] ? "질문 면" : "쓰는 면"} 보기`}
                >
                  <span className="pv-inner">
                    <span className="pv-face pv-front">
                      <span className="pv-chip">{c.tag}</span>
                      <span className="pv-illust"><img src={P_IMGS[c.img]} alt="" loading="lazy" decoding="async" /></span>
                      <span className="pv-q">{c.q}</span>
                      <span className="pv-hint">↻ 뒤집어보기</span>
                    </span>
                    <span className="pv-face pv-back">
                      <span className="pv-chip">{c.tag}</span>
                      <span className="pv-paper">여기에 적어요.</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <p className="pv-after">봤죠? 뒤집으면 쓸 수 있어요.<br />진짜로 적으려면, 아래에서 시작해요.</p>
            {!loaded ? (
              <p className="loading">기록을 불러오는 중…</p>
            ) : (
              <div className="cover-actions">
                <p className="branch-q">회고, 처음이신가요?</p>
                <div className="branch-row">
                  <button className="primary seam" onClick={() => { setStoryOpen(false); setView("intro"); }}>
                    처음이에요
                  </button>
                  <button className="primary alt seam" onClick={() => setView("welcome")}>
                    해본 적 있어요
                  </button>
                </div>
                {(mainDone > 0 || pracDone > 0) && (
                  <div className="continue-row">
                    {mainDone > 0 && (
                      <button className="ghost" onClick={() => {
                        const first = CARDS.findIndex((c) => !c.rest && !getText(c.id));
                        enterDeck("main", first === -1 ? 0 : first);
                      }}>반,짝임 이어서 쓰기 · {mainDone}장</button>
                    )}
                    {pracDone > 0 && pracDone < PRACTICE.length && (
                      <button className="ghost" onClick={() => {
                        const first = PRACTICE.findIndex((c) => !getText(c.id));
                        enterDeck("practice", first === -1 ? 0 : first);
                      }}>첫,눈 이어서 쓰기 · {pracDone}장</button>
                    )}
                    <button className="ghost" onClick={() => requireAuth(() => setView("archive"))}>아카이브 보기</button>
                  </div>
                )}
              </div>
            )}
            <p className="hint">적은 글은 다른 사용자에게 공개되지 않아요. 운영과 장애 대응에 필요한 경우 외에는 임의로 열람하지 않아요.</p>
          </div>
          <div className="byline-dock">
              <button className="byline" onClick={() => setShowAbout(true)}>
                by EMM
                <span className="byline-a">
                  A
                  <Spark size={9} color="var(--orange)" className="byline-spark" delay={0} />
                </span>
              </button>
            </div>
        </main>
      )}

      {/* ── 카드덱 ── */}
      {view === "deck" && (
        <main className="deck">
          {/* 카드 스택 */}
          <div className="stack">
            <div className="under u2" aria-hidden="true" />
            <div className="under u1" aria-hidden="true" />
            {deckMode === "practice" ? (
            <div className={`flip ${peek ? "isFlipped" : ""}`} key={card.id}
              onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className="flip-inner">

                {/* 쓰는 면 (기본) */}
                <section className="face front" aria-hidden={peek} {...(peek ? { inert: "" } : {})}>
                  <div className="face-top">
                    <span className="cat-chip">{card.tag}</span>
                    <span className="autosave">{saveState === "saving" ? "저장 중…" : saveState === "saved" ? "자동 저장됨" : saveState === "temp" ? "임시 저장됨" : ""}</span>
                  </div>
                  <div className="card-illust small" aria-hidden="true">
                    <img src={P_IMGS[card.img]} alt="" loading="lazy" decoding="async" />
                  </div>
                  {trialGated(card.id)
                    ? <p className="flat-q veil-q">이 카드는 로그인하고 열어요.</p>
                    : <p className="flat-q">{card.q}</p>}
                  {!trialGated(card.id) && card.ex && <p className="ex-note">{card.ex}</p>}
                  {trialGated(card.id) ? (
                    <div className="trial-lock" role="note">
                      <p>여기서부터는 로그인하고 열어 볼 수 있어요.</p>
                      <button className="primary" onClick={openTrialAuth}>로그인</button>
                    </div>
                  ) : (
                  <textarea
                    className="paper"
                    value={draft}
                    onChange={(e) => onDraft(e.target.value)}
                    onBlur={flushDraft}
                    placeholder="여기에 편하게 적어요. 다 못 채워도 괜찮아요."
                    aria-label={`연습 ${card.n}번 카드 답변, 질문: ${card.q}`}
                  />
                  )}
                  <div className="face-bottom">
                    <button className="ghost sm" onClick={() => setPeek(true)}>질문 카드 보기</button>
                  </div>
                </section>

                {/* 질문 면 (뒤집으면) */}
                <section className="face back" aria-hidden={!peek} {...(!peek ? { inert: "" } : {})}>
                  <div className="face-top">
                    <span className="cat-chip">{card.tag}</span>
                    <span className="num">{card.n}</span>
                  </div>
                  <div className="card-illust" aria-hidden="true">
                    <img src={P_IMGS[card.img]} alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="q">
                    {trialGated(card.id)
                      ? <p className="veil-q">이 카드는 로그인하고 열어요.</p>
                      : sentences(card.q).map((si, i) => <p key={i}>{si}</p>)}
                  </div>
                  {!trialGated(card.id) && card.ex && <p className="ex-note">{card.ex}</p>}
                  <div className="face-bottom">
                    <button className="primary wide" onClick={() => setPeek(false)}>뒤집어서 적기</button>
                  </div>
                </section>

              </div>
            </div>
            ) : (
            <div className={`flip ${flipped ? "isFlipped" : ""}`} key={card.id}
              onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className="flip-inner">

                {/* 앞면 */}
                <section className="face front" aria-hidden={flipped} {...(flipped ? { inert: "" } : {})}>
                  <div className="face-top">
                    <span className="cat-chip">{card.tag || card.cat}</span>
                    <span className="num">{card.n || card.id}</span>
                  </div>

                  <div className="card-illust" aria-hidden="true">
                    <img src={card.img ? P_IMGS[card.img] : CAT_IMGS[card.cat]} alt="" />
                  </div>

                  <div className="q" key={card.id}>
                    {trialGated(card.id)
                      ? <p className="veil-q">이 카드는 로그인하고 열어요.</p>
                      : sentences(card.q).map((s, i) => <p key={i} style={{ animationDelay: `${i * 60}ms` }}>{s}</p>)}
                  </div>

                  {card.ex && <p className="ex-note">{card.ex}</p>}
                  {!trialGated(card.id) && card.note && <p className="slow-note">{card.note}</p>}

                  {/* 근거 */}
                  {!trialGated(card.id) && card.basis && (
                    <div className={`why ${showWhy ? "open" : ""}`}>
                      <button className="why-toggle" onClick={() => setShowWhy((v) => !v)} aria-expanded={showWhy}>
                        {showWhy ? "접어두기" : card.rest ? "이 카드는 어디에서 왔나요?" : "이 질문은 어디에서 왔나요?"}
                      </button>
                      {showWhy && (
                        <div className="why-text">
                          <p>{card.why}</p>
                          <span className="why-src">{card.basis}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {card.rest ? (
                    <div className="face-bottom rest-bottom">
                      <span className="blank-note">적는 칸이 없는, 쉬어가는 카드예요</span>
                    </div>
                  ) : (
                  <div className="face-bottom">
                    {trialGated(card.id)
                      ? <span className="blank-note" aria-hidden="true"></span>
                      : getText(card.id)
                        ? <span className="answered">뒷면에 적어둠</span>
                        : <span className="blank-note">뒷면이 비어 있어요</span>}
                    <button className="primary" onClick={openBack}>
                      {getText(card.id) ? "뒷면 고쳐 쓰기" : "뒤집어서 적기"}
                    </button>
                  </div>
                  )}
                </section>

                {/* 뒷면 */}
                <section className="face back" aria-hidden={!flipped} {...(!flipped ? { inert: "" } : {})}>
                  <div className="face-top">
                    <span className="cat-chip back-chip">{card.n || card.id} 뒷면</span>
                    <span className="autosave">{saveState === "saving" ? "저장 중…" : saveState === "saved" ? "자동 저장됨" : saveState === "temp" ? "임시 저장됨" : ""}</span>
                  </div>

                  {!trialGated(card.id) && <p className="back-q">{card.q}</p>}

                  {trialGated(card.id) ? (
                    <div className="trial-lock" role="note">
                      <p>여기서부터는 로그인하고 열어 볼 수 있어요.</p>
                      <button className="primary" onClick={openTrialAuth}>로그인</button>
                    </div>
                  ) : (
                  <textarea
                    ref={taRef}
                    className="paper"
                    value={draft}
                    onChange={(e) => onDraft(e.target.value)}
                    onBlur={flushDraft}
                    placeholder="여기에 편하게 적어요. 다 못 채워도 괜찮아요."
                    aria-label={`${card.id}번 카드 답변, 질문: ${card.q}`}
                  />
                  )}

                  <div className="face-bottom">
                    <button className="primary wide" onClick={closeBack}>덮어두기</button>
                  </div>
                </section>

              </div>
            </div>
            )}
          </div>

          {/* 넘기기 */}
          <div className="pager">
            <button className="arrow" onClick={() => go(-1)} disabled={idx === 0} aria-label="이전 카드">←</button>
            <div className="where">
              <b>{card.cat}</b>
              <span className="dots">
                {DECK.map((c, i) => (
                  <button key={c.id} type="button"
                    className={(i === idx ? "cur " : "") + (getText(c.id) ? "fill" : "")}
                    aria-label={`${c.n || c.id}번 카드로 이동`}
                    aria-current={i === idx ? "true" : undefined}
                    onClick={() => {
                      if (flipped) { clearTimeout(autoT.current); commit(card.id, draft); setFlipped(false); }
                      setIdx(i); setShowWhy(false); setPeek(deckMode === "practice");
                    }} />
                ))}
              </span>
            </div>
            {idx === DECK.length - 1 ? (
              <button
                type="button"
                className="btn-finish"
                onClick={() => {
                  if (flipped) { clearTimeout(autoT.current); commit(card.id, draft); setFlipped(false); }
                  setPeek(false);
                  setView(deckMode === "practice" ? "bridge" : "outro");
                }}
              >
                <span>마치기</span><span aria-hidden="true">→</span>
              </button>
            ) : (
              <button className="arrow" onClick={() => go(1)} aria-label="다음 카드">→</button>
            )}
          </div>
        </main>
      )}

      {/* ── 경험자 환영 ── */}
      {view === "welcome" && (
        <main className="cover">
          <div className="cover-card">
            <p className="kicker">반,짝임</p>
            <img src={IMG_COVER} alt="" aria-hidden="true" className="scene" />
            <p className="intro story">
              회고하고 기록하며 살아온 당신, 멋져요.<br />
              핑티와 함께 상반기 회고를 시작해봐요.<br /><br />
              이번에도 쉽지만은 않겠지만,<br />
              당신을 믿어요.
            </p>
            <div className="cover-actions">
              <button className="primary seam" onClick={() => enterDeck("main")}>상반기 회고 시작하기</button>
              <button className="ghost" onClick={() => setView("cover")}>표지로 돌아가기</button>
            </div>
          </div>
        </main>
      )}

      {/* ── 첫,눈 프롤로그 ── */}
      {view === "intro" && (
        <main className="cover">
          <div className="cover-card">
            <p className="kicker">첫,눈</p>
            <img src={IMG_INTRO} alt="" aria-hidden="true" className="scene" loading="lazy" decoding="async" />
            <p className="intro story">
              핑티도 가끔 그래요.<br />
              뭐부터 써야 할지 몰라서,<br />
              펜만 쥐고 한참을 있어요.<br /><br />
              그럴 땐 다 채우려고 하지 않아요.<br />
              딱 하나만 답해요.
            </p>
            <p className="story-reveal reveal-static">
              <img src={PINGTY} alt="" className="inline-face" />년 <img src={PINGTY} alt="" className="inline-face" />월 <img src={PINGTY} alt="" className="inline-face" />일, 회고를 시작했다.
            </p>

            <div className={`why intro-why ${introBasis ? "open" : ""}`}>
              <button className="why-toggle" onClick={() => setIntroBasis((v) => !v)} aria-expanded={introBasis}>
                {introBasis ? "근거 접기" : "회고, 왜 좋을까요? 심리학 근거 보기"}
              </button>
              {introBasis && (
                <p className="why-text">
                  <b className="why-tag">임상심리학</b>
                  형식 없이 마음을 적는 것만으로 감정이 정리되고 회복이 빨라져요. 수십 년 글쓰기 연구의 한결같은 결론이에요. (Expressive Writing) 첫,눈의 열 장이 바로 그 첫걸음이에요.
                </p>
              )}
            </div>
            <div className="cover-actions">
              <div className="branch-row">
                <button className="primary stacked seam" onClick={() => enterDeck("practice")}>
                  <span className="b-name">첫<em>,</em>눈</span>
                  <span className="b-sub">처음 만나는 회고</span>
                </button>
                <button className="primary alt stacked seam" onClick={() => setView("welcome")}>
                  <span className="b-name">반<em>,</em>짝임</span>
                  <span className="b-sub">조금 더 깊은 회고</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── 연습 → 본편 다리 ── */}
      {view === "bridge" && (
        <main className="cover">
          <div className="cover-card">
            <p className="kicker">첫,눈을 마치며</p>
            <img src={IMG_OUTRO} alt="" aria-hidden="true" className="scene" loading="lazy" decoding="async" />
            <h1 className="outro-title">다음엔 조금 더 깊게 물어볼까요?</h1>
            <p className="intro">
              열 장을 다 지나왔어요.<br />
              방금 마지막 카드에 적어둔 궁금증,<br />
              거기서부터 이어가면 돼요.<br /><br />
              반,짝임의 스무 개 질문이<br />
              그 궁금증을 천천히 풀어줄 거예요.
            </p>
            <div className="cover-actions">
              <button className="primary seam" onClick={() => enterDeck("main")}>반,짝임 스무 장 시작하기</button>
              <button className="ghost" onClick={() => setView("archive")}>오늘은 여기까지</button>
            </div>
          </div>
        </main>
      )}

      {/* ── 마치는 장 ── */}
      {view === "outro" && (
        <main className="cover">
          <div className="cover-card outro">
            <p className="kicker">반,짝임을 마치며</p>
            <img src={IMG_OUTRO} alt="" aria-hidden="true" className="scene" loading="lazy" decoding="async" />
            <div className="title-wrap">
              <Spark size={13} color="var(--orange)" className="s1" delay={0} />
              <Spark size={9} color="var(--olive)" className="s2" delay={0.7} />
              <h1 className="outro-title">여기까지 온 당신에게</h1>
              <Spark size={11} color="var(--orange)" className="s3" delay={1.3} />
              <Spark size={7} color="var(--olive)" className="s4" delay={1.9} />
            </div>
            <p className="intro">
              스무 장의 카드를 지나온 문장들은<br />
              당신이 반년을 성실히 통과했다는 증거예요.<br />
              길게 쓴 답도, 아직 빈 카드도 전부 기록이에요.<br /><br />
              그리고 여기까지가 올해의 반이에요.<br />
              남은 반을 함께 그릴 계획 카드를 준비하고 있어요.<br />
              완성되면 제가 가장 먼저 알려드릴게요.<br />
              그때까지 이 기록은 제가 잘 담아둘게요.
            </p>
            <div className="cover-actions">
              <button className="primary" onClick={() => setView("archive")}>아카이브에서 다시 읽기</button>
              <button className="ghost" onClick={() => { setIdx(0); setView("deck"); }}>카드로 돌아가기</button>
            </div>
          </div>
          <div className="byline-dock">
              <button className="byline" onClick={() => setShowAbout(true)}>
                by EMM
                <span className="byline-a">
                  A
                  <Spark size={9} color="var(--orange)" className="byline-spark" delay={0} />
                </span>
              </button>
            </div>
        </main>
      )}

      {/* ── 아카이브 ── */}
      {view === "archive" && (
        <main className="archive">
          <div className={`arch-head ${mainDone === MAIN_WRITABLE.length ? "celebrate" : ""}`}>
            {mainDone === MAIN_WRITABLE.length && <Pingty size={84} className="arch-face" />}
            <h2>{mainDone === MAIN_WRITABLE.length ? "반년이 반짝, 모두 채웠어요" : `지금까지 ${mainDone + pracDone}장을 적었어요`}</h2>
            <p>{mainDone === MAIN_WRITABLE.length
              ? "상반기의 기록이 완성됐어요. 커피 한 잔 옆에 두고 천천히 다시 읽어봐요."
              : "빈 카드는 언제든 이어서 적을 수 있어요."}</p>
            {lastTs > 0 && <p className="stamp">마지막 기록 · {fmtDate(lastTs)}</p>}
            <div className="arch-actions">
              <button className="ghost" onClick={copyAll}>전체 기록 복사</button>
              <button className="ghost danger" onClick={() => setAskReset(true)}>모두 비우기</button>
            </div>
          </div>

          {deckMode === "practice" && (
            <section className="arch-group">
              <h3>첫,눈 <span className="count">{pracDone}/{PRACTICE.length}</span></h3>
              {PRACTICE.map((c) => {
                const a = getText(c.id);
                const ts = answers[c.id]?.ts;
                return (
                  <article key={c.id} className={`arch-card ${a ? "filled" : ""}`}>
                    <header>
                      <span className="num">{c.n}</span>
                      <div className="meta">
                        {a && ts && <span className="when">{fmtDate(ts)}</span>}
                        <button className="edit" onClick={() => {
                          enterDeck("practice", PRACTICE.findIndex((x) => x.id === c.id), true);
                        }}>{a ? "고쳐 쓰기" : "쓰러 가기"}</button>
                      </div>
                    </header>
                    <p className="arch-q">{c.q}</p>
                    {a
                      ? <ArchAnswer text={a} />
                      : <p className="arch-empty">아직 빈 카드예요.</p>}
                  </article>
                );
              })}
            </section>
          )}

          {deckMode === "main" && CATS.map((cat) => (
            <section key={cat} className="arch-group">
              <h3>{cat} <span className="count">{catDone(cat)}</span></h3>
              {CARDS.filter((c) => c.cat === cat && !c.rest).map((c) => {
                const a = getText(c.id);
                const ts = answers[c.id]?.ts;
                return (
                  <article key={c.id} className={`arch-card ${a ? "filled" : ""}`}>
                    <header>
                      <span className="num">{c.id}</span>
                      <div className="meta">
                        {a && ts && <span className="when">{fmtDate(ts)}</span>}
                        <button className="edit" onClick={() => {
                          enterDeck("main", CARDS.findIndex((x) => x.id === c.id), true);
                        }}>{a ? "고쳐 쓰기" : "쓰러 가기"}</button>
                      </div>
                    </header>
                    <p className="arch-q">{c.q}</p>
                    {a
                      ? <ArchAnswer text={a} />
                      : <p className="arch-empty">아직 빈 카드예요.</p>}
                  </article>
                );
              })}
            </section>
          ))}
        </main>
      )}

      {showAbout && (
        <div className="about-backdrop" onClick={() => setShowAbout(false)}>
          <div className="about-card" onClick={(e) => e.stopPropagation()}>
            <button className="about-close" onClick={() => setShowAbout(false)} aria-label="닫기">×</button>
            <Pingty size={52} className="about-face" />
            <p className="about-kicker">만든 사람</p>
            <div className="about-body">
              <p>글쓰기와 회고를 오래 붙들고 살았습니다. 돌아보니 그 옆엔 사람들이 이야기할 판을 까는 일이 늘 있었네요.</p>
              <p>회고 프로그램을 여러 번 진행하면서 알게 된 게 있어요. 성과만 확인하는 회고는 삶을 채점표로 만들어버리고, 무작정 다독이기만 하는 회고는 위로는 되지만 정작 나를 보여주진 않더라고요.</p>
              <p>그래서 반틈의 질문에는 몸과 마음, 일과 사람을 고루 담고 싶었습니다. 그리고 질문마다 심리학과 정신의학의 연구를 하나씩 붙여두었어요. 나를 조금 더 정확하게 보는 데는, 다정한 말보다 근거 하나가 나을 때가 있으니까요.</p>
              <p className="about-last">핑티와 함께 앉아, 딱 반틈만큼만 쉬어가요.</p>
            </div>
            <div className="about-links">
              <a className="about-link" href="mailto:emma.neway@gmail.com" aria-label="이메일 보내기">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
                  <path d="M3.6 7 12 12.8 20.4 7" />
                </svg>
              </a>
              <a className="about-link" href="https://instagram.com/emma.neway"
                target="_blank" rel="noopener noreferrer" aria-label="인스타그램 열기">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {askReset && (
        <div className="about-backdrop" onClick={() => setAskReset(false)}>
          <div className="about-card confirm-card" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <Pingty size={44} className="about-face" />
            <p className="confirm-q">모든 답을 지우고 처음부터 시작할까요? 되돌릴 수 없어요.</p>
            <div className="confirm-actions">
              <button className="ghost" onClick={() => setAskReset(false)} disabled={resetBusy} autoFocus>취소</button>
              <button className="ghost danger" onClick={doReset} disabled={resetBusy}>{resetBusy ? "비우는 중…" : "모두 비우기"}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

const css = `
/* 글꼴은 index.html 의 <link> 로 불러온다 (@import 는 렌더링을 막아서 제거) */

:root{
  --bg:#EFE9DC;
  --bg-deep:#E7DFCD;
  --card:#FBF7EC;
  --card-back:#F6F0E0;
  --olive:#7A8464;
  --olive-deep:#5C654A;
  --orange:#C57B45;
  --orange-soft:#E4C4A6;
  --ink:#57503F;
  --ink-soft:#8B8271;
  --line:#DCD3BE;
  --rule:#E6DCC5;
  --tag:#EEE8D6;
}
*{box-sizing:border-box;margin:0;padding:0}
.app{
  min-height:100vh;min-height:100dvh;color:var(--ink);
  background:
    radial-gradient(1200px 500px at 50% -140px, rgba(255,255,255,.55), transparent 60%),
    var(--bg);
  font-family:'Gowun Dodum',sans-serif;
  display:flex;flex-direction:column;align-items:center;
  padding:calc(18px + env(safe-area-inset-top, 0px)) 16px calc(56px + env(safe-area-inset-bottom, 0px));
  padding-top:max(18px, calc(12px + env(safe-area-inset-top, 0px)));
}
html,body{background:var(--bg)}

/* 헤더 */
.top{width:100%;max-width:560px;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.brand{display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;
  font-family:'Gowun Batang',serif;font-weight:700;font-size:17px;color:var(--ink);transition:color .15s}
.brand:hover,.brand:active{color:var(--orange)}
.brand:hover .brand-face,.brand:active .brand-face{opacity:1}
.brand-face{opacity:.9;transition:opacity .15s}
.brand .withp{font-family:'Gowun Dodum';font-weight:400;font-size:12px;color:var(--ink-soft);margin-left:2px}
.top-right{display:flex;align-items:center;gap:16px}
.link-btn{
  font-family:inherit;font-size:13px;color:var(--ink-soft);background:none;border:none;
  cursor:pointer;padding:4px 2px;position:relative;transition:color .15s;
}
.link-btn:hover{color:var(--ink)}
.link-btn.on{color:var(--olive-deep)}
.link-btn .dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--orange);margin-left:4px;vertical-align:middle}
.tabs .dot{position:absolute;top:5px;right:7px;width:6px;height:6px;border-radius:50%;background:var(--orange)}

/* 표지 */
.cover{width:100%;max-width:560px;display:flex;justify-content:center;padding-top:3vh;padding-bottom:76px}
.cover-card{
  width:100%;background:var(--card);border:1px solid var(--line);border-radius:20px;
  padding:42px 34px 34px;text-align:center;
  box-shadow:0 2px 0 rgba(255,255,255,.7) inset, 0 18px 40px rgba(87,80,63,.12);
  animation:rise .5s ease both;
}
.kicker{font-size:11px;letter-spacing:.22em;color:var(--olive-deep);margin-bottom:16px}
.cover-face{margin:0 auto 4px}
.scene{width:min(66%,300px);height:auto;display:block;margin:22px auto 2px}
.scene-wrap .scene{width:100%;margin:0}
.byline-dock{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom, 0px));transform:translateX(-50%);z-index:5;pointer-events:none}
.byline{
  pointer-events:auto;position:relative;display:inline-flex;align-items:center;
  background:rgba(250,247,236,.85);backdrop-filter:blur(2px);
  border:none;border-radius:999px;padding:6px 16px;
  font-family:'Gowun Dodum',sans-serif;font-size:11px;letter-spacing:.22em;color:var(--olive-deep);
  text-decoration:underline dotted;text-underline-offset:4px;cursor:pointer;
  transition:color .15s, background .15s;
}
.byline:hover, .byline:active{color:var(--orange);background:rgba(250,247,236,.97)}
.byline-a{position:relative;display:inline-block}
.byline-spark{position:absolute;top:-11px;left:50%;transform:translateX(-50%)}
.cover-card.outro .intro{color:var(--ink)}
.title-wrap{position:relative;display:inline-block;margin:12px auto 4px;padding:0 26px}
.prog-title{font-family:'Gowun Batang',serif;font-weight:700;letter-spacing:-.01em;line-height:1}
.prog-title .t-big{font-size:46px}
.prog-title .comma{font-size:40px;color:var(--orange)}
.prog-title .t-small{font-size:31px}
.spark{position:absolute;animation:twinkle 2.6s ease-in-out infinite}
.spark.s1{top:-12px;left:2px}
.spark.s2{top:26px;left:-8px}
.spark.s3{top:-6px;right:0}
.spark.s4{bottom:-4px;right:14px}
.outro-title{font-family:'Gowun Batang',serif;font-weight:700;font-size:25px;letter-spacing:-.01em}
.prog-sub{font-size:12px;color:var(--ink-soft);letter-spacing:.06em;margin-bottom:12px}
.cover-card .intro{font-size:13.5px;line-height:1.95;color:var(--ink-soft);word-break:keep-all}
.cat-legend{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:20px}
.cat-legend span{font-size:11px;color:var(--olive-deep);border:1px solid var(--line);background:rgba(255,255,255,.5);border-radius:999px;padding:4px 11px}

/* ── 표지 스토리텔링 ── */
.intro.invite{margin-top:20px}
.why-more{margin-top:8px;font-size:11.5px;color:var(--ink-soft);text-align:center}

/* ── 표지 미리보기 카드 ── */
.pv-lead{margin-top:26px;font-family:'Gowun Batang',serif;font-size:13.5px;color:var(--ink)}
.preview-row{display:flex;gap:12px;margin-top:14px}
.pv-flip{
  flex:1;min-width:0;perspective:1200px;
  background:none;border:none;padding:0;margin:0;cursor:pointer;
  font-family:inherit;text-align:left;
}
.pv-flip:focus-visible{outline:2px solid var(--olive);outline-offset:3px;border-radius:14px}
.pv-inner{
  position:relative;display:block;width:100%;min-height:300px;
  transform-style:preserve-3d;-webkit-transform-style:preserve-3d;
  transition:transform .55s cubic-bezier(.4,.1,.2,1);
}
.pv-flip.isFlipped .pv-inner{transform:rotateY(180deg)}
.pv-face{
  position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;
  background:var(--card);border:1px solid var(--line);border-radius:14px;
  box-shadow:0 1px 0 rgba(255,255,255,.7) inset, 0 10px 22px rgba(87,80,63,.10);
  padding:13px 12px 11px;display:flex;flex-direction:column;overflow:hidden;
}
.pv-back{transform:rotateY(180deg);background:var(--card-back)}
.pv-chip{
  align-self:flex-start;font-size:10.5px;color:var(--olive-deep);
  border:1px solid var(--line);border-radius:999px;padding:3px 9px;
  background:rgba(255,255,255,.55);
}
.pv-illust{height:64px;display:flex;align-items:center;justify-content:center;margin:10px 0 2px}
.pv-illust img{max-height:100%;width:auto;max-width:72%}
.pv-q{
  flex:1;display:flex;align-items:center;
  font-family:'Gowun Batang',serif;font-size:12px;line-height:1.7;
  color:var(--ink);word-break:keep-all;padding:2px 1px;
}
.pv-hint{font-size:11px;color:var(--orange);text-align:center;padding-top:8px;border-top:1px solid var(--line)}
.pv-paper{
  flex:1;margin-top:12px;padding:2px 4px;
  background:repeating-linear-gradient(to bottom, transparent 0 25px, var(--rule) 25px 26px);
  font-family:'Gowun Batang',serif;font-size:12.5px;line-height:26px;
  color:var(--ink-soft);text-align:left;
}
.pv-note{font-size:10.5px;color:var(--ink-soft);text-align:center;padding-top:8px;border-top:1px solid var(--line)}
.pv-after{margin-top:16px;font-size:12px;line-height:1.8;color:var(--ink-soft);word-break:keep-all}
@media (max-width:430px){
  .preview-row{flex-direction:column}
  .pv-inner{min-height:264px}
}
.cover-actions{margin-top:24px;display:flex;flex-direction:column;gap:10px;align-items:center}
.loading{margin-top:24px;font-size:13px;color:var(--ink-soft)}
.hint{margin-top:24px;font-size:11.5px;line-height:1.75;color:var(--ink-soft);border-top:1px solid var(--line);padding-top:15px;word-break:keep-all}

/* 버튼 */
/* ── 버튼: 종이 카드 + 반틈(문 열림·반짝임) ─────────────────
   알약을 걷어내 카드 덱과 같은 종이로. 등장 땐 가운데 틈이 열리며 크림빛이
   번지고, 누르는 동안 문장 가로 정가운데로 옅은 올리브빛이 좌우로 번진다.
   빛은 z-index:-1 가상요소라 글자 뒤에 놓여 마크업을 건드리지 않는다. */
.primary{
  position:relative; overflow:hidden;
  font-family:inherit;font-size:14px;color:#FBF9F2;
  background:linear-gradient(180deg, rgba(122,132,100,.78), rgba(103,112,84,.68));
  border:1px solid rgba(255,255,255,.45);border-radius:12px;padding:13px 26px;cursor:pointer;
  background-clip:padding-box;
  -webkit-backdrop-filter:blur(14px) saturate(160%);
  backdrop-filter:blur(14px) saturate(160%);
  transition:transform .13s ease, background .18s ease, box-shadow .13s ease;
  box-shadow:0 1px 0 rgba(255,255,255,.35) inset, 0 1px 1.5px rgba(87,80,63,.1), 0 7px 16px rgba(92,101,74,.16);
}
/* 문틈 등장(seamDoor+doorLight): 스토리 문턱 CTA(Tier 1)에만 .seam으로 부여 */
.primary.seam{ animation:seamDoor .6s cubic-bezier(.22,.61,.36,1) both; }
@keyframes seamDoor{
  0%{ clip-path:inset(0 50% 0 50% round 12px) }
  100%{ clip-path:inset(0 0 0 0 round 12px) }
}
/* 문틈 빛(등장): 크림빛이 글자와 같은 속도로 좌우로 번지고 스민다 — .seam 동반 */
.primary.seam::after{
  content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;transform-origin:center;
  background:radial-gradient(ellipse 60% 120% at center, rgba(255,244,220,.85), rgba(255,240,210,.35) 45%, transparent 72%);
  animation:doorLight .68s cubic-bezier(.22,.61,.36,1) both;
}
@keyframes doorLight{
  0%{ transform:scaleX(.02); opacity:0 }
  16%{ transform:scaleX(.06); opacity:.9 }
  70%{ transform:scaleX(1); opacity:.55 }
  100%{ transform:scaleX(1); opacity:0 }
}
/* 가운데 빛줄(터치=:active): 문장 가로 정가운데 틈에서 옅은 빛이 좌우로, 떼면 사라진다 — 텍스트 버튼 전체 */
.primary::before,.ghost::before,.btn-finish::before,.google-btn::before{
  content:"";position:absolute;left:6%;right:6%;top:50%;height:2px;z-index:-1;pointer-events:none;
  transform:translateY(-50%) scaleX(0);transform-origin:center;opacity:0;
  background:linear-gradient(90deg,transparent 0%,rgba(214,220,190,.22) 16%,rgba(216,222,198,.6) 36%,rgba(226,231,208,.85) 50%,rgba(216,222,198,.6) 64%,rgba(214,220,190,.22) 84%,transparent 100%);
  filter:blur(.7px);box-shadow:0 0 9px 2.5px rgba(200,208,175,.32);
  transition:transform .26s cubic-bezier(.22,.61,.36,1), opacity .22s ease;
}
.primary:active::before,.ghost:active::before,.btn-finish:active::before,.google-btn:active::before{
  transform:translateY(-50%) scaleX(1);opacity:.9;
  transition:transform .2s cubic-bezier(.22,.61,.36,1), opacity .15s ease;
}
/* 빛줄 톤 팔레트 정합: 주황 마치기엔 크림빛, 흰 구글엔 옅은 중립빛 */
.btn-finish::before{
  background:linear-gradient(90deg,transparent 0%,rgba(255,238,212,.28) 16%,rgba(255,241,220,.7) 36%,rgba(255,248,234,.92) 50%,rgba(255,241,220,.7) 64%,rgba(255,238,212,.28) 84%,transparent 100%);
  box-shadow:0 0 9px 2.5px rgba(255,226,190,.34);
}
.google-btn::before{
  background:linear-gradient(90deg,transparent 0%,rgba(210,214,196,.16) 16%,rgba(198,205,178,.44) 36%,rgba(208,214,190,.62) 50%,rgba(198,205,178,.44) 64%,rgba(210,214,196,.16) 84%,transparent 100%);
  box-shadow:0 0 8px 2px rgba(190,198,165,.24);
}
.primary:hover{background:linear-gradient(180deg, rgba(107,117,88,.86), rgba(88,97,71,.76))}
.primary.wide{width:100%}
.primary:active{transform:translateY(2px);
  box-shadow:0 1px 0 rgba(255,255,255,.12) inset, 0 1px 2px rgba(87,80,63,.14)}
.ghost{
  position:relative; overflow:hidden;
  font-family:inherit;font-size:13px;color:var(--olive-deep);
  background:linear-gradient(180deg, rgba(255,255,255,.5), rgba(255,255,255,.28));
  border:1px solid rgba(255,255,255,.6);border-radius:12px;padding:12px 22px;cursor:pointer;
  -webkit-backdrop-filter:blur(12px) saturate(150%);
  backdrop-filter:blur(12px) saturate(150%);
  box-shadow:0 1px 0 rgba(255,255,255,.6) inset, 0 3px 9px rgba(87,80,63,.06);
  transition:background .15s, transform .13s ease, box-shadow .13s ease;
}
.ghost:hover{background:linear-gradient(180deg, rgba(255,255,255,.68), rgba(255,255,255,.46))}
.ghost:active{transform:translateY(2px);box-shadow:0 1px 3px rgba(87,80,63,.1)}
.ghost.danger{color:#A15B3B;border-color:#D9C3AE}
/* 체험 베일: 4장째부터 질문 대신 조용한 안내 한 줄 */
.veil-q{font-family:'Gowun Batang',serif;font-size:14.5px;color:var(--ink-soft);text-align:center;letter-spacing:.01em}
/* 체험 잠금: 4장째 — 이유를 짧게, 톤은 조용히 */
.trial-lock{
  display:flex;flex-direction:column;align-items:center;gap:12px;
  background:rgba(255,255,255,.55);border:1px dashed var(--line);border-radius:14px;
  padding:26px 18px;margin:6px 0 4px;min-height:120px;justify-content:center;
}
.trial-lock p{font-family:'Gowun Batang',serif;font-size:14px;color:var(--ink);text-align:center;word-break:keep-all}
/* 로그인 시트 상단 체험 안내 */
.trial-notice{margin-bottom:14px;text-align:center}
.trial-notice .tn-head{font-family:'Gowun Batang',serif;font-weight:700;font-size:15px;color:var(--ink);margin-bottom:8px}
.trial-notice .tn-body{font-size:12.5px;line-height:1.8;color:var(--ink-soft);word-break:keep-all}
button{-webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent}
button:focus-visible{outline:2px solid var(--orange);outline-offset:2px}

/* 카드덱 상단 바 — 덱 선택(밑줄 탭) + 진행률(가벼운 표시), 한 줄 */
.deck{width:100%;max-width:560px;display:flex;flex-direction:column;align-items:center}
.deck-switch{
  width:100%;max-width:560px;display:flex;align-items:center;justify-content:space-between;gap:16px;
  margin:0 0 22px;padding-bottom:10px;border-bottom:1px solid var(--line);
}
.ds-chips{display:flex;gap:18px}
.ds-chip{
  font-family:'Gowun Batang',serif;font-weight:700;font-size:14px;
  color:var(--ink-soft);background:none;border:none;cursor:pointer;
  padding:2px 0 10px;position:relative;transition:color .15s;
}
.ds-chip em{font-style:normal;color:var(--orange);opacity:.6}
.ds-chip:hover{color:var(--ink)}
.ds-chip.on{color:var(--olive-deep)}
.ds-chip.on em{opacity:1}
.ds-chip.on::after{
  content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;
  background:var(--olive);border-radius:2px;
}
.ds-progress{display:flex;align-items:center;gap:8px;flex-shrink:0}
.ds-progress .bar{width:64px;height:4px;border-radius:99px;background:rgba(255,255,255,.65);overflow:hidden;display:block}
.ds-progress .bar i{display:block;height:100%;background:linear-gradient(90deg,var(--orange-soft),var(--orange));border-radius:99px;transition:width .5s ease}
.ds-progress .num{font-family:'Gowun Batang',serif;font-size:13px;color:var(--ink-soft)}
.ds-progress .num em{font-style:normal;font-size:11px}
@media (max-width:430px){
  .ds-chips{gap:14px}
  .ds-progress .bar{width:44px}
}

/* 카드 스택 */
.stack{position:relative;width:100%;max-width:420px}
.under{position:absolute;inset:0;background:var(--card);border:1px solid var(--line);border-radius:16px}
.under.u1{transform:rotate(1.6deg) translateY(5px);opacity:.75}
.under.u2{transform:rotate(-2.1deg) translateY(9px);opacity:.45}

.flip{position:relative;width:100%;perspective:1500px;animation:deal .35s ease both}
.flip-inner{
  position:relative;width:100%;min-height:600px;
  transform-style:preserve-3d;-webkit-transform-style:preserve-3d;
  transition:transform .55s cubic-bezier(.4,.1,.2,1);
}
.flip.isFlipped .flip-inner{transform:rotateY(180deg)}
.card-illust.small{height:110px;margin:16px 0 0}
.flat-q{font-family:'Gowun Batang',serif;font-size:14px;line-height:1.75;color:var(--ink);word-break:keep-all;margin:12px 0 6px}
.face{
  position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;
  background:var(--card);border:1px solid var(--line);border-radius:16px;
  box-shadow:0 2px 0 rgba(255,255,255,.7) inset, 0 18px 38px rgba(87,80,63,.14);
  padding:22px 22px 18px;display:flex;flex-direction:column;overflow-y:auto;
  -webkit-overflow-scrolling:touch;
}
.face.back{transform:rotateY(180deg);background:var(--card-back)}

.face-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.cat-chip{font-size:12px;color:var(--olive-deep);border:1px solid var(--line);border-radius:999px;padding:4px 12px;background:rgba(255,255,255,.55)}
.back-chip{background:none}
.num{font-family:'Gowun Batang',serif;font-weight:700;font-size:27px;color:var(--olive);opacity:.32}
.autosave{font-size:11px;color:var(--ink-soft)}

.card-illust{height:138px;flex:none;display:flex;align-items:center;justify-content:center;margin:34px 0 0}
.card-illust img{max-height:100%;width:auto;max-width:78%}
.q{flex:1;display:flex;flex-direction:column;justify-content:center;gap:9px;padding:8px 4px}
.q p{font-family:'Gowun Batang',serif;font-size:15px;line-height:1.75;word-break:keep-all;
  animation:lineIn .4s ease both}

/* 근거 */
.why{margin-bottom:10px}
.why-toggle{
  border:none;background:none;font-family:inherit;font-size:11.5px;color:var(--orange);
  cursor:pointer;padding:2px 0;letter-spacing:.02em;
  text-decoration:underline dotted;text-underline-offset:4px;
  transition:transform .1s ease;
}
.why-toggle:active{transform:translateY(1px)}
.why-tag{display:inline-block;font-style:normal;font-weight:400;font-size:10.5px;color:var(--orange);border:1px solid var(--orange-soft);border-radius:999px;padding:1px 8px;margin-right:8px;vertical-align:1px;background:rgba(255,255,255,.6)}
.intro-why{text-align:center;margin:14px 0 0}
.intro-why .why-text{text-align:left}
.why-text{
  margin-top:8px;font-size:12px;line-height:1.75;color:var(--ink-soft);
  background:rgba(255,255,255,.55);border-left:2px solid var(--orange-soft);
  padding:9px 12px;border-radius:0 10px 10px 0;word-break:keep-all;
  animation:lineIn .3s ease both;
}

.slow-note{font-size:11.5px;color:var(--ink-soft);text-align:center;margin-bottom:10px;letter-spacing:.01em}
.why-text p{margin:0 0 7px}
.why-src{display:inline-block;font-size:10.5px;color:var(--orange);border:1px solid var(--orange-soft);border-radius:999px;padding:2px 9px;background:rgba(255,255,255,.6)}
.rest-bottom{justify-content:center}
@media (prefers-reduced-motion: reduce){
  .primary,.ghost,.arrow,.btn-finish,.google-btn,.why-toggle,.dots button{transition:none}
  .primary:hover,.ghost:hover,.arrow:hover:not(:disabled),.btn-finish:hover{transform:none}
  .primary.seam{animation:none;clip-path:none}
  .primary.seam::after{animation:none;opacity:0}
  .primary::before,.ghost::before,.btn-finish::before,.google-btn::before{transition:none}
}
.face-bottom{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:13px;border-top:1px solid var(--line)}
.answered{font-size:12px;color:var(--orange)}
.answered::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--orange);margin-right:6px;vertical-align:1px}
.blank-note{font-size:12px;color:var(--ink-soft)}

/* 뒷면 — 질문은 위에 고정, 아래는 온전히 답 쓰는 자리 */
.back-q{
  font-family:'Gowun Batang',serif;font-size:12.5px;line-height:1.6;color:var(--ink-soft);white-space:pre-line;
  background:rgba(255,255,255,.5);border-radius:8px;padding:8px 10px;margin-bottom:8px;
  word-break:keep-all;flex:none;
}
.paper{
  flex:1;width:100%;resize:none;border:none;background:
    repeating-linear-gradient(to bottom, transparent 0 31px, var(--rule) 31px 32px);
  font-family:'Gowun Batang',serif;font-size:15px;line-height:32px;color:var(--ink);
  padding:0 6px;outline:none;
}
.paper::placeholder{color:var(--ink-soft);opacity:.8}

/* 넘기기 */
.pager{display:flex;align-items:center;gap:14px;margin-top:24px;width:100%;max-width:420px;justify-content:space-between}
.arrow{
  font-family:inherit;font-size:16px;color:var(--ink);
  background:linear-gradient(180deg, rgba(255,255,255,.46), rgba(255,255,255,.26));
  border:1px solid rgba(255,255,255,.55);border-radius:999px;width:46px;height:46px;cursor:pointer;
  -webkit-backdrop-filter:blur(10px) saturate(150%);
  backdrop-filter:blur(10px) saturate(150%);
  transition:background .15s;flex:none;
}
.arrow{transition:background .15s, transform .1s ease, box-shadow .1s ease;
  box-shadow:0 1px 0 rgba(255,255,255,.8) inset, 0 2px 0 rgba(87,80,63,.1)}
.arrow:hover:not(:disabled){background:linear-gradient(180deg, rgba(255,255,255,.66), rgba(255,255,255,.46));transform:translateY(-1px)}
.arrow:active:not(:disabled){transform:translateY(1px);box-shadow:0 1px 0 rgba(87,80,63,.08)}
.arrow:disabled{opacity:.35;cursor:default}
.btn-finish{
  position:relative; overflow:hidden;
  flex:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;
  height:46px;padding:0 20px;border-radius:999px;border:none;
  font-family:'Gowun Dodum',sans-serif;font-size:15px;font-weight:500;
  color:#FFFFFF;cursor:pointer;white-space:nowrap;
  background:linear-gradient(180deg, rgba(197,123,69,.82), rgba(176,107,57,.72));
  -webkit-backdrop-filter:blur(14px) saturate(160%);
  backdrop-filter:blur(14px) saturate(160%);
}
.btn-finish span{color:#FFFFFF}
.btn-finish{transition:transform .12s ease, box-shadow .12s ease, background-color .15s ease;
  box-shadow:0 1px 0 rgba(255,255,255,.32) inset, 0 3px 0 rgba(143,85,39,.7), 0 6px 14px rgba(143,85,39,.2)}
.btn-finish:hover{background:linear-gradient(180deg, rgba(176,107,57,.88), rgba(159,95,49,.78));transform:translateY(-1px)}
.btn-finish:active:not(:disabled){transform:translateY(2px);
  box-shadow:0 1px 0 rgba(255,255,255,.2) inset, 0 1px 0 #8F5527, 0 3px 6px rgba(143,85,39,.2)}
.btn-finish:disabled{background-color:#C57B45;opacity:.35;cursor:default}
.where{display:flex;flex-direction:column;align-items:center;gap:7px;flex:1;min-width:0}
.where b{font-weight:400;font-size:12.5px;color:var(--ink-soft)}
.dots{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:240px}
.dots button{position:relative;width:8px;height:8px;padding:0;border-radius:50%;background:rgba(255,255,255,.9);border:1px solid var(--line);cursor:pointer;transition:transform .15s}
.dots button:active{transform:scale(.8)}
.dots button::after{content:'';position:absolute;inset:-6px;border-radius:50%}
.dots button.fill{background:var(--orange);border-color:var(--orange);animation:pop .3s ease}
.dots button.cur{transform:scale(1.5);border-color:var(--olive-deep)}
.dots button:focus-visible{outline:2px solid var(--orange);outline-offset:3px}

/* 아카이브 */
.archive{width:100%;max-width:560px}
.arch-head{text-align:center;margin:4px 0 26px}
.arch-head.celebrate{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:30px 24px 24px;box-shadow:0 14px 32px rgba(87,80,63,.10)}
.arch-face{margin:0 auto 10px;animation:rise .5s ease both}
.arch-head h2{font-family:'Gowun Batang',serif;font-weight:700;font-size:21px;margin-bottom:8px}
.arch-head p{font-size:13.5px;color:var(--ink-soft);word-break:keep-all}
.stamp{margin-top:8px;font-size:11.5px;color:var(--ink-soft);opacity:.8}
.arch-actions{display:flex;gap:8px;justify-content:center;margin-top:16px}
.arch-group{margin-bottom:26px}
.arch-group h3{font-size:13px;letter-spacing:.06em;color:var(--olive-deep);margin:0 4px 10px;display:flex;align-items:baseline;gap:8px}
.arch-group .count{font-size:11px;color:var(--ink-soft)}
.arch-card{
  background:var(--card);border:1px solid var(--line);border-radius:14px;
  padding:16px 18px;margin-bottom:10px;
  overflow-wrap:anywhere;word-wrap:break-word;overflow-x:hidden;
}
.arch-card.filled{border-left:3px solid var(--orange)}
.arch-card header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.arch-card .num{font-size:15px;opacity:.55}
.meta{display:flex;align-items:center;gap:12px}
.when{font-size:11px;color:var(--ink-soft)}
.edit{border:none;background:none;font-family:inherit;font-size:12px;color:var(--olive-deep);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.arch-q{font-size:13px;line-height:1.7;color:var(--ink-soft);word-break:keep-all;margin-bottom:8px}
.arch-a{min-width:0;max-width:100%}
.arch-a p{font-family:'Gowun Batang',serif;font-size:14.5px;line-height:1.85;word-break:keep-all;word-wrap:break-word;overflow-wrap:anywhere}
.arch-a.clamped{max-height:188px;overflow:hidden;position:relative}
.arch-a.clamped::after{
  content:"";position:absolute;left:0;right:0;bottom:0;height:54px;pointer-events:none;
  background:linear-gradient(to bottom, rgba(255,255,255,0), var(--card));
}
.arch-more{
  border:none;background:none;font-family:inherit;font-size:12px;color:var(--olive-deep);
  cursor:pointer;text-decoration:underline;text-underline-offset:3px;
  padding:6px 0 0;display:block;
}
.arch-empty{font-size:13px;color:var(--ink-soft);opacity:.7}

.account-btn{
  margin-left:auto;display:inline-flex;align-items:center;gap:5px;
  border-radius:999px;padding:7px 14px;font-size:12.5px;font-family:inherit;
  cursor:pointer;
  transition:background .18s ease, color .18s ease, border-color .18s ease,
             box-shadow .18s ease, transform .08s ease;
}
.account-btn svg{flex:none}

/* 로그아웃 상태 — 또렷하게 */
.account-btn.solid{
  border:1px solid rgba(255,255,255,.5);
  background:linear-gradient(180deg, rgba(122,132,100,.66), rgba(103,112,84,.56));
  color:#FBF9F2;
  -webkit-backdrop-filter:blur(14px) saturate(160%);
  backdrop-filter:blur(14px) saturate(160%);
  box-shadow:0 1px 0 rgba(255,255,255,.38) inset, 0 4px 14px rgba(92,101,74,.16);
}
.account-btn.solid:hover{
  background:linear-gradient(180deg, rgba(112,122,92,.74), rgba(92,101,74,.64));
  box-shadow:0 1px 0 rgba(255,255,255,.32) inset, 0 5px 16px rgba(92,101,74,.22);
}

/* 로그인 상태 — 조용하게 */
.account-btn.quiet{
  border:1px solid rgba(255,255,255,.6);
  background:linear-gradient(180deg, rgba(255,255,255,.52), rgba(255,255,255,.3));
  color:var(--olive-deep);
  -webkit-backdrop-filter:blur(14px) saturate(160%);
  backdrop-filter:blur(14px) saturate(160%);
  box-shadow:0 1px 0 rgba(255,255,255,.6) inset, 0 3px 10px rgba(87,80,63,.08);
}
.account-btn.quiet:hover{
  border-color:rgba(255,255,255,.75);color:var(--olive-deep);
  background:linear-gradient(180deg, rgba(255,255,255,.66), rgba(255,255,255,.44));
}

/* 눌림 — 터치 기기에서 호버를 대신함 */
.account-btn:active{transform:scale(.96)}

/* 키보드 접근성 */
.account-btn:focus-visible{outline:2px solid var(--olive);outline-offset:2px}

/* 손가락 뗀 뒤 호버가 눌어붙는 모바일 문제 방지 */
@media (hover:none){
  .account-btn.solid:hover{background:linear-gradient(180deg, rgba(122,132,100,.66), rgba(103,112,84,.56));box-shadow:0 1px 0 rgba(255,255,255,.38) inset, 0 4px 14px rgba(92,101,74,.16)}
  .account-btn.quiet:hover{border-color:rgba(255,255,255,.6);color:var(--olive-deep);background:linear-gradient(180deg, rgba(255,255,255,.52), rgba(255,255,255,.3))}
}
.modal-back{
  position:fixed;inset:0;background:rgba(30,24,18,.35);
  display:flex;align-items:center;justify-content:center;z-index:50;padding:20px;
}
.modal{
  background:var(--card);border-radius:18px;padding:26px 24px;max-width:360px;width:100%;
  position:relative;box-shadow:0 12px 40px rgba(0,0,0,.18);
}
.modal h3{margin:0 0 8px;font-size:17px}
.modal-x{
  position:absolute;top:12px;right:14px;border:none;background:none;
  font-size:15px;color:var(--ink-soft);cursor:pointer;
}
.auth-note{font-size:12.5px;color:var(--ink-soft);line-height:1.6;margin:0 0 16px}

/* 로그아웃 확인 시트 */
.logout-sheet{max-width:340px;text-align:left}
.logout-sheet h3{margin:0 0 10px;font-size:17px;line-height:1.45}
.ls-body{font-size:13.5px;color:var(--ink-soft);line-height:1.75;margin:0 0 20px}
.ls-actions{display:flex;flex-direction:column;gap:8px}
.ls-actions button{width:100%}
.auth-email{font-size:14px;font-weight:600;margin:0 0 6px}
.google-btn{
  position:relative; overflow:hidden;
  width:100%;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.65);
  background:linear-gradient(180deg, rgba(255,255,255,.72), rgba(255,255,255,.52));
  -webkit-backdrop-filter:blur(12px) saturate(150%);
  backdrop-filter:blur(12px) saturate(150%);
  font-size:14px;cursor:pointer;margin-bottom:12px;
  display:flex;align-items:center;justify-content:center;gap:8px;
}
.auth-divider{
  text-align:center;font-size:12px;color:var(--ink-soft);margin:0 0 12px;position:relative;
}
.auth-form{display:flex;flex-direction:column;gap:8px}
.auth-form input{
  padding:10px 12px;border-radius:10px;border:1px solid var(--line);
  font-size:14px;font-family:inherit;background:#fff;
}
.auth-form .primary{
  margin-top:4px;padding:10px;border-radius:10px;border:none;
  background:var(--olive-deep,#5b6a4a);color:#fff;font-size:14px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
}
.auth-err{color:#b3452f;font-size:12.5px;margin:2px 0 0}
.auth-sent{color:var(--olive-deep,#5b6a4a);font-size:12.5px;margin:2px 0 0}
.auth-switch{
  display:flex;flex-direction:column;gap:6px;margin-top:14px;
}
.auth-switch button{
  border:none;background:none;font-size:12.5px;color:var(--ink-soft);
  text-decoration:underline;text-underline-offset:3px;cursor:pointer;text-align:left;padding:0;
}
.auth-tabs{
  display:flex;gap:4px;background:var(--paper,#f1ece0);border-radius:999px;
  padding:4px;margin:0 0 14px;
}
.auth-tabs button{
  flex:1;border:none;background:none;border-radius:999px;padding:8px 0;
  font-size:13.5px;font-family:inherit;color:var(--ink-soft);cursor:pointer;
}
.auth-tabs button.on{
  background:var(--card);color:var(--ink);font-weight:600;
  box-shadow:0 1px 3px rgba(0,0,0,.08);
}

/* 표지 분기·연습 */
.branch-q{font-family:'Gowun Batang',serif;font-size:14.5px;color:var(--ink);margin-bottom:4px}
.branch-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.primary.alt{
  background:linear-gradient(180deg, rgba(255,255,255,.56), rgba(255,255,255,.34));
  color:var(--olive-deep);border:1px solid rgba(122,132,100,.55);
  -webkit-backdrop-filter:blur(14px) saturate(160%);
  backdrop-filter:blur(14px) saturate(160%);
  box-shadow:0 1px 0 rgba(255,255,255,.6) inset, 0 3px 9px rgba(87,80,63,.07)}
.primary.stacked{display:flex;flex-direction:column;align-items:center;gap:1px;padding:10px 26px;line-height:1.2;min-width:148px}
.b-name{font-family:'Gowun Batang',serif;font-weight:700;font-size:15px}
.b-name em{font-style:normal;color:var(--orange)}
.primary.alt .b-name{color:var(--olive-deep)}
.b-sub{font-size:10px;font-weight:400;letter-spacing:.02em;opacity:.8;font-family:'Gowun Dodum',sans-serif}
.primary.alt .b-sub{color:var(--ink-soft)}
.ghost.sm{padding:7px 16px;font-size:12px}
.primary.alt:hover{background:var(--tag)}
.continue-row{display:flex;flex-direction:column;gap:8px;align-items:center;margin-top:14px;padding-top:14px;border-top:1px solid var(--line);width:100%}
.intro.story{font-family:'Gowun Batang',serif;color:var(--ink);font-size:14.5px}
.story-reveal{margin-top:10px;font-family:'Gowun Batang',serif;font-size:13.5px;color:var(--olive-deep);animation:lineIn .3s ease both}
.inline-face{width:16px;height:auto;display:inline-block;vertical-align:-3px;margin:0 1px;opacity:.85}
.reveal-static{display:block;width:fit-content;margin:16px auto 0;background:rgba(255,255,255,.5);border:1px dashed var(--line);border-radius:12px;padding:12px 18px;cursor:default}
.ex-note{font-size:11.5px;color:var(--ink-soft);text-align:center;margin-bottom:8px;opacity:.85}
main{animation:viewIn .46s cubic-bezier(.22,.61,.36,1) both;will-change:opacity,transform}
@keyframes viewIn{from{opacity:0;transform:translateY(12px) scale(.994)}to{opacity:1;transform:translateY(0) scale(1)}}

/* 소개 팝업 */
.about-backdrop{
  position:fixed;inset:0;background:rgba(51,48,43,.45);
  display:flex;align-items:center;justify-content:center;padding:20px;z-index:50;
  animation:fadeIn .2s ease both;
}
.about-card{
  position:relative;width:100%;max-width:400px;max-height:86vh;overflow-y:auto;
  background:var(--card);border:1px solid var(--line);border-radius:18px;
  padding:34px 28px 26px;box-shadow:0 20px 50px rgba(0,0,0,.25);
  animation:rise .3s ease both;
}
.about-close{
  position:absolute;top:12px;right:14px;width:30px;height:30px;border-radius:50%;
  border:1px solid var(--line);background:rgba(255,255,255,.6);color:var(--ink-soft);
  font-size:17px;line-height:1;cursor:pointer;
}
.about-close:hover{background:#fff;color:var(--ink)}
.about-face{display:block;margin:0 auto 10px}
.about-kicker{text-align:center;font-size:11px;letter-spacing:.2em;color:var(--olive-deep);margin-bottom:16px}
.about-body p{
  font-family:'Gowun Batang',serif;font-size:14px;line-height:1.9;color:var(--ink);
  margin-bottom:14px;word-break:keep-all;
}
.about-body .about-last{margin-bottom:0;color:var(--olive-deep)}
.about-links{
  display:flex;gap:20px;justify-content:center;
  margin-top:22px;padding-top:18px;border-top:1px solid var(--line);
}
.about-link{
  display:inline-flex;align-items:center;justify-content:center;
  width:44px;height:44px;border-radius:50%;
  color:var(--olive-deep);text-decoration:none;cursor:pointer;
  transition:color .15s,background .15s,transform .15s;
}
.about-link:hover{color:var(--orange);background:rgba(255,255,255,.6)}
.about-link:active{transform:scale(.92)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}

/* 토스트 */
.toast{
  position:fixed;bottom:calc(64px + env(safe-area-inset-bottom, 0px));left:50%;transform:translateX(-50%);
  background:var(--ink);color:#F6F1E3;font-size:13px;border-radius:999px;
  padding:10px 20px;box-shadow:0 8px 20px rgba(0,0,0,.18);animation:rise .25s ease both;
  z-index:60;max-width:calc(100vw - 32px);text-align:center;
}

/* 확인 다이얼로그 */
.confirm-card{max-width:330px;padding:28px 24px 22px;text-align:center}
.confirm-q{font-family:'Gowun Batang',serif;font-size:14.5px;line-height:1.8;color:var(--ink);word-break:keep-all;margin:4px 0 18px}
.confirm-actions{display:flex;gap:8px;justify-content:center}

@keyframes twinkle{0%,100%{opacity:.25;transform:scale(.75) rotate(0deg)}50%{opacity:1;transform:scale(1.1) rotate(18deg)}}
@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.6)}100%{transform:scale(1)}}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes deal{from{opacity:0;transform:translateY(14px) rotate(.6deg)}to{opacity:1;transform:translateY(0) rotate(0)}}
@keyframes lineIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

@media (max-width:480px){
  .flip-inner{min-height:620px}
  .q p{font-size:15.5px}
  .cover-card{padding:36px 24px 28px}
}
@media (prefers-reduced-motion: reduce){
  *{animation:none !important;transition:none !important}
}
`;
