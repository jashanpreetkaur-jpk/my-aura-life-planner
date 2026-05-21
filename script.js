// ============================================================
// MY AURA LIFE PLANNER — COMPLETE JS 
// ============================================================

// ── Globals ──
let currentFilter = 'all';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let showingYearView = false;
let clockInterval = null;
let timerInterval = null;
let timerRunning = false;
let timerSeconds = 25 * 60;
let timerMode = 'work';
let slotCheckInterval = null;
let lastUsedChatResponses = {};
let forgotTargetUsername = '';

const TIMER_DEFAULTS = { work: 25 * 60, break: 5 * 60 };

// ── Quotes ──
const loginQuotes = [
    "Every new beginning comes from some other beginning's end.",
    "The journey of a thousand miles begins with a single step.",
    "Your aura is unique. Let it shine.",
    "Today is the first day of the rest of your life.",
    "Start where you are. Use what you have. Do what you can.",
    "Believe you can and you're halfway there.",
    "Your future is created by what you do today.",
    "Small steps every day lead to big results.",
    "You are capable of amazing things.",
    "Let your aura glow bright today."
];

const DASHBOARD_QUOTES = {
    high: [
        { emoji:'🌟', quote:'"You are performing at your peak. Keep this energy alive!"', sub:'Elite Performer ✦' },
        { emoji:'🔥', quote:'"Champions are built on days like this."', sub:'Unstoppable!' },
        { emoji:'💎', quote:'"Your consistency is your superpower."', sub:'Keep shining' },
        { emoji:'🚀', quote:'"You are on fire! Nothing can stop you today."', sub:'Peak performance' },
        { emoji:'🏆', quote:'"This is champion-level productivity."', sub:'You earned this' }
    ],
    medium: [
        { emoji:'💪', quote:'"You\'re making progress. Keep pushing!"', sub:'Stay consistent' },
        { emoji:'🌊', quote:'"Small steps every day create big results."', sub:'Trust the process' },
        { emoji:'✨', quote:'"Halfway there! The best is yet to come."', sub:'Keep going' },
        { emoji:'🌱', quote:'"Growth happens outside your comfort zone."', sub:'You\'re growing' }
    ],
    low: [
        { emoji:'🌱', quote:'"Every master was once a beginner."', sub:'Growth takes time' },
        { emoji:'☀️', quote:'"Today is a fresh start. You\'ve got this!"', sub:'New beginning' },
        { emoji:'🤍', quote:'"Be gentle with yourself. Progress, not perfection."', sub:'You are enough' },
        { emoji:'🦋', quote:'"Even the smallest step forward is still progress."', sub:'Keep moving' }
    ]
};

const MOTIVATION_QUOTES = [
    { emoji:'🌟', quote:'"The only way to do great work is to love what you do."', sub:'- Steve Jobs' },
    { emoji:'🔥', quote:'"Don\'t watch the clock; do what it does. Keep going."', sub:'- Sam Levenson' },
    { emoji:'💪', quote:'"It always seems impossible until it\'s done."', sub:'- Nelson Mandela' },
    { emoji:'🌱', quote:'"The secret of getting ahead is getting started."', sub:'- Mark Twain' },
    { emoji:'✨', quote:'"You are never too old to set another goal or dream."', sub:'- C.S. Lewis' },
    { emoji:'🚀', quote:'"The future belongs to those who believe in their dreams."', sub:'- Eleanor Roosevelt' },
    { emoji:'💫', quote:'"Believe you can and you\'re halfway there."', sub:'- Theodore Roosevelt' },
    { emoji:'🌊', quote:'"Life is like riding a bicycle. Keep moving to keep balance."', sub:'- Albert Einstein' },
    { emoji:'🦋', quote:'"What lies within us is far greater than what lies before us."', sub:'- Emerson' },
    { emoji:'💗', quote:'"You have everything you need to deal with whatever comes."', sub:'' }
];

const LIFE_REMINDERS = [
    { icon:'💧', text:'Drink water regularly. Hydration fuels your brain.' },
    { icon:'🧘', text:'Take 5-minute breaks. Rest is productive.' },
    { icon:'📵', text:'Limit screen time before bed. Sleep is your superpower.' },
    { icon:'🚶', text:'Move your body daily. Even a short walk helps.' },
    { icon:'📓', text:'Journal your thoughts. Clarity comes from expression.' },
    { icon:'🌿', text:'Spend time in nature. It heals what screens cannot.' },
    { icon:'🙏', text:'Practice gratitude. What you appreciate, appreciates.' },
    { icon:'📚', text:'Read for 15 minutes daily. Knowledge compounds.' },
    { icon:'🤝', text:'Connect with loved ones. Relationships fuel happiness.' },
    { icon:'🎯', text:'Set one priority per day. Focus beats multitasking.' },
    { icon:'😴', text:'Protect your sleep schedule. Consistency is everything.' },
    { icon:'🌅', text:'Start mornings with intention, not your phone.' }
];

// ── Chatbot — expanded, no repeats ──
const BOT_RESPONSES = {
    stressed: [
        "Take a deep breath. You've handled hard things before, and you will handle this too 🌸",
        "Stress means you care deeply. Now let's take it one step at a time 💛",
        "Inhale peace, exhale tension. You are stronger than this moment 💙",
        "When stress hits, remember: you have survived every single hard day so far. This too shall pass.",
        "Close your eyes. Take 3 slow deep breaths. Feel better? You've absolutely got this.",
        "Stress is just pressure trying to make a diamond out of you 💎",
        "Break it down. What's the ONE thing you can handle right now? Start there."
    ],
    great: [
        "That's the energy! Ride this wave and conquer your goals today! 🚀",
        "Amazing! Your positive energy is contagious. Channel it into something great!",
        "YES! This is your day. Go make it absolutely unforgettable! ✨",
        "Your enthusiasm is truly inspiring. Keep that beautiful momentum going!",
        "Feeling great is your aura shining at full brightness. Don't waste a single drop! 🌟",
        "When you feel this good, big things happen. Go for it!",
        "That's what I love to hear! You're in the zone — stay there!"
    ],
    motivation: [
        "You are capable of far more amazing things than you realize. Start before you're ready.",
        "Your future self is cheering for you from the finish line. Don't let them down 🔥",
        "Every expert was once an absolute beginner who simply refused to quit. Keep going!",
        "The harder you work for something, the sweeter it will feel when you achieve it.",
        "Progress is progress, no matter how small. You're moving forward every day.",
        "Your only competition is who you were yesterday. You're already winning.",
        "Action creates motivation, not the other way around. Just start — energy will follow!"
    ],
    failed: [
        "Falling down is how we grow. Getting back up is how we win. And you WILL get back up 🤍",
        "One setback doesn't define your entire journey. Tomorrow is a brand new chance.",
        "Be kind to yourself. Every comeback story starts with a single decision to try again.",
        "Failure is simply proof that you're actually trying. Most people don't even try.",
        "The comeback is always stronger than the setback. Your best chapter is ahead.",
        "Thomas Edison failed 10,000 times before the light bulb. Your turn will come.",
        "Today's failure is tomorrow's experience. You're building something great."
    ],
    productivity: [
        "Try the Pomodoro technique: 25 min focused work, then 5 min break. Use the Timer tab! ⏱️",
        "Focus on ONE task at a time. Multitasking is actually a productivity myth.",
        "Start with your hardest task first thing. Your future self will genuinely thank you!",
        "Break big goals into tiny daily actions. Less overwhelming, more achievable!",
        "Use the 2-minute rule: if it takes less than 2 minutes, do it RIGHT now!",
        "Plan tomorrow tonight. You'll wake up with purpose instead of confusion.",
        "Done is better than perfect. Ship it, then refine it."
    ],
    tired: [
        "Rest is not being lazy. It is absolutely necessary. Take care of yourself first 💤",
        "Even the sun needs to set to rise again. Rest well so you can shine brighter.",
        "Your body is asking for care. Listen to it. A short break can work absolute wonders.",
        "Rest today so you can show up fully tomorrow. You deserve recovery.",
        "Sleep is when your brain sorts everything out. It's productive, not wasted time.",
        "A tired mind makes poor decisions. Recharge first, then conquer.",
        "You can't pour from an empty cup. Fill yourself up first."
    ],
    sad: [
        "It's okay to not be okay. Your feelings are completely valid right now 🤍",
        "Sadness is a season, not a lifetime. Brighter days are absolutely coming.",
        "You are loved. You are enough. You matter more than you know. Never forget that.",
        "This feeling will pass. Be gentle and patient with yourself today.",
        "Sometimes the bravest and most courageous thing is simply to keep going.",
        "Cry if you need to. Feel it fully. Then rise. You always do.",
        "Even on the darkest nights, stars still shine. So do you."
    ],
    morning: [
        "Good morning, beautiful soul! Today is completely full of new possibilities 🌅",
        "Rise and shine! Your aura is charged and ready to absolutely glow today!",
        "New day, new opportunities, new chances! Go make this one count!",
        "The early bird catches the worm, but you're already ahead just by showing up!",
        "Today is a gift. Use it wisely. Make it a day worth remembering.",
        "Morning energy sets the tone for everything. Start strong, finish stronger!",
        "Your morning mindset becomes your daily reality. Think big today!"
    ],
    night: [
        "Rest well, beautiful dreamer. Tomorrow is a completely fresh start 🌙",
        "Good night! Your brain will consolidate all of today's learning while you sleep.",
        "Sleep tight. Tomorrow you'll wake up refreshed, stronger and ready to win.",
        "The day is done. Whatever happened, you showed up. That counts for a lot.",
        "Sleep is the best recovery tool on the planet. Use it fully tonight.",
        "Let go of today. Tomorrow holds new potential waiting just for you.",
        "Sweet dreams. Your subconscious will keep working on your goals."
    ],
    thanks: [
        "You're so welcome! I'm genuinely always here for you anytime 💙",
        "Anytime! That's exactly what I'm here for. You're doing great!",
        "My absolute pleasure! Keep being the amazing person you are!",
        "Of course! You deserve all the support and encouragement in the world."
    ],
    hello: [
        "Hello there, friend! How are you feeling today?",
        "Hi! Ready to make today absolutely amazing? Let's go!",
        "Hey! I'm your Aura Assistant. What's on your mind right now?",
        "Greetings! How can I help brighten your day today?"
    ],
    javascript: [
        "JavaScript is incredibly powerful! Remember: async/await makes async code clean and readable 💻",
        "Pro tip: map(), filter(), reduce() will make your JS code cleaner and smarter!",
        "console.log() is your absolute best debugging friend. Use it liberally!",
        "Learn the fundamentals deeply — closures, promises, event loop. Everything builds on them.",
        "Practice makes perfect. Build small projects every day and watch yourself grow!"
    ],
    study: [
        "Break your study into 25-min Pomodoro sessions. Use the Timer tab for this! 📚",
        "Active recall beats passive reading every time. Test yourself constantly!",
        "Teach what you learn to someone else. That's the fastest way to truly remember.",
        "Spaced repetition is science-backed. Review material at increasing intervals.",
        "Study smart, not just hard. Understand the WHY behind everything."
    ],
    default: [
        "I'm here for you! Tell me more about how you're feeling right now.",
        "That's really interesting! How can I support you best today?",
        "I'm listening carefully. What's truly on your mind?",
        "Your aura is completely unique and beautiful. I'm here to help it shine!",
        "Tell me more. Every feeling and thought matters here.",
        "I hear you. Let's work through this together, one step at a time.",
        "You've got a friend in me! Share whatever you need to share."
    ]
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const q = document.getElementById('loginQuote');
    if (q) q.textContent = loginQuotes[Math.floor(Math.random() * loginQuotes.length)];
    checkAutoLogin();
    initRipple();
    requestNotificationPermission();
});

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// ============================================================
// RIPPLE EFFECT
// ============================================================
function initRipple() {
    document.addEventListener('click', e => {
        const btn = e.target.closest('.ripple');
        if (!btn) return;
        const circle = document.createElement('span');
        circle.className = 'ripple-circle';
        const rect = btn.getBoundingClientRect();
        circle.style.left = (e.clientX - rect.left) + 'px';
        circle.style.top = (e.clientY - rect.top) + 'px';
        btn.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    });
}

// ============================================================
// PANEL SWITCHING (Login / Register / Forgot)
// ============================================================
function showPanel(id) {
    ['loginPanel','registerPanel','forgotPanel'].forEach(p => {
        const el = document.getElementById(p);
        if (el) el.style.display = 'none';
    });
    const target = document.getElementById(id);
    if (target) target.style.display = 'block';
    // Clear errors
    ['loginError','regError','forgotError1','forgotError2','forgotError3'].forEach(e => {
        const el = document.getElementById(e); if (el) el.style.display = 'none';
    });
    // Reset forgot steps
    if (id === 'forgotPanel') {
        showForgotStep(1);
        forgotTargetUsername = '';
    }
}

function togglePwVis(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        btn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
}

// ============================================================
// REGISTER
// ============================================================
function registerUser() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm  = document.getElementById('regConfirm').value;
    const sq1q = document.getElementById('sq1q').value.trim();
    const sq1a = document.getElementById('sq1a').value.trim();
    const sq2q = document.getElementById('sq2q').value.trim();
    const sq2a = document.getElementById('sq2a').value.trim();
    const sq3q = document.getElementById('sq3q').value.trim();
    const sq3a = document.getElementById('sq3a').value.trim();

    if (!username) { showError('regError', '❌ Please enter a username.'); return; }
    if (username.length < 3) { showError('regError', '❌ Username must be at least 3 characters.'); return; }
    if (!password || password.length < 4) { showError('regError', '❌ Password must be at least 4 characters.'); return; }
    if (password !== confirm) { showError('regError', '❌ Passwords do not match.'); return; }
    if (!sq1q || !sq1a || !sq2q || !sq2a || !sq3q || !sq3a) { showError('regError', '❌ Please fill all 3 security questions and answers.'); return; }

    // Check if username already exists
    if (localStorage.getItem(`aura_user_${username}`)) {
        showError('regError', '❌ This username is already taken. Choose another.');
        return;
    }

    // Save user account
    const userData = {
        username,
        password,
        joinDate: new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }),
        securityQuestions: [
            { q: sq1q, a: sq1a.toLowerCase() },
            { q: sq2q, a: sq2a.toLowerCase() },
            { q: sq3q, a: sq3a.toLowerCase() }
        ]
    };
    localStorage.setItem(`aura_user_${username}`, JSON.stringify(userData));

    showToast('✅ Account created! You can now login.');
    showPanel('loginPanel');
}

// ============================================================
// LOGIN
// ============================================================
function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username) { showError('loginError', '❌ Please enter your username.'); return; }
    if (!password) { showError('loginError', '❌ Please enter your password.'); return; }

    const userData = localStorage.getItem(`aura_user_${username}`);
    if (!userData) {
        showError('loginError', '❌ Username not found. Please register first or check spelling.');
        return;
    }

    const user = JSON.parse(userData);
    if (user.password !== password) {
        showError('loginError', '❌ Incorrect password. Try again or use Forgot Password.');
        return;
    }

    // Successful login
    localStorage.setItem('aura_logged_in', 'true');
    localStorage.setItem('aura_username', username);
    localStorage.setItem('aura_join_date', user.joinDate);

    // Initialize data for this user if first time
    initializeUserData(username);

    const loginScreen = document.getElementById('login-screen');
    loginScreen.style.opacity = '0';
    loginScreen.style.transition = 'opacity 0.4s';
    setTimeout(() => {
        loginScreen.style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        setUserUI(username, user.joinDate);
        loadTheme();
        setHeaderDate();
        loadAllData();
        startMondayCheck();
        loadProfileExtras();
        startLiveClock();
        startSlotChecker();
    }, 400);
}

function checkAutoLogin() {
    const isLoggedIn = localStorage.getItem('aura_logged_in') === 'true';
    const savedUsername = localStorage.getItem('aura_username');
    if (!isLoggedIn || !savedUsername) return;

    // Validate user still exists
    const userData = localStorage.getItem(`aura_user_${savedUsername}`);
    if (!userData) {
        localStorage.removeItem('aura_logged_in');
        return;
    }
    const user = JSON.parse(userData);

    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    setUserUI(savedUsername, user.joinDate);
    loadTheme();
    setHeaderDate();
    loadAllData();
    startMondayCheck();
    loadProfileExtras();
    startLiveClock();
    startSlotChecker();
}

function initializeUserData(username) {
    const key = `aura_data_${username}_initialized`;
    if (localStorage.getItem(key)) return;

    const uid = `aura_data_${username}`;
    localStorage.setItem(`${uid}_todos`, JSON.stringify([
        { id: Date.now()+1, text:"Morning Meditation", priority:"high", done:true },
        { id: Date.now()+2, text:"Complete Project Report", priority:"high", done:false },
        { id: Date.now()+3, text:"Grocery Shopping", priority:"medium", done:true },
        { id: Date.now()+4, text:"Read 30 minutes", priority:"medium", done:false },
        { id: Date.now()+5, text:"Call Family", priority:"low", done:false },
        { id: Date.now()+6, text:"Evening Walk", priority:"low", done:true }
    ]));
    localStorage.setItem(`${uid}_slots`, JSON.stringify([
        { id: Date.now()+7, displayTime:"6:00 AM", sortKey:"06:00", activity:"Morning Meditation", period:"Morning" },
        { id: Date.now()+8, displayTime:"8:00 AM", sortKey:"08:00", activity:"Breakfast & Planning", period:"Morning" },
        { id: Date.now()+9, displayTime:"12:00 PM", sortKey:"12:00", activity:"Lunch Break", period:"Afternoon" },
        { id: Date.now()+10, displayTime:"3:00 PM", sortKey:"15:00", activity:"Work/Study Session", period:"Afternoon" },
        { id: Date.now()+11, displayTime:"6:00 PM", sortKey:"18:00", activity:"Evening Exercise", period:"Evening" },
        { id: Date.now()+12, displayTime:"8:00 PM", sortKey:"20:00", activity:"Dinner & Family Time", period:"Evening" },
        { id: Date.now()+13, displayTime:"10:00 PM", sortKey:"22:00", activity:"Reading Time", period:"Night" }
    ]));
    localStorage.setItem(`${uid}_yearly_goals`, JSON.stringify([
        { id: Date.now()+14, text:"Learn JavaScript", completed:false },
        { id: Date.now()+15, text:"Travel to new place", completed:false },
        { id: Date.now()+16, text:"Read 20 books", completed:false }
    ]));
    localStorage.setItem(`${uid}_highlights`, JSON.stringify([
        { id: Date.now()+17, text:"Started learning JavaScript" },
        { id: Date.now()+18, text:"Completed first project" }
    ]));
    localStorage.setItem(key, 'true');
}

function setUserUI(username, joinDate) {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('headerUsername', username);
    set('userName', username);
    set('profileUsername', username);
    set('profileJoinDate', joinDate || localStorage.getItem('aura_join_date') || '—');
}

function loadTheme() {
    const username = localStorage.getItem('aura_username');
    const theme = localStorage.getItem(`aura_theme_${username}`) || 'cream';
    document.documentElement.setAttribute('data-theme', theme);
    const ts = document.getElementById('themeSelect');
    if (ts) ts.value = theme;
}

// ============================================================
// LOGOUT
// ============================================================
function logout() {
    if (!confirm('Are you sure you want to logout?')) return;
    if (slotCheckInterval) clearInterval(slotCheckInterval);
    if (clockInterval) clearInterval(clockInterval);
    localStorage.removeItem('aura_logged_in');
    localStorage.removeItem('aura_username');
    localStorage.removeItem('aura_join_date');
    const ls = document.getElementById('login-screen');
    ls.style.display = 'flex'; ls.style.opacity = '0';
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    const loginErr = document.getElementById('loginError');
    if (loginErr) loginErr.style.display = 'none';
    showPanel('loginPanel');
    setTimeout(() => { ls.style.transition = 'opacity 0.4s'; ls.style.opacity = '1'; }, 10);
}

// ============================================================
// FORGOT PASSWORD
// ============================================================
function showForgotStep(step) {
    [1,2,3].forEach(n => {
        const el = document.getElementById(`forgotStep${n}`);
        if (el) el.style.display = n === step ? 'block' : 'none';
    });
}

function forgotStep1() {
    const username = document.getElementById('forgotUsername').value.trim();
    if (!username) { showError('forgotError1', '❌ Please enter your username.'); return; }
    const userData = localStorage.getItem(`aura_user_${username}`);
    if (!userData) { showError('forgotError1', '❌ Username not found.'); return; }
    const user = JSON.parse(userData);
    if (!user.securityQuestions || user.securityQuestions.length < 3) {
        showError('forgotError1', '❌ No security questions set for this account.');
        return;
    }
    forgotTargetUsername = username;
    // Show questions
    const block = document.getElementById('forgotQuestionsBlock');
    block.innerHTML = user.securityQuestions.map((sq, i) => `
        <div class="login-form-group">
            <label class="login-label">${sq.q}</label>
            <input type="text" class="login-input" id="forgotAns${i+1}" placeholder="Your answer">
        </div>
    `).join('');
    showForgotStep(2);
}

function forgotStep2() {
    const userData = localStorage.getItem(`aura_user_${forgotTargetUsername}`);
    if (!userData) return;
    const user = JSON.parse(userData);
    let allCorrect = true;
    for (let i = 0; i < 3; i++) {
        const input = document.getElementById(`forgotAns${i+1}`);
        if (!input) { allCorrect = false; break; }
        if (input.value.trim().toLowerCase() !== user.securityQuestions[i].a) {
            allCorrect = false; break;
        }
    }
    if (!allCorrect) {
        showError('forgotError2', '❌ One or more answers are incorrect. Please try again.');
        return;
    }
    showForgotStep(3);
}

function forgotStep3() {
    const newPw = document.getElementById('newPassword').value;
    const confirmPw = document.getElementById('confirmNewPassword').value;
    if (!newPw || newPw.length < 4) { showError('forgotError3', '❌ Password must be at least 4 characters.'); return; }
    if (newPw !== confirmPw) { showError('forgotError3', '❌ Passwords do not match.'); return; }
    const userData = JSON.parse(localStorage.getItem(`aura_user_${forgotTargetUsername}`));
    userData.password = newPw;
    localStorage.setItem(`aura_user_${forgotTargetUsername}`, JSON.stringify(userData));
    showToast('✅ Password reset successfully! You can now login.');
    showPanel('loginPanel');
}

// ============================================================
// HEADER / DATE
// ============================================================
function setHeaderDate() {
    const el = document.getElementById('headerDate');
    if (el) el.textContent = new Date().toLocaleDateString('en-US', { weekday:'short', year:'numeric', month:'short', day:'numeric' }).toUpperCase();
}

// ============================================================
// NAVIGATION
// ============================================================
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    const actions = {
        dashboard: updateDashboard,
        todo: renderTodos,
        timetable: renderSlots,
        timer: startLiveClock,
        weekly: renderReportsList,
        calendar: renderCalendar,
        yearly: () => { refreshYearly(); renderYearlyGoals(); renderHighlights(); },
        motivation: () => { loadMotivation(); loadReminders(); },
        profile: loadProfileExtras,
        chatbot: checkAndClearChat
    };
    if (actions[sectionId]) actions[sectionId]();
}

function loadAllData() {
    renderTodos(); renderSlots(); updateDashboard(); renderReportsList();
    renderCalendar(); refreshYearly(); renderYearlyGoals(); renderHighlights();
    loadMotivation(); loadReminders();
}

// ── User-scoped storage ──
function uKey(key) {
    const u = localStorage.getItem('aura_username');
    return `aura_data_${u}_${key}`;
}

// ============================================================
// TO-DO
// ============================================================
function getTodos() { return JSON.parse(localStorage.getItem(uKey('todos')) || '[]'); }
function saveTodos(t) { localStorage.setItem(uKey('todos'), JSON.stringify(t)); }

function addTodo() {
    const text = document.getElementById('todoInput').value.trim();
    const priority = document.getElementById('todoPriority').value;
    if (!text) return;
    saveTodos([...getTodos(), { id:Date.now(), text, priority, done:false }]);
    document.getElementById('todoInput').value = '';
    renderTodos(); updateDashboard(); updateTodayProgress();
}

function toggleTodo(id) {
    saveTodos(getTodos().map(t => t.id === id ? {...t, done:!t.done} : t));
    renderTodos(); updateDashboard(); updateTodayProgress();
}

function deleteTodo(id) {
    saveTodos(getTodos().filter(t => t.id !== id));
    renderTodos(); updateDashboard(); updateTodayProgress();
}

function filterTodo(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll('.filter-row .btn').forEach(b => b.classList.remove('filter-active'));
    btn.classList.add('filter-active');
    renderTodos();
}

function renderTodos() {
    const todos = getTodos();
    const list = document.getElementById('todoList');
    const empty = document.getElementById('todoEmpty');
    if (!list) return;
    const filtered = currentFilter === 'pending' ? todos.filter(t => !t.done)
        : currentFilter === 'done' ? todos.filter(t => t.done) : todos;
    if (filtered.length === 0) { list.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';
    list.innerHTML = filtered.map(t => `
        <div class="todo-item ${t.done ? 'done' : ''}">
            <div class="todo-check ${t.done ? 'checked' : ''}" onclick="toggleTodo(${t.id})">${t.done ? '✓' : ''}</div>
            <span class="todo-text">${escapeHtml(t.text)}</span>
            <span class="todo-priority prio-${t.priority}">${t.priority==='high'?'🔴':t.priority==='medium'?'🟠':'🟢'} ${t.priority}</span>
            <button class="del-btn" onclick="deleteTodo(${t.id})"><i class="fas fa-trash"></i></button>
        </div>`).join('');
}

function clearDoneTodos() {
    saveTodos(getTodos().filter(t => !t.done));
    renderTodos(); updateDashboard(); updateTodayProgress();
}

function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// ============================================================
// TIMETABLE — Fixed: AM/PM separate, notifications
// ============================================================
function getSlots() { return JSON.parse(localStorage.getItem(uKey('slots')) || '[]'); }
function saveSlots(s) { localStorage.setItem(uKey('slots'), JSON.stringify(s)); }

function addSlot() {
    const hour = document.getElementById('slotHour').value;
    const minute = document.getElementById('slotMinute').value;
    const ampm = document.getElementById('slotAmPm').value;
    const activity = document.getElementById('slotActivity').value.trim();
    const period = document.getElementById('slotPeriod').value;

    if (!activity) { showToast('⚠️ Please enter an activity name!'); return; }

    const displayTime = `${parseInt(hour)}:${minute} ${ampm}`;
    // Convert to 24h for sorting
    let h24 = parseInt(hour);
    if (ampm === 'AM' && h24 === 12) h24 = 0;
    if (ampm === 'PM' && h24 !== 12) h24 += 12;
    const sortKey = `${String(h24).padStart(2,'0')}:${minute}`;

    const slots = [...getSlots(), { id:Date.now(), displayTime, sortKey, activity, period }];
    slots.sort((a,b) => a.sortKey.localeCompare(b.sortKey));
    saveSlots(slots);
    document.getElementById('slotActivity').value = '';
    renderSlots();
    showToast(`✅ "${activity}" added at ${displayTime}`);
}

function deleteSlot(id) { saveSlots(getSlots().filter(s => s.id !== id)); renderSlots(); }

function renderSlots() {
    const slots = getSlots();
    const list = document.getElementById('slotList');
    const empty = document.getElementById('slotEmpty');
    if (!list) return;
    if (slots.length === 0) { list.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';
    list.innerHTML = slots.map(s => `
        <div class="time-slot">
            <span class="time-label">${escapeHtml(s.displayTime)}</span>
            <span class="time-activity">${escapeHtml(s.activity)}</span>
            <span class="time-period">${s.period}</span>
            <button class="del-btn" onclick="deleteSlot(${s.id})"><i class="fas fa-trash"></i></button>
        </div>`).join('');
}

// ── Slot Notification Checker ──
let notifiedSlots = new Set();
function startSlotChecker() {
    if (slotCheckInterval) clearInterval(slotCheckInterval);
    notifiedSlots.clear();
    slotCheckInterval = setInterval(checkSlotNotifications, 30000); // check every 30s
    checkSlotNotifications();
}

function checkSlotNotifications() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const currentKey = `${h}:${m}`;
    const slots = getSlots();
    slots.forEach(slot => {
        if (slot.sortKey === currentKey && !notifiedSlots.has(slot.id)) {
            notifiedSlots.add(slot.id);
            showTimetableNotification(slot);
        }
    });
    // Reset notified set at midnight
    if (h === '00' && m === '00') notifiedSlots.clear();
}

function showTimetableNotification(slot) {
    // In-app popup
    const popup = document.getElementById('ttNotifPopup');
    const title = document.getElementById('ttNotifTitle');
    const body = document.getElementById('ttNotifBody');
    const emoji = document.getElementById('ttNotifEmoji');
    const emojis = { Morning:'🌅', Afternoon:'☀️', Evening:'🌆', Night:'🌙' };
    if (popup && title && body && emoji) {
        emoji.textContent = emojis[slot.period] || '⏰';
        title.textContent = `Time for: ${slot.activity}`;
        body.textContent = `It's ${slot.displayTime} — ${slot.period} activity ready!`;
        popup.style.display = 'flex';
    }
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⏰ Aura Life Planner', {
            body: `${slot.displayTime} — ${slot.activity}`,
            icon: '✦'
        });
    }
}

function closeTtNotif() {
    const popup = document.getElementById('ttNotifPopup');
    if (popup) popup.style.display = 'none';
}

// ============================================================
// DASHBOARD
// ============================================================
function updateDashboard() {
    const todos = getTodos();
    const total = todos.length;
    const done = todos.reduce((acc,t) => acc + (t.done?1:0), 0);
    const pending = total - done;
    const pct = total === 0 ? 0 : Math.round((done/total)*100);
    const set = (id,v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    animateCounter('statTotal', total);
    animateCounter('statDone', done);
    animateCounter('statPending', pending);
    set('dailyPercText', pct+'%');
    const bar = document.getElementById('dailyBar');
    if (bar) setTimeout(() => bar.style.width = pct+'%', 100);
    set('dailyMotMsg', total===0 ? 'Add your first task to begin your journey! 🌱'
        : pct===100 ? '🎉 Perfect day! You completed everything!'
        : pct>=75 ? '🔥 Amazing progress! Almost there!'
        : pct>=50 ? '💪 Halfway done! Keep the momentum!'
        : pct>=25 ? '🌱 Good start! Every task counts!'
        : '✨ Every small step counts. You\'ve got this!');
    setDashboardQuote(pct);
    const recent = [...todos].reverse().slice(0,5);
    const recentEl = document.getElementById('recentTasks');
    if (recentEl) recentEl.innerHTML = recent.length===0 ? '<p class="empty-msg">No tasks yet!</p>'
        : recent.map(t => `
            <div class="todo-item ${t.done?'done':''}" style="margin-bottom:0.5rem;">
                <div class="todo-check ${t.done?'checked':''}" onclick="toggleTodo(${t.id})">${t.done?'✓':''}</div>
                <span class="todo-text">${escapeHtml(t.text)}</span>
                <span class="todo-priority prio-${t.priority}">${t.priority}</span>
            </div>`).join('');
}

function animateCounter(id, target) {
    const el = document.getElementById(id); if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target/20));
    const timer = setInterval(() => {
        current = Math.min(current+step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
    }, 40);
}

function setDashboardQuote(pct) {
    const level = pct>=70?'high':pct>=35?'medium':'low';
    const q = DASHBOARD_QUOTES[level][Math.floor(Math.random()*DASHBOARD_QUOTES[level].length)];
    const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
    set('dashEmoji', q.emoji); set('dashQuote', q.quote); set('dashSub', q.sub);
}
function refreshDashboardQuote() {
    const pct = parseInt(document.getElementById('dailyPercText').textContent) || 0;
    setDashboardQuote(pct);
}

// ============================================================
// CALENDAR
// ============================================================
function renderCalendar() {
    const el = document.getElementById('calendarMonthYear');
    if (el) el.textContent = new Date(currentYear,currentMonth).toLocaleDateString('en-US',{month:'long',year:'numeric'});
    const firstDay = new Date(currentYear,currentMonth,1).getDay();
    const startOffset = firstDay===0?6:firstDay-1;
    const daysInMonth = new Date(currentYear,currentMonth+1,0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getMonth()===currentMonth && today.getFullYear()===currentYear;
    const calData = JSON.parse(localStorage.getItem(uKey('calendar')) || '{}');
    const monthProgress = calData[`${currentYear}-${currentMonth}`] || {};
    const joinDateObj = localStorage.getItem('aura_join_date') ? new Date(localStorage.getItem('aura_join_date')) : null;
    let grid='', totalProg=0, daysWithProg=0;
    for (let i=0;i<startOffset;i++) grid+='<div class="cal-day empty"></div>';
    for (let day=1;day<=daysInMonth;day++) {
        const date=new Date(currentYear,currentMonth,day);
        const isAfter=isCurrentMonth && day>today.getDate();
        const isBefore=joinDateObj && date<joinDateObj;
        let content=`<div class="cal-date">${day}</div>`;
        if (isAfter) { content+=`<div class="cal-progress"></div>`; }
        else if (isBefore) { content+=`<div class="cal-not-started">Not started</div>`; }
        else {
            const p=monthProgress[day];
            if (p!==undefined) {
                let cls='cal-progress'; if(p<30) cls+=' very-low'; else if(p<60) cls+=' low';
                content+=`<div class="${cls}">${p}%</div>`;
                totalProg+=p; daysWithProg++;
            } else { content+=`<div class="cal-progress">—</div>`; }
        }
        grid+=`<div class="cal-day">${content}</div>`;
    }
    const cg=document.getElementById('calendarGrid'); if(cg) cg.innerHTML=grid;
    const avg=daysWithProg>0?Math.round(totalProg/daysWithProg):0;
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
    set('monthProgress',avg+'%');
    const mb=document.getElementById('monthBar'); if(mb) setTimeout(()=>mb.style.width=avg+'%',100);
    set('monthQuote', daysWithProg===0?'✨ This month marks the beginning of your journey!'
        :avg>=80?'🌟 Outstanding! Your consistency is inspiring!'
        :avg>=60?'💪 Great progress! Keep building strong habits!'
        :avg>=40?'🌱 Good effort! Every day counts!'
        :'✨ Every step is progress. Keep going!');
}

function changeMonth(delta) {
    currentMonth+=delta;
    if(currentMonth<0){currentMonth=11;currentYear--;}
    else if(currentMonth>11){currentMonth=0;currentYear++;}
    renderCalendar();
}

function toggleYearView() {
    showingYearView=!showingYearView;
    document.getElementById('monthView').style.display=showingYearView?'none':'block';
    document.getElementById('yearView').style.display=showingYearView?'block':'none';
    const btn=document.getElementById('yearViewBtn');
    if(btn) btn.innerHTML=showingYearView?'<i class="fas fa-calendar-alt"></i> Show Month View':'<i class="fas fa-calendar-alt"></i> Show Year View';
    if(showingYearView) renderYearView();
}

function renderYearView() {
    const calData=JSON.parse(localStorage.getItem(uKey('calendar'))||'{}');
    const joinDateObj=localStorage.getItem('aura_join_date')?new Date(localStorage.getItem('aura_join_date')):null;
    const joinYear=joinDateObj?joinDateObj.getFullYear():currentYear;
    const joinMon=joinDateObj?joinDateObj.getMonth():0;
    let html='';
    for(let m=0;m<12;m++){
        const vals=Object.values(calData[`${currentYear}-${m}`]||{});
        if(currentYear<joinYear||(currentYear===joinYear&&m<joinMon)){
            html+=`<div class="year-month-card"><div class="year-month-name">${new Date(currentYear,m).toLocaleDateString('en-US',{month:'short'})}</div><div class="year-month-progress" style="color:var(--muted);">Not started</div></div>`;
        } else {
            const avg=vals.length>0?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
            const color=avg>=70?'var(--success)':avg>=40?'var(--warning)':avg>0?'var(--danger)':'var(--muted)';
            html+=`<div class="year-month-card"><div class="year-month-name">${new Date(currentYear,m).toLocaleDateString('en-US',{month:'short'})}</div><div class="year-month-progress" style="color:${color};">${avg>0?avg+'%':'—'}</div><div style="font-size:0.65rem;color:var(--muted);">${vals.length} days</div></div>`;
        }
    }
    const yg=document.getElementById('yearGrid'); if(yg) yg.innerHTML=html;
}

function updateTodayProgress() {
    const todos=getTodos();
    const done=todos.reduce((a,t)=>a+(t.done?1:0),0);
    const pct=todos.length===0?0:Math.round((done/todos.length)*100);
    const today=new Date(); const key=`${today.getFullYear()}-${today.getMonth()}`;
    let calData=JSON.parse(localStorage.getItem(uKey('calendar'))||'{}');
    if(!calData[key]) calData[key]={};
    calData[key][today.getDate()]=pct;
    localStorage.setItem(uKey('calendar'),JSON.stringify(calData));
    if(document.getElementById('calendar').classList.contains('active')) renderCalendar();
}

// ============================================================
// WEEKLY PDF
// ============================================================
function generateWeeklyReport() {
    const todos=getTodos();
    const done=todos.reduce((a,t)=>a+(t.done?1:0),0);
    const pct=todos.length===0?0:Math.round((done/todos.length)*100);
    const today=new Date(); const start=getStartOfWeek(today); const end=getEndOfWeek(today);
    const calData=JSON.parse(localStorage.getItem(uKey('calendar'))||'{}');
    const weekDays=[]; let activeDays=0;
    for(let i=0;i<7;i++){
        const d=new Date(start); d.setDate(start.getDate()+i);
        const key=`${d.getFullYear()}-${d.getMonth()}`; const isFuture=d>today;
        let progress=null;
        if(!isFuture&&calData[key]&&calData[key][d.getDate()]!==undefined){progress=calData[key][d.getDate()];if(progress>0)activeDays++;}
        weekDays.push({dayName:d.toLocaleDateString('en-US',{weekday:'long'}),dateNum:d.getDate(),month:d.toLocaleDateString('en-US',{month:'short'}),progress,isFuture});
    }
    const report={id:Date.now(),weekNumber:getWeekNumber(today),startDate:start.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),endDate:end.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),progress:pct,completed:done,total:todos.length,pending:todos.length-done,weekDays,activeDays,totalWeekDays:7,date:today.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),time:today.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}),message:getMotivationMessage(pct)};
    let reports=JSON.parse(localStorage.getItem(uKey('reports'))||'[]');
    reports.push(report); localStorage.setItem(uKey('reports'),JSON.stringify(reports));
    showToast('✅ Weekly report generated!'); renderReportsList(); downloadReport(report.id);
}

function renderReportsList() {
    const reports=JSON.parse(localStorage.getItem(uKey('reports'))||'[]');
    const listEl=document.getElementById('reportsList'); const emptyEl=document.getElementById('reportsEmpty');
    if(!listEl) return;
    if(reports.length===0){listEl.innerHTML='';if(emptyEl)emptyEl.style.display='block';return;}
    if(emptyEl) emptyEl.style.display='none';
    reports.sort((a,b)=>b.id-a.id);
    listEl.innerHTML=reports.map(r=>`
        <div class="report-card">
            <div class="report-title">Week ${r.weekNumber}</div>
            <div class="report-date">${r.startDate} - ${r.endDate}</div>
            <div class="report-progress">${r.progress}%</div>
            <div style="font-size:0.7rem;color:var(--muted);margin-bottom:0.5rem;">🔥 ${r.activeDays}/${r.totalWeekDays} days active</div>
            <div class="report-actions">
                <button class="btn btn-sm btn-ghost ripple" onclick="viewReport(${r.id})"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-ghost ripple" onclick="downloadReport(${r.id})"><i class="fas fa-download"></i></button>
                <button class="btn btn-sm btn-ghost ripple" onclick="shareReport(${r.id})"><i class="fas fa-share"></i></button>
                <button class="btn btn-sm btn-danger ripple" onclick="deleteReport(${r.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>`).join('');
}

function getWeekNumber(d){const f=new Date(d.getFullYear(),0,1);return Math.ceil(((d-f)/86400000+f.getDay()+1)/7);}
function getStartOfWeek(d){const n=new Date(d);const day=n.getDay();n.setDate(n.getDate()-day+(day===0?-6:1));return n;}
function getEndOfWeek(d){const s=getStartOfWeek(d);const e=new Date(s);e.setDate(s.getDate()+6);return e;}

function viewReport(id){
    const r=JSON.parse(localStorage.getItem(uKey('reports'))||'[]').find(r=>r.id===id);
    if(!r) return;
    const w=window.open('','_blank'); if(w){w.document.write(generatePDFHTML(r));w.document.close();}
}

function generatePDFHTML(r) {
    const rows=(r.weekDays||[]).map(d=>{
        const p=d.progress!==null?d.progress:0;
        const disp=d.isFuture?'—':(d.progress!==null?p+'%':'0%');
        const color=p>=70?'#c4956a':p>=40?'#e8a020':'#cc3333';
        return `<tr><td style="padding:8px;font-weight:700;">${d.dayName}</td><td style="padding:8px;">${d.dateNum} ${d.month}</td><td style="padding:8px;width:50%;"><div style="display:flex;align-items:center;gap:10px;"><div style="flex:1;height:18px;background:#f0e8d8;border-radius:100px;overflow:hidden;"><div style="height:100%;width:${d.isFuture?0:p}%;background:${color};border-radius:100px;"></div></div><span style="min-width:40px;font-weight:800;color:${color};">${disp}</span></div></td></tr>`;
    }).join('');
    let dots=''; for(let i=0;i<r.activeDays;i++) dots+='🔥 '; for(let i=0;i<(r.totalWeekDays-r.activeDays);i++) dots+='— ';
    return `<!DOCTYPE html><html><head><title>Week ${r.weekNumber}</title><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&family=Playfair+Display:wght@900&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Poppins',sans-serif;background:#fdf6ee;padding:20px;}.wrap{max-width:780px;margin:0 auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(139,94,60,0.2);}.hdr{background:linear-gradient(135deg,#8b5e3c,#e8650a,#f5c842);color:white;padding:2.5rem;text-align:center;}.hdr h1{font-family:'Playfair Display',serif;font-size:2rem;}.body{padding:2rem;}.circle{margin:1.5rem auto;border-radius:50%;width:160px;height:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:3px solid #8b5e3c;background:rgba(139,94,60,0.06);}.circle .num{font-size:3rem;font-weight:900;color:#8b5e3c;font-family:'Playfair Display',serif;}.tbl{width:100%;border-collapse:collapse;margin:1.5rem 0;}.tbl th{text-align:left;padding:10px;background:#fdf0e0;color:#8b5e3c;font-weight:800;}.tbl td{padding:10px;border-bottom:1px solid #f0e8d8;}.box{margin:1.5rem 0;padding:1.2rem;background:#fdf0e0;border-radius:12px;text-align:center;}.ftr{text-align:center;padding:1rem;color:#999;font-size:0.82rem;border-top:1px solid #f0e8d8;}</style></head><body><div class="wrap"><div class="hdr"><h1>✦ MY AURA LIFE PLANNER ✦</h1><p style="opacity:0.9;margin-top:0.3rem;">Weekly Report — Week ${r.weekNumber} · ${r.startDate} – ${r.endDate}</p></div><div class="body"><div class="circle"><span class="num">${r.progress}%</span><span style="font-size:0.85rem;color:#8b5e3c;">AURA LEVEL</span></div><h3 style="color:#8b5e3c;margin-bottom:0.5rem;">📊 Daily Progress</h3><table class="tbl"><thead><tr><th>Day</th><th>Date</th><th>Progress</th></tr></thead><tbody>${rows}</tbody></table><div class="box"><div style="font-size:1.1rem;font-weight:800;margin-bottom:0.5rem;color:#8b5e3c;">🔥 Consistency Tracker</div><div style="font-size:1.3rem;letter-spacing:4px;">${dots.trim()}</div><div style="color:#999;margin-top:0.3rem;">${r.activeDays} of ${r.totalWeekDays} days active</div></div><div class="box" style="font-style:italic;color:#5a3e2b;">"${r.message}"</div><div class="ftr">✨ Generated with My Aura Life Planner ✨<br>${r.date} · ${r.time}</div></div></div></body></html>`;
}

function downloadReport(id){
    const r=JSON.parse(localStorage.getItem(uKey('reports'))||'[]').find(r=>r.id===id);
    if(!r) return;
    const el=document.createElement('div'); el.innerHTML=generatePDFHTML(r);
    html2pdf().set({margin:[0.5,0.5,0.5,0.5],filename:`Week_${r.weekNumber}_Report.pdf`,image:{type:'jpeg',quality:1},html2canvas:{scale:2},jsPDF:{unit:'in',format:'a4',orientation:'portrait'}}).from(el).save();
}

function shareReport(id){
    const r=JSON.parse(localStorage.getItem(uKey('reports'))||'[]').find(r=>r.id===id);
    if(!r) return;
    const text=`My Aura Life Planner — Week ${r.weekNumber}\nProgress: ${r.progress}%\nActive Days: ${r.activeDays}/${r.totalWeekDays}\n"${r.message}"`;
    if(navigator.share) navigator.share({title:'Aura Report',text}).catch(()=>alert(text)); else alert(text);
}

function deleteReport(id){
    if(!confirm('Delete this report?')) return;
    localStorage.setItem(uKey('reports'),JSON.stringify(JSON.parse(localStorage.getItem(uKey('reports'))||'[]').filter(r=>r.id!==id)));
    renderReportsList();
}

function getMotivationMessage(p){
    if(p>=80) return "Your aura is at its peak! Absolutely unstoppable! 🌟";
    if(p>=60) return "Great consistency! Building powerful habits! 💪";
    if(p>=40) return "Solid progress. Keep that momentum going! 🌱";
    if(p>=20) return "Every step counts. You're on the right path! ✨";
    return "Your journey is just beginning. Keep shining! 🌈";
}

// ── Monday Popup (not browser confirm) ──
function startMondayCheck() {
    setInterval(()=>{
        const today=new Date();
        if(today.getDay()===1){
            const last=localStorage.getItem('aura_last_monday_check');
            const todayStr=today.toDateString();
            if(last!==todayStr){
                setTimeout(()=>showMondayPopup(),2000);
                localStorage.setItem('aura_last_monday_check',todayStr);
            }
        }
    },3600000);
}

function showMondayPopup() {
    const popup=document.getElementById('mondayPopup');
    if(popup) popup.style.display='flex';
}
function closeMondayPopup(generate) {
    const popup=document.getElementById('mondayPopup');
    if(popup) popup.style.display='none';
    if(generate) generateWeeklyReport();
}

// ============================================================
// YEARLY GOALS & HIGHLIGHTS
// ============================================================
function getYearlyGoals(){return JSON.parse(localStorage.getItem(uKey('yearly_goals'))||'[]');}
function saveYearlyGoals(g){localStorage.setItem(uKey('yearly_goals'),JSON.stringify(g));}
function addYearlyGoal(){const i=document.getElementById('yearGoalInput');const t=i.value.trim();if(!t)return;saveYearlyGoals([...getYearlyGoals(),{id:Date.now(),text:t,completed:false}]);i.value='';renderYearlyGoals();}
function toggleYearlyGoal(id){saveYearlyGoals(getYearlyGoals().map(g=>g.id===id?{...g,completed:!g.completed}:g));renderYearlyGoals();}
function editYearlyGoal(id){const goals=getYearlyGoals();const g=goals.find(g=>g.id===id);if(!g)return;const t=prompt('Edit goal:',g.text);if(t&&t.trim()){g.text=t.trim();saveYearlyGoals(goals);renderYearlyGoals();}}
function deleteYearlyGoal(id){saveYearlyGoals(getYearlyGoals().filter(g=>g.id!==id));renderYearlyGoals();}
function renderYearlyGoals(){
    const goals=getYearlyGoals();const el=document.getElementById('yearlyGoalsList');if(!el)return;
    if(goals.length===0){el.innerHTML='<p class="empty-msg">No goals yet!</p>';return;}
    el.innerHTML=goals.map(g=>`<div class="goal-item"><div style="cursor:pointer;font-size:1.2rem;" onclick="toggleYearlyGoal(${g.id})">${g.completed?'✅':'◻️'}</div><span class="goal-text" style="${g.completed?'text-decoration:line-through;color:var(--muted);':''}">${escapeHtml(g.text)}</span><div class="goal-actions"><button class="goal-edit-btn" onclick="editYearlyGoal(${g.id})"><i class="fas fa-edit"></i></button><button class="goal-delete-btn" onclick="deleteYearlyGoal(${g.id})"><i class="fas fa-trash"></i></button></div></div>`).join('');
}

function getHighlights(){return JSON.parse(localStorage.getItem(uKey('highlights'))||'[]');}
function saveHighlights(h){localStorage.setItem(uKey('highlights'),JSON.stringify(h));}
function addHighlight(){const i=document.getElementById('highlightInput');const t=i.value.trim();if(!t)return;saveHighlights([...getHighlights(),{id:Date.now(),text:t}]);i.value='';renderHighlights();}
function deleteHighlight(id){saveHighlights(getHighlights().filter(h=>h.id!==id));renderHighlights();}
function renderHighlights(){
    const h=getHighlights();const el=document.getElementById('highlightList');if(!el)return;
    if(h.length===0){el.innerHTML='<p class="empty-msg">No highlights yet!</p>';return;}
    el.innerHTML=h.map(item=>`<div class="highlight-item"><span style="color:var(--primary);">✨</span><span class="highlight-text">${escapeHtml(item.text)}</span><button class="del-btn" onclick="deleteHighlight(${item.id})"><i class="fas fa-trash"></i></button></div>`).join('');
}

function refreshYearly(){
    const today=new Date();const year=today.getFullYear();
    const start=new Date(year,0,1);const end=new Date(year+1,0,1);
    const pct=Math.round(((today-start)/(end-start))*100);
    const daysLeft=Math.round((end-today)/86400000);
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
    set('currentYear',year);set('yearPercText',pct+'%');set('yearDaysLeft',`${daysLeft} days remaining in ${year}`);
    const yb=document.getElementById('yearBar');if(yb) setTimeout(()=>yb.style.width=pct+'%',100);
}

// ============================================================
// MOTIVATION
// ============================================================
function loadMotivation(){
    const q=MOTIVATION_QUOTES[Math.floor(Math.random()*MOTIVATION_QUOTES.length)];
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
    set('bigEmoji',q.emoji);set('bigQuote',q.quote);set('bigSub',q.sub);
}
function refreshMotivation(){loadMotivation();}
function loadReminders(){
    const grid=document.getElementById('remindersGrid');if(!grid)return;
    grid.innerHTML=[...LIFE_REMINDERS].sort(()=>Math.random()-0.5).slice(0,8)
        .map(r=>`<div class="reminder-card"><div class="reminder-icon">${r.icon}</div><div class="reminder-text">${r.text}</div></div>`).join('');
}

// ============================================================
// CHATBOT — no repeat fixes
// ============================================================
function checkAndClearChat(){
    const today=new Date().toDateString();
    if(localStorage.getItem('aura_last_chat_date')!==today){
        const cw=document.getElementById('chatWindow');
        if(cw) cw.innerHTML='<div class="chat-msg bot">👋 Hi! I\'m your Aura Assistant. How are you feeling today?</div>';
        localStorage.setItem('aura_last_chat_date',today);
        lastUsedChatResponses={};
    }
}
function clearChat(){
    if(!confirm('Start a new chat?')) return;
    const cw=document.getElementById('chatWindow');
    if(cw) cw.innerHTML='<div class="chat-msg bot">👋 Hi! I\'m your Aura Assistant. How are you feeling today?</div>';
    lastUsedChatResponses={};
}

async function sendChat(){
    const input=document.getElementById('chatInput');
    const msg=input.value.trim();if(!msg) return;
    addChatMsg(msg,'user');input.value='';
    await botReply(msg);
}
async function quickChat(msg){addChatMsg(msg,'user');await botReply(msg);}

async function botReply(msg){
    showTyping(true);
    await new Promise(r=>setTimeout(r,800+Math.random()*400));
    showTyping(false);
    addChatMsg(getResponse(msg),'bot');
}

function showTyping(show){
    const el=document.getElementById('typingIndicator');if(el) el.style.display=show?'flex':'none';
}

function addChatMsg(text,sender){
    const cw=document.getElementById('chatWindow');
    const div=document.createElement('div');div.className=`chat-msg ${sender}`;div.textContent=text;
    cw.appendChild(div);cw.scrollTop=cw.scrollHeight;
}

// Smart response — no consecutive repeats
function getResponse(msg){
    const m=msg.toLowerCase();
    let category='default';
    if(m.includes('stress')||m.includes('anxious')||m.includes('overwhelm')) category='stressed';
    else if(m.includes('great')||m.includes('good')||m.includes('happy')||m.includes('awesome')) category='great';
    else if(m.includes('motivat')||m.includes('inspire')||m.includes('push')) category='motivation';
    else if(m.includes('fail')||m.includes('bad day')||m.includes('gave up')) category='failed';
    else if(m.includes('product')||m.includes('tip')||m.includes('focus')) category='productivity';
    else if(m.includes('tired')||m.includes('exhaust')) category='tired';
    else if(m.includes('sad')||m.includes('down')||m.includes('cry')) category='sad';
    else if(m.includes('morning')||m.includes('good morn')) category='morning';
    else if(m.includes('night')||m.includes('good night')) category='night';
    else if(m.includes('thank')) category='thanks';
    else if(m.includes('hello')||m.includes('hi')||m.includes('hey')) category='hello';
    else if(m.includes('javascript')||m.includes('js')||m.includes('code')) category='javascript';
    else if(m.includes('study')||m.includes('exam')||m.includes('learn')) category='study';

    const responses=BOT_RESPONSES[category];
    const lastIdx=lastUsedChatResponses[category]??-1;
    let idx;
    // Pick random but not same as last
    do { idx=Math.floor(Math.random()*responses.length); } while(idx===lastIdx && responses.length>1);
    lastUsedChatResponses[category]=idx;
    return responses[idx];
}

// ============================================================
// TIMER & CLOCK
// ============================================================
function startLiveClock(){
    if(clockInterval) clearInterval(clockInterval);
    tickClock();clockInterval=setInterval(tickClock,1000);
}
function tickClock(){
    const now=new Date();
    const el=document.getElementById('liveClock');
    if(el) el.textContent=[now.getHours(),now.getMinutes(),now.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');
    const dateEl=document.getElementById('liveDate');
    if(dateEl) dateEl.textContent=now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
}

function setTimerMode(mode){
    if(timerRunning){showToast('⚠️ Please reset the timer first.');return;}
    timerMode=mode;timerSeconds=TIMER_DEFAULTS[mode];
    document.querySelectorAll('.timer-mode-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById(mode+'ModeBtn').classList.add('active');
    document.getElementById('timerModeLabel').textContent=mode==='work'?'Work Mode':'Break Mode';
    updateTimerDisplay();
}
function applyCustomTimer(){
    if(timerRunning){showToast('⚠️ Please reset first.');return;}
    const val=parseInt(document.getElementById('customMinutes').value);
    if(!val||val<1||val>180){showToast('⚠️ Enter 1–180 minutes.');return;}
    timerSeconds=val*60;
    document.querySelectorAll('.timer-mode-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById('timerModeLabel').textContent=`Custom (${val} min)`;
    updateTimerDisplay();showToast(`✅ Timer set to ${val} minutes!`);
}
function startTimer(){
    if(timerRunning) return;
    timerRunning=true;
    document.getElementById('timerStartBtn').disabled=true;
    document.getElementById('timerPauseBtn').disabled=false;
    timerInterval=setInterval(()=>{
        timerSeconds--;updateTimerDisplay();
        if(timerSeconds<=0){
            clearInterval(timerInterval);timerRunning=false;
            document.getElementById('timerStartBtn').disabled=false;
            document.getElementById('timerPauseBtn').disabled=true;
            playBeep();
            showToast(`🎉 ${document.getElementById('timerModeLabel').textContent} complete!`);
            resetTimer();
        }
    },1000);
}
function pauseTimer(){
    if(!timerRunning) return;
    clearInterval(timerInterval);timerRunning=false;
    document.getElementById('timerStartBtn').disabled=false;
    document.getElementById('timerPauseBtn').disabled=true;
    document.getElementById('timerStartBtn').innerHTML='<i class="fas fa-play"></i> Resume';
}
function resetTimer(){
    clearInterval(timerInterval);timerRunning=false;
    timerSeconds=timerMode==='work'?TIMER_DEFAULTS.work:TIMER_DEFAULTS.break;
    const custVal=parseInt(document.getElementById('customMinutes').value);
    if(custVal&&custVal>0&&custVal<=180) timerSeconds=custVal*60;
    document.getElementById('timerStartBtn').disabled=false;
    document.getElementById('timerPauseBtn').disabled=true;
    document.getElementById('timerStartBtn').innerHTML='<i class="fas fa-play"></i> Start';
    updateTimerDisplay();
}
function updateTimerDisplay(){
    const m=Math.floor(timerSeconds/60),s=timerSeconds%60;
    const el=document.getElementById('timerDisplay');
    if(el) el.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function playBeep(){
    try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);osc.frequency.value=660;osc.type='sine';gain.gain.setValueAtTime(0.3,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1.5);osc.start(ctx.currentTime);osc.stop(ctx.currentTime+1.5);}catch(e){}
}

// ============================================================
// PROFILE PHOTO — View / Edit / Remove with menu
// ============================================================
function togglePhotoMenu(){
    const menu=document.getElementById('photoMenu');
    if(menu) menu.style.display=menu.style.display==='none'?'flex':'none';
}
function hidePhotoMenu(){
    const menu=document.getElementById('photoMenu');if(menu) menu.style.display='none';
}
function viewProfilePhoto(){
    const photo=localStorage.getItem(`aura_photo_${localStorage.getItem('aura_username')}`);
    if(!photo){showToast('No photo set yet!');hidePhotoMenu();return;}
    const modal=document.getElementById('photoViewModal');
    const img=document.getElementById('photoViewImg');
    if(modal&&img){img.src=photo;modal.style.display='flex';}
    hidePhotoMenu();
}
function closePhotoModal(){
    const modal=document.getElementById('photoViewModal');
    if(modal) modal.style.display='none';
}
function uploadProfilePhoto(event){
    const file=event.target.files[0];if(!file) return;
    if(!file.type.startsWith('image/')){showToast('❌ Please select an image file.');return;}
    if(file.size>5*1024*1024){showToast('❌ Image must be less than 5MB.');return;}
    const reader=new FileReader();
    reader.onload=e=>{
        const key=`aura_photo_${localStorage.getItem('aura_username')}`;
        localStorage.setItem(key,e.target.result);
        renderProfilePhoto(e.target.result);
        showToast('📸 Profile photo updated!');
    };
    reader.readAsDataURL(file);
    hidePhotoMenu();
}
function removeProfilePhoto(){
    if(!confirm('Remove profile photo?')) return;
    const key=`aura_photo_${localStorage.getItem('aura_username')}`;
    localStorage.removeItem(key);
    document.getElementById('photoUpload').value='';
    renderProfilePhoto(null);
    showToast('🗑️ Photo removed!');
    hidePhotoMenu();
}
function renderProfilePhoto(src){
    const img=document.getElementById('profilePhotoImg');
    const letter=document.getElementById('profilePhotoLetter');
    const hint=document.getElementById('photoHint');
    if(src){img.src=src;img.style.display='block';letter.style.display='none';}
    else{img.style.display='none';letter.style.display='flex';}
    if(hint) hint.textContent=src?'Click to change/remove photo':'Click photo to see options';
}

// ============================================================
// PROFILE FIELDS
// ============================================================
function validatePhoneInput(input){
    const val=input.value;
    const valid=/^[0-9+\s\-]*$/.test(val);
    const errEl=document.getElementById('phoneError');
    if(!valid){
        input.value=val.replace(/[^0-9+\s\-]/g,'');
        if(errEl) errEl.style.display='block';
    } else {
        if(errEl) errEl.style.display='none';
    }
}

function editProfileField(field){
    document.getElementById(field+'Edit').style.display='flex';
    const u=localStorage.getItem('aura_username');
    if(field==='email'){const v=localStorage.getItem(`aura_email_${u}`);if(v)document.getElementById('emailInput').value=v;}
    if(field==='phone'){const v=localStorage.getItem(`aura_phone_${u}`);if(v)document.getElementById('phoneInput').value=v;}
    if(field==='security'){
        const userData=JSON.parse(localStorage.getItem(`aura_user_${u}`)||'{}');
        const sqs=userData.securityQuestions||[];
        if(sqs[0]){document.getElementById('editSq1q').value=sqs[0].q;document.getElementById('editSq1a').value=sqs[0].a;}
        if(sqs[1]){document.getElementById('editSq2q').value=sqs[1].q;document.getElementById('editSq2a').value=sqs[1].a;}
        if(sqs[2]){document.getElementById('editSq3q').value=sqs[2].q;document.getElementById('editSq3a').value=sqs[2].a;}
    }
}
function cancelProfileField(field){document.getElementById(field+'Edit').style.display='none';}
function saveProfileField(field){
    const u=localStorage.getItem('aura_username');
    if(field==='email'){
        const v=document.getElementById('emailInput').value.trim();
        if(!v||!v.includes('@')){showToast('❌ Enter a valid email.');return;}
        localStorage.setItem(`aura_email_${u}`,v);
        document.getElementById('profileEmailDisplay').textContent=v;
        showToast('✉️ Email saved!');
    } else if(field==='phone'){
        const v=document.getElementById('phoneInput').value.trim();
        if(!v){showToast('❌ Enter a phone number.');return;}
        if(!/^[0-9+\s\-]+$/.test(v)){showToast('❌ Phone can only have numbers, +, spaces and -');return;}
        if(v.replace(/[^0-9]/g,'').length<7){showToast('❌ Phone number too short.');return;}
        localStorage.setItem(`aura_phone_${u}`,v);
        document.getElementById('profilePhoneDisplay').textContent=v;
        showToast('📱 Phone saved!');
    } else if(field==='security'){
        const q1=document.getElementById('editSq1q').value.trim();const a1=document.getElementById('editSq1a').value.trim();
        const q2=document.getElementById('editSq2q').value.trim();const a2=document.getElementById('editSq2a').value.trim();
        const q3=document.getElementById('editSq3q').value.trim();const a3=document.getElementById('editSq3a').value.trim();
        if(!q1||!a1||!q2||!a2||!q3||!a3){showToast('❌ Fill all 3 questions and answers.');return;}
        const userData=JSON.parse(localStorage.getItem(`aura_user_${u}`)||'{}');
        userData.securityQuestions=[{q:q1,a:a1.toLowerCase()},{q:q2,a:a2.toLowerCase()},{q:q3,a:a3.toLowerCase()}];
        localStorage.setItem(`aura_user_${u}`,JSON.stringify(userData));
        showToast('🔐 Security questions updated!');
    }
    document.getElementById(field+'Edit').style.display='none';
}
function deleteProfileField(field){
    if(!confirm(`Delete ${field}?`)) return;
    const u=localStorage.getItem('aura_username');
    if(field==='email'){localStorage.removeItem(`aura_email_${u}`);document.getElementById('profileEmailDisplay').textContent='Not set';}
    else if(field==='phone'){localStorage.removeItem(`aura_phone_${u}`);document.getElementById('profilePhoneDisplay').textContent='Not set';}
    showToast('🗑️ Deleted!');
}

// Hobbies
function addHobby(){
    const input=document.getElementById('hobbyInput');const text=input.value.trim();if(!text) return;
    const u=localStorage.getItem('aura_username');
    const hobbies=JSON.parse(localStorage.getItem(`aura_hobbies_${u}`)||'[]');
    if(hobbies.find(h=>h.toLowerCase()===text.toLowerCase())){showToast('Already added!');return;}
    hobbies.push(text);localStorage.setItem(`aura_hobbies_${u}`,JSON.stringify(hobbies));
    input.value='';renderHobbies();
}
function removeHobby(index){
    const u=localStorage.getItem('aura_username');
    const hobbies=JSON.parse(localStorage.getItem(`aura_hobbies_${u}`)||'[]');
    hobbies.splice(index,1);localStorage.setItem(`aura_hobbies_${u}`,JSON.stringify(hobbies));renderHobbies();
}
function renderHobbies(){
    const u=localStorage.getItem('aura_username');
    const hobbies=JSON.parse(localStorage.getItem(`aura_hobbies_${u}`)||'[]');
    const el=document.getElementById('hobbyTags');if(!el) return;
    if(hobbies.length===0){el.innerHTML='<p class="empty-msg" style="padding:0.6rem;font-size:0.82rem;">No hobbies yet!</p>';return;}
    const colors=['#e8650a','#c44f1c','#9333ea','#d97706','#be185d','#e11d48','#b85a10','#8b5e3c'];
    el.innerHTML=hobbies.map((h,i)=>`<span class="hobby-tag" style="background:${colors[i%colors.length]};"><span>${escapeHtml(h)}</span><button class="hobby-remove" onclick="removeHobby(${i})">×</button></span>`).join('');
}

function loadProfileExtras(){
    const u=localStorage.getItem('aura_username');
    if(!u) return;
    const photo=localStorage.getItem(`aura_photo_${u}`);renderProfilePhoto(photo||null);
    const letter=document.getElementById('profilePhotoLetter');if(letter) letter.textContent=u.charAt(0).toUpperCase();
    const email=localStorage.getItem(`aura_email_${u}`);if(email) document.getElementById('profileEmailDisplay').textContent=email;
    const phone=localStorage.getItem(`aura_phone_${u}`);if(phone) document.getElementById('profilePhoneDisplay').textContent=phone;
    const userData=JSON.parse(localStorage.getItem(`aura_user_${u}`)||'{}');
    const sqs=userData.securityQuestions||[];
    const secDisplay=document.getElementById('profileSecDisplay');
    if(secDisplay) secDisplay.textContent=sqs.length>=3?'3 questions set':`${sqs.length} question(s) set`;
    renderHobbies();
}

// ============================================================
// SETTINGS
// ============================================================
function changeUsername(){
    const newName=document.getElementById('changeNameInput').value.trim();if(!newName) return;
    if(newName.length<3){showToast('❌ Username must be at least 3 characters.');return;}
    const u=localStorage.getItem('aura_username');
    // Update user record
    const userData=JSON.parse(localStorage.getItem(`aura_user_${u}`)||'{}');
    if(localStorage.getItem(`aura_user_${newName}`)){showToast('❌ That username is taken.');return;}
    userData.username=newName;
    localStorage.setItem(`aura_user_${newName}`,JSON.stringify(userData));
    localStorage.removeItem(`aura_user_${u}`);
    localStorage.setItem('aura_username',newName);
    ['headerUsername','userName','profileUsername'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=newName;});
    const letter=document.getElementById('profilePhotoLetter');if(letter)letter.textContent=newName.charAt(0).toUpperCase();
    document.getElementById('changeNameInput').value='';
    showToast('✅ Username updated!');
}

function changePassword(){
    const oldPw=document.getElementById('oldPasswordInput').value;
    const newPw=document.getElementById('newPasswordInput').value;
    const u=localStorage.getItem('aura_username');
    const userData=JSON.parse(localStorage.getItem(`aura_user_${u}`)||'{}');
    if(!oldPw||oldPw!==userData.password){showToast('❌ Current password is incorrect.');return;}
    if(!newPw||newPw.length<4){showToast('❌ New password must be at least 4 characters.');return;}
    userData.password=newPw;
    localStorage.setItem(`aura_user_${u}`,JSON.stringify(userData));
    document.getElementById('oldPasswordInput').value='';
    document.getElementById('newPasswordInput').value='';
    showToast('✅ Password updated!');
}

function changeTheme(theme){
    document.documentElement.setAttribute('data-theme',theme);
    const u=localStorage.getItem('aura_username');
    localStorage.setItem(`aura_theme_${u}`,theme);
}

function resetAllData(){
    if(!confirm('⚠️ Delete ALL your tasks, goals, calendar and reports? This cannot be undone.')) return;
    if(!confirm('Last warning! All your data will be erased. Continue?')) return;
    const u=localStorage.getItem('aura_username');
    ['todos','slots','yearly_goals','highlights','calendar','reports'].forEach(k=>localStorage.removeItem(`aura_data_${u}_${k}`));
    localStorage.removeItem(`aura_data_${u}_initialized`);
    initializeUserData(u);
    loadAllData();showToast('✅ Data reset! Fresh start loaded.');
}



// ============================================================
// TOAST
// ============================================================
function showToast(message){
    const toast=document.getElementById('aura-toast');if(!toast) return;
    toast.textContent=message;toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),2800);
}