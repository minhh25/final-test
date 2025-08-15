//ktao
let ban = [];       // [1..11, 0]
let den = 11;       // index ô đen
let dangChoi = false;
let buoc = 0;       
let giay = 0;
let gioId = null;
let soLuot = 0;


const khung    = document.querySelector('.box-game');
const btnStart = document.querySelector('.btn-start');
const btnEnd   = document.querySelector('.btn-end');
const timeEl   = document.querySelector('.clock h1');
const winEl    = document.getElementById('win');
const tbody    = document.getElementById('history-body');


const mau = {
  1:['bg-green-100','text-green-500'],
  2:['bg-red-100','text-red-500'],
  3:['bg-blue-100','text-blue-500'],
  4:['bg-purple-100','text-purple-500'],
  5:['bg-yellow-100','text-yellow-500'],
  6:['bg-pink-100','text-pink-500'],
  7:['bg-indigo-100','text-indigo-500'],
  8:['bg-gray-100','text-gray-500'],
  9:['bg-emerald-100','text-emerald-500'],
  10:['bg-amber-100','text-amber-500'],
  11:['bg-lime-100','text-lime-500'],
};


function taoBan(){
  ban = [];
  for (let i=1;i<=11;i++) ban.push(i);
  ban.push(0);
  den = 11;
}

// ham ve lai ban choi game
function resetBan(){
  khung.innerHTML = '';
  for(let i=0;i<12;i++){
    const so = ban[i];
    const o = document.createElement('div');
    o.className = 'tile';
    if(so===0){
      o.classList.add('bg-black');
    }else{
      const color = mau[so];
      o.classList.add(color[0], color[1]);
      o.textContent = so;
    }
    khung.appendChild(o);
  }
}

// xu ly dong ho
const time = n => String(n).padStart(2,'0');
function batGio(){
  clearInterval(gioId);
  giay = 0;
  timeEl.textContent = '00:00';
  gioId = setInterval(() => {
    giay++;
    timeEl.textContent = `${time(Math.floor(giay/60))}:${time(giay%60)}`;
  }, 1000);
}

function tatGio(){ 
    clearInterval(gioId); 
    gioId = null; 
}


function rc(i){ 
    return [Math.floor(i/4), i%4]; // tra ve [row,col] cua i nhu kieu toa do
}

// test xem di duoc k 
function thuDi(dir){
  const [row,column] = rc(den);
  let t = -1;
  if(dir === 'left'  && column>0) t = den - 1; // left right thi tang giam 1 don vi tren bang
  if(dir === 'right' && column<3) t = den + 1;
  if(dir === 'up'    && row>0) t = den - 4; // up down thi tang giam 4 de len row tren hoac duoi
  if(dir === 'down'  && row<2) t = den + 4;
  if(t===-1) return false;
  [ban[den], ban[t]] = [ban[t], ban[den]];
  den = t;
  return true;
}

//  di khi dang play
function di(dir){
  if(!dangChoi) return;
  if(thuDi(dir)){
    buoc++;
    resetBan();
    checkWin();
  }
}


function tron100(){
  const dirs = ['left','right','up','down'];
  let n = 0;
  while(n < 100){
    if(thuDi(dirs[Math.floor(Math.random()*4)])) n++;
  }
  buoc = 0;  // reset buoc
  resetBan();
}

//check thang
function checkWin(){
  for(let i=0;i<11;i++) if(ban[i] !== i+1) return;
  if(ban[11] !== 0) return;
  // win
  dangChoi = false;
  tatGio();
  winEl.classList.remove('hidden');    
  btnEnd.classList.add('hidden');
  btnStart.classList.remove('hidden');
  btnStart.textContent = 'Chơi lại';
  // ghi history vao bang
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td style="padding:10px 20px; border-top:1px solid #e5e7eb;">${++soLuot}</td>
    <td style="padding:10px 20px; border-top:1px solid #e5e7eb;">${buoc}</td>
    <td style="padding:10px 20px; border-top:1px solid #e5e7eb;">${timeEl.textContent}</td>
  `;
  tbody.appendChild(tr);
}


function batDau(){
  dangChoi = true;
  btnStart.classList.add('hidden');
  btnEnd.classList.remove('hidden');
  winEl.classList.add('hidden');       
  taoBan();
  resetBan();
  tron100();
  batGio();
  window.focus();                       
}

function ketThuc(){
  dangChoi = false;
  tatGio();
  btnEnd.classList.add('hidden');
  btnStart.classList.remove('hidden');
  winEl.classList.add('hidden');

  taoBan();
  resetBan();
}

btnStart.addEventListener('click', batDau);
btnEnd.addEventListener('click',   ketThuc);


window.addEventListener('keydown', (e) => {
  if(!dangChoi) return;
  const k = e.key.toLowerCase();
  if(['arrowleft','arrowright','arrowup','arrowdown'].includes(k)) e.preventDefault();
  if(k==='a' || k==='arrowleft')  di('left');
  if(k==='d' || k==='arrowright') di('right');
  if(k==='w' || k==='arrowup')    di('up');
  if(k==='s' || k==='arrowdown')  di('down');
});


taoBan();
resetBan();
