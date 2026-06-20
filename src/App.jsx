import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const API_BASE = "https://greed-box-server.onrender.com/api";


function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return "0";
  if (typeof num === 'string') num = parseFloat(num);
  if (isNaN(num)) return "0";
  
  if (num >= 1e9) {
    return (num / 1e9).toFixed(decimals).replace(/\.?0+$/, '') + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(decimals).replace(/\.?0+$/, '') + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(decimals).replace(/\.?0+$/, '') + 'K';
  }
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(num);
}

const TRANSLATIONS = {
  ar: {
    brand: "صناديق الطمع",
    dashboard: "لوحة التحكم",
    users: "المستخدمين",
    deposits: "طلبات الشحن",
    withdrawals: "طلبات السحب",
    config: "إعدادات النظام",
    tasks: "المهام",
    finance: "المحاسبة والمستشار 📊",
    pool: "سجل الخزينة",
    simulation: "محاكاة النظام",
    playGame: "قسم اللعبة 🎮",
    profits: "أرباحي 💰",
    withdrawProfit: "سحب الأرباح",
    totalProfits: "إجمالي الأرباح",
    logout: "تسجيل الخروج",
    loginTitle: "تسجيل دخول الإدارة",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    loginBtn: "دخول اللوحة",
    socketStatus: "حالة السيرفر",
    connected: "متصل",
    disconnected: "غير متصل",
    activePlayers: "اللاعبين النشطين",
    cashPool: "رصيد الخزينة المالي",
    todayRevenue: "أرباح اليوم",
    pendingRequests: "الطلبات المعلقة",
    roundStatus: "حالة الجولة الحالية",
    roundId: "رقم الجولة",
    timeRemaining: "الوقت المتبقي",
    currencyMode: "نوع العملة",
    sequence: "رقم التسلسل",
    overrideTip: "* اضغط على أي صندوق لتحديد الفائز يدوياً للجولة القادمة (خاص بالمدير الرئيسي).",
    searchPlaceholder: "ابحث عن بريد، اسم أو معرف...",
    userId: "معرف المستخدم",
    username: "اسم المستخدم",
    role: "الصلاحية",
    freeCoins: "الماسات",
    cashCoins: "الكونزات",
    stats: "الإحصائيات (جولات / فوز)",
    actions: "الإجراءات",
    editBalance: "تعديل الرصيد",
    amount: "المبلغ",
    status: "الحالة",
    refNo: "رقم العملية",
    date: "التاريخ",
    approve: "قبول",
    reject: "رفض",
    rejectionReason: "سبب الرفض",
    minBet: "أقل رهان",
    maxBet: "أعلى رهان",
    betDuration: "مدة الرهان (ثانية)",
    calcDuration: "مدة الحساب (ثانية)",
    revealDuration: "مدة العرض (ثانية)",
    historySize: "عدد نتائج شريط الجولات",
    toggles: "تفعيل وتعطيل الأنظمة",
    freeEnabled: "جولات الماسات",
    cashEnabled: "جولات الكونزات",
    maintenance: "وضع الصيانة",
    normalOps: "عمل طبيعي",
    maintenanceActive: "وضع الصيانة نشط",
    maintMessage: "رسالة الصيانة للمستخدمين",
    saveConfig: "حفظ الإعدادات",
    addTask: "إضافة مهمة جديدة",
    taskKey: "رمز المهمة الفريد",
    taskTitle: "عنوان المهمة",
    taskDesc: "الوصف",
    taskGoal: "الهدف (عدد المرات)",
    rewardAmount: "مبلغ الجائزة",
    rewardCurrency: "عملة الجائزة",
    simulationTitle: "تشغيل محاكاة اللعبة",
    simTip: "يقوم بتشغيل جولات وهمية مع لاعبين آليين (Bots) لاختبار استقرار الصندوق الأسود.",
    roundsCount: "عدد الجولات",
    virtualPool: "الرصيد الافتراضي للخزينة",
    botsCount: "عدد البوتات المشاركة",
    minBotBet: "أقل رهان للبوت",
    maxBotBet: "أعلى رهان للبوت",
    startSim: "بدء المحاكاة",
    simRunning: "جاري تشغيل خيط معالجة المحاكاة...",
    stabilityReport: "تقرير استقرار المحاكاة",
    simTip2: "قم بتشغيل المحاكاة لإنشاء تقارير ومخططات الأمان.",
    stabilityScore: "مؤشر الاستقرار",
    initialPool: "الخزينة الأولية",
    finalPool: "الخزينة النهائية",
    netProfit: "صافي الأرباح/الخسائر",
    frequencies: "توزيع فوز الصناديق",
    cancel: "إلغاء",
    forceOutcome: "فرض النتيجة يدوياً",
    reason: "السبب الإجباري",
    save: "حفظ التغييرات",
    betPrompt: "حدد قيمة الرهان:",
    placeBetBtn: "تأكيد الرهان",
    betSuccess: "تم تسجيل الرهان بنجاح!",
    recentResults: "شريط آخر الجولات:",
    myRoundsHistory: "سجل مراهناتي الحالية",
    betFree: "رهان الماسات",
    betCash: "رهان عملة شحن",
    referralSettings: "إعدادات الدعوات والمكافآت",
    referralActive: "تفعيل نظام الدعوات",
    inviteRewardInviter: "مكافأة الداعي (كونز)",
    inviteRewardInvitee: "مكافأة المدعو (كونز)",
    supportSettings: "إعدادات الدعم الفني",
    supportTelegram: "رابط الدعم تليجرام",
    supportWhatsApp: "رابط الدعم واتساب"
  },
  en: {
    brand: "Greed Boxes",
    dashboard: "Dashboard",
    users: "Users CRUD",
    deposits: "Deposits Queue",
    withdrawals: "Withdrawals",
    config: "Configurations",
    tasks: "Tasks",
    finance: "Accounting & Advisor 📊",
    pool: "Pool Logs",
    simulation: "Simulation Engine",
    playGame: "Game Section 🎮",
    profits: "My Profits 💰",
    withdrawProfit: "Withdraw Profit",
    totalProfits: "Total Profits",
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
    betCash: "Bet Cash Coins",
    referralSettings: "Referrals & Rewards Settings",
    referralActive: "Referral System Active",
    inviteRewardInviter: "Inviter Reward (Coins)",
    inviteRewardInvitee: "Invitee Reward (Coins)",
    supportSettings: "Technical Support Settings",
    supportTelegram: "Telegram Support Link",
    supportWhatsApp: "WhatsApp Support Link"
  }
};

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem("admin_lang") || "ar");
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("admin_user") || "null"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // Auth Form (Default credentials loaded, option to remember)
  const [email, setEmail] = useState(localStorage.getItem("remembered_admin_email") || "admin@greedboxes.com");
  const [password, setPassword] = useState(localStorage.getItem("remembered_admin_password") || "adminpassword");
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("remember_admin") === "true");
  const [authError, setAuthError] = useState("");

  // Live Stats & Sockets state
  const [stats, setStats] = useState(null);

  
  // Admin Profits state
  const [financeStats, setFinanceStats] = useState(null);
  const [financeLogs, setFinanceLogs] = useState([]);
  const [financeCurrency, setFinanceCurrency] = useState("IQD");
  const [newFinanceLog, setNewFinanceLog] = useState({ type: "EXPENSE", category: "MANUAL", amount: "", currency: "IQD", description: "" });
  const [showFinanceModal, setShowFinanceModal] = useState(false);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPoolType, setWithdrawPoolType] = useState("CASH");
  const [withdrawAmount, setWithdrawAmount] = useState("");


  // Rounds History state
  const [pastRounds, setPastRounds] = useState([]);
  const [selectedRoundId, setSelectedRoundId] = useState(null);
  const [roundPlayers, setRoundPlayers] = useState([]);
  const [loadingRoundPlayers, setLoadingRoundPlayers] = useState(false);

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
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTab, setDetailsTab] = useState("info");
  const [overrideBox, setOverrideBox] = useState(0);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideError, setOverrideError] = useState("");

  // Users Management State (new unified modal)
  const [showUserMgmtModal, setShowUserMgmtModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userMgmtTab, setUserMgmtTab] = useState("info");
  const [usersTab, setUsersTab] = useState("registered");

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
  const [filterRegDate, setFilterRegDate] = useState("");

  // Legacy modals (deposits/withdrawals)
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectType, setRejectType] = useState("");
  const [rejectId, setRejectId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Create/Edit Task Form
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskKey, setTaskKey] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskGoal, setTaskGoal] = useState("");
  const [taskReward, setTaskReward] = useState("");
  const [taskCurrency, setTaskCurrency] = useState("FREE");
  const [editingTask, setEditingTask] = useState(null);
  const [taskType, setTaskType] = useState("DAILY");
  const [taskActionType, setTaskActionType] = useState("");
  const [taskLinkUrl, setTaskLinkUrl] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskTypeFilter, setTaskTypeFilter] = useState("ALL");

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
    if (activeTab === "play") fetchPastRounds();
    if (activeTab === "deposits") fetchDeposits();
    if (activeTab === "withdrawals") fetchWithdrawals();
    if (activeTab === "config") fetchConfig();
    if (activeTab === "tasks") fetchTasks();
    if (activeTab === "finance") fetchFinanceStats();

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

  
  
  const fetchFinanceStats = () => {
    apiCall("/admin/finance/stats")
      .then(d => {
        setFinanceStats(d);
        setFinanceLogs(d.logs || []);
      })
      .catch(console.error);
  };


  
  const handleAddFinanceLog = async (e) => {
    e.preventDefault();
    if (!newFinanceLog.amount) return;
    try {
      await apiCall("/admin/finance/log", {
        method: "POST",
        body: JSON.stringify(newFinanceLog)
      });
      setShowFinanceModal(false);
      setNewFinanceLog({ type: "EXPENSE", category: "MANUAL", amount: "", currency: "IQD", description: "" });
      fetchFinanceStats();
      alert("تم التسجيل بنجاح!");
    } catch(err) {
      alert("حدث خطأ أثناء التسجيل");
    }
  };


  const handleWithdrawProfit = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
      alert("يرجى إدخال مبلغ صحيح");
      return;
    }
    try {
      const res = await apiCall("/admin/pool/withdraw", "POST", {
        poolType: withdrawPoolType,
        amount: Number(withdrawAmount)
      });
      alert(res.message || "تم سحب الأرباح بنجاح!");
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      fetchStats();
    } catch (err) {
      alert(err.error || "حدث خطأ أثناء سحب الأرباح");
    }
  };

  const fetchStats = () => apiCall("/admin/stats").then(setStats).catch(console.error);

  const fetchPastRounds = () => apiCall("/admin/rounds/recent").then(d => setPastRounds(d.rounds || [])).catch(console.error);
  const fetchRoundPlayers = (roundId) => {
    setSelectedRoundId(roundId);
    setLoadingRoundPlayers(true);
    apiCall(`/admin/rounds/${roundId}/players`)
      .then(d => setRoundPlayers(d.bets || []))
      .catch(console.error)
      .finally(() => setLoadingRoundPlayers(false));
  };

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
    if (!adjustAmount || parseFloat(adjustAmount) <= 0) { alert("يرجى إدخال مبلغ صحيح."); return; }
    if (!adjustReason) { alert("يرجى تحديد سبب العملية."); return; }
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
      alert("تمت إدارة العملات بنجاح!");
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
      alert("تم تحديث بيانات الحساب بنجاح!");
    } catch (err) { alert(err.message); }
  };

  const handleBanUser = async (days, reason) => {
    try {
      await apiCall(`/admin/users/${selectedUser.id}`, "PUT", {
        isBanned: true,
        banDays: days || undefined,
        banReason: reason || "حظر إداري"
      });
      fetchUsers();
      const updated = await apiCall(`/admin/users`);
      const freshUser = updated.users.find(u => u.id === selectedUser.id);
      if (freshUser) setSelectedUser(freshUser);
      alert(days ? `تم حظر المستخدم لمدة ${days} يوم.` : "تم الحظر النهائي.");
    } catch (err) { alert(err.message); }
  };

  const handleUnbanUser = async () => {
    try {
      await apiCall(`/admin/users/${selectedUser.id}`, "PUT", { isBanned: false });
      fetchUsers();
      const updated = await apiCall(`/admin/users`);
      const freshUser = updated.users.find(u => u.id === selectedUser.id);
      if (freshUser) setSelectedUser(freshUser);
      alert("تم فك الحظر بنجاح!");
    } catch (err) { alert(err.message); }
  };

  const handleBanDevice = async () => {
    if (!confirm("هل أنت متأكد من حظر جهاز هذا الحساب نهائياً؟")) return;
    const reason = prompt("أدخل سبب حظر الجهاز:") || "مخالفة الشروط العامة";
    try {
      await apiCall(`/admin/users/${selectedUser.id}/ban-device`, "POST", { reason });
      setShowUserMgmtModal(false);
      fetchUsers();
      alert("تم حظر الجهاز والحساب نهائياً بنجاح!");
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
      if (deleteTextVal !== "DELETE") { alert("يرجى كتابة كلمة DELETE بدقة للتأكيد."); return; }
      try {
        await apiCall(`/admin/users/${selectedUser.id}`, "DELETE");
        setShowUserMgmtModal(false);
        setDeleteConfirmStep(0);
        setDeleteTextVal("");
        fetchUsers();
        alert("تم حذف المستخدم وكافة السجلات المرتبطة به نهائياً!");
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

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await apiCall(`/admin/tasks/${editingTask.id}`, "PUT", {
          title: taskTitle,
          description: taskDesc,
          goalCount: parseInt(taskGoal),
          rewardAmount: parseFloat(taskReward),
          rewardCurrency: taskCurrency,
          type: taskType,
          actionType: taskActionType || null,
          linkUrl: taskLinkUrl || null
        });
      } else {
        await apiCall("/admin/tasks", "POST", {
          key: taskKey,
          title: taskTitle,
          description: taskDesc,
          goalCount: parseInt(taskGoal),
          rewardAmount: parseFloat(taskReward),
          rewardCurrency: taskCurrency,
          type: taskType,
          actionType: taskActionType || null,
          linkUrl: taskLinkUrl || null
        });
      }
      setShowTaskModal(false);
      setEditingTask(null);
      setTaskKey("");
      setTaskTitle("");
      setTaskDesc("");
      setTaskGoal("");
      setTaskReward("");
      setTaskType("DAILY");
      setTaskActionType("");
      setTaskLinkUrl("");
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskKey(task.key);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setTaskGoal(task.goalCount);
    setTaskReward(task.rewardAmount);
    setTaskCurrency(task.rewardCurrency);
    setTaskType(task.type || "DAILY");
    setTaskActionType(task.actionType || "");
    setTaskLinkUrl(task.linkUrl || "");
    setShowTaskModal(true);
  };

  const handleResetTask = async (taskId) => {
    if (!window.confirm(lang === "ar" ? "هل أنت متأكد من إعادة تعيين المهمة لجميع اللاعبين؟" : "Are you sure you want to reset this task for all players?")) return;
    try {
      await apiCall(`/admin/tasks/${taskId}/reset`, "POST");
      alert(lang === "ar" ? "تم إعادة التعيين بنجاح" : "Task reset successfully");
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

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm(lang === "ar" ? "هل أنت متأكد من حذف هذه المهمة نهائياً؟" : "Are you sure you want to delete this task permanently?")) return;
    try {
      await apiCall(`/admin/tasks/${taskId}`, "DELETE");
      alert(lang === "ar" ? "تم حذف المهمة بنجاح" : "Task deleted successfully");
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
              {lang === "ar" ? "English" : "العربية"}
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
              {lang === "ar" ? "تذكرني في هذا المتصفح" : "Remember Me"}
            </label>
          </div>

          <div style={{ padding: "0.75rem", background: "rgba(255,255,255,0.05)", borderRadius: "6px", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1rem", border: "1px solid rgba(255,255,255,0.1)" }}>
            <strong>🔑 {lang === "ar" ? "بيانات الدخول الافتراضية للوحة:" : "Default Admin Credentials:"}</strong>
            <div style={{ marginTop: "0.25rem" }}>Email: <code>admin@greedboxes.com</code></div>
            <div>Password: <code>adminpassword</code></div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>{t.loginBtn}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-app" dir={direction}>
      {/* Sidebar Backdrop Overlay on Mobile */}
      {showMobileSidebar && (
        <div className="sidebar-backdrop" onClick={() => setShowMobileSidebar(false)}></div>
      )}

      {/* Sidebar Nav */}
      <div className={`sidebar ${showMobileSidebar ? "open" : ""}`}>
        <div className="brand" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>{t.brand}</h1>
          <button type="button" className="btn" style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }} onClick={handleLanguageToggle}>
            {lang === "ar" ? "EN" : "AR"}
          </button>
        </div>
        <ul className="nav-links">
          <li className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => { setActiveTab("dashboard"); setShowMobileSidebar(false); }}>{t.dashboard}</li>
          <li className={`nav-item ${activeTab === "play" ? "active" : ""}`} onClick={() => { setActiveTab("play"); fetchMyWallet(); setShowMobileSidebar(false); }}>{t.playGame}</li>
          <li className={`nav-item ${activeTab === "finance" ? "active" : ""}`} onClick={() => { setActiveTab("finance"); setShowMobileSidebar(false); }}>{t.finance}</li>

          <li className={`nav-item ${activeTab === "tasks" ? "active" : ""}`} onClick={() => { setActiveTab("tasks"); setShowMobileSidebar(false); }}>{t.tasks}</li>
          <li className={`nav-item ${activeTab === "users" ? "active" : ""}`} onClick={() => { setActiveTab("users"); setShowMobileSidebar(false); }}>{t.users}</li>
          <li className={`nav-item ${activeTab === "deposits" ? "active" : ""}`} onClick={() => { setActiveTab("deposits"); setShowMobileSidebar(false); }}>{t.deposits}</li>
          <li className={`nav-item ${activeTab === "withdrawals" ? "active" : ""}`} onClick={() => { setActiveTab("withdrawals"); setShowMobileSidebar(false); }}>{t.withdrawals}</li>
          <li className={`nav-item ${activeTab === "config" ? "active" : ""}`} onClick={() => { setActiveTab("config"); setShowMobileSidebar(false); }}>{t.config}</li>
          <li className={`nav-item ${activeTab === "pool" ? "active" : ""}`} onClick={() => { setActiveTab("pool"); setShowMobileSidebar(false); }}>{t.pool}</li>
          <li className={`nav-item ${activeTab === "simulation" ? "active" : ""}`} onClick={() => { setActiveTab("simulation"); setShowMobileSidebar(false); }}>{t.simulation}</li>
          <li className="nav-item logout-btn" onClick={() => { handleLogout(); setShowMobileSidebar(false); }}>{t.logout}</li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Mobile top navigation header */}
        <div className="mobile-header">
          <button className="menu-toggle-btn" onClick={() => setShowMobileSidebar(true)}>
            ☰
          </button>
          <h2>{t.brand}</h2>
          <button type="button" className="btn" style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }} onClick={handleLanguageToggle}>
            {lang === "ar" ? "EN" : "AR"}
          </button>
        </div>
        {activeTab === "dashboard" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2>{t.dashboard}</h2>
              <span className={`badge ${socketConnected ? "revealing" : "locked"}`}>
                {t.socketStatus}: {socketConnected ? t.connected : t.disconnected}
              </span>
            </div>

            <div className="stats-grid">
              {/* المستخدمين: متصلين الآن */}
              <div className="glass-card stat-card sky-blue">
                <span className="stat-label">المستخدمين (متصلين الآن)</span>
                <span className="stat-value" style={{ color: '#87CEEB', marginTop: '10px' }}>{formatNumber(stats?.counts?.usersOnline)}</span>
              </div>

              {/* المستخدمين: كل المستخدمين */}
              <div className="glass-card stat-card sky-blue">
                <span className="stat-label">كل المستخدمين</span>
                <span className="stat-value" style={{ marginTop: '10px' }}>{formatNumber(stats?.counts?.users)}</span>
              </div>

              {/* الكونزات */}
              <div className="glass-card stat-card gold">
                <span className="stat-label">جميع كونزات المستخدمين</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
                  <span className="stat-value">{formatNumber(stats?.counts?.totalUserCoins)}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    ≈ ${( (stats?.counts?.totalUserCoins || 0) / 3000000 ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* الماسات */}
              <div className="glass-card stat-card turquoise">
                <span className="stat-label">جميع ماسات المستخدمين</span>
                <span className="stat-value" style={{ color: '#40E0D0', marginTop: '10px' }}>{formatNumber(stats?.counts?.totalUserDiamonds)}</span>
              </div>


              {/* إجمالي الأرباح - كونزات */}
              <div className="glass-card stat-card green">
                <span className="stat-label">{t.totalProfits} - كونزات</span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "10px", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span className="stat-value" style={{ color: 'var(--accent-gold)' }}>{formatNumber(stats?.adminProfits?.cash)}</span>
                  <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    ≈ ${( (stats?.adminProfits?.cash || 0) / 3000000 ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* إجمالي الأرباح - ماسات */}
              <div className="glass-card stat-card green">
                <span className="stat-label">{t.totalProfits} - ماسات</span>
                <span className="stat-value" style={{ color: '#40E0D0', marginTop: '10px' }}>{formatNumber(stats?.adminProfits?.free)}</span>
              </div>
              {/* المتجر - جميع المنتجات */}
              <div className="glass-card stat-card turquoise">
                <span className="stat-label">المتجر - جميع المنتجات</span>
                <span className="stat-value" style={{ marginTop: '10px' }}>{formatNumber(stats?.store?.productsCount)}</span>
              </div>

              {/* المتجر - جميع الطلبات */}
              <div className="glass-card stat-card turquoise">
                <span className="stat-label">المتجر - جميع الطلبات</span>
                <span className="stat-value" style={{ marginTop: '10px' }}>{formatNumber(stats?.store?.totalOrders)}</span>
              </div>

              {/* المتجر - الطلبات المعلقة */}
              <div className="glass-card stat-card turquoise">
                <span className="stat-label">طلبات المتجر المعلقة</span>
                <span className="stat-value" style={{ color: 'var(--accent-gold)', marginTop: '10px' }}>{formatNumber(stats?.store?.pendingOrders)}</span>
              </div>

              {/* المتجر - الطلبات المقبولة */}
              <div className="glass-card stat-card turquoise">
                <span className="stat-label">طلبات المتجر المقبولة</span>
                <span className="stat-value" style={{ color: 'var(--accent-neon-green)', marginTop: '10px' }}>{formatNumber(stats?.store?.approvedOrders)}</span>
              </div>

              {/* المتجر - الطلبات المرفوضة */}
              <div className="glass-card stat-card turquoise">
                <span className="stat-label">طلبات المتجر المرفوضة</span>
                <span className="stat-value" style={{ color: 'var(--accent-neon-red)', marginTop: '10px' }}>{formatNumber(stats?.store?.rejectedOrders)}</span>
              </div>
            </div>

          </div>
        )}

        {/* Playable simulator for game testing */}
        {activeTab === "play" && (
          <div>
            <h2>{t.playGame}</h2>


            <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
              {/* الصندوق الاسود - كونزات */}
              <div className="glass-card stat-card sky-blue">
                <span className="stat-label">الصندوق الأسود (الخزينة) - كونزات</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className="stat-value" style={{ color: 'var(--accent-gold)' }}>{formatNumber(stats?.pools?.cash)}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    ≈ ${( (stats?.pools?.cash || 0) / 3000000 ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <button className="btn btn-primary" style={{ marginTop: "15px", width: "100%", padding: "0.5rem" }} onClick={() => { setWithdrawPoolType("CASH"); setShowWithdrawModal(true); }}>{t.withdrawProfit}</button>
              </div>

              {/* الصندوق الاسود - ماسات */}
              <div className="glass-card stat-card sky-blue">
                <span className="stat-label">الصندوق الأسود (الخزينة) - ماسات</span>
                <span className="stat-value" style={{ color: '#40E0D0', marginTop: '10px' }}>{formatNumber(stats?.pools?.free)}</span>
                <button className="btn btn-primary" style={{ marginTop: "15px", width: "100%", padding: "0.5rem" }} onClick={() => { setWithdrawPoolType("FREE"); setShowWithdrawModal(true); }}>{t.withdrawProfit}</button>
              </div>
            </div>
            {/* Rounds Ribbon */}
            <div className="glass-card" style={{ marginBottom: "1.5rem" }}>
              <h3>شريط الجولات السابقة</h3>
              <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", padding: "1rem 0" }}>
                {pastRounds.map(r => (
                  <button 
                    key={r.id} 
                    className={`btn ${selectedRoundId === r.id ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => fetchRoundPlayers(r.id)}
                    style={{ minWidth: "100px", flexShrink: 0 }}
                  >
                    جولة #{r.sequenceNumber}
                    <br/>
                    <small>{r.winningMultiplier ? r.winningMultiplier + 'x' : 'N/A'}</small>
                  </button>
                ))}
                {pastRounds.length === 0 && <span style={{ color: "var(--text-muted)" }}>لا توجد جولات منتهية بعد.</span>}
              </div>

              {/* Round Players Details */}
              {selectedRoundId && (
                <div style={{ marginTop: "1.5rem" }}>
                  <h4>تفاصيل الجولة #{pastRounds.find(r => r.id === selectedRoundId)?.sequenceNumber}</h4>
                  {loadingRoundPlayers ? (
                    <p style={{ color: "var(--text-muted)" }}>جاري التحميل...</p>
                  ) : (
                    <div className="table-container" style={{ marginTop: "1rem" }}>
                      <table>
                        <thead>
                          <tr>
                            <th>الآيدي (ID)</th>
                            <th>مبلغ المراهنة</th>
                            <th>مبلغ الربح</th>
                            <th>العملة</th>
                            <th>الصندوق</th>
                            <th>النتيجة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roundPlayers.map(bet => (
                            <tr key={bet.betId}>
                              <td style={{ fontFamily: "monospace" }}>{bet.playerId}</td>
                              <td>{formatNumber(bet.amount)}</td>
                              <td style={{ color: bet.status === "WON" ? "var(--accent-neon-green)" : "inherit" }}>
                                {bet.status === "WON" ? `+${formatNumber(bet.winAmount)}` : "0"}
                              </td>
                              <td>{bet.currency === "CASH" ? "كونزات" : "ماسات"}</td>
                              <td>{bet.boxIndex}</td>
                              <td>
                                <span className={`badge ${bet.status.toLowerCase()}`}>{bet.status}</span>
                              </td>
                            </tr>
                          ))}
                          {roundPlayers.length === 0 && (
                            <tr>
                              <td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)" }}>لا يوجد لاعبين في هذه الجولة</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="glass-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <h3>{t.roundStatus}</h3>
                <span className={`badge ${(liveRound?.status || "ended").toLowerCase()}`}>
                  {liveRound?.status || "ENDED"}
                </span>
              </div>
              
              <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                <div>
                  <span className="stat-label">{t.roundId}</span>
                  <p style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "var(--accent-gold)", wordBreak: "break-all" }}>
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
                      <div className="box-bets-value">{formatNumber(betsTotal, 1)} {liveRound?.currencyMode === "FREE_ONLY" ? "FREE" : "CASH"}</div>
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

        {/* ═══ Users Management Panel ═══ */}
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
              u.phoneNumber?.includes(searchVal)
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                  { label: "إجمالي المستخدمين", value: users.length, color: "#a855f7" },
                  { label: "مسجلون", value: registeredUsers.length, color: "#3b82f6" },
                  { label: "زوار", value: guestUsers.length, color: "#6b7280" },
                  { label: "نشطون", value: activeCount, color: "#22c55e" },
                  { label: "موقوف مؤقت", value: tempBannedCount, color: "#f59e0b" },
                  { label: "محظور نهائي", value: bannedCount, color: "#ef4444" },
                  { label: "💎 إجمالي الماسات", value: Math.roundformatNumber(totalDiamonds), color: "#38bdf8" },
                  { label: "🪙 إجمالي الكونزات", value: Math.roundformatNumber(totalCoins), color: "#f59e0b" },
                ].map((card, i) => (
                  <div key={i} className="glass-card" style={{ padding: "0.8rem 1rem", borderLeft: `3px solid ${card.color}` }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>{card.label}</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: "700", color: card.color }}>{card.value}</div>
                  </div>
                ))}
              </div>

              <div className="glass-card">
                {/* Header + Search */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                  <h2 style={{ margin: 0 }}>إدارة المستخدمين</h2>
                  <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                    <input type="text" placeholder="🔍 بحث بالاسم، ID، بريد، هاتف..." value={searchUser}
                      onChange={e => { setSearchUser(e.target.value); setUsersPage(1); }} style={{ width: "230px", margin: 0 }} />
                    <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setUsersPage(1); }} style={{ margin: 0 }}>
                      <option value="ALL">كل الحالات</option>
                      <option value="ACTIVE">🟢 نشط</option>
                      <option value="BANNED_TEMP">🟡 موقوف مؤقت</option>
                      <option value="BANNED_PERM">🔴 محظور نهائي</option>
                    </select>
                    <select value={filterSort} onChange={e => setFilterSort(e.target.value)} style={{ margin: 0 }}>
                      <option value="newest">الأحدث أولاً</option>
                      <option value="most_diamonds">💎 أعلى ماسات</option>
                      <option value="most_coins">🪙 أعلى كونزات</option>
                    </select>
                  </div>
                </div>

                {/* Tabs: Registered / Guests */}
                <div style={{ display: "flex", borderBottom: "1px solid var(--glass-border)", marginBottom: "1rem" }}>
                  {[
                    { key: "registered", label: `👤 الحسابات المسجلة (${registeredUsers.length})` },
                    { key: "guests", label: `👻 الزوار (${guestUsers.length})` },
                  ].map(tab => (
                    <button key={tab.key}
                      onClick={() => { setUsersTab(tab.key); setUsersPage(1); setSearchUser(""); setFilterStatus("ALL"); }}
                      style={{ padding: "0.6rem 1.2rem", border: "none", background: "transparent", cursor: "pointer",
                        fontSize: "0.88rem", fontWeight: usersTab === tab.key ? "700" : "400",
                        color: usersTab === tab.key ? "var(--accent-gold)" : "var(--text-muted)",
                        borderBottom: usersTab === tab.key ? "2px solid var(--accent-gold)" : "2px solid transparent" }}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Table */}
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th>الاسم</th>
                        <th>ID</th>
                        <th>البريد / النوع</th>
                        <th>الهاتف</th>
                        <th style={{ color: "#38bdf8" }}>💎 الماسات</th>
                        <th style={{ color: "#f59e0b" }}>🪙 الكونزات</th>
                        <th>الحالة</th>
                        <th style={{ textAlign: "center" }}>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map(u => {
                        const initials = (u.displayNickname || u.username || "?")[0].toUpperCase();
                        const isPerm = u.isBanned && !u.banExpiresAt;
                        const isTemp = u.isBanned && u.banExpiresAt;
                        const statusEmoji = isPerm ? "🔴" : isTemp ? "🟡" : u.role === "GUEST" ? "👤" : "🟢";
                        const statusLabel = isPerm ? "محظور نهائياً" : isTemp ? "موقوف مؤقت" : u.role === "GUEST" ? "زائر" : "نشط";
                        const rowBg = isPerm ? "rgba(239,68,68,0.05)" : isTemp ? "rgba(245,158,11,0.05)" : "transparent";
                        return (
                          <tr key={u.id} style={{ background: rowBg }}>
                            <td>
                              <div style={{ width: "34px", height: "34px", borderRadius: "50%",
                                background: "linear-gradient(135deg,#DA22FF,#9733EE)", display: "flex",
                                alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#fff", fontSize: "0.9rem" }}>
                                {initials}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: "600", fontSize: "0.88rem" }}>{u.displayNickname || u.username}</div>
                              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                <span style={{ fontFamily: "monospace", color: "var(--accent-gold)", fontWeight: "700", fontSize: "0.83rem" }}>
                                  {u.publicId}
                                </span>
                                <button onClick={() => navigator.clipboard.writeText(u.publicId)}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.8rem", padding: "1px 3px" }}
                                  title="نسخ">⎘</button>
                              </div>
                            </td>
                            <td style={{ fontSize: "0.8rem" }}>
                              {u.email ? <div>{u.email}</div> : <span style={{ color: "#6b7280", fontStyle: "italic" }}>Guest Account</span>}
                              <span className="badge ended" style={{ fontSize: "0.62rem", padding: "1px 5px", marginTop: "2px", display: "inline-block" }}>{u.role}</span>
                            </td>
                            <td style={{ fontSize: "0.8rem" }}>
                              {u.phoneNumber
                                ? <span style={{ fontFamily: "monospace" }}><span style={{ color: "var(--accent-gold)" }}>{u.countryCode || ""}</span> {u.phoneNumber}</span>
                                : <span style={{ color: "var(--text-muted)" }}>—</span>}
                            </td>
                            <td><strong style={{ color: "#38bdf8" }}>{formatNumber(u.wallet?.freeBalance || 0)}</strong></td>
                            <td><strong style={{ color: "#f59e0b" }}>{formatNumber(u.wallet?.cashBalance || 0)}</strong></td>
                            <td>
                              <span style={{ fontSize: "0.83rem" }}>{statusEmoji} {statusLabel}</span>
                              {isTemp && u.banExpiresAt && (
                                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                                  حتى: {new Date(u.banExpiresAt).toLocaleDateString("ar-EG")}
                                </div>
                              )}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <button onClick={() => openUserMgmt(u)}
                                style={{ padding: "0.38rem 0.85rem", fontSize: "0.8rem",
                                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none",
                                  color: "#fff", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
                                إدارة ⚙️
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {paged.length === 0 && (
                        <tr><td colSpan="9" style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem" }}>
                          لا يوجد مستخدمون يطابقون معايير البحث.
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                      <button className="btn" disabled={usersPage <= 1} onClick={() => setUsersPage(p => p - 1)}
                        style={{ padding: "0.3rem 0.7rem", fontSize: "0.78rem", opacity: usersPage <= 1 ? 0.4 : 1 }}>‹ السابق</button>
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                        <button key={i+1} className={`btn ${usersPage === i+1 ? "btn-primary" : ""}`}
                          onClick={() => setUsersPage(i+1)} style={{ padding: "0.3rem 0.6rem", fontSize: "0.78rem", minWidth: "30px" }}>{i+1}</button>
                      ))}
                      <button className="btn" disabled={usersPage >= totalPages} onClick={() => setUsersPage(p => p + 1)}
                        style={{ padding: "0.3rem 0.7rem", fontSize: "0.78rem", opacity: usersPage >= totalPages ? 0.4 : 1 }}>التالي ›</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      <span>{filtered.length} مستخدم | صفحة {usersPage}/{totalPages}</span>
                      <select value={usersPerPage} onChange={e => { setUsersPerPage(+e.target.value); setUsersPage(1); }}
                        style={{ margin: 0, padding: "0.28rem", fontSize: "0.78rem", width: "80px" }}>
                        {[25, 50, 100, 250].map(n => <option key={n} value={n}>{n}/صفحة</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ═══ User Management Modal ═══ */}
        {showUserMgmtModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowUserMgmtModal(false)}>
            <div className="glass-card" onClick={e => e.stopPropagation()}
              style={{ maxWidth: "740px", width: "96%", maxHeight: "92vh", overflowY: "auto", borderRadius: "16px" }}>

              {/* Modal Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--glass-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "50%",
                    background: "linear-gradient(135deg,#DA22FF,#9733EE)", display: "flex",
                    alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#fff", fontSize: "1.3rem" }}>
                    {(selectedUser.displayNickname || selectedUser.username || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "1.05rem" }}>{selectedUser.displayNickname || selectedUser.username}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--accent-gold)", fontFamily: "monospace" }}>
                      ID: {selectedUser.publicId} • {selectedUser.role}
                    </div>
                  </div>
                </div>
                <button className="btn btn-danger" style={{ padding: "0.38rem 0.75rem" }} onClick={() => setShowUserMgmtModal(false)}>✕ إغلاق</button>
              </div>

              {/* Modal Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--glass-border)", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                {[
                  { key: "info", label: "📋 المعلومات" },
                  { key: "edit", label: "✏️ تعديل" },
                  { key: "coins", label: "🪙 العملات" },
                  { key: "ban", label: "🚫 الحظر" },
                  { key: "logs", label: "📜 السجلات" },
                  { key: "danger", label: "⚠️ خطر" },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setUserMgmtTab(tab.key)}
                    style={{ padding: "0.55rem 0.9rem", border: "none", background: "transparent", cursor: "pointer",
                      fontSize: "0.82rem", fontWeight: userMgmtTab === tab.key ? "700" : "400",
                      color: userMgmtTab === tab.key ? "var(--accent-gold)" : "var(--text-muted)",
                      borderBottom: userMgmtTab === tab.key ? "2px solid var(--accent-gold)" : "2px solid transparent" }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab: INFO */}
              {userMgmtTab === "info" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.75rem" }}>الملف الشخصي</h4>
                    {[
                      ["UUID", <span style={{ fontFamily: "monospace", fontSize: "0.7rem" }}>{selectedUser.id}</span>],
                      ["Public ID", <strong style={{ color: "var(--accent-gold)" }}>{selectedUser.publicId}</strong>],
                      ["الاسم الظاهر", selectedUser.displayNickname || "—"],
                      ["اسم المستخدم", `@${selectedUser.username}`],
                      ["البريد", selectedUser.email || <em style={{ color: "#6b7280" }}>Guest Account</em>],
                      ["العمر", selectedUser.age || "—"],
                      ["الجنس", selectedUser.gender === "MALE" ? "ذكر ♂" : selectedUser.gender === "FEMALE" ? "أنثى ♀" : "—"],
                      ["تاريخ التسجيل", new Date(selectedUser.createdAt).toLocaleString("ar-EG")],
                      ["الجولات / الفوز", `${selectedUser.roundsPlayed} / ${selectedUser.roundsWon}`],
                    ].map(([label, val], i) => (
                      <p key={i} style={{ margin: "0.3rem 0", fontSize: "0.86rem" }}><strong>{label}: </strong>{val}</p>
                    ))}
                  </div>
                  <div>
                    <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.75rem" }}>الأمان والمحفظة</h4>
                    {[
                      ["الهاتف", selectedUser.phoneNumber ? `${selectedUser.countryCode || ""} ${selectedUser.phoneNumber}` : "—"],
                      ["Device ID", <span style={{ fontFamily: "monospace", fontSize: "0.7rem" }}>{selectedUser.deviceId || "—"}</span>],
                      ["💎 الماسات", <strong style={{ color: "#38bdf8", fontSize: "1.1rem" }}>{formatNumber(selectedUser.wallet?.freeBalance || 0)}</strong>],
                      ["🪙 الكونزات", <strong style={{ color: "#f59e0b", fontSize: "1.1rem" }}>{formatNumber(selectedUser.wallet?.cashBalance || 0)}</strong>],
                    ].map(([label, val], i) => (
                      <p key={i} style={{ margin: "0.3rem 0", fontSize: "0.86rem" }}><strong>{label}: </strong>{val}</p>
                    ))}
                    <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "8px",
                      background: selectedUser.isBanned ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.08)",
                      border: `1px solid ${selectedUser.isBanned ? "#ef4444" : "#22c55e"}` }}>
                      <strong style={{ color: selectedUser.isBanned ? "#ef4444" : "#22c55e" }}>
                        {selectedUser.isBanned
                          ? (selectedUser.banExpiresAt ? `🟡 موقوف حتى ${new Date(selectedUser.banExpiresAt).toLocaleDateString("ar-EG")}` : "🔴 محظور نهائياً")
                          : "🟢 الحساب نشط"}
                      </strong>
                      {selectedUser.banReason && <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "4px" }}>السبب: {selectedUser.banReason}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: EDIT */}
              {userMgmtTab === "edit" && (
                <form onSubmit={handleEditUser}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label>الاسم الظاهر</label>
                      <input type="text" value={editNickname} onChange={e => setEditNickname(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Public ID {user?.role !== "SUPERADMIN" && <span style={{ color: "var(--accent-gold)", fontSize: "0.72rem" }}>(SuperAdmin فقط)</span>}</label>
                      <input type="text" value={editPublicId} onChange={e => setEditPublicId(e.target.value)}
                        disabled={user?.role !== "SUPERADMIN"} style={{ opacity: user?.role !== "SUPERADMIN" ? 0.5 : 1 }} />
                    </div>
                    <div className="form-group">
                      <label>العمر</label>
                      <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>الجنس</label>
                      <select value={editGender} onChange={e => setEditGender(e.target.value)}>
                        <option value="MALE">ذكر ♂</option>
                        <option value="FEMALE">أنثى ♀</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>رمز الدولة</label>
                      <select value={editCountryCode} onChange={e => setEditCountryCode(e.target.value)}>
                        {["+964","+966","+971","+20","+965","+968","+973","+974","+967","+249","+218","+212","+213","+216","+961","+963","+962","+970"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>رقم الهاتف</label>
                      <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="7712345678" />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1/-1" }}>
                      <label>كلمة مرور جديدة (اتركها فارغة للتخطي)</label>
                      <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.75rem 0" }}>
                    <input type="checkbox" id="removeAv2" checked={removeAvatar} onChange={e => setRemoveAvatar(e.target.checked)} style={{ width: "16px", height: "16px" }} />
                    <label htmlFor="removeAv2" style={{ cursor: "pointer", fontSize: "0.83rem" }}>حذف الصورة الشخصية وإرجاع الافتراضية</label>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                    <button type="button" className="btn" onClick={() => setUserMgmtTab("info")}>إلغاء</button>
                    <button type="submit" className="btn btn-primary">💾 حفظ التغييرات</button>
                  </div>
                </form>
              )}

              {/* Tab: COINS */}
              {userMgmtTab === "coins" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ padding: "1.1rem", borderRadius: "10px", background: "rgba(56,189,248,0.08)", border: "1px solid #38bdf8", textAlign: "center" }}>
                      <div style={{ fontSize: "0.82rem", color: "#38bdf8", marginBottom: "4px" }}>💎 رصيد الماسات</div>
                      <div style={{ fontSize: "1.7rem", fontWeight: "700", color: "#38bdf8" }}>{formatNumber(selectedUser.wallet?.freeBalance || 0)}</div>
                    </div>
                    <div style={{ padding: "1.1rem", borderRadius: "10px", background: "rgba(245,158,11,0.08)", border: "1px solid #f59e0b", textAlign: "center" }}>
                      <div style={{ fontSize: "0.82rem", color: "#f59e0b", marginBottom: "4px" }}>🪙 رصيد الكونزات</div>
                      <div style={{ fontSize: "1.7rem", fontWeight: "700", color: "#f59e0b" }}>{formatNumber(selectedUser.wallet?.cashBalance || 0)}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label>نوع العملية</label>
                      <select value={adjustOp} onChange={e => setAdjustOp(e.target.value)}>
                        <option value="ADD">➕ إضافة</option>
                        <option value="SUBTRACT">➖ سحب</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>نوع العملة</label>
                      <select value={adjustType} onChange={e => setAdjustType(e.target.value)}>
                        <option value="FREE">💎 الماسات (مجانية)</option>
                        <option value="CASH">🪙 الكونزات (مدفوعة)</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>المبلغ</label>
                    <input type="number" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} placeholder="مثال: 5000" min="1" />
                  </div>
                  <div className="form-group">
                    <label>السبب (إجباري)</label>
                    <select value={adjustReason} onChange={e => setAdjustReason(e.target.value)}>
                      <option value="">-- اختر السبب --</option>
                      <option value="مكافأة">🏆 مكافأة</option>
                      <option value="تعويض">💸 تعويض</option>
                      <option value="تصحيح رصيد">🔧 تصحيح رصيد</option>
                      <option value="عقوبة">⚠️ عقوبة</option>
                      <option value="هدية إدارية">🎁 هدية إدارية</option>
                      <option value="استرجاع">↩️ استرجاع</option>
                    </select>
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleAdjustBalance}>
                    {adjustOp === "ADD" ? "➕ إضافة العملات" : "➖ سحب العملات"}
                  </button>
                </div>
              )}

              {/* Tab: BAN */}
              {userMgmtTab === "ban" && (
                <div>
                  {selectedUser.isBanned && (
                    <div style={{ padding: "0.85rem 1rem", borderRadius: "8px", background: "rgba(239,68,68,0.08)",
                      border: "1px solid #ef4444", marginBottom: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ color: "#ef4444" }}>
                          {selectedUser.banExpiresAt ? `🟡 موقوف حتى ${new Date(selectedUser.banExpiresAt).toLocaleDateString("ar-EG")}` : "🔴 محظور نهائياً"}
                        </strong>
                        {selectedUser.banReason && <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>السبب: {selectedUser.banReason}</div>}
                      </div>
                      <button className="btn btn-success" onClick={handleUnbanUser} style={{ fontSize: "0.8rem" }}>✅ فك الحظر</button>
                    </div>
                  )}
                  <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.75rem" }}>الحظر المؤقت</h4>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    {[1, 3, 7, 30].map(d => (
                      <button key={d} className="btn" style={{ padding: "0.45rem 1rem", fontSize: "0.8rem", border: "1px solid var(--glass-border)" }}
                        onClick={() => { if (confirm(`حظر المستخدم لمدة ${d} يوم؟`)) handleBanUser(d, banReason || `حظر مؤقت ${d} يوم`); }}>
                        {d} يوم
                      </button>
                    ))}
                  </div>
                  <div className="form-group">
                    <label>مدة مخصصة (أيام)</label>
                    <input type="number" value={banDays} onChange={e => setBanDays(e.target.value)} placeholder="مثال: 14" min="1" />
                  </div>
                  <div className="form-group">
                    <label>سبب الحظر</label>
                    <textarea value={banReason} onChange={e => setBanReason(e.target.value)} rows="2" placeholder="اكتب سبب الحظر..." />
                  </div>
                  <button className="btn" style={{ background: "#f59e0b", color: "#000", width: "100%", fontWeight: "700" }}
                    onClick={() => { if (confirm(`حظر المستخدم لمدة ${banDays} يوم؟`)) handleBanUser(parseInt(banDays), banReason); }}>
                    🟡 تطبيق الحظر المؤقت
                  </button>
                  {user?.role === "SUPERADMIN" && (
                    <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "8px", border: "1px dashed #ef4444", background: "rgba(239,68,68,0.04)" }}>
                      <h4 style={{ color: "#ef4444", margin: "0 0 0.5rem" }}>🔴 الحظر النهائي (SuperAdmin)</h4>
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button className="btn btn-danger" style={{ flex: 1 }}
                          onClick={() => { if (confirm("حظر نهائي للحساب؟")) handleBanUser(null, banReason || "حظر نهائي"); }}>
                          🚫 حظر الحساب نهائياً
                        </button>
                        <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleBanDevice}>
                          📵 حظر الجهاز نهائياً
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: LOGS */}
              {userMgmtTab === "logs" && (
                <div>
                  {logsLoading ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>⏳ جاري تحميل السجلات...</div>
                  ) : (
                    <div>
                      <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.5rem" }}>📊 سجل النشاط ({userLogs.activityLogs.length})</h4>
                      <div style={{ maxHeight: "190px", overflowY: "auto", marginBottom: "1.2rem" }}>
                        {userLogs.activityLogs.length === 0
                          ? <p style={{ color: "var(--text-muted)", textAlign: "center" }}>لا يوجد سجل نشاط.</p>
                          : userLogs.activityLogs.map((log, i) => (
                            <div key={i} style={{ padding: "0.45rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                              display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.81rem" }}>
                              <div><span className="badge ended" style={{ fontSize: "0.58rem", padding: "1px 4px", marginInlineEnd: "6px" }}>{log.type}</span>{log.message}</div>
                              <div style={{ color: "var(--text-muted)", whiteSpace: "nowrap", fontSize: "0.72rem" }}>{new Date(log.date).toLocaleString("ar-EG")}</div>
                            </div>
                          ))
                        }
                      </div>
                      <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.5rem" }}>🛡️ الإجراءات الإدارية ({userLogs.adminActions.length})</h4>
                      <div style={{ maxHeight: "190px", overflowY: "auto" }}>
                        {userLogs.adminActions.length === 0
                          ? <p style={{ color: "var(--text-muted)", textAlign: "center" }}>لا يوجد إجراءات إدارية.</p>
                          : userLogs.adminActions.map((log, i) => (
                            <div key={i} style={{ padding: "0.45rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                              display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.81rem" }}>
                              <div><span style={{ background: "var(--accent-gold)", color: "#000", fontSize: "0.58rem", padding: "1px 5px", borderRadius: "3px", marginInlineEnd: "6px" }}>{log.type?.replace("ADMIN_","")}</span>{log.message}</div>
                              <div style={{ color: "var(--text-muted)", whiteSpace: "nowrap", fontSize: "0.72rem" }}>{new Date(log.date).toLocaleString("ar-EG")}</div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: DANGER */}
              {userMgmtTab === "danger" && (
                user?.role === "SUPERADMIN" ? (
                  <div style={{ padding: "1rem", border: "1px dashed #ef4444", borderRadius: "10px", background: "rgba(239,68,68,0.04)" }}>
                    <h4 style={{ color: "#ef4444", margin: "0 0 0.5rem" }}>⚠️ حذف الحساب نهائياً من قاعدة البيانات</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                      سيتم مسح المحفظة، الجولات، المهام، الإحالات وجميع البيانات المرتبطة. لا يمكن التراجع عنه.
                    </p>
                    {deleteConfirmStep === 0 && (
                      <button className="btn btn-danger" onClick={handleDeleteUser}>🗑️ حذف الحساب نهائياً</button>
                    )}
                    {deleteConfirmStep === 1 && (
                      <div>
                        <p style={{ color: "#ef4444", fontWeight: "700", marginBottom: "0.5rem" }}>هل أنت متأكد تماماً؟</p>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button className="btn btn-danger" onClick={handleDeleteUser}>نعم، متأكد</button>
                          <button className="btn" onClick={() => setDeleteConfirmStep(0)}>إلغاء</button>
                        </div>
                      </div>
                    )}
                    {deleteConfirmStep === 2 && (
                      <div>
                        <p style={{ color: "#ef4444", fontWeight: "700", marginBottom: "0.5rem" }}>اكتب DELETE للتأكيد النهائي:</p>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <input type="text" value={deleteTextVal} onChange={e => setDeleteTextVal(e.target.value)}
                            placeholder="DELETE" style={{ width: "140px", margin: 0, border: "1px solid #ef4444" }} />
                          <button className="btn btn-danger" onClick={handleDeleteUser}>💥 تدمير الحساب</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    <div style={{ fontSize: "2rem" }}>🔒</div>
                    <div>هذا القسم متاح للمدير العام (SuperAdmin) فقط.</div>
                  </div>
                )
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
                      <td><strong>{formatNumber(d.amount, 2)} CASH</strong></td>
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
                      <td><strong>{formatNumber(w.amount, 2)} CASH</strong></td>
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

            <h3 style={{ marginTop: "1.5rem", marginBottom: "0.75rem" }}>{t.referralSettings}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div className="form-group">
                <label>{t.referralActive}</label>
                <select value={config.isReferralActive ? "true" : "false"} onChange={e => setConfig({ ...config, isReferralActive: e.target.value === "true" })}>
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Limit per day</label>
                <input type="number" value={config.dailyInviteLimit || 5} onChange={e => setConfig({ ...config, dailyInviteLimit: parseInt(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>{t.inviteRewardInviter}</label>
                <input type="number" value={config.inviteRewardInviter || 0} onChange={e => setConfig({ ...config, inviteRewardInviter: parseFloat(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>{t.inviteRewardInvitee}</label>
                <input type="number" value={config.inviteRewardInvitee || 0} onChange={e => setConfig({ ...config, inviteRewardInvitee: parseFloat(e.target.value) })} required />
              </div>
            </div>

            <h3 style={{ marginTop: "1.5rem", marginBottom: "0.75rem" }}>{t.supportSettings}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div className="form-group">
                <label>{t.supportTelegram}</label>
                <input type="text" value={config.supportTelegram || ""} onChange={e => setConfig({ ...config, supportTelegram: e.target.value })} placeholder="e.g. https://t.me/yourusername" />
              </div>
              <div className="form-group">
                <label>{t.supportWhatsApp}</label>
                <input type="text" value={config.supportWhatsApp || ""} onChange={e => setConfig({ ...config, supportWhatsApp: e.target.value })} placeholder="e.g. https://wa.me/number" />
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
        {activeTab === "tasks" && (() => {
          let filtered = [...tasks];
          if (taskSearch) {
            const searchLower = taskSearch.toLowerCase();
            filtered = filtered.filter(tk =>
              (tk.key?.toLowerCase() || "").includes(searchLower) ||
              (tk.title?.toLowerCase() || "").includes(searchLower) ||
              (tk.description?.toLowerCase() || "").includes(searchLower)
            );
          }
          if (taskTypeFilter !== "ALL") {
            filtered = filtered.filter(tk => tk.type === taskTypeFilter);
          }

          return (
            <div className="glass-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2>{t.tasks}</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
                    {lang === "ar" ? `إجمالي المهام: ${filtered.length}` : `Total Tasks: ${filtered.length}`}
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingTask(null); setTaskKey(""); setTaskTitle(""); setTaskDesc(""); setTaskGoal(""); setTaskReward(""); setTaskType("DAILY"); setTaskActionType(""); setTaskLinkUrl(""); setShowTaskModal(true); }}>{t.addTask}</button>
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["ALL", "DAILY", "ONETIME", "SOCIAL"].map(typeVal => {
                    const label = typeVal === "ALL" ? (lang === "ar" ? "الكل" : "All")
                                : typeVal === "DAILY" ? (lang === "ar" ? "اليومية" : "Daily")
                                : typeVal === "ONETIME" ? (lang === "ar" ? "الإنجازات" : "Achievements")
                                : (lang === "ar" ? "التواصل الاجتماعي" : "Social");
                    return (
                      <button
                        key={typeVal}
                        className={`btn ${taskTypeFilter === typeVal ? "btn-primary" : ""}`}
                        style={{ padding: "0.45rem 1rem", fontSize: "0.85rem", background: taskTypeFilter === typeVal ? undefined : "rgba(255,255,255,0.05)" }}
                        onClick={() => setTaskTypeFilter(typeVal)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  placeholder={lang === "ar" ? "البحث في المهام..." : "Search tasks..."}
                  value={taskSearch}
                  onChange={e => setTaskSearch(e.target.value)}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(0,0,0,0.2)",
                    color: "white",
                    minWidth: "220px",
                    flex: "1"
                  }}
                />
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>{lang === "ar" ? "الفئة" : "Type"}</th>
                      <th>{t.taskTitle}</th>
                      <th>{t.taskGoal}</th>
                      <th>Reward</th>
                      <th>{lang === "ar" ? "رابط المهمة" : "Target Link"}</th>
                      <th style={{ color: "#38bdf8" }}>{lang === "ar" ? "المنجزين" : "Completions"}</th>
                      <th>{t.status}</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(tData => (
                      <tr key={tData.id}>
                        <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{tData.key}</td>
                        <td>
                          <span style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            background: tData.type === "DAILY" ? "rgba(56, 189, 248, 0.1)" : tData.type === "ONETIME" ? "rgba(245, 158, 11, 0.1)" : "rgba(168, 85, 247, 0.1)",
                            color: tData.type === "DAILY" ? "#38bdf8" : tData.type === "ONETIME" ? "#f59e0b" : "#a855f7"
                          }}>
                            {tData.type}
                          </span>
                        </td>
                        <td className="task-title-cell">
                          <strong>{tData.title}</strong>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>{tData.description}</div>
                        </td>
                        <td>{formatNumber(tData.goalCount)}</td>
                        <td><strong style={{ color: "var(--accent-gold)" }}>{formatNumber(tData.rewardAmount)} {tData.rewardCurrency}</strong></td>
                        <td>
                          {tData.linkUrl ? (
                            <a href={tData.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8", textDecoration: "underline", fontSize: "0.8rem" }}>
                              {tData.linkUrl.substring(0, 30)}...
                            </a>
                          ) : "-"}
                        </td>
                        <td>
                          <strong style={{ color: "#38bdf8" }}>{tData.completionsCount || 0}</strong>
                        </td>
                        <td>
                          <span className={`badge ${tData.isEnabled ? "revealing" : "ended"}`}>
                            {tData.isEnabled ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.4rem" }}>
                            <button className="btn" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }} onClick={() => handleEditTask(tData)}>
                              {lang === "ar" ? "تعديل" : "Edit"}
                            </button>
                            <button className="btn" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "rgba(255,255,255,0.05)" }} onClick={() => handleToggleTask(tData)}>
                              {tData.isEnabled ? (lang === "ar" ? "تعطيل" : "Disable") : (lang === "ar" ? "تفعيل" : "Enable")}
                            </button>
                            <button className="btn btn-warning" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "#f59e0b", color: "black" }} onClick={() => handleResetTask(tData.id)}>
                              {lang === "ar" ? "إعادة" : "Reset"}
                            </button>
                            <button className="btn btn-danger" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "#dc2626", color: "white" }} onClick={() => handleDeleteTask(tData.id)}>
                              {lang === "ar" ? "حذف" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="9" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                          {lang === "ar" ? "لا توجد مهام مطابقة للبحث." : "No tasks match search query."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

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
                          {l.amountChange >= 0 ? "+" : ""}{formatNumber(l.amountChange, 2)}
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
                    <span>{formatNumber(simReport.initialPool, 2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{t.finalPool}</span>
                    <span>{formatNumber(simReport.finalPool, 2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{t.netProfit}</span>
                    <span style={{ color: simReport.netProfitLoss >= 0 ? "var(--accent-neon-green)" : "var(--accent-neon-red)" }}>
                      {simReport.netProfitLoss >= 0 ? "+" : ""}{formatNumber(simReport.netProfitLoss, 2)} ({simReport.profitLossPct.toFixed(1)}%)
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

      {/* Balance adjustments Modal */}
      {showAdjustModal && selectedUser && (
        <div className="modal-overlay">
          <div className="glass-card modal-content" style={{ maxWidth: "450px" }}>
            <h3>{lang === "ar" ? "إدارة الرصيد (شحن / سحب)" : "Balance Management (Credit/Debit)"}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 1rem" }}>
              {selectedUser.displayNickname || selectedUser.username} | ID: {selectedUser.publicId}
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>{lang === "ar" ? "نوع العملية" : "Operation"}</label>
                <select value={adjustOp} onChange={e => setAdjustOp(e.target.value)}>
                  <option value="ADD">{lang === "ar" ? "إضافة (+)" : "Add (+)"}</option>
                  <option value="SUBTRACT">{lang === "ar" ? "سحب (-)" : "Withdraw (-)"}</option>
                </select>
              </div>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label>{lang === "ar" ? "العملة" : "Currency"}</label>
                <select value={adjustType} onChange={e => setAdjustType(e.target.value)}>
                  <option value="FREE">{lang === "ar" ? "الماسات (Free)" : "Free Coins"}</option>
                  <option value="CASH">{lang === "ar" ? "الكونزات (Cash)" : "Cash Coins"}</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>{t.amount}</label>
              <input 
                type="number" 
                value={adjustAmount} 
                onChange={e => setAdjustAmount(e.target.value)} 
                required 
                placeholder="e.g. 5000"
              />
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                {lang === "ar" ? "الرصيد الحالي:" : "Current Balance:"}{" "}
                {adjustType === "FREE" 
                  ? `${formatNumber(selectedUser.wallet?.freeBalance || 0)} FREE`
                  : `${formatNumber(selectedUser.wallet?.cashBalance || 0)} CASH`}
              </div>
            </div>

            <div className="form-group">
              <label>{lang === "ar" ? "السبب" : "Reason"}</label>
              <textarea 
                value={adjustReason} 
                onChange={e => setAdjustReason(e.target.value)} 
                required 
                rows="2" 
                placeholder={lang === "ar" ? "اكتب سبب العملية..." : "Log reason..."}
              ></textarea>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button className="btn" onClick={() => setShowAdjustModal(false)}>{t.cancel}</button>
              <button className="btn btn-primary" onClick={handleAdjustBalance}>{t.save}</button>
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
          <form onSubmit={handleSaveTask} className="glass-card modal-content" style={{ maxWidth: "500px", width: "95%" }}>
            <h3>{editingTask ? (lang === "ar" ? "تعديل مهمة" : "Edit Task") : t.addTask}</h3>
            
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>{t.taskKey}</label>
              <input type="text" value={taskKey} onChange={e => setTaskKey(e.target.value)} required disabled={!!editingTask} placeholder="e.g. follow_instagram" />
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
              <label>{lang === "ar" ? "نوع المهمة" : "Task Category"}</label>
              <select value={taskType} onChange={e => setTaskType(e.target.value)}>
                <option value="DAILY">DAILY (يومية)</option>
                <option value="ONETIME">ONETIME (إنجاز لمرة واحدة)</option>
                <option value="SOCIAL">SOCIAL (تواصل اجتماعي)</option>
              </select>
            </div>
            <div className="form-group">
              <label>{lang === "ar" ? "نوع الإجراء البرمجي (Action Type)" : "Action Type"}</label>
              <input type="text" value={taskActionType} onChange={e => setTaskActionType(e.target.value)} placeholder="e.g. SOCIAL_INSTAGRAM, PLAY_ROUNDS" />
            </div>
            <div className="form-group">
              <label>{lang === "ar" ? "رابط المهمة (Link URL)" : "Link URL"}</label>
              <input type="text" value={taskLinkUrl} onChange={e => setTaskLinkUrl(e.target.value)} placeholder="e.g. https://instagram.com/..." />
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
                <option value="FREE">FREE COINS (الماسات)</option>
                <option value="CASH">CASH COINS (الكونزات)</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button type="button" className="btn" onClick={() => { setShowTaskModal(false); setEditingTask(null); }}>{t.cancel}</button>
              <button type="submit" className="btn btn-primary">{t.save}</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Profile and Ban Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <form onSubmit={handleEditUser} className="glass-card modal-content" style={{ maxWidth: "500px", width: "95%", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>{lang === "ar" ? "تعديل حساب المستخدم" : "Edit User Account"}</h3>
              {user?.role === "SUPERADMIN" && (
                <button type="button" className="btn btn-danger" style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }} onClick={handleBanDevice}>
                  🚫 {lang === "ar" ? "حظر الجهاز نهائياً" : "Permanent Device Ban"}
                </button>
              )}
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.25rem 0 1rem" }}>
              UUID: {selectedUser.id}
            </p>

            <div className="form-group">
              <label>{lang === "ar" ? "معرف المستخدم الفريد (8 أرقام أو أحرف)" : "Unique Public ID"}</label>
              <input 
                type="text" 
                value={editPublicId} 
                onChange={e => setEditPublicId(e.target.value)} 
                required 
                disabled={user?.role !== "SUPERADMIN"}
                style={{ opacity: user?.role === "SUPERADMIN" ? 1 : 0.6 }}
              />
              {user?.role !== "SUPERADMIN" && (
                <div style={{ fontSize: "0.75rem", color: "var(--accent-gold)", marginTop: "2px" }}>
                  * {lang === "ar" ? "تعديل الـ ID متاح للمدير العام فقط" : "Modifying player ID requires Super Admin privileges."}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>{lang === "ar" ? "الاسم الظاهر" : "Display Nickname"}</label>
              <input type="text" value={editNickname} onChange={e => setEditNickname(e.target.value)} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>{lang === "ar" ? "العمر" : "Age"}</label>
                <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} />
              </div>
              <div className="form-group">
                <label>{lang === "ar" ? "الجنس" : "Gender"}</label>
                <select value={editGender} onChange={e => setEditGender(e.target.value)}>
                  <option value="MALE">{lang === "ar" ? "ذكر" : "MALE"}</option>
                  <option value="FEMALE">{lang === "ar" ? "أنثى" : "FEMALE"}</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>{lang === "ar" ? "تعيين كلمة مرور جديدة (اتركه فارغاً للتخطي)" : "New Password (Leave blank to skip)"}</label>
              <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="********" />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1rem 0" }}>
              <input 
                type="checkbox" 
                id="removeAvatar" 
                checked={removeAvatar} 
                onChange={e => setRemoveAvatar(e.target.checked)} 
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              <label htmlFor="removeAvatar" style={{ cursor: "pointer", fontSize: "0.85rem" }}>
                {lang === "ar" ? "حذف الصورة الشخصية (إعادة الافتراضي)" : "Reset Profile Picture to Default"}
              </label>
            </div>

            <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input 
                  type="checkbox" 
                  id="editIsBanned" 
                  checked={editIsBanned} 
                  onChange={e => setEditIsBanned(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <label htmlFor="editIsBanned" style={{ cursor: "pointer", fontWeight: "bold", color: editIsBanned ? "var(--accent-neon-red)" : "inherit" }}>
                  ⚠️ {lang === "ar" ? "حظر هذا الحساب" : "Ban this Account"}
                </label>
              </div>

              {editIsBanned && (
                <div style={{ marginTop: "1rem", paddingLeft: "1rem", borderLeft: "2px solid var(--accent-neon-red)" }}>
                  <div className="form-group">
                    <label>{lang === "ar" ? "مدة الحظر بالأيام" : "Ban Duration in Days"}</label>
                    <input 
                      type="number" 
                      value={editBanDays} 
                      onChange={e => setEditBanDays(e.target.value)} 
                      placeholder={user?.role === "SUPERADMIN" ? (lang === "ar" ? "اتركه فارغاً لحظر نهائي" : "Blank = permanent") : "e.g. 7"}
                      required={user?.role !== "SUPERADMIN"}
                    />
                    
                    {/* Quick duration presets */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                      {[1, 3, 7, 30].map(days => (
                        <button 
                          key={days} 
                          type="button" 
                          className="btn" 
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", border: "1px solid var(--glass-border)" }}
                          onClick={() => setEditBanDays(days.toString())}
                        >
                          {days} {lang === "ar" ? "يوم" : "Days"}
                        </button>
                      ))}
                      {user?.role === "SUPERADMIN" && (
                        <button 
                          type="button" 
                          className="btn btn-danger" 
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                          onClick={() => setEditBanDays("")}
                        >
                          {lang === "ar" ? "حظر نهائي 🚫" : "Permanent 🚫"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{lang === "ar" ? "سبب الحظر" : "Ban Reason"}</label>
                    <textarea value={editBanReason} onChange={e => setEditBanReason(e.target.value)} rows="2" placeholder="Reason..."></textarea>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button type="button" className="btn" onClick={() => setShowEditModal(false)}>{t.cancel}</button>
              <button type="submit" className="btn btn-primary">{t.save}</button>
            </div>
          </form>
        </div>
      )}
      {/* User Details Modal (Full Profile overview & Purging/Admin actions) */}
      {showDetailsModal && selectedUser && (
        <div className="modal-overlay">
          <div className="glass-card modal-content" style={{ maxWidth: "700px", width: "95%", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #DA22FF, #9733EE)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#fff",
                  fontSize: "1.25rem"
                }}>
                  {(selectedUser.displayNickname || selectedUser.username || "?")[0].toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{selectedUser.displayNickname || selectedUser.username}</h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--accent-gold)" }}>@{selectedUser.username}</span>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-primary" style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }} onClick={() => {
                  setAdjustAmount("");
                  setAdjustReason("");
                  setShowAdjustModal(true);
                }}>{lang === "ar" ? "🪙 إدارة العملات" : "🪙 Manage Coins"}</button>

                <button className="btn" style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", border: "1px solid var(--glass-border)" }} onClick={() => {
                  setEditNickname(selectedUser.displayNickname || "");
                  setEditAge(selectedUser.age?.toString() || "");
                  setEditGender(selectedUser.gender || "MALE");
                  setEditPublicId(selectedUser.publicId || "");
                  setEditIsBanned(selectedUser.isBanned || false);
                  setEditBanDays("");
                  setEditBanReason(selectedUser.banReason || "");
                  setRemoveAvatar(false);
                  setEditPassword("");
                  setShowEditModal(true);
                }}>{lang === "ar" ? "⚙️ تعديل الحساب / الحظر" : "⚙️ Edit / Ban"}</button>
                
                <button className="btn btn-danger" style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }} onClick={() => setShowDetailsModal(false)}>
                  {lang === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>

            {/* Tabs Selector */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--glass-border)", margin: "1rem 0 0" }}>
              <button className={`nav-item ${detailsTab === "info" ? "active" : ""}`} style={{ padding: "0.75rem 1rem", border: 0, background: "transparent", color: detailsTab === "info" ? "var(--accent-gold)" : "inherit", cursor: "pointer", borderBottom: detailsTab === "info" ? "2px solid var(--accent-gold)" : "none" }} onClick={() => setDetailsTab("info")}>
                📋 {lang === "ar" ? "المعلومات الأساسية" : "Basic Information"}
              </button>
              <button className={`nav-item ${detailsTab === "activity" ? "active" : ""}`} style={{ padding: "0.75rem 1rem", border: 0, background: "transparent", color: detailsTab === "activity" ? "var(--accent-gold)" : "inherit", cursor: "pointer", borderBottom: detailsTab === "activity" ? "2px solid var(--accent-gold)" : "none" }} onClick={() => setDetailsTab("activity")}>
                🎮 {lang === "ar" ? "سجل النشاط (Activity Log)" : "Activity Logs"}
              </button>
              <button className={`nav-item ${detailsTab === "admin" ? "active" : ""}`} style={{ padding: "0.75rem 1rem", border: 0, background: "transparent", color: detailsTab === "admin" ? "var(--accent-gold)" : "inherit", cursor: "pointer", borderBottom: detailsTab === "admin" ? "2px solid var(--accent-gold)" : "none" }} onClick={() => setDetailsTab("admin")}>
                🛡️ {lang === "ar" ? "سجل الإدارة (Admin Logs)" : "Admin Actions"}
              </button>
            </div>

            {/* Tab 1: Basic Information */}
            {detailsTab === "info" && (
              <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.75rem" }}>{lang === "ar" ? "الملف الشخصي" : "Profile Details"}</h4>
                  <p style={{ margin: "0.35rem 0" }}><strong>UUID:</strong> <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{selectedUser.id}</span></p>
                  <p style={{ margin: "0.35rem 0" }}><strong>User ID (Public):</strong> <span style={{ color: "var(--accent-gold)", fontWeight: "bold" }}>{selectedUser.publicId || "N/A"}</span></p>
                  <p style={{ margin: "0.35rem 0" }}><strong>{t.email}:</strong> {selectedUser.email || "حساب زائر (Guest)"}</p>
                  <p style={{ margin: "0.35rem 0" }}><strong>{lang === "ar" ? "العمر والجنس:" : "Age & Gender:"}</strong> {selectedUser.age || "N/A"} ({selectedUser.gender || "N/A"})</p>
                  <p style={{ margin: "0.35rem 0" }}><strong>{t.role}:</strong> <span className="badge ended" style={{ fontSize: "0.7rem" }}>{selectedUser.role}</span></p>
                  <p style={{ margin: "0.35rem 0" }}><strong>{lang === "ar" ? "تاريخ التسجيل:" : "Registered At:"}</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                  <p style={{ margin: "0.35rem 0" }}><strong>{lang === "ar" ? "الجولات والانتصارات:" : "Rounds Played / Won:"}</strong> {selectedUser.roundsPlayed} / {selectedUser.roundsWon}</p>
                </div>
                <div>
                  <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.75rem" }}>{lang === "ar" ? "الأجهزة والأمان" : "Devices & Security"}</h4>
                  <p style={{ margin: "0.35rem 0" }}><strong>Device ID:</strong> <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{selectedUser.deviceId || "N/A"}</span></p>
                  <p style={{ margin: "0.35rem 0" }}><strong>IP Address:</strong> <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{selectedUser.lastIp || "N/A"}</span></p>
                  <p style={{ margin: "0.35rem 0" }}><strong>Wallet Free Balance:</strong> <strong style={{ color: "var(--accent-gold)" }}>{formatNumber(selectedUser.wallet?.freeBalance || 0)} FREE</strong></p>
                  <p style={{ margin: "0.35rem 0" }}><strong>Wallet Cash Balance:</strong> <strong style={{ color: "var(--accent-neon-green)" }}>{formatNumber(selectedUser.wallet?.cashBalance || 0)} CASH</strong></p>
                  
                  {/* SuperAdmin Purge Account Purging Card */}
                  {user?.role === "SUPERADMIN" && (
                    <div style={{ marginTop: "1.5rem", padding: "1rem", border: "1px dashed var(--accent-neon-red)", borderRadius: "8px", background: "rgba(239,35,60,0.05)" }}>
                      <h5 style={{ color: "var(--accent-neon-red)", margin: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        ⚠️ {lang === "ar" ? "حذف الحساب نهائياً من النظام" : "Delete Account Permanently"}
                      </h5>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        {lang === "ar" ? "سيتم مسح المحفظة والجولات والمهام والإحالات تماماً ولا يمكن استرجاعها." : "This will wipe all wagers, wallets, tasks, and invitations. Action cannot be undone."}
                      </p>
                      
                      {deleteConfirmStep === 0 && (
                        <button className="btn btn-danger" style={{ padding: "0.4rem 0.65rem", fontSize: "0.75rem", marginTop: "0.5rem" }} onClick={handleDeleteUser}>
                          🗑️ {lang === "ar" ? "حذف الحساب نهائياً" : "Delete Account"}
                        </button>
                      )}
                      {deleteConfirmStep === 1 && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--accent-neon-red)", fontWeight: "bold" }}>
                            {lang === "ar" ? "هل أنت متأكد تماماً؟ اضغط مجدداً لتأكيد المتابعة." : "Are you sure? Click again to confirm."}
                          </span>
                          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                            <button className="btn btn-danger" style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem" }} onClick={handleDeleteUser}>
                              {lang === "ar" ? "نعم، متأكد" : "Yes, Confirm"}
                            </button>
                            <button className="btn" style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem" }} onClick={() => setDeleteConfirmStep(0)}>
                              {lang === "ar" ? "إلغاء" : "Cancel"}
                            </button>
                          </div>
                        </div>
                      )}
                      {deleteConfirmStep === 2 && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <label style={{ fontSize: "0.8rem", color: "var(--accent-neon-red)", display: "block", marginBottom: "4px" }}>
                            {lang === "ar" ? "للتأكيد الأخير، اكتب كلمة DELETE في الحقل أدناه:" : "Type DELETE below for final execution:"}
                          </label>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input 
                              type="text" 
                              value={deleteTextVal} 
                              onChange={e => setDeleteTextVal(e.target.value)} 
                              placeholder="DELETE" 
                              style={{ width: "120px", padding: "0.25rem", margin: 0, border: "1px solid var(--accent-neon-red)" }}
                            />
                            <button className="btn btn-danger" style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }} onClick={handleDeleteUser}>
                              {lang === "ar" ? "تدمير الحساب 💥" : "Destroy Account 💥"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Activity Logs */}
            {detailsTab === "activity" && (
              <div style={{ marginTop: "1rem" }}>
                {logsLoading ? (
                  <p style={{ textAlign: "center", color: "var(--text-muted)" }}>{lang === "ar" ? "جاري تحميل السجلات..." : "Loading logs..."}</p>
                ) : (
                  <div style={{ maxHeight: "300px", overflowY: "auto", paddingRight: "0.5rem" }}>
                    {userLogs.activityLogs.map((log, index) => (
                      <div key={index} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.6rem 0", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                        <div>
                          <span className="badge ended" style={{ fontSize: "0.65rem", padding: "1px 4px", marginRight: lang === "en" ? "6px" : 0, marginLeft: lang === "ar" ? "6px" : 0 }}>{log.type}</span>
                          <span style={{ fontSize: "0.85rem" }}>{log.message}</span>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{new Date(log.date).toLocaleString()}</span>
                      </div>
                    ))}
                    {userLogs.activityLogs.length === 0 && (
                      <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "2rem" }}>
                        {lang === "ar" ? "لا توجد نشاطات مسجلة لهذا الحساب." : "No activities logged for this user."}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Admin Actions Logs */}
            {detailsTab === "admin" && (
              <div style={{ marginTop: "1rem" }}>
                {logsLoading ? (
                  <p style={{ textAlign: "center", color: "var(--text-muted)" }}>{lang === "ar" ? "جاري تحميل السجلات..." : "Loading logs..."}</p>
                ) : (
                  <div style={{ maxHeight: "300px", overflowY: "auto", paddingRight: "0.5rem" }}>
                    {userLogs.adminActions.map((action, index) => (
                      <div key={index} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.6rem 0", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                        <div>
                          <span className="badge warning" style={{ fontSize: "0.65rem", padding: "1px 4px", background: "var(--accent-gold)", color: "#000", marginRight: lang === "en" ? "6px" : 0, marginLeft: lang === "ar" ? "6px" : 0 }}>
                            {action.type.replace("ADMIN_", "")}
                          </span>
                          <span style={{ fontSize: "0.85rem" }}>{action.message}</span>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{new Date(action.date).toLocaleString()}</span>
                      </div>
                    ))}
                    {userLogs.adminActions.length === 0 && (
                      <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "2rem" }}>
                        {lang === "ar" ? "لم يجر المدراء أي عمليات تعديل على هذا الحساب." : "No administrative actions performed on this user."}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}


        
        
        {/* Smart Financial System Tab */}
        {activeTab === "finance" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2>نظام المحاسبة والمستشار المالي 📊</h2>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <select value={financeCurrency} onChange={e => setFinanceCurrency(e.target.value)} style={{ padding: "0.5rem", borderRadius: "5px", background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}>
                  <option value="IQD">دينار عراقي (IQD)</option>
                  <option value="USD">دولار أمريكي ($)</option>
                  <option value="COINS">كونزات اللعبة</option>
                </select>
                <button className="btn btn-primary" onClick={() => setShowFinanceModal(true)}>+ تسجيل عملية مالية</button>
              </div>
            </div>

            {/* Smart Advisor AI Box */}
            <div className="glass-card" style={{ marginBottom: "1.5rem", background: "linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)", border: "1px solid rgba(139, 92, 246, 0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "1.5rem" }}>🤖</span>
                <h3 style={{ color: "#a78bfa", margin: 0 }}>المستشار الذكي (Smart Advisor)</h3>
              </div>
              <p style={{ lineHeight: "1.6" }}>
                {(() => {
                  if (!financeStats) return "جاري تحليل البيانات...";
                  const net = financeStats.netProfitIqd || 0;
                  const rev = financeStats.totalRevenueIqd || 0;
                  const exp = financeStats.totalExpenseIqd || 0;
                  if (rev === 0 && exp === 0) return "مرحباً بك في النظام المحاسبي الجديد! قم بتسجيل مصاريف السيرفر أو اسحب أرباحاً من اللعبة لكي أبدأ بتحليل بياناتك.";
                  if (net > 0 && exp === 0) return "أداؤك المالي ممتاز! لقد حققت أرباحاً صافية ولم تقم بتسجيل أي مصاريف حتى الآن. لا تنسَ تسجيل تكاليف السيرفرات لكي تكون حساباتك دقيقة 100%.";
                  if (net > 0 && exp > 0) return `عمل رائع! الإيرادات تغطي المصروفات، وصافي ربحك الحالي يبلغ حوالي ${(net / (financeStats.exchangeRateIqd || 1600)).toFixed(2)}$ دولار. ننصحك بالاستمرار في تحفيز اللاعبين واستثمار جزء من الأرباح في إعلانات جديدة.`;
                  if (net < 0) return `تحذير مالي! مصاريفك (تكاليف السيرفرات وغيرها) تتجاوز أرباحك الحالية بعجز قدره ${Math.abs(net / (financeStats.exchangeRateIqd || 1600)).toFixed(2)}$ دولار. راجع تكاليفك وحاول تنشيط قسم المتجر والشحن لزيادة الدخل.`;
                  return "أداء النظام مستقر. لا توجد أرباح أو خسائر كبيرة.";
                })()}
              </p>
            </div>

            {/* Financial Overview Cards */}
            <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
              <div className="glass-card stat-card green">
                <span className="stat-label">إجمالي الإيرادات (Revenue)</span>
                <span className="stat-value" style={{ color: "var(--accent-neon-green)", marginTop: "10px", fontSize: "1.8rem" }}>
                  {(() => {
                    if (!financeStats) return "0";
                    let val = financeStats.totalRevenueIqd;
                    if (financeCurrency === "USD") val = val / (financeStats.exchangeRateIqd || 1600);
                    if (financeCurrency === "COINS") val = val / (financeStats.exchangeRateIqd || 1600) * 3000000;
                    return formatNumber(val, financeCurrency === "IQD" ? 0 : 2);
                  })()}
                  <span style={{ fontSize: "1rem", marginLeft: "5px" }}>{financeCurrency === "IQD" ? "د.ع" : financeCurrency === "USD" ? "$" : "C"}</span>
                </span>
              </div>
              <div className="glass-card stat-card red">
                <span className="stat-label">إجمالي المصروفات (Expenses)</span>
                <span className="stat-value" style={{ color: "var(--accent-neon-red)", marginTop: "10px", fontSize: "1.8rem" }}>
                  {(() => {
                    if (!financeStats) return "0";
                    let val = financeStats.totalExpenseIqd;
                    if (financeCurrency === "USD") val = val / (financeStats.exchangeRateIqd || 1600);
                    if (financeCurrency === "COINS") val = val / (financeStats.exchangeRateIqd || 1600) * 3000000;
                    return formatNumber(val, financeCurrency === "IQD" ? 0 : 2);
                  })()}
                  <span style={{ fontSize: "1rem", marginLeft: "5px" }}>{financeCurrency === "IQD" ? "د.ع" : financeCurrency === "USD" ? "$" : "C"}</span>
                </span>
              </div>
              <div className={`glass-card stat-card ${financeStats?.netProfitIqd < 0 ? "red" : "gold"}`}>
                <span className="stat-label">صافي الربح / الخسارة</span>
                <span className="stat-value" style={{ color: financeStats?.netProfitIqd < 0 ? "var(--accent-neon-red)" : "var(--accent-gold)", marginTop: "10px", fontSize: "1.8rem" }}>
                  {(() => {
                    if (!financeStats) return "0";
                    let val = financeStats.netProfitIqd;
                    if (financeCurrency === "USD") val = val / (financeStats.exchangeRateIqd || 1600);
                    if (financeCurrency === "COINS") val = val / (financeStats.exchangeRateIqd || 1600) * 3000000;
                    return formatNumber(val, financeCurrency === "IQD" ? 0 : 2);
                  })()}
                  <span style={{ fontSize: "1rem", marginLeft: "5px" }}>{financeCurrency === "IQD" ? "د.ع" : financeCurrency === "USD" ? "$" : "C"}</span>
                </span>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="glass-card">
              <h3>سجل العمليات المالية (Ledger)</h3>
              <div className="table-container" style={{ marginTop: "1rem" }}>
                <table>
                  <thead>
                    <tr>
                      <th>التاريخ</th>
                      <th>النوع</th>
                      <th>التصنيف</th>
                      <th>المبلغ</th>
                      <th>العملة الأصلية</th>
                      <th>التفاصيل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeLogs.map(log => (
                      <tr key={log.id}>
                        <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{new Date(log.createdAt).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${log.type === "REVENUE" ? "won" : "lost"}`}>
                            {log.type === "REVENUE" ? "إيراد" : "مصروف"}
                          </span>
                        </td>
                        <td>
                          <span className="badge secondary">
                            {log.category === "SERVER" ? "سيرفرات" : log.category === "ADS" ? "إعلانات" : log.category === "STORE" ? "متجر" : log.category === "GAME" ? "اللعبة" : "أخرى"}
                          </span>
                        </td>
                        <td style={{ color: log.type === "REVENUE" ? "var(--accent-neon-green)" : "var(--accent-neon-red)", fontWeight: "bold" }}>
                          {log.type === "REVENUE" ? "+" : "-"}{formatNumber(log.amount)}
                        </td>
                        <td>{log.currency === "IQD" ? "دينار" : log.currency === "USD" ? "دولار" : "كونزات"}</td>
                        <td style={{ fontSize: "0.85rem" }}>{log.description || "-"}</td>
                      </tr>
                    ))}
                    {financeLogs.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)" }}>لا توجد عمليات مالية مسجلة.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Finance Modal */}
            {showFinanceModal && (
              <div className="modal-overlay">
                <div className="modal-content" style={{ maxWidth: "500px" }}>
                  <div className="modal-header">
                    <h2>تسجيل عملية مالية جديدة</h2>
                    <button className="close-btn" onClick={() => setShowFinanceModal(false)}>×</button>
                  </div>
                  <form onSubmit={handleAddFinanceLog} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                    
                    <div className="form-group">
                      <label>نوع العملية</label>
                      <select value={newFinanceLog.type} onChange={e => setNewFinanceLog({...newFinanceLog, type: e.target.value})}>
                        <option value="EXPENSE">دفع مصروفات (سيرفرات، إعلانات مدفوعة...)</option>
                        <option value="REVENUE">استلام إيرادات (أرباح إعلانات، وغيرها...)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>التصنيف</label>
                      <select value={newFinanceLog.category} onChange={e => setNewFinanceLog({...newFinanceLog, category: e.target.value})}>
                        <option value="SERVER">السيرفرات وقواعد البيانات</option>
                        <option value="ADS">الإعلانات (تسويق أو أرباح)</option>
                        <option value="STORE">المتجر والشحن</option>
                        <option value="GAME">أرباح اللعبة</option>
                        <option value="MANUAL">أخرى (يدوي)</option>
                      </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div className="form-group">
                        <label>المبلغ</label>
                        <input type="number" step="0.01" required value={newFinanceLog.amount} onChange={e => setNewFinanceLog({...newFinanceLog, amount: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>العملة</label>
                        <select value={newFinanceLog.currency} onChange={e => setNewFinanceLog({...newFinanceLog, currency: e.target.value})}>
                          <option value="IQD">دينار عراقي (IQD)</option>
                          <option value="USD">دولار أمريكي ($)</option>
                          <option value="COINS">كونزات اللعبة</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>التفاصيل (اختياري)</label>
                      <input type="text" placeholder="مثال: دفع تكاليف سيرفر AWS لشهر 6" value={newFinanceLog.description} onChange={e => setNewFinanceLog({...newFinanceLog, description: e.target.value})} />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>حفظ العملية</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}


        {/* Withdraw Profit Modal */}
        {showWithdrawModal && (
          <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
            <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
              <h2>{t.withdrawProfit} ({withdrawPoolType === "CASH" ? "كونزات" : "ماسات"})</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                سيتم خصم هذا المبلغ من الصندوق الأسود وتسجيله كأرباح خاصة بالإدارة.
              </p>
              <form onSubmit={handleWithdrawProfit}>
                <div className="form-group">
                  <label>مبلغ السحب:</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    required
                    min="1"
                  />
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>تأكيد السحب</button>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowWithdrawModal(false)}>إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}
          </div>
        </div>
      )}
    </div>
  );
}
