import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const API_BASE = "https://greed-box-server.onrender.com/api";

const TRANSLATIONS = {
  ar: {
    brand: "طµظ†ط§ط¯ظٹظ‚ ط§ظ„ط·ظ…ط¹",
    dashboard: "ظ„ظˆط­ط© ط§ظ„طھط­ظƒظ…",
    users: "ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†",
    deposits: "ط·ظ„ط¨ط§طھ ط§ظ„ط´ط­ظ†",
    withdrawals: "ط·ظ„ط¨ط§طھ ط§ظ„ط³ط­ط¨",
    config: "ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ†ط¸ط§ظ…",
    tasks: "ط§ظ„ظ…ظ‡ط§ظ… ط§ظ„ظٹظˆظ…ظٹط©",
    pool: "ط³ط¬ظ„ ط§ظ„ط®ط²ظٹظ†ط©",
    simulation: "ظ…ط­ط§ظƒط§ط© ط§ظ„ظ†ط¸ط§ظ…",
    playGame: "طھط¬ط±ط¨ط© ط§ظ„ظ„ط¹ط¨ ظƒظ„ط§ط¹ط¨ ًںژ®",
    logout: "طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬",
    loginTitle: "طھط³ط¬ظٹظ„ ط¯ط®ظˆظ„ ط§ظ„ط¥ط¯ط§ط±ط©",
    email: "ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ",
    password: "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±",
    loginBtn: "ط¯ط®ظˆظ„ ط§ظ„ظ„ظˆط­ط©",
    socketStatus: "ط­ط§ظ„ط© ط§ظ„ط³ظٹط±ظپط±",
    connected: "ظ…طھطµظ„",
    disconnected: "ط؛ظٹط± ظ…طھطµظ„",
    activePlayers: "ط§ظ„ظ„ط§ط¹ط¨ظٹظ† ط§ظ„ظ†ط´ط·ظٹظ†",
    cashPool: "ط±طµظٹط¯ ط§ظ„ط®ط²ظٹظ†ط© ط§ظ„ظ…ط§ظ„ظٹ",
    todayRevenue: "ط£ط±ط¨ط§ط­ ط§ظ„ظٹظˆظ…",
    pendingRequests: "ط§ظ„ط·ظ„ط¨ط§طھ ط§ظ„ظ…ط¹ظ„ظ‚ط©",
    roundStatus: "ط­ط§ظ„ط© ط§ظ„ط¬ظˆظ„ط© ط§ظ„ط­ط§ظ„ظٹط©",
    roundId: "ط±ظ‚ظ… ط§ظ„ط¬ظˆظ„ط©",
    timeRemaining: "ط§ظ„ظˆظ‚طھ ط§ظ„ظ…طھط¨ظ‚ظٹ",
    currencyMode: "ظ†ظˆط¹ ط§ظ„ط¹ظ…ظ„ط©",
    sequence: "ط±ظ‚ظ… ط§ظ„طھط³ظ„ط³ظ„",
    overrideTip: "* ط§ط¶ط؛ط· ط¹ظ„ظ‰ ط£ظٹ طµظ†ط¯ظˆظ‚ ظ„طھط­ط¯ظٹط¯ ط§ظ„ظپط§ط¦ط² ظٹط¯ظˆظٹط§ظ‹ ظ„ظ„ط¬ظˆظ„ط© ط§ظ„ظ‚ط§ط¯ظ…ط© (ط®ط§طµ ط¨ط§ظ„ظ…ط¯ظٹط± ط§ظ„ط±ط¦ظٹط³ظٹ).",
    searchPlaceholder: "ط§ط¨ط­ط« ط¹ظ† ط¨ط±ظٹط¯طŒ ط§ط³ظ… ط£ظˆ ظ…ط¹ط±ظپ...",
    userId: "ظ…ط¹ط±ظپ ط§ظ„ظ…ط³طھط®ط¯ظ…",
    username: "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ…",
    role: "ط§ظ„طµظ„ط§ط­ظٹط©",
    freeCoins: "ط¹ظ…ظ„ط§طھ ظ…ط¬ط§ظ†ظٹط©",
    cashCoins: "ط¹ظ…ظ„ط§طھ ط´ط­ظ†",
    stats: "ط§ظ„ط¥ط­طµط§ط¦ظٹط§طھ (ط¬ظˆظ„ط§طھ / ظپظˆط²)",
    actions: "ط§ظ„ط¥ط¬ط±ط§ط،ط§طھ",
    editBalance: "طھط¹ط¯ظٹظ„ ط§ظ„ط±طµظٹط¯",
    amount: "ط§ظ„ظ…ط¨ظ„ط؛",
    status: "ط§ظ„ط­ط§ظ„ط©",
    refNo: "ط±ظ‚ظ… ط§ظ„ط¹ظ…ظ„ظٹط©",
    date: "ط§ظ„طھط§ط±ظٹط®",
    approve: "ظ‚ط¨ظˆظ„",
    reject: "ط±ظپط¶",
    rejectionReason: "ط³ط¨ط¨ ط§ظ„ط±ظپط¶",
    minBet: "ط£ظ‚ظ„ ط±ظ‡ط§ظ†",
    maxBet: "ط£ط¹ظ„ظ‰ ط±ظ‡ط§ظ†",
    betDuration: "ظ…ط¯ط© ط§ظ„ط±ظ‡ط§ظ† (ط«ط§ظ†ظٹط©)",
    calcDuration: "ظ…ط¯ط© ط§ظ„ط­ط³ط§ط¨ (ط«ط§ظ†ظٹط©)",
    revealDuration: "ظ…ط¯ط© ط§ظ„ط¹ط±ط¶ (ط«ط§ظ†ظٹط©)",
    historySize: "ط¹ط¯ط¯ ظ†طھط§ط¦ط¬ ط´ط±ظٹط· ط§ظ„ط¬ظˆظ„ط§طھ",
    toggles: "طھظپط¹ظٹظ„ ظˆطھط¹ط·ظٹظ„ ط§ظ„ط£ظ†ط¸ظ…ط©",
    freeEnabled: "ط¬ظˆظ„ط§طھ ط§ظ„ط¹ظ…ظ„ط§طھ ط§ظ„ظ…ط¬ط§ظ†ظٹط©",
    cashEnabled: "ط¬ظˆظ„ط§طھ ط¹ظ…ظ„ط§طھ ط§ظ„ط´ط­ظ†",
    maintenance: "ظˆط¶ط¹ ط§ظ„طµظٹط§ظ†ط©",
    normalOps: "ط¹ظ…ظ„ ط·ط¨ظٹط¹ظٹ",
    maintenanceActive: "ظˆط¶ط¹ ط§ظ„طµظٹط§ظ†ط© ظ†ط´ط·",
    maintMessage: "ط±ط³ط§ظ„ط© ط§ظ„طµظٹط§ظ†ط© ظ„ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†",
    saveConfig: "ط­ظپط¸ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ",
    addTask: "ط¥ط¶ط§ظپط© ظ…ظ‡ظ…ط© ط¬ط¯ظٹط¯ط©",
    taskKey: "ط±ظ…ط² ط§ظ„ظ…ظ‡ظ…ط© ط§ظ„ظپط±ظٹط¯",
    taskTitle: "ط¹ظ†ظˆط§ظ† ط§ظ„ظ…ظ‡ظ…ط©",
    taskDesc: "ط§ظ„ظˆطµظپ",
    taskGoal: "ط§ظ„ظ‡ط¯ظپ (ط¹ط¯ط¯ ط§ظ„ظ…ط±ط§طھ)",
    rewardAmount: "ظ…ط¨ظ„ط؛ ط§ظ„ط¬ط§ط¦ط²ط©",
    rewardCurrency: "ط¹ظ…ظ„ط© ط§ظ„ط¬ط§ط¦ط²ط©",
    simulationTitle: "طھط´ط؛ظٹظ„ ظ…ط­ط§ظƒط§ط© ط§ظ„ظ„ط¹ط¨ط©",
    simTip: "ظٹظ‚ظˆظ… ط¨طھط´ط؛ظٹظ„ ط¬ظˆظ„ط§طھ ظˆظ‡ظ…ظٹط© ظ…ط¹ ظ„ط§ط¹ط¨ظٹظ† ط¢ظ„ظٹظٹظ† (Bots) ظ„ط§ط®طھط¨ط§ط± ط§ط³طھظ‚ط±ط§ط± ط§ظ„طµظ†ط¯ظˆظ‚ ط§ظ„ط£ط³ظˆط¯.",
    roundsCount: "ط¹ط¯ط¯ ط§ظ„ط¬ظˆظ„ط§طھ",
    virtualPool: "ط§ظ„ط±طµظٹط¯ ط§ظ„ط§ظپطھط±ط§ط¶ظٹ ظ„ظ„ط®ط²ظٹظ†ط©",
    botsCount: "ط¹ط¯ط¯ ط§ظ„ط¨ظˆطھط§طھ ط§ظ„ظ…ط´ط§ط±ظƒط©",
    minBotBet: "ط£ظ‚ظ„ ط±ظ‡ط§ظ† ظ„ظ„ط¨ظˆطھ",
    maxBotBet: "ط£ط¹ظ„ظ‰ ط±ظ‡ط§ظ† ظ„ظ„ط¨ظˆطھ",
    startSim: "ط¨ط¯ط، ط§ظ„ظ…ط­ط§ظƒط§ط©",
    simRunning: "ط¬ط§ط±ظٹ طھط´ط؛ظٹظ„ ط®ظٹط· ظ…ط¹ط§ظ„ط¬ط© ط§ظ„ظ…ط­ط§ظƒط§ط©...",
    stabilityReport: "طھظ‚ط±ظٹط± ط§ط³طھظ‚ط±ط§ط± ط§ظ„ظ…ط­ط§ظƒط§ط©",
    simTip2: "ظ‚ظ… ط¨طھط´ط؛ظٹظ„ ط§ظ„ظ…ط­ط§ظƒط§ط© ظ„ط¥ظ†ط´ط§ط، طھظ‚ط§ط±ظٹط± ظˆظ…ط®ط·ط·ط§طھ ط§ظ„ط£ظ…ط§ظ†.",
    stabilityScore: "ظ…ط¤ط´ط± ط§ظ„ط§ط³طھظ‚ط±ط§ط±",
    initialPool: "ط§ظ„ط®ط²ظٹظ†ط© ط§ظ„ط£ظˆظ„ظٹط©",
    finalPool: "ط§ظ„ط®ط²ظٹظ†ط© ط§ظ„ظ†ظ‡ط§ط¦ظٹط©",
    netProfit: "طµط§ظپظٹ ط§ظ„ط£ط±ط¨ط§ط­/ط§ظ„ط®ط³ط§ط¦ط±",
    frequencies: "طھظˆط²ظٹط¹ ظپظˆط² ط§ظ„طµظ†ط§ط¯ظٹظ‚",
    cancel: "ط¥ظ„ط؛ط§ط،",
    forceOutcome: "ظپط±ط¶ ط§ظ„ظ†طھظٹط¬ط© ظٹط¯ظˆظٹط§ظ‹",
    reason: "ط§ظ„ط³ط¨ط¨ ط§ظ„ط¥ط¬ط¨ط§ط±ظٹ",
    save: "ط­ظپط¸ ط§ظ„طھط؛ظٹظٹط±ط§طھ",
    betPrompt: "ط­ط¯ط¯ ظ‚ظٹظ…ط© ط§ظ„ط±ظ‡ط§ظ†:",
    placeBetBtn: "طھط£ظƒظٹط¯ ط§ظ„ط±ظ‡ط§ظ†",
    betSuccess: "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط±ظ‡ط§ظ† ط¨ظ†ط¬ط§ط­!",
    recentResults: "ط´ط±ظٹط· ط¢ط®ط± ط§ظ„ط¬ظˆظ„ط§طھ:",
    myRoundsHistory: "ط³ط¬ظ„ ظ…ط±ط§ظ‡ظ†ط§طھظٹ ط§ظ„ط­ط§ظ„ظٹط©",
    betFree: "ط±ظ‡ط§ظ† ط¹ظ…ظ„ط© ظ…ط¬ط§ظ†ظٹط©",
    betCash: "ط±ظ‡ط§ظ† ط¹ظ…ظ„ط© ط´ط­ظ†"
  },
  en: {
    brand: "Greed Boxes",
    dashboard: "Dashboard",
    users: "Users CRUD",
    deposits: "Deposits Queue",
    withdrawals: "Withdrawals",
    config: "Configurations",
    tasks: "Daily Tasks",
    pool: "Pool Logs",
    simulation: "Simulation Engine",
    playGame: "Play / Test Game ًںژ®",
    logout: "Logout",
    loginTitle: "Admin Portal Login",
    email: "Email Address",
    password: "Password",
    loginBtn: "Login Dashboard",
    socketStatus: "Engine Socket",
    connected: "CONNECTED",
    disconnected: "DISCONNECTED",
    activePlayers: "Active Users",
    cashPool: "Cash Pool Reserve",
    todayRevenue: "Today's Revenue",
    pendingRequests: "Pending Requests",
    roundStatus: "Active Round Status",
    roundId: "Round ID",
    timeRemaining: "Time Remaining",
    currencyMode: "Currency Mode",
    sequence: "Seq Number",
    overrideTip: "* Click on a Box to trigger a SuperAdmin Manual Result Override for the next calculating phase.",
    searchPlaceholder: "Search email, name or ID...",
    userId: "User ID / Device",
    username: "Email / Username",
    role: "Role",
    freeCoins: "Free Coins",
    cashCoins: "Cash Coins",
    stats: "Stats (Rounds / Wins)",
    actions: "Actions",
    editBalance: "Edit Balance",
    amount: "Amount",
    status: "Status",
    refNo: "Transaction Ref",
    date: "Date",
    approve: "Approve",
    reject: "Reject",
    rejectionReason: "Rejection Reason",
    minBet: "Minimum Bet Amount",
    maxBet: "Maximum Bet Amount",
    betDuration: "Betting Period (Seconds)",
    calcDuration: "Calculating Period (Seconds)",
    revealDuration: "Reveal Period (Seconds)",
    historySize: "Outcome History Size",
    toggles: "Functional Toggles",
    freeEnabled: "Free Coins Rounds",
    cashEnabled: "Cash Coins Rounds",
    maintenance: "System Maintenance Toggle",
    normalOps: "Normal Operations",
    maintenanceActive: "Maintenance Mode Active",
    maintMessage: "Maintenance Display Message",
    saveConfig: "Save Configurations",
    addTask: "Add New Task",
    taskKey: "Task Key (Unique Name)",
    taskTitle: "Task Title",
    taskDesc: "Description",
    taskGoal: "Goal Count",
    rewardAmount: "Reward Amount",
    rewardCurrency: "Reward Currency",
    simulationTitle: "Launch Sandbox Simulation",
    simTip: "Runs virtual bets on a isolated CPU worker thread to check engine risk thresholds.",
    roundsCount: "Rounds Count",
    virtualPool: "Starting Virtual Pool Balance",
    botsCount: "Average Bot Count",
    minBotBet: "Min Bot Bet",
    maxBotBet: "Max Bot Bet",
    startSim: "Start Simulation",
    simRunning: "Thread running. Creating risk logs...",
    stabilityReport: "Simulation Stability Report",
    simTip2: "Start simulation to build stability report charts.",
    stabilityScore: "Stability Index",
    initialPool: "Initial Pool",
    finalPool: "Final Pool",
    netProfit: "Net Profit/Loss",
    frequencies: "Winner Box Frequencies",
    cancel: "Cancel",
    forceOutcome: "Force Outcome",
    reason: "Reason",
    save: "Save Changes",
    betPrompt: "Enter bet value:",
    placeBetBtn: "Place Bet",
    betSuccess: "Bet placed successfully!",
    recentResults: "Last Rounds Outcomes:",
    myRoundsHistory: "My Active Bets",
    betFree: "Bet Free Coins",
    betCash: "Bet Cash Coins"
  }
};

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem("admin_lang") || "ar");
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("admin_user") || "null"));
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Auth Form (Default credentials loaded, option to remember)
  const [email, setEmail] = useState(localStorage.getItem("remembered_admin_email") || "admin@greedboxes.com");
  const [password, setPassword] = useState(localStorage.getItem("remembered_admin_password") || "adminpassword");
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("remember_admin") === "true");
  const [authError, setAuthError] = useState("");

  // Live Stats & Sockets state
  const [stats, setStats] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [liveRound, setLiveRound] = useState(null);
  const [liveBets, setLiveBets] = useState({ totalFree: 0, totalCash: 0, boxBets: {} });
  const socketRef = useRef(null);

  // App Lists
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [config, setConfig] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [poolLogs, setPoolLogs] = useState([]);

  // Modals & Action forms
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideBox, setOverrideBox] = useState(0);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideError, setOverrideError] = useState("");

  // Users Management State
  const [showUserMgmtModal, setShowUserMgmtModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userMgmtTab, setUserMgmtTab] = useState("info"); // info, coins, ban, logs
  const [usersTab, setUsersTab] = useState("registered"); // registered, guests
  const [openActionMenu, setOpenActionMenu] = useState(null);

  // Coin adjustment
  const [adjustOp, setAdjustOp] = useState("ADD");
  const [adjustType, setAdjustType] = useState("FREE");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  // Edit fields
  const [editNickname, setEditNickname] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editPublicId, setEditPublicId] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCountryCode, setEditCountryCode] = useState("+964");
  const [removeAvatar, setRemoveAvatar] = useState(false);

  // Ban state
  const [banDays, setBanDays] = useState("");
  const [banReason, setBanReason] = useState("");
  const [editBanDays, setEditBanDays] = useState("");
  const [editBanReason, setEditBanReason] = useState("");
  const [editIsBanned, setEditIsBanned] = useState(false);

  // Logs
  const [userLogs, setUserLogs] = useState({ activityLogs: [], adminActions: [] });
  const [logsLoading, setLogsLoading] = useState(false);

  // Delete confirmation
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(0);
  const [deleteTextVal, setDeleteTextVal] = useState("");

  // Pagination
  const [usersPage, setUsersPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(25);

  // Filters
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterSort, setFilterSort] = useState("newest");

  // Legacy modals (deposits/withdrawals)
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectType, setRejectType] = useState("");
  const [rejectId, setRejectId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Create Task Form
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskKey, setTaskKey] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskGoal, setTaskGoal] = useState("");
  const [taskReward, setTaskReward] = useState("");
  const [taskCurrency, setTaskCurrency] = useState("FREE");

  // Simulation Form
  const [simRounds, setSimRounds] = useState(50);
  const [simPool, setSimPool] = useState(100000);
  const [simBots, setSimBots] = useState(10);
  const [simMin, setSimMin] = useState(10);
  const [simMax, setSimMax] = useState(100);
  const [simCurrency, setSimCurrency] = useState("CASH");
  const [simReport, setSimReport] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Search filter
  const [searchUser, setSearchUser] = useState("");

  // Player gameplay simulator state
  const [playAmount, setPlayAmount] = useState(100);
  const [myWallet, setMyWallet] = useState({ free: 0, cash: 0 });
  const [myBets, setMyBets] = useState([]);
  const [recentOutcomes, setRecentOutcomes] = useState([]);

  const t = TRANSLATIONS[lang];

  const handleLanguageToggle = () => {
    const nextLang = lang === "ar" ? "en" : "ar";
    setLang(nextLang);
    localStorage.setItem("admin_lang", nextLang);
  };

  const fetchMyWallet = async () => {
    try {
      const data = await apiCall("/player/profile");
      setMyWallet({
        free: data.profile.wallet.freeBalance,
        cash: data.profile.wallet.cashBalance
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchConfig();
    fetchStats();
    fetchMyWallet();

    socketRef.current = io("https://greed-box-server.onrender.com", {
      auth: { token }
    });

    socketRef.current.on("connect", () => {
      setSocketConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setSocketConnected(false);
    });

    socketRef.current.on("round_state_change", (data) => {
      setLiveRound(data);
      if (data.status === "BETTING") {
        setLiveBets({ totalFree: 0, totalCash: 0, boxBets: {} });
        setMyBets([]);
      }
    });

    socketRef.current.on("timer_tick", (data) => {
      setLiveRound(prev => prev ? { ...prev, remainingMs: data.remainingMs } : null);
    });

    socketRef.current.on("bets_update", (data) => {
      setLiveBets(data);
    });

    socketRef.current.on("round_reveal", (data) => {
      // Append outcome to horizontal list
      const multiplierStr = data.winningBox <= 3 ? "5x" : (data.winningBox === 4 ? "10x" : (data.winningBox === 5 ? "15x" : (data.winningBox === 6 ? "25x" : "45x")));
      setRecentOutcomes(prev => [multiplierStr, ...prev].slice(0, 20));
      
      // Refresh wallets after payout completes
      setTimeout(() => {
        fetchStats();
        fetchMyWallet();
      }, 2000);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (activeTab === "users") fetchUsers();
    if (activeTab === "deposits") fetchDeposits();
    if (activeTab === "withdrawals") fetchWithdrawals();
    if (activeTab === "config") fetchConfig();
    if (activeTab === "tasks") fetchTasks();
    if (activeTab === "pool") fetchPoolLogs();
  }, [activeTab, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Login failed");
      if (data.user.role !== "ADMIN" && data.user.role !== "SUPERADMIN") {
        throw new Error("Access denied.");
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      
      if (rememberMe) {
        localStorage.setItem("remembered_admin_email", email);
        localStorage.setItem("remembered_admin_password", password);
        localStorage.setItem("remember_admin", "true");
      } else {
        localStorage.removeItem("remembered_admin_email");
        localStorage.removeItem("remembered_admin_password");
        localStorage.removeItem("remember_admin");
      }

      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken("");
    setUser(null);
  };

  const apiCall = async (endpoint, method = "GET", body = null) => {
    const headers = { "Authorization": `Bearer ${token}` };
    if (body) headers["Content-Type"] = "application/json";

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API error");
    return data;
  };

  const fetchStats = () => apiCall("/admin/stats").then(setStats).catch(console.error);
  const fetchUsers = () => apiCall("/admin/users").then(d => setUsers(d.users)).catch(console.error);
  const fetchDeposits = () => apiCall("/admin/deposits").then(d => setDeposits(d.deposits)).catch(console.error);
  const fetchWithdrawals = () => apiCall("/admin/withdrawals").then(d => setWithdrawals(d.withdrawals)).catch(console.error);
  const fetchConfig = () => apiCall("/admin/config").then(d => setConfig(d.config)).catch(console.error);
  const fetchTasks = () => apiCall("/admin/tasks").then(d => setTasks(d.tasks)).catch(console.error);
  const fetchPoolLogs = () => apiCall("/admin/pool/logs").then(d => setPoolLogs(d.logs)).catch(console.error);

  const handleOverride = async () => {
    setOverrideError("");
    try {
      await apiCall("/admin/override", "POST", { boxIndex: overrideBox, reason: overrideReason });
      setShowOverrideModal(false);
      setOverrideReason("");
      alert("Manual override set.");
    } catch (err) {
      setOverrideError(err.message);
    }
  };

  // Place bet over socket (simulate a real player)
  const placeLiveBet = (boxIndex) => {
    if (!socketRef.current || !socketConnected) {
      alert("WebSocket disconnected.");
      return;
    }

    const clientBetId = Math.random().toString(36).substring(7);
    
    socketRef.current.emit("place_bet", {
      boxIndex,
      amount: parseFloat(playAmount),
      clientBetId
    }, (response) => {
      if (response.error) {
        alert(`Error placing bet: ${response.error}`);
      } else {
        setMyBets(prev => [...prev, response.bet]);
        fetchMyWallet();
      }
    });
  };

  const handleAdjustBalance = async () => {
    if (!adjustAmount || parseFloat(adjustAmount) <= 0) {
      alert("ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ظ…ط¨ظ„ط؛ طµط­ظٹط­."); return;
    }
    if (!adjustReason) {
      alert("ظٹط±ط¬ظ‰ طھط­ط¯ظٹط¯ ط³ط¨ط¨ ط§ظ„ط¹ظ…ظ„ظٹط©."); return;
    }
    const amount = parseFloat(adjustAmount);
    const delta = adjustOp === "ADD" ? amount : -amount;
    try {
      const res = await apiCall(`/admin/users/${selectedUser.id}/balance`, "PUT", {
        freeDelta: adjustType === "FREE" ? delta : undefined,
        cashDelta: adjustType === "CASH" ? delta : undefined,
        reason: adjustReason
      });
      setSelectedUser(prev => ({ ...prev, wallet: res.wallet }));
      setAdjustAmount(""); setAdjustReason("");
      fetchUsers();
      alert("طھظ…طھ ط¥ط¯ط§ط±ط© ط§ظ„ط¹ظ…ظ„ط§طھ ط¨ظ†ط¬ط§ط­!");
    } catch (err) { alert(err.message); }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const updated = await apiCall(`/admin/users/${selectedUser.id}`, "PUT", {
        displayNickname: editNickname || undefined,
        age: editAge ? parseInt(editAge) : undefined,
        gender: editGender || undefined,
        password: editPassword || undefined,
        publicId: editPublicId || undefined,
        phoneNumber: editPhone || undefined,
        countryCode: editCountryCode || undefined,
        removeAvatar
      });
      setSelectedUser(updated.user);
      fetchUsers();
      alert("طھظ… طھط­ط¯ظٹط« ط¨ظٹط§ظ†ط§طھ ط§ظ„ط­ط³ط§ط¨ ط¨ظ†ط¬ط§ط­!");
    } catch (err) { alert(err.message); }
  };

  const handleBanUser = async (days, reason) => {
    try {
      await apiCall(`/admin/users/${selectedUser.id}`, "PUT", {
        isBanned: true,
        banDays: days || undefined,
        banReason: reason || "ط­ط¸ط± ط¥ط¯ط§ط±ظٹ"
      });
      fetchUsers();
      const updated = await apiCall(`/admin/users`);
      const freshUser = updated.users.find(u => u.id === selectedUser.id);
      if (freshUser) setSelectedUser(freshUser);
      alert(days ? `طھظ… ط­ط¸ط± ط§ظ„ظ…ط³طھط®ط¯ظ… ظ„ظ…ط¯ط© ${days} ظٹظˆظ….` : "طھظ… ط§ظ„ط­ط¸ط± ط§ظ„ظ†ظ‡ط§ط¦ظٹ.");
    } catch (err) { alert(err.message); }
  };

  const handleUnbanUser = async () => {
    try {
      await apiCall(`/admin/users/${selectedUser.id}`, "PUT", { isBanned: false });
      fetchUsers();
      const updated = await apiCall(`/admin/users`);
      const freshUser = updated.users.find(u => u.id === selectedUser.id);
      if (freshUser) setSelectedUser(freshUser);
      alert("طھظ… ظپظƒ ط§ظ„ط­ط¸ط± ط¨ظ†ط¬ط§ط­!");
    } catch (err) { alert(err.message); }
  };

  const handleBanDevice = async () => {
    if (!confirm("ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط¸ط± ط¬ظ‡ط§ط² ظ‡ط°ط§ ط§ظ„ط­ط³ط§ط¨ ظ†ظ‡ط§ط¦ظٹط§ظ‹طں")) return;
    const reason = prompt("ط£ط¯ط®ظ„ ط³ط¨ط¨ ط­ط¸ط± ط§ظ„ط¬ظ‡ط§ط²:") || "ظ…ط®ط§ظ„ظپط© ط§ظ„ط´ط±ظˆط· ط§ظ„ط¹ط§ظ…ط©";
    try {
      await apiCall(`/admin/users/${selectedUser.id}/ban-device`, "POST", { reason });
      setShowUserMgmtModal(false);
      fetchUsers();
      alert("طھظ… ط­ط¸ط± ط§ظ„ط¬ظ‡ط§ط² ظˆط§ظ„ط­ط³ط§ط¨ ظ†ظ‡ط§ط¦ظٹط§ظ‹ ط¨ظ†ط¬ط§ط­!");
    } catch (err) { alert(err.message); }
  };

  const openUserMgmt = async (u) => {
    setSelectedUser(u);
    setUserMgmtTab("info");
    setUserLogs({ activityLogs: [], adminActions: [] });
    setDeleteConfirmStep(0);
    setDeleteTextVal("");
    setEditNickname(u.displayNickname || "");
    setEditAge(u.age?.toString() || "");
    setEditGender(u.gender || "MALE");
    setEditPublicId(u.publicId || "");
    setEditPhone(u.phoneNumber || "");
    setEditCountryCode(u.countryCode || "+964");
    setEditPassword("");
    setRemoveAvatar(false);
    setAdjustAmount("");
    setAdjustReason("");
    setBanDays("");
    setBanReason("");
    setShowUserMgmtModal(true);
    setLogsLoading(true);
    try {
      const logs = await apiCall(`/admin/users/${u.id}/logs`);
      setUserLogs(logs);
    } catch (err) { console.error(err); }
    finally { setLogsLoading(false); }
  };

  const handleDeleteUser = async () => {
    if (deleteConfirmStep === 0) { setDeleteConfirmStep(1); return; }
    if (deleteConfirmStep === 1) { setDeleteConfirmStep(2); setDeleteTextVal(""); return; }
    if (deleteConfirmStep === 2) {
      if (deleteTextVal !== "DELETE") { alert("ظٹط±ط¬ظ‰ ظƒطھط§ط¨ط© ظƒظ„ظ…ط© DELETE ط¨ط¯ظ‚ط© ظ„ظ„طھط£ظƒظٹط¯."); return; }
      try {
        await apiCall(`/admin/users/${selectedUser.id}`, "DELETE");
        setShowUserMgmtModal(false);
        setDeleteConfirmStep(0);
        setDeleteTextVal("");
        fetchUsers();
        alert("طھظ… ط­ط°ظپ ط§ظ„ظ…ط³طھط®ط¯ظ… ظˆظƒط§ظپط© ط§ظ„ط³ط¬ظ„ط§طھ ط§ظ„ظ…ط±طھط¨ط·ط© ط¨ظ‡ ظ†ظ‡ط§ط¦ظٹط§ظ‹!");
      } catch (err) { alert(err.message); }
    }
  };


  const handleApproveDeposit = async (id) => {
    if (!confirm("Approve?")) return;
    try {
      const ref = prompt("Enter reference:") || "";
      await apiCall(`/admin/deposits/${id}/approve`, "POST", { transactionRef: ref });
      fetchDeposits();
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const openRejectModal = (type, id) => {
    setRejectType(type);
    setRejectId(id);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleRejectRequest = async () => {
    try {
      if (rejectType === "deposit") {
        await apiCall(`/admin/deposits/${rejectId}/reject`, "POST", { rejectionReason });
        fetchDeposits();
      } else {
        await apiCall(`/admin/withdrawals/${rejectId}/reject`, "POST", { rejectionReason });
        fetchWithdrawals();
      }
      setShowRejectModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApproveWithdrawal = async (id) => {
    if (!confirm("Approve payment?")) return;
    try {
      const ref = prompt("Enter reference:") || "";
      await apiCall(`/admin/withdrawals/${id}/approve`, "POST", { transactionRef: ref });
      fetchWithdrawals();
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      await apiCall("/admin/config", "PUT", config);
      alert("Saved.");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await apiCall("/admin/tasks", "POST", {
        key: taskKey,
        title: taskTitle,
        description: taskDesc,
        goalCount: parseInt(taskGoal),
        rewardAmount: parseFloat(taskReward),
        rewardCurrency: taskCurrency
      });
      setShowTaskModal(false);
      setTaskKey("");
      setTaskTitle("");
      setTaskDesc("");
      setTaskGoal("");
      setTaskReward("");
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      await apiCall(`/admin/tasks/${task.id}`, "PUT", { isEnabled: !task.isEnabled });
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    setSimLoading(true);
    setSimReport(null);
    try {
      const data = await apiCall("/admin/simulation", "POST", {
        numRounds: parseInt(simRounds),
        initialPool: parseFloat(simPool),
        botCount: parseInt(simBots),
        betMin: parseFloat(simMin),
        betMax: parseFloat(simMax),
        currencyMode: simCurrency
      });
      setSimReport(data.report);
    } catch (err) {
      alert(err.message);
    } finally {
      setSimLoading(false);
    }
  };

  const getRemainingSecondsStr = () => {
    if (!liveRound?.remainingMs) return "0s";
    return `${Math.ceil(liveRound.remainingMs / 1000)}s`;
  };

  const filteredUsers = users.filter(u => {
    const searchVal = searchUser.toLowerCase();
    const matchesSearch = 
      !searchUser ||
      u.email?.toLowerCase().includes(searchVal) ||
      u.username?.toLowerCase().includes(searchVal) ||
      u.publicId?.toLowerCase().includes(searchVal) ||
      u.displayNickname?.toLowerCase().includes(searchVal) ||
      u.id.includes(searchUser) ||
      u.deviceId?.toLowerCase().includes(searchVal);

    const matchesRole = filterRole === "ALL" || u.role === filterRole;

    let matchesStatus = true;
    if (filterStatus === "BANNED_TEMP") {
      matchesStatus = u.isBanned && u.banExpiresAt !== null;
    } else if (filterStatus === "BANNED_PERM") {
      matchesStatus = u.isBanned && u.banExpiresAt === null;
    } else if (filterStatus === "ACTIVE") {
      matchesStatus = !u.isBanned;
    } else if (filterStatus === "GUEST") {
      matchesStatus = u.role === "GUEST";
    }

    let matchesDate = true;
    if (filterRegDate) {
      const regDate = new Date(u.createdAt).toDateString();
      const filterDate = new Date(filterRegDate).toDateString();
      matchesDate = regDate === filterDate;
    }

    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  const direction = lang === "ar" ? "rtl" : "ltr";

  if (!token) {
    return (
      <div className="auth-container" dir={direction}>
        <form onSubmit={handleLogin} className="glass-card auth-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2>{t.brand}</h2>
            <button type="button" className="btn" style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }} onClick={handleLanguageToggle}>
              {lang === "ar" ? "English" : "ط§ظ„ط¹ط±ط¨ظٹط©"}
            </button>
          </div>
          {authError && <div style={{ color: "var(--accent-neon-red)", marginBottom: "1rem" }}>{authError}</div>}
          <div className="form-group">
            <label>{t.email}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{t.password}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", marginBottom: "0.5rem" }}>
            <input 
              type="checkbox" 
              id="rememberMe" 
              checked={rememberMe} 
              onChange={e => setRememberMe(e.target.checked)} 
              style={{ cursor: "pointer", width: "16px", height: "16px" }}
            />
            <label htmlFor="rememberMe" style={{ cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {lang === "ar" ? "طھط°ظƒط±ظ†ظٹ ظپظٹ ظ‡ط°ط§ ط§ظ„ظ…طھطµظپط­" : "Remember Me"}
            </label>
          </div>

          <div style={{ padding: "0.75rem", background: "rgba(255,255,255,0.05)", borderRadius: "6px", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1rem", border: "1px solid rgba(255,255,255,0.1)" }}>
            <strong>ًں”‘ {lang === "ar" ? "ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¯ط®ظˆظ„ ط§ظ„ط§ظپطھط±ط§ط¶ظٹط© ظ„ظ„ظˆط­ط©:" : "Default Admin Credentials:"}</strong>
            <div style={{ marginTop: "0.25rem" }}>Email: <code>admin@greedboxes.com</code></div>
            <div>Password: <code>adminpassword</code></div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>{t.loginBtn}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-app" dir={direction} style={{ paddingLeft: lang === "en" ? "260px" : "0", paddingRight: lang === "ar" ? "260px" : "0" }}>
      {/* Sidebar Nav */}
      <div className="sidebar" style={{ left: lang === "en" ? "0" : "auto", right: lang === "ar" ? "0" : "auto", borderRight: lang === "en" ? "1px solid var(--glass-border)" : "none", borderLeft: lang === "ar" ? "1px solid var(--glass-border)" : "none" }}>
        <div className="brand" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>{t.brand}</h1>
          <button type="button" className="btn" style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }} onClick={handleLanguageToggle}>
            {lang === "ar" ? "EN" : "AR"}
          </button>
        </div>
        <ul className="nav-links">
          <li className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>{t.dashboard}</li>
          <li className={`nav-item ${activeTab === "play" ? "active" : ""}`} onClick={() => { setActiveTab("play"); fetchMyWallet(); }}>{t.playGame}</li>
          <li className={`nav-item ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>{t.users}</li>
          <li className={`nav-item ${activeTab === "deposits" ? "active" : ""}`} onClick={() => setActiveTab("deposits")}>{t.deposits}</li>
          <li className={`nav-item ${activeTab === "withdrawals" ? "active" : ""}`} onClick={() => setActiveTab("withdrawals")}>{t.withdrawals}</li>
          <li className={`nav-item ${activeTab === "config" ? "active" : ""}`} onClick={() => setActiveTab("config")}>{t.config}</li>
          <li className={`nav-item ${activeTab === "tasks" ? "active" : ""}`} onClick={() => setActiveTab("tasks")}>{t.tasks}</li>
          <li className={`nav-item ${activeTab === "pool" ? "active" : ""}`} onClick={() => setActiveTab("pool")}>{t.pool}</li>
          <li className={`nav-item ${activeTab === "simulation" ? "active" : ""}`} onClick={() => setActiveTab("simulation")}>{t.simulation}</li>
          <li className="nav-item logout-btn" onClick={handleLogout}>{t.logout}</li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {activeTab === "dashboard" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2>{t.dashboard}</h2>
              <span className={`badge ${socketConnected ? "revealing" : "locked"}`}>
                {t.socketStatus}: {socketConnected ? t.connected : t.disconnected}
              </span>
            </div>

            <div className="stats-grid">
              <div className="glass-card stat-card blue">
                <span className="stat-label">{t.activePlayers}</span>
                <span className="stat-value">{stats?.counts.users || 0}</span>
              </div>
              <div className="glass-card stat-card gold">
                <span className="stat-label">{t.cashPool}</span>
                <span className="stat-value">{stats?.pools.cash.toFixed(2) || "0.00"}</span>
              </div>
              <div className="glass-card stat-card green">
                <span className="stat-label">{t.todayRevenue}</span>
                <span className="stat-value">{stats?.revenue.todayCash.toFixed(2) || "0.00"}</span>
              </div>
              <div className="glass-card stat-card red">
                <span className="stat-label">{t.pendingRequests}</span>
                <span className="stat-value">
                  {stats?.counts.pendingDeposits || 0} / {stats?.counts.pendingWithdrawals || 0}
                </span>
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>{t.roundStatus}</h3>
                <span className={`badge ${(liveRound?.status || "ended").toLowerCase()}`}>
                  {liveRound?.status || "ENDED"}
                </span>
              </div>
              
              <div style={{ marginTop: "1rem", display: "flex", gap: "2.5rem" }}>
                <div>
                  <span className="stat-label">{t.roundId}</span>
                  <p style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "var(--accent-gold)" }}>
                    {liveRound?.roundId || "..."}
                  </p>
                </div>
                <div>
                  <span className="stat-label">{t.timeRemaining}</span>
                  <p style={{ fontSize: "1.25rem", fontWeight: "700" }}>{getRemainingSecondsStr()}</p>
                </div>
                <div>
                  <span className="stat-label">{t.currencyMode}</span>
                  <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>{liveRound?.currencyMode || "N/A"}</p>
                </div>
                <div>
                  <span className="stat-label">{t.sequence}</span>
                  <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>#{liveRound?.sequenceNumber || 0}</p>
                </div>
              </div>

              <div className="boxes-container">
                {[0,1,2,3,4,5,6,7].map(boxIndex => {
                  const mult = boxIndex <= 3 ? "5x" : (boxIndex === 4 ? "10x" : (boxIndex === 5 ? "15x" : (boxIndex === 6 ? "25x" : "45x")));
                  const poolType = liveRound?.currencyMode === "FREE_ONLY" ? "free" : "cash";
                  const betsTotal = liveBets.boxBets[boxIndex]?.[poolType] || 0;
                  
                  return (
                    <div key={boxIndex} className="box-card" onClick={() => {
                      setOverrideBox(boxIndex);
                      setShowOverrideModal(true);
                    }}>
                      <span className="box-multiplier">{mult}</span>
                      <h3>Box {boxIndex}</h3>
                      <div className="box-bets-value">{betsTotal.toFixed(1)} {liveRound?.currencyMode === "FREE_ONLY" ? "FREE" : "CASH"}</div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "1rem", textAlign: "center" }}>
                {t.overrideTip}
              </p>
            </div>
          </div>
        )}

        {/* Playable simulator for game testing */}
        {activeTab === "play" && (
          <div>
            <h2>{t.playGame}</h2>
            <div className="stats-grid" style={{ margin: "1.5rem 0" }}>
              <div className="glass-card stat-card gold">
                <span className="stat-label">{t.freeCoins}</span>
                <span className="stat-value">{myWallet.free.toFixed(1)}</span>
              </div>
              <div className="glass-card stat-card green">
                <span className="stat-label">{t.cashCoins}</span>
                <span className="stat-value">{myWallet.cash.toFixed(2)}</span>
              </div>
              <div className="glass-card stat-card blue">
                <span className="stat-label">{t.roundStatus}</span>
                <span className="stat-value" style={{ fontSize: "1.35rem" }}>
                  {liveRound?.status || "ENDED"} ({getRemainingSecondsStr()})
                </span>
              </div>
            </div>

            {/* Past outcomes timeline */}
            <div className="glass-card">
              <span className="stat-label">{t.recentResults}</span>
              <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", padding: "0.5rem 0", marginTop: "0.5rem" }}>
                {recentOutcomes.map((out, idx) => (
                  <span key={idx} className="badge ended" style={{ fontSize: "0.85rem", minWidth: "50px", textAlign: "center" }}>{out}</span>
                ))}
                {recentOutcomes.length === 0 && <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No rounds played yet.</span>}
              </div>
            </div>

            {/* Input betting amount and place bets */}
            <div className="glass-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3>{t.betPrompt}</h3>
                <input 
                  type="number" 
                  value={playAmount} 
                  onChange={e => setPlayAmount(e.target.value)} 
                  style={{ width: "150px", fontSize: "1.1rem", fontWeight: "700" }} 
                />
              </div>

              <div className="boxes-container">
                {[0,1,2,3,4,5,6,7].map(boxIndex => {
                  const mult = boxIndex <= 3 ? "5x" : (boxIndex === 4 ? "10x" : (boxIndex === 5 ? "15x" : (boxIndex === 6 ? "25x" : "45x")));
                  const isPlaced = myBets.find(b => b.boxIndex === boxIndex);
                  
                  return (
                    <div key={boxIndex} className={`box-card ${isPlaced ? "active" : ""}`} onClick={() => placeLiveBet(boxIndex)}>
                      <span className="box-multiplier">{mult}</span>
                      <h3>Box {boxIndex}</h3>
                      <button className="btn btn-primary" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", width: "100%", marginTop: "0.5rem" }}>
                        {isPlaced ? `${isPlaced.amount} PLEDGED` : t.placeBetBtn}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active player wagers details */}
            <div className="glass-card">
              <h3>{t.myRoundsHistory}</h3>
              <div className="table-container" style={{ marginTop: "0.5rem" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Box</th>
                      <th>{t.amount}</th>
                      <th>{t.currencyMode}</th>
                      <th>{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBets.map((b, idx) => (
                      <tr key={idx}>
                        <td>Box {b.boxIndex}</td>
                        <td>{b.amount}</td>
                        <td>{b.currency}</td>
                        <td><span className="badge betting">PENDING</span></td>
                      </tr>
                    ))}
                    {myBets.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", color: "var(--text-muted)" }}>Place bets above to participate in the live round.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Management Panel */}
        {activeTab === "users" && (() => {
          const registeredUsers = users.filter(u => u.role !== "GUEST");
          const guestUsers = users.filter(u => u.role === "GUEST");
          const sourceUsers = usersTab === "registered" ? registeredUsers : guestUsers;

          const searchVal = searchUser.toLowerCase();
          let filtered = sourceUsers.filter(u => {
            if (!searchUser) return true;
            return (
              u.publicId?.toLowerCase().includes(searchVal) ||
              (u.displayNickname || u.username || "").toLowerCase().includes(searchVal) ||
              u.email?.toLowerCase().includes(searchVal) ||
              u.phoneNumber?.includes(searchVal) ||
              u.username?.toLowerCase().includes(searchVal)
            );
          });

          if (filterStatus === "ACTIVE") filtered = filtered.filter(u => !u.isBanned);
          else if (filterStatus === "BANNED_TEMP") filtered = filtered.filter(u => u.isBanned && u.banExpiresAt);
          else if (filterStatus === "BANNED_PERM") filtered = filtered.filter(u => u.isBanned && !u.banExpiresAt);

          if (filterSort === "most_diamonds") filtered = [...filtered].sort((a,b) => (b.wallet?.freeBalance||0) - (a.wallet?.freeBalance||0));
          else if (filterSort === "most_coins") filtered = [...filtered].sort((a,b) => (b.wallet?.cashBalance||0) - (a.wallet?.cashBalance||0));

          const totalPages = Math.ceil(filtered.length / usersPerPage);
          const paged = filtered.slice((usersPage - 1) * usersPerPage, usersPage * usersPerPage);

          const bannedCount = users.filter(u => u.isBanned && !u.banExpiresAt).length;
          const tempBannedCount = users.filter(u => u.isBanned && u.banExpiresAt).length;
          const activeCount = users.filter(u => !u.isBanned).length;
          const totalDiamonds = users.reduce((s, u) => s + (u.wallet?.freeBalance || 0), 0);
          const totalCoins = users.reduce((s, u) => s + (u.wallet?.cashBalance || 0), 0);

          return (
          <div>
            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†", value: users.length, color: "#a855f7" },
                { label: "ظ…ط³ط¬ظ„ظˆظ†", value: registeredUsers.length, color: "#3b82f6" },
                { label: "ط²ظˆط§ط±", value: guestUsers.length, color: "#6b7280" },
                { label: "ظ†ط´ط·ظˆظ†", value: activeCount, color: "#22c55e" },
                { label: "ظ…ظˆظ‚ظˆظپ ظ…ط¤ظ‚طھط§ظ‹", value: tempBannedCount, color: "#f59e0b" },
                { label: "ظ…ط­ط¸ظˆط± ظ†ظ‡ط§ط¦ظٹط§ظ‹", value: bannedCount, color: "#ef4444" },
                { label: "ًں’ژ ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…ط§ط³ط§طھ", value: Math.round(totalDiamonds).toLocaleString(), color: "#38bdf8" },
                { label: "ًںھ™ ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظƒظˆظ†ط²ط§طھ", value: Math.round(totalCoins).toLocaleString(), color: "#f59e0b" },
              ].map((card, i) => (
                <div key={i} className="glass-card" style={{ padding: "0.85rem 1rem", borderLeft: `3px solid ${card.color}` }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>{card.label}</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "700", color: card.color }}>{card.value}</div>
                </div>
              ))}
            </div>

            <div className="glass-card">
              {/* Header + Search */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
                <h2 style={{ margin: 0 }}>ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†</h2>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                  <input type="text" placeholder="ًں”چ ط¨ط­ط« ط¨ط§ظ„ط§ط³ظ…طŒ IDطŒ ط¨ط±ظٹط¯طŒ ظ‡ط§طھظپ..." value={searchUser} onChange={e => { setSearchUser(e.target.value); setUsersPage(1); }} style={{ width: "240px", margin: 0 }} />
                  <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setUsersPage(1); }} style={{ margin: 0 }}>
                    <option value="ALL">ظƒظ„ ط§ظ„ط­ط§ظ„ط§طھ</option>
                    <option value="ACTIVE">ًںں¢ ظ†ط´ط·</option>
                    <option value="BANNED_TEMP">ًںں، ظ…ظˆظ‚ظˆظپ ظ…ط¤ظ‚طھ</option>
                    <option value="BANNED_PERM">ًں”´ ظ…ط­ط¸ظˆط± ظ†ظ‡ط§ط¦ظٹ</option>
                  </select>
                  <select value={filterSort} onChange={e => setFilterSort(e.target.value)} style={{ margin: 0 }}>
                    <option value="newest">ط§ظ„ط£ط­ط¯ط« ط£ظˆظ„ط§ظ‹</option>
                    <option value="most_diamonds">ًں’ژ ط£ط¹ظ„ظ‰ ظ…ط§ط³ط§طھ</option>
                    <option value="most_coins">ًںھ™ ط£ط¹ظ„ظ‰ ظƒظˆظ†ط²ط§طھ</option>
                  </select>
                </div>
              </div>

              {/* Tabs: Registered / Guests */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--glass-border)", marginBottom: "1rem" }}>
                {[
                  { key: "registered", label: `ًں‘¤ ط§ظ„ط­ط³ط§ط¨ط§طھ ط§ظ„ظ…ط³ط¬ظ„ط© (${registeredUsers.length})` },
                  { key: "guests", label: `ًں‘» ط§ظ„ط²ظˆط§ط± (${guestUsers.length})` },
                ].map(tab => (
                  <button key={tab.key} onClick={() => { setUsersTab(tab.key); setUsersPage(1); setSearchUser(""); setFilterStatus("ALL"); }}
                    style={{ padding: "0.6rem 1.25rem", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.9rem", fontWeight: usersTab === tab.key ? "700" : "400", color: usersTab === tab.key ? "var(--accent-gold)" : "var(--text-muted)", borderBottom: usersTab === tab.key ? "2px solid var(--accent-gold)" : "2px solid transparent", transition: "all 0.2s" }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="table-container" style={{ position: "relative" }} onClick={() => setOpenActionMenu(null)}>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "40px" }}></th>
                      <th>ط§ظ„ط§ط³ظ…</th>
                      <th>ID</th>
                      <th>ط§ظ„ط¨ط±ظٹط¯ / ط§ظ„ظ†ظˆط¹</th>
                      <th>ط§ظ„ظ‡ط§طھظپ</th>
                      <th style={{ color: "#38bdf8" }}>ًں’ژ ط§ظ„ظ…ط§ط³ط§طھ</th>
                      <th style={{ color: "#f59e0b" }}>ًںھ™ ط§ظ„ظƒظˆظ†ط²ط§طھ</th>
                      <th>ط§ظ„ط­ط§ظ„ط©</th>
                      <th style={{ textAlign: "center" }}>ط§ظ„ط¥ط¬ط±ط§ط،ط§طھ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map(u => {
                      const initials = (u.displayNickname || u.username || "?")[0].toUpperCase();
                      const isPermanentBan = u.isBanned && !u.banExpiresAt;
                      const isTempBan = u.isBanned && u.banExpiresAt;
                      const statusEmoji = isPermanentBan ? "ًں”´" : isTempBan ? "ًںں،" : u.role === "GUEST" ? "ًں‘¤" : "ًںں¢";
                      const statusLabel = isPermanentBan ? "ظ…ط­ط¸ظˆط± ظ†ظ‡ط§ط¦ظٹط§ظ‹" : isTempBan ? "ظ…ظˆظ‚ظˆظپ ظ…ط¤ظ‚طھ" : u.role === "GUEST" ? "ط²ط§ط¦ط±" : "ظ†ط´ط·";
                      const rowBg = isPermanentBan ? "rgba(239,68,68,0.05)" : isTempBan ? "rgba(245,158,11,0.05)" : "transparent";

                      return (
                        <tr key={u.id} style={{ background: rowBg }}>
                          <td>
                            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#DA22FF,#9733EE)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#fff", fontSize: "0.95rem" }}>
                              {initials}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{u.displayNickname || u.username}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>طھط³ط¬ظٹظ„: {new Date(u.createdAt).toLocaleDateString("ar-EG")}</div>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                              <span style={{ fontFamily: "monospace", color: "var(--accent-gold)", fontWeight: "700", fontSize: "0.85rem" }}>{u.publicId}</span>
                              <button onClick={() => navigator.clipboard.writeText(u.publicId)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.8rem", padding: "1px 3px" }} title="ظ†ط³ط®">âژک</button>
                            </div>
                          </td>
                          <td style={{ fontSize: "0.82rem" }}>
                            {u.email ? <div>{u.email}</div> : <span style={{ color: "#6b7280", fontStyle: "italic" }}>Guest Account</span>}
                            <span className="badge ended" style={{ fontSize: "0.65rem", padding: "1px 5px", marginTop: "2px", display: "inline-block" }}>{u.role}</span>
                          </td>
                          <td style={{ fontSize: "0.82rem" }}>
                            {u.phoneNumber ? (
                              <span style={{ fontFamily: "monospace" }}><span style={{ color: "var(--accent-gold)" }}>{u.countryCode || ""}</span> {u.phoneNumber}</span>
                            ) : <span style={{ color: "var(--text-muted)" }}>â€”</span>}
                          </td>
                          <td><strong style={{ color: "#38bdf8" }}>{(u.wallet?.freeBalance || 0).toLocaleString()}</strong></td>
                          <td><strong style={{ color: "#f59e0b" }}>{(u.wallet?.cashBalance || 0).toLocaleString()}</strong></td>
                          <td>
                            <span style={{ fontSize: "0.85rem" }}>{statusEmoji} {statusLabel}</span>
                            {isTempBan && u.banExpiresAt && (
                              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>ط­طھظ‰: {new Date(u.banExpiresAt).toLocaleDateString("ar-EG")}</div>
                            )}
                          </td>
                          <td style={{ textAlign: "center", position: "relative" }}>
                            <button
                              className="btn"
                              style={{ padding: "0.4rem 0.9rem", fontSize: "0.82rem", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", color: "#fff", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                              onClick={(e) => { e.stopPropagation(); openUserMgmt(u); }}
                            >
                              ط¥ط¯ط§ط±ط© âڑ™ï¸ڈ
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {paged.length === 0 && (
                      <tr><td colSpan="9" style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem" }}>ظ„ط§ ظٹظˆط¬ط¯ ظ…ط³طھط®ط¯ظ…ظˆظ† ظٹط·ط§ط¨ظ‚ظˆظ† ظ…ط¹ط§ظٹظٹط± ط§ظ„ط¨ط­ط«.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button className="btn" disabled={usersPage <= 1} onClick={() => setUsersPage(p => p - 1)} style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", opacity: usersPage <= 1 ? 0.4 : 1 }}>â€¹ ط§ظ„ط³ط§ط¨ظ‚</button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const pg = i + 1;
                      return (
                        <button key={pg} className={`btn ${usersPage === pg ? "btn-primary" : ""}`} onClick={() => setUsersPage(pg)} style={{ padding: "0.35rem 0.65rem", fontSize: "0.8rem", minWidth: "32px" }}>{pg}</button>
                      );
                    })}
                    <button className="btn" disabled={usersPage >= totalPages} onClick={() => setUsersPage(p => p + 1)} style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", opacity: usersPage >= totalPages ? 0.4 : 1 }}>ط§ظ„طھط§ظ„ظٹ â€؛</button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    <span>{filtered.length} ظ…ط³طھط®ط¯ظ… | ط§ظ„طµظپط­ط© {usersPage} ظ…ظ† {totalPages}</span>
                    <select value={usersPerPage} onChange={e => { setUsersPerPage(+e.target.value); setUsersPage(1); }} style={{ margin: 0, padding: "0.3rem", fontSize: "0.82rem", width: "80px" }}>
                      {[25, 50, 100, 250].map(n => <option key={n} value={n}>{n} / طµظپط­ط©</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
          );
        })()}

        {/* â•گâ•گâ•گ User Management Modal â•گâ•گâ•گ */}
        {showUserMgmtModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowUserMgmtModal(false)}>
            <div className="glass-card" style={{ maxWidth: "750px", width: "96%", maxHeight: "92vh", overflowY: "auto", position: "relative", borderRadius: "16px" }} onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--glass-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "linear-gradient(135deg,#DA22FF,#9733EE)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#fff", fontSize: "1.3rem" }}>
                    {(selectedUser.displayNickname || selectedUser.username || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>{selectedUser.displayNickname || selectedUser.username}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--accent-gold)", fontFamily: "monospace" }}>ID: {selectedUser.publicId} â€¢ {selectedUser.role}</div>
                  </div>
                </div>
                <button className="btn btn-danger" style={{ padding: "0.4rem 0.8rem" }} onClick={() => setShowUserMgmtModal(false)}>âœ• ط¥ط؛ظ„ط§ظ‚</button>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--glass-border)", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                {[
                  { key: "info", label: "ًں“‹ ط§ظ„ظ…ط¹ظ„ظˆظ…ط§طھ" },
                  { key: "edit", label: "âœڈï¸ڈ طھط¹ط¯ظٹظ„" },
                  { key: "coins", label: "ًںھ™ ط§ظ„ط¹ظ…ظ„ط§طھ" },
                  { key: "ban", label: "ًںڑ« ط§ظ„ط­ط¸ط±" },
                  { key: "logs", label: "ًں“œ ط§ظ„ط³ط¬ظ„ط§طھ" },
                  { key: "danger", label: "âڑ ï¸ڈ ط®ط·ط±" },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setUserMgmtTab(tab.key)} style={{ padding: "0.6rem 1rem", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.85rem", fontWeight: userMgmtTab === tab.key ? "700" : "400", color: userMgmtTab === tab.key ? "var(--accent-gold)" : "var(--text-secondary)", borderBottom: userMgmtTab === tab.key ? "2px solid var(--accent-gold)" : "2px solid transparent" }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* â”€â”€ Tab: INFO â”€â”€ */}
              {userMgmtTab === "info" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.75rem" }}>ط§ظ„ظ…ظ„ظپ ط§ظ„ط´ط®طµظٹ</h4>
                    {[
                      ["UUID", <span style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{selectedUser.id}</span>],
                      ["Public ID", <strong style={{ color: "var(--accent-gold)" }}>{selectedUser.publicId}</strong>],
                      ["ط§ظ„ط§ط³ظ… ط§ظ„ط¸ط§ظ‡ط±", selectedUser.displayNickname || "â€”"],
                      ["ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ…", `@${selectedUser.username}`],
                      ["ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ", selectedUser.email || <em style={{ color: "#6b7280" }}>Guest Account</em>],
                      ["ط§ظ„ط¹ظ…ط±", selectedUser.age || "â€”"],
                      ["ط§ظ„ط¬ظ†ط³", selectedUser.gender === "MALE" ? "ط°ظƒط± â™‚" : selectedUser.gender === "FEMALE" ? "ط£ظ†ط«ظ‰ â™€" : "â€”"],
                      ["طھط§ط±ظٹط® ط§ظ„طھط³ط¬ظٹظ„", new Date(selectedUser.createdAt).toLocaleString("ar-EG")],
                      ["ط§ظ„ط¬ظˆظ„ط§طھ / ط§ظ„ظپظˆط²", `${selectedUser.roundsPlayed} / ${selectedUser.roundsWon}`],
                    ].map(([label, val], i) => (
                      <p key={i} style={{ margin: "0.35rem 0", fontSize: "0.88rem" }}><strong>{label}: </strong>{val}</p>
                    ))}
                  </div>
                  <div>
                    <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.75rem" }}>ط§ظ„ط£ظ…ط§ظ† ظˆط§ظ„ظ…ط­ظپط¸ط©</h4>
                    {[
                      ["ط±ظ‚ظ… ط§ظ„ظ‡ط§طھظپ", selectedUser.phoneNumber ? `${selectedUser.countryCode || ""} ${selectedUser.phoneNumber}` : "â€”"],
                      ["Device ID", <span style={{ fontFamily: "monospace", fontSize: "0.72rem" }}>{selectedUser.deviceId || "â€”"}</span>],
                      ["ًں’ژ ط§ظ„ظ…ط§ط³ط§طھ", <strong style={{ color: "#38bdf8", fontSize: "1.1rem" }}>{(selectedUser.wallet?.freeBalance || 0).toLocaleString()}</strong>],
                      ["ًںھ™ ط§ظ„ظƒظˆظ†ط²ط§طھ", <strong style={{ color: "#f59e0b", fontSize: "1.1rem" }}>{(selectedUser.wallet?.cashBalance || 0).toLocaleString()}</strong>],
                    ].map(([label, val], i) => (
                      <p key={i} style={{ margin: "0.35rem 0", fontSize: "0.88rem" }}><strong>{label}: </strong>{val}</p>
                    ))}
                    <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "8px", background: selectedUser.isBanned ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.1)", border: `1px solid ${selectedUser.isBanned ? "#ef4444" : "#22c55e"}` }}>
                      <strong style={{ color: selectedUser.isBanned ? "#ef4444" : "#22c55e" }}>
                        {selectedUser.isBanned
                          ? (selectedUser.banExpiresAt ? `ًںں، ظ…ظˆظ‚ظˆظپ ط­طھظ‰ ${new Date(selectedUser.banExpiresAt).toLocaleDateString("ar-EG")}` : "ًں”´ ظ…ط­ط¸ظˆط± ظ†ظ‡ط§ط¦ظٹط§ظ‹")
                          : "ًںں¢ ط§ظ„ط­ط³ط§ط¨ ظ†ط´ط·"}
                      </strong>
                      {selectedUser.banReason && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>ط§ظ„ط³ط¨ط¨: {selectedUser.banReason}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* â”€â”€ Tab: EDIT â”€â”€ */}
              {userMgmtTab === "edit" && (
                <form onSubmit={handleEditUser}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label>ط§ظ„ط§ط³ظ… ط§ظ„ط¸ط§ظ‡ط±</label>
                      <input type="text" value={editNickname} onChange={e => setEditNickname(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Public ID {user?.role !== "SUPERADMIN" && <span style={{ color: "var(--accent-gold)", fontSize: "0.75rem" }}>(SuperAdmin ظپظ‚ط·)</span>}</label>
                      <input type="text" value={editPublicId} onChange={e => setEditPublicId(e.target.value)} disabled={user?.role !== "SUPERADMIN"} style={{ opacity: user?.role !== "SUPERADMIN" ? 0.5 : 1 }} />
                    </div>
                    <div className="form-group">
                      <label>ط§ظ„ط¹ظ…ط±</label>
                      <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>ط§ظ„ط¬ظ†ط³</label>
                      <select value={editGender} onChange={e => setEditGender(e.target.value)}>
                        <option value="MALE">ط°ظƒط± â™‚</option>
                        <option value="FEMALE">ط£ظ†ط«ظ‰ â™€</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>ط±ظ…ط² ط§ظ„ط¯ظˆظ„ط©</label>
                      <select value={editCountryCode} onChange={e => setEditCountryCode(e.target.value)}>
                        {["+964","+966","+971","+20","+965","+968","+973","+974","+967","+249","+218","+212","+213","+216","+961","+963","+962","+970"].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>ط±ظ‚ظ… ط§ظ„ظ‡ط§طھظپ (ط¨ط¯ظˆظ† ط±ظ…ط² ط§ظ„ط¯ظˆظ„ط©)</label>
                      <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="7712345678" />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1/-1" }}>
                      <label>ظƒظ„ظ…ط© ظ…ط±ظˆط± ط¬ط¯ظٹط¯ط© (ط§طھط±ظƒظ‡ط§ ظپط§ط±ط؛ط© ظ„ظ„طھط®ط·ظٹ)</label>
                      <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.75rem 0" }}>
                    <input type="checkbox" id="removeAv" checked={removeAvatar} onChange={e => setRemoveAvatar(e.target.checked)} style={{ width: "16px", height: "16px" }} />
                    <label htmlFor="removeAv" style={{ cursor: "pointer", fontSize: "0.85rem" }}>ط­ط°ظپ ط§ظ„طµظˆط±ط© ط§ظ„ط´ط®طµظٹط© ظˆط¥ط±ط¬ط§ط¹ ط§ظ„ط§ظپطھط±ط§ط¶ظٹط©</label>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "flex-end" }}>
                    <button type="button" className="btn" onClick={() => setUserMgmtTab("info")}>ط¥ظ„ط؛ط§ط،</button>
                    <button type="submit" className="btn btn-primary">ًں’¾ ط­ظپط¸ ط§ظ„طھط؛ظٹظٹط±ط§طھ</button>
                  </div>
                </form>
              )}

              {/* â”€â”€ Tab: COINS â”€â”€ */}
              {userMgmtTab === "coins" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ padding: "1.25rem", borderRadius: "10px", background: "rgba(56,189,248,0.1)", border: "1px solid #38bdf8", textAlign: "center" }}>
                      <div style={{ fontSize: "0.85rem", color: "#38bdf8", marginBottom: "4px" }}>ًں’ژ ط±طµظٹط¯ ط§ظ„ظ…ط§ط³ط§طھ ط§ظ„ط­ط§ظ„ظٹ</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#38bdf8" }}>{(selectedUser.wallet?.freeBalance || 0).toLocaleString()}</div>
                    </div>
                    <div style={{ padding: "1.25rem", borderRadius: "10px", background: "rgba(245,158,11,0.1)", border: "1px solid #f59e0b", textAlign: "center" }}>
                      <div style={{ fontSize: "0.85rem", color: "#f59e0b", marginBottom: "4px" }}>ًںھ™ ط±طµظٹط¯ ط§ظ„ظƒظˆظ†ط²ط§طھ ط§ظ„ط­ط§ظ„ظٹ</div>
                      <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#f59e0b" }}>{(selectedUser.wallet?.cashBalance || 0).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label>ظ†ظˆط¹ ط§ظ„ط¹ظ…ظ„ظٹط©</label>
                      <select value={adjustOp} onChange={e => setAdjustOp(e.target.value)}>
                        <option value="ADD">â‍• ط¥ط¶ط§ظپط©</option>
                        <option value="SUBTRACT">â‍– ط³ط­ط¨</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>ظ†ظˆط¹ ط§ظ„ط¹ظ…ظ„ط©</label>
                      <select value={adjustType} onChange={e => setAdjustType(e.target.value)}>
                        <option value="FREE">ًں’ژ ط§ظ„ظ…ط§ط³ط§طھ (ظ…ط¬ط§ظ†ظٹط©)</option>
                        <option value="CASH">ًںھ™ ط§ظ„ظƒظˆظ†ط²ط§طھ (ظ…ط¯ظپظˆط¹ط©)</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>ط§ظ„ظ…ط¨ظ„ط؛</label>
                    <input type="number" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} placeholder="ظ…ط«ط§ظ„: 5000" min="1" />
                  </div>
                  <div className="form-group">
                    <label>ط§ظ„ط³ط¨ط¨ (ط¥ط¬ط¨ط§ط±ظٹ)</label>
                    <select value={adjustReason} onChange={e => setAdjustReason(e.target.value)}>
                      <option value="">-- ط§ط®طھط± ط§ظ„ط³ط¨ط¨ --</option>
                      <option value="ظ…ظƒط§ظپط£ط©">ًںڈ† ظ…ظƒط§ظپط£ط©</option>
                      <option value="طھط¹ظˆظٹط¶">ًں’¸ طھط¹ظˆظٹط¶</option>
                      <option value="طھطµط­ظٹط­ ط±طµظٹط¯">ًں”§ طھطµط­ظٹط­ ط±طµظٹط¯</option>
                      <option value="ط¹ظ‚ظˆط¨ط©">âڑ ï¸ڈ ط¹ظ‚ظˆط¨ط©</option>
                      <option value="ظ‡ط¯ظٹط© ط¥ط¯ط§ط±ظٹط©">ًںژپ ظ‡ط¯ظٹط© ط¥ط¯ط§ط±ظٹط©</option>
                      <option value="ط§ط³طھط±ط¬ط§ط¹">â†©ï¸ڈ ط§ط³طھط±ط¬ط§ط¹</option>
                    </select>
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} onClick={handleAdjustBalance}>
                    {adjustOp === "ADD" ? "â‍• ط¥ط¶ط§ظپط© ط§ظ„ط¹ظ…ظ„ط§طھ" : "â‍– ط³ط­ط¨ ط§ظ„ط¹ظ…ظ„ط§طھ"}
                  </button>
                </div>
              )}

              {/* â”€â”€ Tab: BAN â”€â”€ */}
              {userMgmtTab === "ban" && (
                <div>
                  {selectedUser.isBanned && (
                    <div style={{ padding: "0.9rem 1rem", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ color: "#ef4444" }}>{selectedUser.banExpiresAt ? `ًںں، ظ…ظˆظ‚ظˆظپ ط­طھظ‰ ${new Date(selectedUser.banExpiresAt).toLocaleDateString("ar-EG")}` : "ًں”´ ظ…ط­ط¸ظˆط± ظ†ظ‡ط§ط¦ظٹط§ظ‹"}</strong>
                        {selectedUser.banReason && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>ط§ظ„ط³ط¨ط¨: {selectedUser.banReason}</div>}
                      </div>
                      <button className="btn btn-success" onClick={handleUnbanUser} style={{ fontSize: "0.82rem" }}>âœ… ظپظƒ ط§ظ„ط­ط¸ط±</button>
                    </div>
                  )}

                  <h4 style={{ color: "var(--accent-gold)", marginBottom: "1rem" }}>ط§ظ„ط­ط¸ط± ط§ظ„ظ…ط¤ظ‚طھ</h4>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    {[1, 3, 7, 30].map(d => (
                      <button key={d} className="btn" style={{ padding: "0.5rem 1rem", fontSize: "0.82rem", border: "1px solid var(--glass-border)" }}
                        onClick={() => { if (confirm(`ط­ط¸ط± ط§ظ„ظ…ط³طھط®ط¯ظ… ظ„ظ…ط¯ط© ${d} ظٹظˆظ…طں`)) handleBanUser(d, banReason || `ط­ط¸ط± ظ…ط¤ظ‚طھ ${d} ظٹظˆظ…`); }}>
                        {d} ظٹظˆظ…
                      </button>
                    ))}
                  </div>
                  <div className="form-group">
                    <label>ظ…ط¯ط© ظ…ط®طµطµط© (ط£ظٹط§ظ…)</label>
                    <input type="number" value={banDays} onChange={e => setBanDays(e.target.value)} placeholder="ظ…ط«ط§ظ„: 14" min="1" />
                  </div>
                  <div className="form-group">
                    <label>ط³ط¨ط¨ ط§ظ„ط­ط¸ط±</label>
                    <textarea value={banReason} onChange={e => setBanReason(e.target.value)} rows="2" placeholder="ط§ظƒطھط¨ ط³ط¨ط¨ ط§ظ„ط­ط¸ط±..." />
                  </div>
                  <button className="btn" style={{ background: "#f59e0b", color: "#000", width: "100%", fontWeight: "700" }}
                    onClick={() => { if (confirm(`ط­ط¸ط± ط§ظ„ظ…ط³طھط®ط¯ظ… ظ„ظ…ط¯ط© ${banDays} ظٹظˆظ…طں`)) handleBanUser(parseInt(banDays), banReason); }}>
                    ًںں، طھط·ط¨ظٹظ‚ ط§ظ„ط­ط¸ط± ط§ظ„ظ…ط¤ظ‚طھ
                  </button>

                  {user?.role === "SUPERADMIN" && (
                    <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "8px", border: "1px dashed #ef4444", background: "rgba(239,68,68,0.05)" }}>
                      <h4 style={{ color: "#ef4444", margin: "0 0 0.75rem" }}>ًں”´ ط§ظ„ط­ط¸ط± ط§ظ„ظ†ظ‡ط§ط¦ظٹ (SuperAdmin)</h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>ظٹط­ط¸ط± ط§ظ„ط­ط³ط§ط¨ + Device ID + Device Fingerprint ط¨ط´ظƒظ„ ط¯ط§ط¦ظ….</p>
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button className="btn btn-danger" style={{ flex: 1 }}
                          onClick={() => { if (confirm("ط­ط¸ط± ظ†ظ‡ط§ط¦ظٹطں")) handleBanUser(null, banReason || "ط­ط¸ط± ظ†ظ‡ط§ط¦ظٹ"); }}>
                          ًںڑ« ط­ط¸ط± ط§ظ„ط­ط³ط§ط¨ ظ†ظ‡ط§ط¦ظٹط§ظ‹
                        </button>
                        <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleBanDevice}>
                          ًں“µ ط­ط¸ط± ط§ظ„ط¬ظ‡ط§ط² ظ†ظ‡ط§ط¦ظٹط§ظ‹
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* â”€â”€ Tab: LOGS â”€â”€ */}
              {userMgmtTab === "logs" && (
                <div>
                  {logsLoading ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>âڈ³ ط¬ط§ط±ظٹ طھط­ظ…ظٹظ„ ط§ظ„ط³ط¬ظ„ط§طھ...</div>
                  ) : (
                    <div>
                      <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.75rem" }}>ًں“ٹ ط³ط¬ظ„ ط§ظ„ظ†ط´ط§ط· ({userLogs.activityLogs.length})</h4>
                      <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "1.25rem" }}>
                        {userLogs.activityLogs.length === 0
                          ? <p style={{ color: "var(--text-muted)", textAlign: "center" }}>ظ„ط§ ظٹظˆط¬ط¯ ط³ط¬ظ„ ظ†ط´ط§ط·.</p>
                          : userLogs.activityLogs.map((log, i) => (
                            <div key={i} style={{ padding: "0.55rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.83rem" }}>
                              <div><span className="badge ended" style={{ fontSize: "0.6rem", padding: "1px 4px", marginInlineEnd: "6px" }}>{log.type}</span>{log.message}</div>
                              <div style={{ color: "var(--text-muted)", whiteSpace: "nowrap", fontSize: "0.75rem" }}>{new Date(log.date).toLocaleString("ar-EG")}</div>
                            </div>
                          ))
                        }
                      </div>
                      <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.75rem" }}>ًں›،ï¸ڈ ط³ط¬ظ„ ط§ظ„ط¥ط¬ط±ط§ط،ط§طھ ط§ظ„ط¥ط¯ط§ط±ظٹط© ({userLogs.adminActions.length})</h4>
                      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {userLogs.adminActions.length === 0
                          ? <p style={{ color: "var(--text-muted)", textAlign: "center" }}>ظ„ط§ ظٹظˆط¬ط¯ ط¥ط¬ط±ط§ط،ط§طھ ط¥ط¯ط§ط±ظٹط©.</p>
                          : userLogs.adminActions.map((log, i) => (
                            <div key={i} style={{ padding: "0.55rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.83rem" }}>
                              <div><span style={{ background: "var(--accent-gold)", color: "#000", fontSize: "0.6rem", padding: "1px 5px", borderRadius: "3px", marginInlineEnd: "6px" }}>{log.type?.replace("ADMIN_","")}</span>{log.message}</div>
                              <div style={{ color: "var(--text-muted)", whiteSpace: "nowrap", fontSize: "0.75rem" }}>{new Date(log.date).toLocaleString("ar-EG")}</div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* â”€â”€ Tab: DANGER â”€â”€ */}
              {userMgmtTab === "danger" && user?.role === "SUPERADMIN" && (
                <div style={{ padding: "1rem", border: "1px dashed #ef4444", borderRadius: "10px", background: "rgba(239,68,68,0.05)" }}>
                  <h4 style={{ color: "#ef4444", margin: "0 0 0.5rem" }}>âڑ ï¸ڈ ط­ط°ظپ ط§ظ„ط­ط³ط§ط¨ ظ†ظ‡ط§ط¦ظٹط§ظ‹ ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ</h4>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem" }}>ط³ظٹطھظ… ظ…ط³ط­ ط§ظ„ظ…ط­ظپط¸ط©طŒ ط§ظ„ط¬ظˆظ„ط§طھطŒ ط§ظ„ظ…ظ‡ط§ظ…طŒ ط§ظ„ط¥ط­ط§ظ„ط§طھ ظˆط¬ظ…ظٹط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط±طھط¨ط·ط© ط¨ظ‡ط°ط§ ط§ظ„ط­ط³ط§ط¨. ظ‡ط°ط§ ط§ظ„ط¥ط¬ط±ط§ط، ظ„ط§ ظٹظ…ظƒظ† ط§ظ„طھط±ط§ط¬ط¹ ط¹ظ†ظ‡.</p>
                  {deleteConfirmStep === 0 && (
                    <button className="btn btn-danger" onClick={handleDeleteUser}>ًں—‘ï¸ڈ ط­ط°ظپ ط§ظ„ط­ط³ط§ط¨ ظ†ظ‡ط§ط¦ظٹط§ظ‹</button>
                  )}
                  {deleteConfirmStep === 1 && (
                    <div>
                      <p style={{ color: "#ef4444", fontWeight: "700", marginBottom: "0.5rem" }}>ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ طھظ…ط§ظ…ط§ظ‹طں</p>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn btn-danger" onClick={handleDeleteUser}>ظ†ط¹ظ…طŒ ظ…طھط£ظƒط¯</button>
                        <button className="btn" onClick={() => setDeleteConfirmStep(0)}>ط¥ظ„ط؛ط§ط،</button>
                      </div>
                    </div>
                  )}
                  {deleteConfirmStep === 2 && (
                    <div>
                      <p style={{ color: "#ef4444", fontWeight: "700", marginBottom: "0.5rem" }}>ط§ظƒطھط¨ ظƒظ„ظ…ط© DELETE ظ„ظ„طھط£ظƒظٹط¯ ط§ظ„ظ†ظ‡ط§ط¦ظٹ:</p>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input type="text" value={deleteTextVal} onChange={e => setDeleteTextVal(e.target.value)} placeholder="DELETE" style={{ width: "140px", margin: 0, border: "1px solid #ef4444" }} />
                        <button className="btn btn-danger" onClick={handleDeleteUser}>ًں’¥ طھط¯ظ…ظٹط± ط§ظ„ط­ط³ط§ط¨</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {userMgmtTab === "danger" && user?.role !== "SUPERADMIN" && (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "2rem" }}>ًں”’</div>
                  <div>ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ… ظ…طھط§ط­ ظ„ظ„ظ…ط¯ظٹط± ط§ظ„ط¹ط§ظ… (SuperAdmin) ظپظ‚ط·.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deposits Queue */}

        {activeTab === "deposits" && (
          <div className="glass-card">
            <h2>{t.deposits}</h2>
            <div className="table-container" style={{ marginTop: "1rem" }}>
              <table>
                <thead>
                  <tr>
                    <th>{t.username}</th>
                    <th>{t.amount}</th>
                    <th>{t.status}</th>
                    <th>{t.refNo}</th>
                    <th>{t.date}</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map(d => (
                    <tr key={d.id}>
                      <td>
                        <div>{d.user?.email || "Guest"}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>ID: {d.userId}</div>
                      </td>
                      <td><strong>{d.amount.toFixed(2)} CASH</strong></td>
                      <td><span className={`badge ${d.status === "PENDING" ? "betting" : d.status === "APPROVED" ? "revealing" : "locked"}`}>{d.status}</span></td>
                      <td>{d.transactionRef || <span style={{ color: "var(--text-muted)" }}>Pending</span>}</td>
                      <td>{new Date(d.createdAt).toLocaleString()}</td>
                      <td>
                        {d.status === "PENDING" && (
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button className="btn btn-success" onClick={() => handleApproveDeposit(d.id)}>{t.approve}</button>
                            <button className="btn btn-danger" onClick={() => openRejectModal("deposit", d.id)}>{t.reject}</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Withdrawals Queue */}
        {activeTab === "withdrawals" && (
          <div className="glass-card">
            <h2>{t.withdrawals}</h2>
            <div className="table-container" style={{ marginTop: "1rem" }}>
              <table>
                <thead>
                  <tr>
                    <th>{t.username}</th>
                    <th>{t.amount}</th>
                    <th>{t.status}</th>
                    <th>{t.refNo}</th>
                    <th>{t.date}</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map(w => (
                    <tr key={w.id}>
                      <td>
                        <div>{w.user?.email || "User"}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>ID: {w.userId}</div>
                      </td>
                      <td><strong>{w.amount.toFixed(2)} CASH</strong></td>
                      <td><span className={`badge ${w.status === "PENDING" ? "betting" : w.status === "APPROVED" ? "revealing" : "locked"}`}>{w.status}</span></td>
                      <td>{w.transactionRef || <span style={{ color: "var(--text-muted)" }}>Pending</span>}</td>
                      <td>{new Date(w.createdAt).toLocaleString()}</td>
                      <td>
                        {w.status === "PENDING" && (
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button className="btn btn-success" onClick={() => handleApproveWithdrawal(w.id)}>{t.approve}</button>
                            <button className="btn btn-danger" onClick={() => openRejectModal("withdrawal", w.id)}>{t.reject}</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Configuration settings panel */}
        {activeTab === "config" && config && (
          <form onSubmit={handleSaveConfig} className="glass-card" style={{ maxWidth: "600px" }}>
            <h2>{t.config}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
              <div className="form-group">
                <label>{t.minBet}</label>
                <input type="number" value={config.minBet} onChange={e => setConfig({ ...config, minBet: parseFloat(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>{t.maxBet}</label>
                <input type="number" value={config.maxBet} onChange={e => setConfig({ ...config, maxBet: parseFloat(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>{t.betDuration}</label>
                <input type="number" value={config.roundDurationBetting} onChange={e => setConfig({ ...config, roundDurationBetting: parseInt(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>{t.calcDuration}</label>
                <input type="number" value={config.roundDurationCalcul} onChange={e => setConfig({ ...config, roundDurationCalcul: parseInt(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>{t.revealDuration}</label>
                <input type="number" value={config.roundDurationReveal} onChange={e => setConfig({ ...config, roundDurationReveal: parseInt(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>{t.historySize}</label>
                <input type="number" value={config.historyLength} onChange={e => setConfig({ ...config, historyLength: parseInt(e.target.value) })} required />
              </div>
            </div>

            <h3 style={{ marginTop: "1.5rem", marginBottom: "0.75rem" }}>{t.toggles}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div className="form-group">
                <label>{t.freeEnabled}</label>
                <select value={config.isFreeEnabled ? "true" : "false"} onChange={e => setConfig({ ...config, isFreeEnabled: e.target.value === "true" })}>
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t.cashEnabled}</label>
                <select value={config.isCashEnabled ? "true" : "false"} onChange={e => setConfig({ ...config, isCashEnabled: e.target.value === "true" })}>
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>

            <h3 style={{ marginTop: "1.5rem", marginBottom: "0.75rem" }}>{t.maintenance}</h3>
            <div className="form-group">
              <label>{t.maintenance}</label>
              <select value={config.isMaintenanceMode ? "true" : "false"} onChange={e => setConfig({ ...config, isMaintenanceMode: e.target.value === "true" })}>
                <option value="false">{t.normalOps}</option>
                <option value="true">{t.maintenanceActive}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t.maintMessage}</label>
              <textarea value={config.maintenanceMessage} onChange={e => setConfig({ ...config, maintenanceMessage: e.target.value })} rows="3"></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1.5rem" }}>{t.saveConfig}</button>
          </form>
        )}

        {/* Tasks CRUD Panel */}
        {activeTab === "tasks" && (
          <div className="glass-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2>{t.tasks}</h2>
              <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>{t.addTask}</button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>{t.taskTitle}</th>
                    <th>{t.taskGoal}</th>
                    <th>Reward</th>
                    <th>{t.status}</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(tData => (
                    <tr key={tData.id}>
                      <td style={{ fontFamily: "monospace" }}>{tData.key}</td>
                      <td>
                        <strong>{tData.title}</strong>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{tData.description}</div>
                      </td>
                      <td>{tData.goalCount}</td>
                      <td><strong style={{ color: "var(--accent-gold)" }}>{tData.rewardAmount} {tData.rewardCurrency}</strong></td>
                      <td>
                        <span className={`badge ${tData.isEnabled ? "revealing" : "ended"}`}>
                          {tData.isEnabled ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-danger" style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }} onClick={() => handleToggleTask(tData)}>
                          {tData.isEnabled ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* House Pool logs */}
        {activeTab === "pool" && (
          <div className="glass-card">
            <h2>{t.pool}</h2>
            <div className="table-container" style={{ marginTop: "1rem" }}>
              <table>
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Pool Type</th>
                    <th>{t.amount}</th>
                    <th>Type</th>
                    <th>Reference</th>
                    <th>{t.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {poolLogs.map(l => (
                    <tr key={l.id}>
                      <td style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>{l.id}</td>
                      <td><span className="badge ended">{l.poolType}</span></td>
                      <td>
                        <strong style={{ color: l.amountChange >= 0 ? "var(--accent-neon-green)" : "var(--accent-neon-red)" }}>
                          {l.amountChange >= 0 ? "+" : ""}{l.amountChange.toFixed(2)}
                        </strong>
                      </td>
                      <td>{l.type}</td>
                      <td style={{ fontSize: "0.8rem", fontFamily: "monospace" }}>{l.referenceId || "Admin Adjust"}</td>
                      <td>{new Date(l.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Simulation Engine Panel */}
        {activeTab === "simulation" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <form onSubmit={handleRunSimulation} className="glass-card">
              <h2>{t.simulationTitle}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                {t.simTip}
              </p>
              
              <div className="form-group">
                <label>{t.roundsCount}</label>
                <input type="number" value={simRounds} onChange={e => setSimRounds(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>{t.virtualPool}</label>
                <input type="number" value={simPool} onChange={e => setSimPool(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>{t.botsCount}</label>
                <input type="number" value={simBots} onChange={e => setSimBots(e.target.value)} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>{t.minBotBet}</label>
                  <input type="number" value={simMin} onChange={e => setSimMin(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>{t.maxBotBet}</label>
                  <input type="number" value={simMax} onChange={e => setSimMax(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>{t.rewardCurrency}</label>
                <select value={simCurrency} onChange={e => setSimCurrency(e.target.value)}>
                  <option value="FREE">FREE</option>
                  <option value="CASH">CASH</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={simLoading}>
                {simLoading ? t.simRunning : t.startSim}
              </button>
            </form>

            <div className="glass-card">
              <h2>{t.stabilityReport}</h2>
              {!simReport && !simLoading && <p style={{ color: "var(--text-muted)", marginTop: "2rem", textAlign: "center" }}>{t.simTip2}</p>}
              {simLoading && <p style={{ marginTop: "2rem", textAlign: "center" }}>{t.simRunning}</p>}
              {simReport && (
                <div style={{ marginTop: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span>{t.stabilityScore}</span>
                    <strong style={{
                      color: simReport.stabilityScore > 75 ? "var(--accent-neon-green)" : 
                             simReport.stabilityScore > 40 ? "var(--accent-gold)" : "var(--accent-neon-red)"
                    }}>{simReport.stabilityScore} / 100</strong>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{t.roundsCount}</span>
                    <span>{simReport.roundsRun} / {simRounds}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{t.initialPool}</span>
                    <span>{simReport.initialPool.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{t.finalPool}</span>
                    <span>{simReport.finalPool.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{t.netProfit}</span>
                    <span style={{ color: simReport.netProfitLoss >= 0 ? "var(--accent-neon-green)" : "var(--accent-neon-red)" }}>
                      {simReport.netProfitLoss >= 0 ? "+" : ""}{simReport.netProfitLoss.toFixed(2)} ({simReport.profitLossPct.toFixed(1)}%)
                    </span>
                  </div>

                  <h4>{t.frequencies}</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginTop: "0.5rem" }}>
                    {Object.entries(simReport.boxWinningFrequencies).map(([box, count]) => (
                      <div key={box} style={{ background: "rgba(0,0,0,0.2)", padding: "0.5rem", borderRadius: "6px", textAlign: "center" }}>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Box {box}</div>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Override Outcome Modal */}
      {showOverrideModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <h3>{t.forceOutcome}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              Forcing Box {overrideBox} to win next.
            </p>
            {overrideError && <div style={{ color: "var(--accent-neon-red)", marginTop: "0.5rem" }}>{overrideError}</div>}
            
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>{t.reason}</label>
              <textarea value={overrideReason} onChange={e => setOverrideReason(e.target.value)} required placeholder="Reason..." rows="3"></textarea>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button className="btn" onClick={() => setShowOverrideModal(false)}>{t.cancel}</button>
              <button className="btn btn-primary" onClick={handleOverride}>{t.forceOutcome}</button>
            </div>
          </div>
        </div>
      )}



      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <h3>{t.reject}</h3>
            
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>{t.rejectionReason}</label>
              <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} required rows="3" placeholder="Reason..."></textarea>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button className="btn" onClick={() => setShowRejectModal(false)}>{t.cancel}</button>
              <button className="btn btn-danger" onClick={handleRejectRequest}>{t.confirm}</button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <form onSubmit={handleCreateTask} className="glass-card modal-content">
            <h3>{t.addTask}</h3>
            
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>{t.taskKey}</label>
              <input type="text" value={taskKey} onChange={e => setTaskKey(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t.taskTitle}</label>
              <input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t.taskDesc}</label>
              <input type="text" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t.taskGoal}</label>
              <input type="number" value={taskGoal} onChange={e => setTaskGoal(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t.rewardAmount}</label>
              <input type="number" value={taskReward} onChange={e => setTaskReward(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t.rewardCurrency}</label>
              <select value={taskCurrency} onChange={e => setTaskCurrency(e.target.value)}>
                <option value="FREE">FREE COINS</option>
                <option value="CASH">CASH COINS</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button type="button" className="btn" onClick={() => setShowTaskModal(false)}>{t.cancel}</button>
              <button type="submit" className="btn btn-primary">{t.save}</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
