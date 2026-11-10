// 問題データ（answer は choices の正解インデックス、0 始まり）
const questions = [
  {
    question: "日本で一番高い山はどれ？",
    choices: ["北岳", "富士山", "奥穂高岳", "槍ヶ岳"],
    answer: 1,
    explanation: "富士山の標高は3,776mで、日本で最も高い山です。",
  },
  {
    question: "太陽系で一番大きな惑星はどれ？",
    choices: ["土星", "地球", "木星", "海王星"],
    answer: 2,
    explanation: "木星は太陽系最大の惑星で、直径は地球の約11倍あります。",
  },
  {
    question: "日本の都道府県の数はいくつ？",
    choices: ["43", "45", "46", "47"],
    answer: 3,
    explanation: "1都・1道・2府・43県で、合計47都道府県です。",
  },
  {
    question: "1気圧のもとで、水が沸騰する温度はおよそ何℃？",
    choices: ["50℃", "80℃", "100℃", "120℃"],
    answer: 2,
    explanation: "1気圧では、水はおよそ100℃で沸騰します。",
  },
  {
    question: "「光の三原色」に含まれない色はどれ？",
    choices: ["赤", "緑", "青", "黄"],
    answer: 3,
    explanation: "光の三原色は赤・緑・青です。黄は「色の三原色」（シアン・マゼンタ・イエロー）の一つです。",
  },
  {
    question: "日本で1年のうち、昼の時間が最も長い日はどれ？",
    choices: ["春分", "夏至", "秋分", "冬至"],
    answer: 1,
    explanation: "夏至（6月21日ごろ）は北半球で昼が最も長く、冬至は最も短くなります。",
  },
  {
    question: "日本で面積が一番大きい都道府県はどこ？",
    choices: ["北海道", "岩手県", "長野県", "新潟県"],
    answer: 0,
    explanation: "北海道は約8万3千km²で、2位の岩手県の5倍以上の広さがあります。",
  },
  {
    question: "水を表す化学式はどれ？",
    choices: ["H₂O", "CO₂", "O₂", "NaCl"],
    answer: 0,
    explanation: "水は水素原子2個と酸素原子1個からできているのでH₂Oです。CO₂は二酸化炭素、NaClは塩化ナトリウム（食塩）です。",
  },
  {
    question: "1日は何秒？",
    choices: ["3,600秒", "43,200秒", "86,400秒", "604,800秒"],
    answer: 2,
    explanation: "24時間 × 60分 × 60秒 = 86,400秒です。3,600秒は1時間、604,800秒は1週間です。",
  },
  {
    question: "日本の国会は、衆議院と何院の二院制？",
    choices: ["参議院", "貴族院", "元老院", "枢密院"],
    answer: 0,
    explanation: "日本の国会は衆議院と参議院の二院制です。貴族院は戦前の帝国議会にあった議院です。",
  },
];

// 画面要素
const startScreen = document.querySelector("#start-screen");
const quizScreen = document.querySelector("#quiz-screen");
const resultScreen = document.querySelector("#result-screen");

const startBtn = document.querySelector("#start-btn");
const nextBtn = document.querySelector("#next-btn");
const retryBtn = document.querySelector("#retry-btn");

const progressText = document.querySelector("#progress-text");
const progressFill = document.querySelector("#progress-fill");
const questionText = document.querySelector("#question-text");
const choicesEl = document.querySelector("#choices");
const feedbackEl = document.querySelector("#feedback");

const scoreText = document.querySelector("#score-text");
const resultMessage = document.querySelector("#result-message");

// 状態
let currentIndex = 0;
let score = 0;

function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach((s) => s.classList.add("hidden"));
  screen.classList.remove("hidden");
}

function startQuiz() {
  currentIndex = 0;
  score = 0;
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentIndex];
  const total = questions.length;

  progressText.textContent = `第${currentIndex + 1}問 / ${total}問`;
  progressFill.style.width = `${(currentIndex / total) * 100}%`;
  questionText.textContent = q.question;

  feedbackEl.className = "feedback hidden";
  feedbackEl.textContent = "";
  nextBtn.classList.add("hidden");

  choicesEl.innerHTML = "";
  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = `${i + 1}. ${choice}`;
    btn.addEventListener("click", () => selectAnswer(i));
    choicesEl.appendChild(btn);
  });

  choicesEl.querySelector(".choice-btn").focus();
}

function selectAnswer(selected) {
  const q = questions[currentIndex];
  const isCorrect = selected === q.answer;
  const buttons = choicesEl.querySelectorAll(".choice-btn");

  // 回答後は選択肢を無効化し、正解と選んだ不正解を色分け
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add("correct");
    else if (i === selected) btn.classList.add("wrong");
  });

  if (isCorrect) score++;

  feedbackEl.className = `feedback ${isCorrect ? "correct" : "wrong"}`;
  feedbackEl.innerHTML = "";

  const title = document.createElement("span");
  title.className = "feedback-title";
  title.textContent = isCorrect
    ? "⭕ 正解！"
    : `❌ 不正解… 正解は「${q.choices[q.answer]}」`;

  const explanation = document.createElement("span");
  explanation.className = "feedback-explanation";
  explanation.textContent = q.explanation;

  feedbackEl.append(title, explanation);

  progressFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

  const isLast = currentIndex === questions.length - 1;
  nextBtn.textContent = isLast ? "結果を見る" : "次の問題へ";
  nextBtn.classList.remove("hidden");
  nextBtn.focus();
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const total = questions.length;
  scoreText.textContent = `${total}問中${score}問正解`;

  let message;
  if (score === total) message = "全問正解！すばらしい！🎉";
  else if (score >= total * 0.6) message = "よくできました！あと少しで満点です。";
  else message = "もう一度挑戦してみましょう！";
  resultMessage.textContent = message;

  showScreen(resultScreen);
  retryBtn.focus();
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
retryBtn.addEventListener("click", startQuiz);
