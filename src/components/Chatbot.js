/**
 * Chatbot Component
 * Smart local knowledge-based chat with animated typing, rich responses,
 * rate limiting, and accessibility features.
 * No API key needed — runs entirely in the browser.
 *
 * @module components/Chatbot
 */
import { encodeHTML } from '../utils/sanitize.js';
import { announce } from '../utils/accessibility.js';
import { validateInput, createRateLimiter } from '../utils/security.js';
import { trackChatEvent } from '../utils/analytics.js';

/* ─── Knowledge Base ─── */

/**
 * Knowledge base entries — pre-processed for efficient lookup.
 * Each entry maps lowercase keywords to a rich HTML answer.
 * @type {Array<{ keys: string[], answer: string }>}
 */
const KB = [
  { keys: ['register', 'registration', 'sign up', 'enroll', 'voter id', 'epic', 'nvsp'],
    answer: `<b>🗳️ Voter Registration</b><br><br>You can register to vote online at <a href="https://nvsp.in" target="_blank" rel="noopener noreferrer">nvsp.in</a> by filling <b>Form 6</b>. You'll need:<br>
• Proof of age (birth certificate, school certificate, Aadhaar)<br>
• Proof of address<br>
• Passport-size photo<br><br>
<em>Minimum age: 18 years on the qualifying date (1st Jan of the year).</em><br><br>
You can also visit your local Electoral Registration Office or download the <b>Voter Helpline App</b>.` },

  { keys: ['evm', 'electronic voting', 'voting machine', 'how to vote', 'vote machine'],
    answer: `<b>🖥️ Electronic Voting Machine (EVM)</b><br><br>EVMs have two parts:<br>
• <b>Control Unit</b> — with the polling officer<br>
• <b>Ballot Unit</b> — in the voting compartment<br><br>
<b>How to vote:</b><br>
1️⃣ Show your voter ID at the polling booth<br>
2️⃣ Get indelible ink on your left index finger<br>
3️⃣ Press the button next to your candidate on the Ballot Unit<br>
4️⃣ A beep confirms your vote is recorded<br>
5️⃣ Check the VVPAT slip (visible for 7 seconds)<br><br>
India has used EVMs nationwide since 2004. They're battery-operated and tamper-proof.` },

  { keys: ['vvpat', 'paper trail', 'paper audit', 'paper slip', 'verification'],
    answer: `<b>📄 VVPAT — Voter Verifiable Paper Audit Trail</b><br><br>
VVPAT is a machine attached to the EVM that prints a small slip showing:<br>
• The candidate's name<br>
• Party symbol<br>
• Serial number<br><br>
The slip is visible through a glass window for <b>7 seconds</b> before it drops into a sealed box.<br><br>
During counting, <b>5 random booths per constituency</b> have their VVPAT slips cross-verified with EVM counts.<br><br>
<em>VVPAT was made mandatory in all Indian elections by the Supreme Court in 2013.</em>` },

  { keys: ['nota', 'none of the above', 'reject all', 'reject candidate'],
    answer: `<b>🚫 NOTA — None of the Above</b><br><br>
NOTA lets you officially reject all candidates. It was introduced in <b>2013</b> following a Supreme Court directive.<br><br>
<b>Key facts:</b><br>
• NOTA is the last option on the EVM ballot<br>
• It <em>does not</em> invalidate the election — the candidate with most votes still wins<br>
• However, a high NOTA count sends a strong signal of voter dissatisfaction<br>
• India was the <b>14th country</b> to introduce a "reject all" option<br><br>
<em>In some state elections, NOTA has received more votes than winning candidates' margins!</em>` },

  { keys: ['mcc', 'model code', 'code of conduct', 'campaign rules', 'election rules'],
    answer: `<b>📜 Model Code of Conduct (MCC)</b><br><br>
The MCC is a set of guidelines issued by ECI that kicks in <b>immediately</b> when elections are announced:<br><br>
<b>Key rules:</b><br>
• 🚫 No government ads (except disaster-related)<br>
• 🚫 No use of government vehicles/resources for campaigns<br>
• 🚫 No appeals based on religion, caste, or community<br>
• 🚫 No campaigning 48 hours before polling ("silence period")<br>
• 💰 Spending limits: ₹95 lakh for Lok Sabha candidates<br><br>
Citizens can report violations via the <b>cVIGIL app</b> — complaints are resolved within 100 minutes!` },

  { keys: ['delimitation', 'constituency', 'boundaries', 'electoral roll', 'voter list'],
    answer: `<b>🗺️ Delimitation & Electoral Rolls</b><br><br>
<b>Delimitation:</b> The process of redrawing constituency boundaries based on census data. The Delimitation Commission ensures roughly equal population per constituency.<br><br>
<b>Electoral Rolls:</b><br>
• Updated continuously by ECI<br>
• Special enrollment drives before elections<br>
• ~968 million voters registered (2024)<br>
• 543 Lok Sabha constituencies<br><br>
Check your name at <a href="https://nvsp.in" target="_blank" rel="noopener noreferrer">nvsp.in</a> or the Voter Helpline App.` },

  { keys: ['announcement', 'schedule', 'election date', 'when election', 'election announce'],
    answer: `<b>📢 Election Announcement</b><br><br>
The Chief Election Commissioner (CEC) announces the schedule in a press conference:<br><br>
• 📅 Dates for nominations, polling, and counting<br>
• 🔢 Number of phases (1 to 7 depending on region)<br>
• ⚖️ MCC comes into effect <b>immediately</b><br><br>
The announcement typically comes <b>~45 days</b> before polling begins. Multi-phase elections are staggered to allow security forces to be deployed across states.` },

  { keys: ['nomination', 'candidate', 'filing', 'contest', 'stand for election', 'security deposit'],
    answer: `<b>📝 Nomination of Candidates</b><br><br>
Anyone can contest if they meet these criteria:<br>
• 🇮🇳 Indian citizen<br>
• 🗳️ Registered voter<br>
• 📅 Age: 25+ for Lok Sabha, 30+ for Rajya Sabha<br>
• 💰 Security deposit: <b>₹25,000</b> (₹12,500 for SC/ST)<br><br>
<b>Process:</b><br>
1. File nomination papers with Returning Officer<br>
2. Papers are scrutinized for validity<br>
3. 2-day withdrawal window after scrutiny<br>
4. Final candidate list is published<br><br>
<em>Convicted persons and those with certain pending cases are barred.</em>` },

  { keys: ['campaign', 'rally', 'spending', 'election campaign', 'silence period'],
    answer: `<b>📣 Election Campaigning</b><br><br>
<b>Rules for campaigning:</b><br>
• 💰 Spending limit: <b>₹95 lakh</b> (Lok Sabha, most states)<br>
• ⏰ Must stop <b>48 hours</b> before polling day<br>
• 🚫 No paid news — it's an election offense<br>
• 📱 Social media campaigns also regulated<br>
• 📋 All expenses must be accounted for<br><br>
Candidates who exceed spending limits can be <b>disqualified</b>. The ECI deploys expenditure observers to monitor campaign spending.` },

  { keys: ['polling', 'voting day', 'poll day', 'how vote', 'ink', 'indelible'],
    answer: `<b>🗳️ Polling Day — Your Voting Guide</b><br><br>
<b>Step by step:</b><br>
1️⃣ Go to your assigned polling station (7 AM – 6 PM)<br>
2️⃣ Stand in queue, show your voter ID<br>
3️⃣ Get indelible ink on your left index finger<br>
4️⃣ Enter the voting compartment<br>
5️⃣ Press the button next to your candidate on the EVM<br>
6️⃣ Verify your vote on the VVPAT slip (7 seconds)<br>
7️⃣ Exit the booth<br><br>
<b>Accepted IDs:</b> Voter ID (EPIC), Aadhaar, Passport, Driving License, PAN card<br><br>
<em>Polling day is a paid holiday for all voters!</em>` },

  { keys: ['counting', 'result', 'who wins', 'winner', 'tally', 'votes counted'],
    answer: `<b>📊 Counting & Results</b><br><br>
• Counting begins at <b>8 AM</b> on the designated date<br>
• 📬 Postal ballots are counted first<br>
• EVMs are tallied <b>round by round</b><br>
• VVPAT slips of <b>5 random booths</b> per constituency are verified<br>
• Results are declared by the Returning Officer<br><br>
Track live results on <a href="https://results.eci.gov.in" target="_blank" rel="noopener noreferrer">results.eci.gov.in</a><br><br>
Counting typically takes <b>12-16 hours</b>. Any candidate can request a recount.` },

  { keys: ['government', 'formation', 'prime minister', 'oath', 'majority', '272', 'coalition'],
    answer: `<b>🏛️ Government Formation</b><br><br>
The party/coalition with <b>272+ seats</b> (majority in Lok Sabha of 543 seats) forms the government:<br><br>
1. President invites the majority leader<br>
2. PM is sworn in at <b>Rashtrapati Bhavan</b><br>
3. Council of Ministers is appointed<br>
4. First Lok Sabha session begins<br>
5. Speaker is elected<br>
6. Government presents its agenda<br><br>
If no single party gets 272, a <b>coalition</b> is formed. The PM must prove majority through a <b>floor test</b>.` },

  { keys: ['nri', 'overseas', 'abroad', 'foreign', 'non resident'],
    answer: `<b>🌍 NRI Voting</b><br><br>
Yes, NRIs <em>can</em> vote in Indian elections!<br><br>
• Register as an overseas elector using <b>Form 6A</b> on NVSP<br>
• Must vote <b>in person</b> at your registered constituency<br>
• Carry your passport as ID<br><br>
<em>Proxy voting for NRIs has been proposed but is not yet implemented. Remote e-voting for NRIs is being explored by ECI.</em>` },

  { keys: ['eci', 'election commission', 'who conducts', 'autonomous', 'independent'],
    answer: `<b>⚖️ Election Commission of India (ECI)</b><br><br>
ECI is an <b>autonomous constitutional body</b> (Article 324) responsible for:<br>
• Conducting free and fair elections<br>
• Preparing electoral rolls<br>
• Enforcing the Model Code of Conduct<br>
• Registering political parties<br>
• Monitoring election expenditure<br><br>
<b>Structure:</b><br>
• Chief Election Commissioner (CEC) + 2 Election Commissioners<br>
• Cannot be removed except by impeachment<br>
• Headquartered in New Delhi` },

  { keys: ['age', 'minimum', 'eligible', 'eligibility', 'who can vote', 'qualification'],
    answer: `<b>✅ Voting Eligibility</b><br><br>
To vote in India, you must:<br>
• Be an <b>Indian citizen</b><br>
• Be at least <b>18 years old</b> (on Jan 1 of the qualifying year)<br>
• Be a <b>registered voter</b> (have an EPIC / voter ID)<br>
• Not be disqualified by law (e.g., convicted of certain offenses)<br><br>
<em>The voting age was lowered from 21 to 18 by the <b>61st Constitutional Amendment (1988)</b>.</em>` },

  { keys: ['compulsory', 'mandatory', 'must vote', 'required to vote', 'penalty'],
    answer: `<b>🤔 Is Voting Compulsory?</b><br><br>
<b>No</b> — voting is a <b>right</b>, not a legal obligation at the national level.<br><br>
However:<br>
• Some states (like Gujarat) have provisions for compulsory voting in <b>local body elections</b><br>
• ECI actively promotes voter turnout through the <b>SVEEP</b> (Systematic Voters' Education and Electoral Participation) program<br>
• India's average voter turnout has been around <b>67%</b> in recent general elections` },

  { keys: ['party', 'political party', 'symbol', 'parties', 'national party', 'regional party'],
    answer: `<b>🏛️ Political Parties in India</b><br><br>
India has a <b>multi-party system</b>:<br><br>
<b>Types of parties:</b><br>
• <b>National parties</b> — recognized in 4+ states (e.g., BJP, INC, BSP, CPI(M))<br>
• <b>State/Regional parties</b> — recognized in specific states<br>
• <b>Registered unrecognized parties</b> — thousands exist<br><br>
Parties must register with ECI and follow election laws. Party symbols are allotted by ECI — national parties get "reserved" symbols.` },

  { keys: ['history', 'first election', 'how many elections', 'past elections'],
    answer: `<b>📚 History of Indian Elections</b><br><br>
• <b>1st General Election:</b> 1951-52 (173 million voters, 44.87% turnout)<br>
• India is the <b>world's largest democracy</b> with 968M+ voters<br>
• <b>18 General Elections</b> have been held (as of 2024)<br>
• Universal adult suffrage since <b>1950</b> (unique for a new democracy)<br>
• EVMs introduced in <b>1982</b> (pilot), nationwide since <b>2004</b><br><br>
<em>The 2024 general election was the largest democratic exercise in human history!</em>` },

  { keys: ['help', 'what can you', 'options', 'topics', 'menu'],
    answer: `<b>🤖 I can help you with:</b><br><br>
🗳️ <b>Voter Registration</b> — How to register, documents needed<br>
🖥️ <b>EVMs & VVPAT</b> — How voting machines work<br>
📋 <b>Election Process</b> — All 7 stages explained<br>
📜 <b>Model Code of Conduct</b> — Campaign rules<br>
🚫 <b>NOTA</b> — The "reject all" option<br>
⚖️ <b>ECI</b> — About the Election Commission<br>
📊 <b>Counting & Results</b> — How winners are decided<br>
🏛️ <b>Government Formation</b> — Coalitions, floor test<br>
🌍 <b>NRI Voting</b> — Overseas voter rights<br>
📚 <b>Election History</b> — Key facts and milestones<br><br>
<em>Just type your question or tap a quick reply!</em>` },
];

/**
 * Pre-computed lowercase keys for faster lookup.
 * Built once at module load time to avoid repeated toLowerCase() calls.
 * @type {Array<{ keys: string[], answer: string }>}
 */
const KB_INDEXED = KB.map((entry) => ({
  keys: entry.keys.map((k) => k.toLowerCase()),
  answer: entry.answer,
}));

/** Quick reply button suggestions */
const QUICK_REPLIES = [
  'How do I register?',
  'How does EVM work?',
  'What is NOTA?',
  'Explain VVPAT',
  'What is MCC?',
  'Who can vote?',
  'What can you help with?',
];

/** Maximum number of messages to keep in DOM for performance */
const MAX_MESSAGES = 50;

/** Client-side rate limiter — max 15 messages per minute */
const chatLimiter = createRateLimiter(15, 60000);

/**
 * Find the best matching answer from the knowledge base.
 * Uses keyword scoring — longer keyword matches score higher.
 *
 * @param {string} query - User's question text
 * @returns {string} HTML answer string
 */
function findAnswer(query) {
  const q = query.toLowerCase().trim();

  // Greeting detection
  if (/^(hi|hello|hey|namaste|namaskar)\b/.test(q)) {
    return `<b>🙏 Namaste!</b> I'm your Election Assistant. Ask me anything about the Indian election process — voter registration, EVMs, NOTA, or how the government is formed!<br><br><em>Tip: Try the quick reply buttons below for popular topics.</em>`;
  }

  // Thank you detection
  if (/^(thank|thanks|dhanyavaad)\b/.test(q)) {
    return `<b>😊 You're welcome!</b> Every informed voter strengthens our democracy. Feel free to ask more questions anytime!<br><br>🗳️ <em>Remember: Your vote is your voice!</em>`;
  }

  // Score-based keyword matching against pre-indexed KB
  let best = null;
  let bestScore = 0;

  for (const entry of KB_INDEXED) {
    let score = 0;
    for (const key of entry.keys) {
      if (q.includes(key)) score += key.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best) return best.answer;

  // Fallback response
  return `<b>🤔 Great question!</b><br><br>I'm specialized in Indian elections. I can answer questions about:<br>
• Voter registration & eligibility<br>
• EVMs, VVPAT, NOTA<br>
• Election process & stages<br>
• Model Code of Conduct<br>
• Government formation<br><br>
Try rephrasing or tap one of the quick reply buttons below!`;
}

/**
 * Initialize and mount the Chatbot widget into #chatbot-root.
 * Creates the floating toggle button, chat window with message list,
 * input field, and quick reply buttons.
 *
 * @returns {void}
 */
export function initChatbot() {
  const root = document.getElementById('chatbot-root');
  if (!root) return;

  root.innerHTML = `
    <button class="chatbot-toggle" id="chatbot-toggle-btn" aria-label="Open AI chat assistant" title="Ask about elections" type="button">
      <span class="chatbot-toggle-icon" aria-hidden="true">💬</span>
      <span class="chatbot-pulse" aria-hidden="true"></span>
    </button>
    <div class="chatbot-window" id="chatbot-window" role="dialog" aria-modal="false" aria-label="Election Assistant Chat">
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <span class="chatbot-header-icon" aria-hidden="true">🤖</span>
          <div>
            <h4>Election Assistant</h4>
            <span class="chatbot-header-status">Always online · No API key needed</span>
          </div>
        </div>
        <button class="chatbot-close" id="chatbot-close" aria-label="Close chat" type="button">✕</button>
      </div>
      <div class="chatbot-messages" id="chat-messages" aria-live="polite" aria-label="Chat messages">
        <div class="chat-message bot">
          <b>🙏 Namaste!</b> I'm your Election Assistant.<br><br>
          Ask me anything about the Indian election process — voter registration, EVMs, VVPAT, NOTA, or how the government is formed!<br><br>
          <em>💡 Tap a quick reply or type your question below.</em>
        </div>
      </div>
      <div class="chat-quick-replies" id="chat-quick-replies" role="group" aria-label="Quick reply suggestions">
        ${QUICK_REPLIES.map((q) => `<button class="quick-reply" data-question="${encodeHTML(q)}" type="button">${q}</button>`).join('')}
      </div>
      <div class="chatbot-input-area">
        <input type="text" class="chatbot-input" id="chat-input"
               placeholder="Ask about elections..." aria-label="Type your question"
               maxlength="500" autocomplete="off" />
        <button class="chatbot-send" id="chat-send" aria-label="Send message" type="button">➤</button>
      </div>
    </div>
  `;

  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const chatWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const messages = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  /** @type {number} Track total messages for DOM cleanup */
  let messageCount = 1; // Start at 1 for the welcome message

  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    toggleBtn.style.display = chatWindow.classList.contains('open') ? 'none' : 'flex';
    if (chatWindow.classList.contains('open')) {
      input.focus();
      trackChatEvent('open');
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
    toggleBtn.style.display = 'flex';
    trackChatEvent('close');
  });

  /**
   * Send a message and get a response.
   * Validates input, applies rate limiting, and displays the response.
   *
   * @param {string} text - Raw message text from user
   * @returns {Promise<void>}
   */
  async function sendMessage(text) {
    const clean = validateInput(text, 500);
    if (!clean) return;

    // Client-side rate limiting
    if (!chatLimiter.canProceed()) {
      addMessage('bot', '<b>⏳ Slow down!</b> Please wait a moment before sending more messages.');
      return;
    }

    addMessage('user', encodeHTML(clean));
    input.value = '';

    trackChatEvent('message', { query_length: clean.length });

    // Simulate typing delay for natural feel
    const typingEl = showTyping();
    const delay = 400 + Math.random() * 800;
    await new Promise((r) => setTimeout(r, delay));
    typingEl.remove();

    const reply = findAnswer(clean);
    addMessage('bot', reply);
  }

  /**
   * Add a message to the chat window.
   * Enforces maximum message count for DOM performance.
   *
   * @param {'user'|'bot'} type - Message sender type
   * @param {string} html - HTML content to display
   */
  function addMessage(type, html) {
    const div = document.createElement('div');
    div.className = `chat-message ${type}`;
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    messageCount++;

    // Remove oldest messages if exceeding limit (keep DOM lean)
    while (messageCount > MAX_MESSAGES) {
      const first = messages.querySelector('.chat-message');
      if (first) {
        first.remove();
        messageCount--;
      } else {
        break;
      }
    }

    if (type === 'bot') {
      announce('Assistant replied');
    }
  }

  /**
   * Show a typing indicator in the chat.
   *
   * @returns {HTMLElement} The typing indicator element (for removal)
   */
  function showTyping() {
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.setAttribute('role', 'status');
    div.setAttribute('aria-label', 'Assistant is typing');
    div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  // --- Event listeners ---
  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(input.value);
  });

  // Event delegation for quick replies
  document.getElementById('chat-quick-replies').addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-reply');
    if (btn) {
      trackChatEvent('quick_reply', { question: btn.dataset.question });
      sendMessage(btn.dataset.question);
    }
  });
}

// Export findAnswer for testing
export { findAnswer };
