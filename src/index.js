import Stopwatch from './stopwatch.js';

const stopwatch = new Stopwatch();

const $timer = document.getElementById('timer');
const $startStopBtn = document.getElementById('start-stop-btn');
const $lapResetBtn = document.getElementById('lap-reset-btn');
const $startStopBtnLabel = document.getElementById('start-stop-btn-label');
const $lapResetBtnLabel = document.getElementById('lap-reset-btn-label');
const $laps = document.getElementById('laps');

let isRunning = false;
let interval;
let $minLap, $maxLap;

const toggleBtnStyle = () => {
  $startStopBtn.classList.toggle('bg-green-600');
  $startStopBtn.classList.toggle('bg-red-600');
};

const formatString = (num) => (num < 10 ? `0${num}` : num);

const formatTime = (centisecond) => {
  // centisecond -> 분:초:1/100초
  let formattedString = '';
  const minute = Math.floor(centisecond / 6000); // 몫만 필요
  const second = Math.floor((centisecond % 6000) / 100);
  const centi = centisecond % 100;

  formattedString = `${formatString(minute)}:${formatString(
    second
  )}.${formatString(centi)}`;

  return formattedString;
};

const updateTime = (time) => {
  $timer.innerText = formatTime(time);
};

const onClickStartStopBtn = () => {
  isRunning ? onClickStopBtn() : onClickStartBtn();

  toggleBtnStyle();
  isRunning = !isRunning;
};

const onClickLapResetBtn = () => {
  isRunning ? onClickLapBtn() : onClickResetBtn();
};

const onClickStartBtn = () => {
  stopwatch.start();
  interval = setInterval(() => {
    updateTime(stopwatch.centisecond);
  }, 10);

  $lapResetBtnLabel.innerText = '랩';
  $startStopBtnLabel.innerText = '중단';
};

const onClickStopBtn = () => {
  stopwatch.pause();
  clearInterval(interval);

  $lapResetBtnLabel.innerText = '리셋';
  $startStopBtnLabel.innerText = '시작';
};

const colorMinMax = () => {
  $minLap.classList.add('text-green-600');
  $maxLap.classList.add('text-red-600');
};

const onClickLapBtn = () => {
  const [lapCount, lapTime] = stopwatch.createLap();
  const $lap = document.createElement('li');

  $lap.classList.add('flex', 'justify-between', 'py-2', 'px-3', 'border-b-2');
  $lap.innerHTML = `
    <span>랩 ${lapCount}</span>
    <span>${formatTime(lapTime)}</span>
  `;
  // data attribute를 이용해 lapTime을 저장
  $lap.setAttribute('data-time', lapTime);
  // 노드의 맨 앞에 추가
  $laps.prepend($lap);

  // 처음 Lap을 눌렀을 때: 첫 Lap은 minLap으로 둔다.
  if ($minLap === undefined) {
    $minLap = $lap;
    return;
  }

  // 두번째 Lap을 눌렀을 때: 첫번째 Lap과 비교해서 최소, 최대값을 결정
  if ($maxLap === undefined) {
    if (lapTime < Number($minLap.dataset.time)) {
      $maxLap = $minLap; // 최대값 초기화
      $minLap = $lap; // 최소값 갱신
    } else {
      $maxLap = $lap; // 최대값 갱신
    }

    colorMinMax();
    return;
  }

  // 세번째 Lap부터: 최소, 최대값을 갱신
  if (lapTime < Number($minLap.dataset.time)) {
    $minLap.classList.remove('text-green-600');
    $minLap = $lap;
  } else if (lapTime > Number($maxLap.dataset.time)) {
    $maxLap.classList.remove('text-red-600');
    $maxLap = $lap;
  }

  colorMinMax();
};

const onClickResetBtn = () => {
  stopwatch.reset();
  updateTime(0);
  $laps.innerHTML = '';
  $minLap = undefined;
  $maxLap = undefined;
};

const onKeyDown = (e) => {
  switch (e.code) {
    case 'KeyS':
      onClickStartStopBtn();
      break;
    case 'KeyL':
      onClickLapResetBtn();
  }
};

$startStopBtn.addEventListener('click', onClickStartStopBtn);
$lapResetBtn.addEventListener('click', onClickLapResetBtn);

document.addEventListener('keydown', onKeyDown);
