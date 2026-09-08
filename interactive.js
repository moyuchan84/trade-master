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

/* ── 해시 ──
   브라우저의 Web Crypto로 진짜 SHA-256을 계산합니다.
   보안 컨텍스트가 아니면(예: file://) 설명용 대체 해시로 넘어갑니다. */
function sha256(str){
  if(window.crypto && window.crypto.subtle && window.isSecureContext){
    return window.crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(str))
      .then(function(buf){
        return Array.from(new Uint8Array(buf))
          .map(function(b){ return b.toString(16).padStart(2, '0'); }).join('');
      })
      .catch(function(){ return fallbackHash(str); });
  }
  return Promise.resolve(fallbackHash(str));
}

/* 대체 해시 — 진짜 SHA-256은 아니지만 「조금만 바꿔도 완전히 달라진다」는
   성질은 같아서, 설명용으로는 동일하게 작동합니다. */
function fallbackHash(str){
  var out = '';
  for(var seed = 0; seed < 8; seed++){
    var h = 2166136261 ^ (seed * 2654435761);
    for(var i = 0; i < str.length; i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
      h ^= h >>> 13;
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h ^= h >>> 13;
    out += (h >>> 0).toString(16).padStart(8, '0');
  }
  return out;
}

/* 해시 앞부분이 0으로 몇 개 시작하는지 — 채굴 난이도 판정에 씁니다. */
function leadingZeros(hex){
  var n = 0;
  while(n < hex.length && hex[n] === '0') n++;
  return n;
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
