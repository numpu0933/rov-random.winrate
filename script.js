let preventDuplicate = false;
let usedHeroes = new Set();
let specialAudioPlayed = false;
let chaosMode = false;
let winrateModeActive = false;
let isRandomAll = false;
let randomAllFinished = 0;


/* ================= DATA ================= */
const roles = [
    { id: 'dsl', name: 'DARK SLAYER', pool: ['Airi', 'Astrid', 'Birrow', 'Bright', 'Kaine', 'Murad', 'Ryoma', 'Volkath', 'Wukong', 'Yan', 'Zuka', 'Bolt Baron', 'Marja', 'Rourke', 'Zanis', 'Tachi', 'Taara', 'Wonder Woman', 'Florentino', 'Lu Bu', 'Edras', 'Superman', 'Skud', 'Roxie', 'Allain', 'Amily', 'Biron', 'Bijan', 'Charlotte', 'Maloch', 'Dextra', 'Errol', "Kil'Groth", 'Yena', 'Veres', 'Riktor', 'Qi', 'Heino', 'Omen', 'Mortos', 'Max', 'Wiro'] },
    { id: 'jgl', name: 'JUNGLE', pool: ['Airi', 'Aoi', 'Astrid','Birrow','Bolt Baron','Bright','Butterfly',"Eland\'orr",'Enzo','Fennik','Florentino','Kaine','Keera','Kriknak','Lindis','Lu Bu','Marja','Murad','Nakroth','Paine','Quillen','Rourke','Ryoma','Sinestrea','Tachi','Taara','Tulen','Volkath','Wonder Woman','Wukong','Yan','Zanis','Zephys','Zill','Zuka','Edras']},
    { id: 'mid', name: 'MID', pool: ['Aleister', 'Aleister', 'Annette', 'Azzen\'Ka', 'Bolt Baron', 'Bonnie', 'D\'Arcy', 'Diaochan', 'Dirak', 'Iggy', 'Ignis', 'Ilumia', 'Ishar', 'Jinnar', 'Kahlii', 'Krixi', 'Lauriel', 'Liliana', 'Lorion', 'Mganga', 'Natalya', 'Preyta', 'Raz', 'Sephera', 'Tulen', 'Veera', 'Yue', 'Zata', 'Heino', 'Alice', 'Goverra'] },
 { id:'adc', name:'ABYSSAL', pool:['Celica','Capheny','Elsu','Erin','Fennik','Hayate','Laville','Lindis','Moren','Slimz','Stuart','Teeri',"Tel\'Annas",'Thorne','Valhein','Violet','Wisp','Yorn'] },
    { id: 'sup', name: 'SUPPORT', pool: ['Alice', 'Annette', 'Arum', 'Aya', 'Baldum', 'Chaugnar', 'Cresht', 'Dolia', 'Grakk', 'Gildur', 'Helen', 'Ishar', 'Krizzix', 'Lumburr', 'Mina', 'Ming', 'Omega', 'Ormarr', 'Rouie', 'Sephera', 'TeeMee', 'Toro', 'Xeniel', 'Zip', 'Wiro', 'Max', 'Roxie', 'Arduin', 'Riktor', 'Enzo', 'Mortos'] }
];

/* ================= ELEMENT ================= */
const board = document.getElementById('board');
const chaosBtn = document.getElementById('chaosToggle');
const modeToggle = document.getElementById('modeToggle');
const winrateDiv = document.getElementById('winrateMode');
const randomAllBtn = document.getElementById('randomAllBtn');
const lockToggle = document.getElementById('lockToggle');

/* ================= UTILS ================= */
function heroImage(name){
  return `images/${name.toLowerCase().replace(/[\s']/g,'')}.jpg`;
}

/* ================= RENDER ================= */
function render(){
  board.innerHTML='';
  roles.forEach(r=>{
    const el=document.createElement('div');
    el.className='slot';
    el.id=r.id;
    el.innerHTML=`
      <div class="role">${r.name}</div>
      <div class="hero" id="hero-${r.id}">
        <div style="text-align:center;font-size:48px;opacity:.3">?</div>
      </div>
      <div class="actions">
        <button onclick="randomOne('${r.id}')">สุ่มตำแหน่งนี้</button>
      </div>`;
    board.appendChild(el);
  });
}
/* ================= SOUND ================= */
const spinSound = new Audio('audio/spin.mp3');
spinSound.loop = true;
spinSound.volume = 0.4;

const revealSound = new Audio('audio/reveal.mp3');
revealSound.volume = 0.8;


/* ================= TOGGLE ================= */
function toggleDuplicate(){
  preventDuplicate = !preventDuplicate;
  usedHeroes.clear();
  lockToggle.className = 'lock ' + (preventDuplicate ? 'locked' : 'unlocked');
}

function toggleChaos(){
  chaosMode = !chaosMode;
  chaosBtn.textContent = chaosMode ? 'มั่วเลน (เปิด)' : 'มั่วเลน (ปิด)';
  chaosBtn.classList.toggle('chaos-on',chaosMode);
}

/* ================= RANDOM ================= */
function randomOne(id){
  if(winrateModeActive) return;

  const r = roles.find(x=>x.id===id);
  const slot = document.getElementById(id);
  const heroBox = document.getElementById('hero-'+id);

  slot.classList.add('animating');
    let rolls = 0;
    const spinSound = new Audio('audio/spin.mp3');
    spinSound.currentTime = 0;
    spinSound.play();


  const spin = setInterval(()=>{
    const fake = r.pool[Math.floor(Math.random()*r.pool.length)];
    heroBox.innerHTML = `<img src="${heroImage(fake)}"><div style="text-align:center">${fake}</div>`;
    if(++rolls>=10){
        clearInterval(spin);
        spinSound.pause();
        spinSound.currentTime = 0;

        if (isRandomAll) {
            randomAllFinished++;
            if (randomAllFinished === roles.length) {
                const revealSound = new Audio('audio/reveal.mp3');
                revealSound.play();
                randomAllFinished = 0;
                isRandomAll = false;
            }
        } else {
            const revealSound = new Audio('audio/reveal.mp3');
            revealSound.play();
        }



      let pool = chaosMode
        ? roles.flatMap(x=>x.pool)
        : preventDuplicate
          ? r.pool.filter(h=>!usedHeroes.has(h))
          : r.pool;

      if(pool.length===0){ usedHeroes.clear(); pool=r.pool; }

      const hero = pool[Math.floor(Math.random()*pool.length)];
      if(preventDuplicate) usedHeroes.add(hero);

      heroBox.innerHTML = `
        <img src="${heroImage(hero)}">
        <div style="text-align:center;font-weight:800;color:#00f5ff">${hero}</div>
      `;

      slot.classList.remove('animating');
      checkSpecial();
    }
  },80);
}

function randomAll() {
    if (winrateModeActive) return;

    isRandomAll = true;
    randomAllFinished = 0;

    roles.forEach((r, i) => {
        setTimeout(() => randomOne(r.id), i * 200);
    });
}


/* ================= SPECIAL ================= */
function checkSpecial(){
  const heroes=[...document.querySelectorAll('.hero div')]
    .map(x=>x.textContent.trim());

  const active = heroes.includes('Dolia') && heroes.includes('Heino');

  document.querySelectorAll('.hero').forEach(h=>{
    const name=h.querySelector('div').textContent.trim();
    h.classList.toggle('effect',active && (name==='Dolia'||name==='Heino'));
  });

  if(active && !specialAudioPlayed){
    new Audio('audio/dolia_heino.mp3').play();
    specialAudioPlayed=true;
  }
  if(!active) specialAudioPlayed=false;
}

/* ================= MODE SWITCH ================= */
modeToggle.addEventListener('click', () => {
    winrateModeActive = !winrateModeActive;

    modeToggle.textContent = winrateModeActive
        ? 'ROV WIN RATE MODE'
        : 'ROV CONTENT MODE';

    // ของเก่าเดิม
    board.style.display = winrateModeActive ? 'none' : 'grid';
    randomAllBtn.style.display = winrateModeActive ? 'none' : 'inline-flex';
    chaosBtn.style.display = winrateModeActive ? 'none' : 'inline-flex';
    lockToggle.style.display = winrateModeActive ? 'none' : 'inline-flex';

    winrateDiv.classList.toggle('hidden', !winrateModeActive);

    // ซ่อน/แสดงปุ่มสุ่มพลังแฝงของกูเอง
    const powerBtn = document.getElementById('powerToggle');
    if (powerBtn) {
        powerBtn.style.display = winrateModeActive ? 'none' : 'inline-flex';
    }
});


/* ================= WIN RATE ================= */
function calculateWinRate() {
    const c = +currentWin.value;
    const t = +targetWin.value;
    const m = +totalMatches.value;

    if (!c || !t || !m) {
        alert('กรอกตัวเลขให้ครบก่อนจั้ฟพรี่');
        return;
    }

    if (c <= 0 || c > 100 || t < 0 || t > 100) {
        alert('เปอร์เซ็นต์ไม่ถูกต้อง');
        return;
    }

    if (t >= 100) {
        alert('Win Rate 100% ทำไม่ได้จั้ฟพรี่');
        return;
    }

    const wins = m * (c / 100);

    /* ===== เพิ่ม Win Rate ===== */
    if (t > c) {
        let x = 0;
        while (((wins + x) / (m + x)) * 100 < t) {
            x++;
        }

        winrateResult.textContent = `ต้องชนะเพิ่ม ${x.toLocaleString()} เกม`;
    }

    /* ===== ลด Win Rate ===== */
    else if (t < c) {
        let x = 0;
        while ((wins / (m + x)) * 100 > t) {
            x++;
        }

        winrateResult.textContent = `ต้องแพ้เพิ่ม ${x.toLocaleString()} เกม`;
    }

    /* ===== เท่ากัน ===== */
    else {
        winrateResult.textContent = 'วินเรทเท่าเดิม ไม่ต้องเพิ่มเกม';
    }

    /* animation */
    winrateResult.classList.remove('animate');
    void winrateResult.offsetWidth;
    winrateResult.classList.add('animate');
}
/* ================= RESET ================= */
function resetAll() {
    usedHeroes.clear();
    specialAudioPlayed = false;
    render();

    currentWin.value = '';
    targetWin.value = '';
    totalMatches.value = '';
    winrateResult.textContent = '';
}

function saveImage() {
    const app = document.getElementById('app');

    html2canvas(app, {
        backgroundColor: '#05070f',
        scale: 2,                 // ✅ รูปคม ไม่เบลอ
        useCORS: true,
        windowWidth: app.scrollWidth,
        windowHeight: app.scrollHeight
    }).then(canvas => {
        const a = document.createElement('a');
        a.download = 'rov-content.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    });
}



/* ================= INIT ================= */
render();



document.addEventListener("DOMContentLoaded", () => {
    render(); // สร้าง slot และ heroBox ทั้งหมดก่อน

    const powerBtn = document.getElementById('powerToggle');
    let powerOn = false;

    const powerImages = [
        'Images/power1.png',
        'Images/power2.png',
        'Images/power3.png',
        'Images/power4.png',
        'Images/power5.png',
        'Images/power6.png',
        'Images/power7.png',
        'Images/power8.png',
        'Images/power9.png',
    ];

    function randomPower() {
        // ซ่อน icon ถ้า WinRate mode เปิด
        const winrateVisible = !document.querySelector('.winrate-mode.hidden');
        if (winrateVisible) return;

        const slots = document.querySelectorAll('.slot');
        slots.forEach(slot => {
            const heroBox = slot.querySelector('.hero');
            if (!heroBox) return;

            const imgSrc = powerImages[Math.floor(Math.random() * powerImages.length)];
            let icon = slot.querySelector('.power-icon');
            if (!icon) {
                icon = document.createElement('img');
                icon.classList.add('power-icon');
                slot.appendChild(icon);
            }

            icon.src = imgSrc;
            icon.style.position = 'absolute';
            icon.style.left = '6px';
            icon.style.bottom = '60px';
            icon.style.width = '30px';
            icon.style.height = '30px';
            icon.style.opacity = '0';
            icon.style.transform = 'rotateY(0deg)';
            icon.style.transition = 'transform 0.6s ease, opacity 0.6s ease';

            setTimeout(() => {
                icon.style.transform = 'rotateY(360deg)';
                icon.style.opacity = '1';
            }, 10);
        });
    }

    function removePowerIcons() {
        // ถ้าอยู่ใน WinRate mode ให้ซ่อนเฉยๆ
        const winrateVisible = !document.querySelector('.winrate-mode.hidden');
        const icons = document.querySelectorAll('.power-icon');
        icons.forEach(icon => {
            if (winrateVisible) {
                icon.style.opacity = '0'; // แค่ซ่อน
            } else {
                icon.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
                icon.style.opacity = '0';
                icon.style.transform = 'rotateY(0deg)';
                setTimeout(() => {
                    if (icon.parentNode) icon.parentNode.removeChild(icon);
                }, 400);
            }
        });
    }

    powerBtn.addEventListener('click', () => {
        powerOn = !powerOn;
        if (powerOn) {
            powerBtn.classList.add('active');
            powerBtn.style.background = '#8b0000';
            powerBtn.textContent = "สุ่มพลังแฝง (เปิด)";
            randomPower();
        } else {
            powerBtn.classList.remove('active');
            powerBtn.style.background = '';
            powerBtn.textContent = "สุ่มพลังแฝง (ปิด)";
            removePowerIcons();
        }
    });
});
