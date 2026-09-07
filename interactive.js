/* ══════════════════════════════════════════════════════════
   interactive.js — 문서 공통 헬퍼
   ══════════════════════════════════════════════════════════ */

/* 읽기 모드: 「쉽게 보기」는 .deep 로 표시된 심화 문단을 감춥니다. */
function setMode(m){
  document.body.classList.toggle('simple', m === 'simple');
  document.body.classList.toggle('full', m === 'full');
  var s = document.getElementById('mSimple'), f = document.getElementById('mFull');
  if(s) s.classList.toggle('on', m === 'simple');
  if(f) f.classList.toggle('on', m === 'full');
  // 문서마다 다른 안내 문구를 쓰고 싶으면 #modeHint 에 data-simple / data-full 을 달아둡니다.
  var h = document.getElementById('modeHint');
  if(h) h.textContent = (m === 'simple')
    ? (h.dataset.simple || '비유와 그림 위주 — 아이와 함께 보기 좋아요')
    : (h.dataset.full || '용어와 상세 설명까지 전부 표시합니다');
}

/* 부호를 붙인 퍼센트 문자열 */
function pct(v, digits){
  var d = (digits === undefined) ? 1 : digits;
  return (v > 0 ? '+' : '') + v.toFixed(d) + '%';
}

/* 억/만 단위 한국어 금액 표기 (입력 단위: 만원) */
function won(manwon){
  var v = Math.round(manwon);
  if(Math.abs(v) >= 10000){
    var eok = v / 10000;
    return (Math.abs(eok % 1) < 0.005 ? eok.toFixed(0) : eok.toFixed(2)) + '억';
  }
  return v.toLocaleString('ko-KR') + '만';
}

/* 값의 부호에 따라 색을 입힙니다. */
function signColor(el, v){
  el.style.color = v > 0 ? 'var(--pos)' : (v < 0 ? 'var(--neg)' : 'var(--ink)');
}

/* 해설 박스 갱신 */
function verdict(id, color, title, body){
  var v = document.getElementById(id);
  if(!v) return;
  v.style.setProperty('--vc', color);
  v.querySelector('.vt').innerHTML = title;
  v.querySelector('p').innerHTML = body;
}

/* SVG 경로를 왼쪽에서 오른쪽으로 그려 넣는 애니메이션 */
function drawPath(el, ms){
  var len = el.getTotalLength();
  el.style.transition = 'none';
  el.style.strokeDasharray = len + ' ' + len;
  el.style.strokeDashoffset = len;
  el.getBoundingClientRect();
  el.style.transition = 'stroke-dashoffset ' + (ms || 900) + 'ms ease-out';
  el.style.strokeDashoffset = '0';
}

/* 같은 .btnrow 안에서 하나만 켜지는 토글 버튼 묶음 */
function bindBtnRow(selector, handler){
  var row = document.querySelector(selector);
  if(!row) return;
  row.querySelectorAll('button').forEach(function(btn, i){
    btn.addEventListener('click', function(){
      row.querySelectorAll('button').forEach(function(b){ b.classList.remove('on'); });
      btn.classList.add('on');
      handler(btn.getAttribute('data-v') || i, btn);
    });
  });
}
