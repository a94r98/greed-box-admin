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
  
  // Auth Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const [adjustFree, setAdjustFree] = useState("");
  const [adjustCash, setAdjustCash] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

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
    try {
      await apiCall(`/admin/users/${selectedUser.id}/balance`, "PUT", {
        freeAmount: adjustFree !== "" ? parseFloat(adjustFree) : undefined,
        cashAmount: adjustCash !== "" ? parseFloat(adjustCash) : undefined,
        reason: adjustReason
      });
      setShowAdjustModal(false);
      setAdjustFree("");
      setAdjustCash("");
      setAdjustReason("");
      fetchUsers();
    } catch (err) {
      alert(err.message);
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

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.id.includes(searchUser)
  );

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
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>{t.loginBtn}</button>
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2>{t.users}</h2>
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchUser} 
                onChange={e => setSearchUser(e.target.value)} 
                style={{ width: "250px" }}
              />
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{t.userId}</th>
                    <th>{t.username}</th>
                    <th>{t.role}</th>
                    <th>{t.freeCoins}</th>
                    <th>{t.cashCoins}</th>
                    <th>{t.stats}</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontSize: "0.8rem", fontFamily: "monospace" }}>
                        <div>{u.id}</div>
                        <div style={{ color: "var(--text-muted)" }}>Device: {u.deviceId}</div>
                      </td>
                      <td>
                        <div>{u.email || "GUEST"}</div>
                        <div style={{ color: "var(--text-muted)" }}>{u.username}</div>
                      </td>
                      <td><span className="badge ended">{u.role}</span></td>
                      <td>{(u.wallet?.freeBalance || 0).toFixed(1)}</td>
                      <td>{(u.wallet?.cashBalance || 0).toFixed(2)}</td>
                      <td>
                        <div>Played: {u.roundsPlayed}</div>
                        <div>Won: {u.roundsWon}</div>
                      </td>
                      <td>
                        {user?.role === "SUPERADMIN" && (
                          <button className="btn btn-primary" style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem" }} onClick={() => {
                            setSelectedUser(u);
                            setAdjustFree(u.wallet?.freeBalance.toString() || "");
                            setAdjustCash(u.wallet?.cashBalance.toString() || "");
                            setShowAdjustModal(true);
                          }}>
                            {t.editBalance}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
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
          <div className="glass-card modal-content">
            <h3>{t.editBalance}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 1rem" }}>
              {t.userId}: {selectedUser.id}
            </p>
            
            <div className="form-group">
              <label>{t.freeCoins}</label>
              <input type="number" value={adjustFree} onChange={e => setAdjustFree(e.target.value)} />
            </div>
            
            <div className="form-group">
              <label>{t.cashCoins}</label>
              <input type="number" value={adjustCash} onChange={e => setAdjustCash(e.target.value)} />
            </div>

            <div className="form-group">
              <label>{t.reason}</label>
              <textarea value={adjustReason} onChange={e => setAdjustReason(e.target.value)} required rows="2" placeholder="Description..."></textarea>
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
    </div>
  );
}
