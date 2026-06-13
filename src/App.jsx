import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const API_BASE = "https://greed-box-server.onrender.com/api";

const TRANSLATIONS = {
  ar: {
    brand: "صناديق الطمع",
    dashboard: "لوحة التحكم",
    users: "المستخدمين",
    deposits: "طلبات الشحن",
    withdrawals: "طلبات السحب",
    config: "إعدادات النظام",
    tasks: "المهام اليومية",
    pool: "سجل الخزينة",
    simulation: "محاكاة النظام",
    playGame: "تجربة اللعب كلاعب 🎮",
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
    freeCoins: "عملات مجانية",
    cashCoins: "عملات شحن",
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
    freeEnabled: "جولات العملات المجانية",
    cashEnabled: "جولات عملات الشحن",
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
    betFree: "رهان عملة مجانية",
    betCash: "رهان عملة شحن"
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
    playGame: "Play / Test Game 🎮",
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

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustOp, setAdjustOp] = useState("ADD"); // ADD, SUBTRACT
  const [adjustType, setAdjustType] = useState("FREE"); // FREE, CASH
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectType, setRejectType] = useState(""); 
  const [rejectId, setRejectId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Detailed User Overview & Logs state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTab, setDetailsTab] = useState("info"); // info, activity, admin
  const [userLogs, setUserLogs] = useState({ activityLogs: [], adminActions: [] });
  const [logsLoading, setLogsLoading] = useState(false);

  // Triple confirmation delete account state
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(0);
  const [deleteTextVal, setDeleteTextVal] = useState("");

  // Filters for User Management
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterRegDate, setFilterRegDate] = useState("");

  // Edit User Details state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editPublicId, setEditPublicId] = useState("");
  const [editIsBanned, setEditIsBanned] = useState(false);
  const [editBanDays, setEditBanDays] = useState("");
  const [editBanReason, setEditBanReason] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);

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
      alert("يرجى إدخال مبلغ صحيح.");
      return;
    }
    if (!adjustReason) {
      alert("يرجى تحديد سبب العملية.");
      return;
    }

    const amount = parseFloat(adjustAmount);
    const delta = adjustOp === "ADD" ? amount : -amount;

    try {
      const res = await apiCall(`/admin/users/${selectedUser.id}/balance`, "PUT", {
        freeDelta: adjustType === "FREE" ? delta : undefined,
        cashDelta: adjustType === "CASH" ? delta : undefined,
        reason: adjustReason
      });
      setShowAdjustModal(false);
      setAdjustAmount("");
      setAdjustReason("");
      
      // Update selectedUser if open in details with the exact wallet returned by the server
      if (showDetailsModal && selectedUser) {
        setSelectedUser(prev => ({
          ...prev,
          wallet: res.wallet
        }));
      }

      fetchUsers();
      alert("تمت إدارة العملات بنجاح!");
    } catch (err) {
      alert(err.message);
    }
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
        isBanned: editIsBanned,
        banDays: editIsBanned ? (editBanDays || undefined) : undefined,
        banReason: editIsBanned ? editBanReason : undefined,
        removeAvatar
      });
      setShowEditModal(false);
      
      if (showDetailsModal) {
        setSelectedUser(updated.user);
      }

      fetchUsers();
      alert("تم تحديث بيانات الحساب بنجاح!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBanDevice = async () => {
    if (!confirm("هل أنت متأكد من حظر جهاز هذا الحساب نهائياً؟ لن يتمكن من إنشاء أو استخدام أي حساب ضيف أو دائم من هذا الهاتف.")) return;
    try {
      const reason = prompt("أدخل سبب حظر الجهاز:") || "مخالفة الشروط العامة";
      await apiCall(`/admin/users/${selectedUser.id}/ban-device`, "POST", { reason });
      setShowEditModal(false);
      setShowDetailsModal(false);
      fetchUsers();
      alert("تم حظر الجهاز والحساب نهائياً بنجاح!");
    } catch (err) {
      alert(err.message);
    }
  };

  const viewUserDetails = async (u) => {
    setSelectedUser(u);
    setDetailsTab("info");
    setUserLogs({ activityLogs: [], adminActions: [] });
    setShowDetailsModal(true);
    setLogsLoading(true);
    setDeleteConfirmStep(0);
    setDeleteTextVal("");
    try {
      const logs = await apiCall(`/admin/users/${u.id}/logs`);
      setUserLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (deleteConfirmStep === 0) {
      setDeleteConfirmStep(1);
      return;
    }
    if (deleteConfirmStep === 1) {
      setDeleteConfirmStep(2);
      setDeleteTextVal("");
      return;
    }
    if (deleteConfirmStep === 2) {
      if (deleteTextVal !== "DELETE") {
        alert("يرجى كتابة كلمة DELETE بدقة للتأكيد.");
        return;
      }
      try {
        await apiCall(`/admin/users/${selectedUser.id}`, "DELETE");
        setShowDetailsModal(false);
        setDeleteConfirmStep(0);
        setDeleteTextVal("");
        fetchUsers();
        alert("تم حذف المستخدم وكافة السجلات المرتبطة به نهائياً!");
      } catch (err) {
        alert(err.message);
      }
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

        {/* Users Panel */}
        {activeTab === "users" && (
          <div className="glass-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2>{t.users}</h2>
              
              {/* Advanced search and filters */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                <input 
                  type="text" 
                  placeholder={t.searchPlaceholder}
                  value={searchUser} 
                  onChange={e => setSearchUser(e.target.value)} 
                  style={{ width: "220px", margin: 0 }}
                />
                
                <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ margin: 0 }}>
                  <option value="ALL">{lang === "ar" ? "كل الصلاحيات" : "All Roles"}</option>
                  <option value="GUEST">{lang === "ar" ? "حساب ضيف" : "Guest"}</option>
                  <option value="USER">{lang === "ar" ? "مستخدم عادي" : "User"}</option>
                  <option value="ADMIN">{lang === "ar" ? "مدير" : "Admin"}</option>
                  <option value="SUPERADMIN">{lang === "ar" ? "مدير عام" : "Super Admin"}</option>
                </select>

                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ margin: 0 }}>
                  <option value="ALL">{lang === "ar" ? "كل الحالات" : "All Status"}</option>
                  <option value="ACTIVE">{lang === "ar" ? "نشط (Active)" : "Active"}</option>
                  <option value="BANNED_TEMP">{lang === "ar" ? "حظر مؤقت" : "Temporary Ban"}</option>
                  <option value="BANNED_PERM">{lang === "ar" ? "حظر نهائي" : "Permanent Ban"}</option>
                </select>

                <input 
                  type="date" 
                  value={filterRegDate} 
                  onChange={e => setFilterRegDate(e.target.value)} 
                  style={{ margin: 0, padding: "0.55rem" }}
                  title={lang === "ar" ? "تاريخ التسجيل" : "Registration Date"}
                />
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{lang === "ar" ? "المستخدم" : "User"}</th>
                    <th>{t.userId}</th>
                    <th>{t.role}</th>
                    <th>{t.freeCoins}</th>
                    <th>{t.cashCoins}</th>
                    <th>{lang === "ar" ? "تاريخ التسجيل" : "Registration Date"}</th>
                    <th>{lang === "ar" ? "حالة الحساب" : "Account Status"}</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => {
                    const initials = (u.displayNickname || u.username || "?")[0].toUpperCase();
                    const statusText = u.isBanned 
                      ? (u.banExpiresAt ? (lang === "ar" ? "حظر مؤقت" : "Temporary Ban") : (lang === "ar" ? "حظر نهائي" : "Permanent Ban")) 
                      : (lang === "ar" ? "نشط" : "Active");
                    const statusBadge = u.isBanned ? "locked" : "revealing";

                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div className="avatar-circle" style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #DA22FF, #9733EE)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              color: "#fff",
                              fontSize: "1.1rem"
                            }}>
                              {initials}
                            </div>
                            <div>
                              <div style={{ fontWeight: "600" }}>{u.displayNickname || u.username}</div>
                              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{u.email || "GUEST ACCOUNT"}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: "0.8rem", fontFamily: "monospace" }}>
                          <div style={{ color: "var(--accent-gold)", fontWeight: "bold" }}>ID: {u.publicId || "N/A"}</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>UUID: {u.id.substring(0, 8)}...</div>
                        </td>
                        <td><span className="badge ended">{u.role}</span></td>
                        <td>{(u.wallet?.freeBalance || 0).toLocaleString()}</td>
                        <td>{(u.wallet?.cashBalance || 0).toLocaleString()}</td>
                        <td style={{ fontSize: "0.8rem" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td><span className={`badge ${statusBadge}`} style={{ fontSize: "0.75rem" }}>{statusText}</span></td>
                        <td>
                          <button className="btn btn-primary" style={{ padding: "0.4rem 0.65rem", fontSize: "0.75rem" }} onClick={() => viewUserDetails(u)}>
                            👁️ {lang === "ar" ? "عرض التفاصيل" : "View Details"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                        {lang === "ar" ? "لا يوجد مستخدمين يطابقون خيارات البحث." : "No users matched the search criteria."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                  <option value="FREE">{lang === "ar" ? "عملات مجانية (Free)" : "Free Coins"}</option>
                  <option value="CASH">{lang === "ar" ? "عملات شحن (Cash)" : "Cash Coins"}</option>
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
                  ? `${(selectedUser.wallet?.freeBalance || 0).toLocaleString()} FREE`
                  : `${(selectedUser.wallet?.cashBalance || 0).toLocaleString()} CASH`}
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
                  <p style={{ margin: "0.35rem 0" }}><strong>Wallet Free Balance:</strong> <strong style={{ color: "var(--accent-gold)" }}>{(selectedUser.wallet?.freeBalance || 0).toLocaleString()} FREE</strong></p>
                  <p style={{ margin: "0.35rem 0" }}><strong>Wallet Cash Balance:</strong> <strong style={{ color: "var(--accent-neon-green)" }}>{(selectedUser.wallet?.cashBalance || 0).toLocaleString()} CASH</strong></p>
                  
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
          </div>
        </div>
      )}
    </div>
  );
}
