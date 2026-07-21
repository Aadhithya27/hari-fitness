"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFitness, Meal } from "@/context/FitnessContext";
import { 
  Flame, 
  Droplet, 
  Plus, 
  Trash2, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  LogOut,
  Send,
  FileText,
  BadgeAlert,
  ArrowRight,
  TrendingDown,
  Calendar,
  Camera,
  Image as ImageIcon,
  X
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import confetti from "canvas-confetti";

export default function ClientDashboard() {
  const router = useRouter();
  const {
    currentUser,
    logout,
    clients,
    workouts,
    diets,
    messages,
    measurements,
    notifications,
    announcements,
    updateWaterIntake,
    addMeal,
    deleteMeal,
    toggleExercise,
    logMeasurements,
    sendMessage,
    markMessagesRead,
    triggerCelebration,
    setTriggerCelebration
  } = useFitness();

  const [activeTab, setActiveTab] = useState<"overview" | "workout" | "nutrition" | "progress" | "chat">("overview");

  // Get active client data matching logged in user
  const clientProfile = clients.find(c => c.id === currentUser?.id);
  const clientWorkout = workouts.find(w => w.clientId === currentUser?.id);
  const clientDiet = diets.find(d => d.clientId === currentUser?.id);
  const clientMeasurements = measurements.filter(m => m.clientId === currentUser?.id);
  const clientMessages = messages.filter(m => m.senderId === currentUser?.id || m.receiverId === currentUser?.id);

  // Authentication Guard
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    } else if (currentUser.role !== "CLIENT") {
      router.push("/dashboard/trainer");
    }
  }, [currentUser]);

  // Confetti Level Up Celebration
  useEffect(() => {
    if (triggerCelebration) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FF1E1E", "#FF3B3B", "#FFFFFF"]
      });
      setTriggerCelebration(false);
    }
  }, [triggerCelebration]);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setTimerActive(true);
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(60);
  };

  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            // Alert user with a sound or notification
            alert("Rest timer completed! Get back to the set.");
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive]);

  // Add Meal Dialog State
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState(350);
  const [mealProtein, setMealProtein] = useState(25);
  const [mealCarbs, setMealCarbs] = useState(30);
  const [mealFat, setMealFat] = useState(8);
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [mealSnap, setMealSnap] = useState<string>("");
  const [selectedMealPhoto, setSelectedMealPhoto] = useState<{ name: string; url: string } | null>(null);

  const handleSnapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        const height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
          setMealSnap(compressedBase64);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleAddMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !mealName) return;
    addMeal(currentUser.id, {
      name: mealName,
      calories: Number(mealCalories),
      protein: Number(mealProtein),
      carbs: Number(mealCarbs),
      fat: Number(mealFat),
      type: mealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageSnap: mealSnap || undefined,
      dateLogged: new Date().toISOString().split("T")[0]
    });
    setMealName("");
    setMealSnap("");
    alert("Meal logged with food snap! +15 XP earned.");
  };

  // Add Measurement state
  const [logWeight, setLogWeight] = useState(80);
  const [logBodyFat, setLogBodyFat] = useState(18);
  const [logWaist, setLogWaist] = useState(85);
  const [logBiceps, setLogBiceps] = useState(38);

  const handleLogMeasurementsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    logMeasurements(currentUser.id, {
      weight: Number(logWeight),
      bodyFat: Number(logBodyFat),
      bmi: Number((Number(logWeight) / ((clientProfile!.height / 100) ** 2)).toFixed(1)),
      chest: 104,
      waist: Number(logWaist),
      hip: 98,
      biceps: Number(logBiceps),
      thigh: 60,
      shoulders: 122,
      neck: 38
    });
    alert("Body measurements logged! Weight chart updated, +30 XP earned.");
  };

  // Chat State
  const [chatText, setChatText] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !chatText.trim()) return;

    sendMessage(currentUser.id, "trainer", chatText);
    setChatText("");
  };

  // Scroll to bottom on chats
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);



  if (!currentUser || !clientProfile) return null;

  // Calculate Nutrients Consumed
  const consumedCalories = clientDiet?.meals.reduce((sum, m) => sum + m.calories, 0) || 0;
  const consumedProtein = clientDiet?.meals.reduce((sum, m) => sum + m.protein, 0) || 0;
  const consumedCarbs = clientDiet?.meals.reduce((sum, m) => sum + m.carbs, 0) || 0;
  const consumedFat = clientDiet?.meals.reduce((sum, m) => sum + m.fat, 0) || 0;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Dashboard Top Header */}
      <header className="bg-brand-sec-bg border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-black border border-brand-accent/50 shadow-[0_0_15px_rgba(255,30,30,0.3)]">
            <Dumbbell className="w-5 h-5 text-brand-glow drop-shadow-[0_0_8px_#FF1E1E] animate-pulse" />
          </div>
          <div>
            <h1 className="font-space font-bold uppercase tracking-wider text-sm text-white">Client OS Terminal</h1>
            <p className="font-inter text-brand-muted text-xs">Logged in: {currentUser.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Level & XP HUD */}
          <div className="hidden sm:flex flex-col items-end gap-1.5">
            <div className="font-space text-xs tracking-wider uppercase text-brand-glow font-bold">
              Level {clientProfile.level} Elite
            </div>
            <div className="w-40 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-brand-accent shadow-[0_0_10px_rgba(255,30,30,0.6)] transition-all duration-500" 
                style={{ width: `${(clientProfile.xp % 300) / 3}%` }} 
              />
            </div>
            <div className="font-orbitron text-[9px] text-brand-muted">
              {clientProfile.xp % 300} / 300 XP
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-brand-danger/10 border border-white/5 hover:border-brand-danger/30 text-brand-muted hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 flex flex-row overflow-x-auto lg:flex-col gap-2 pb-3 lg:pb-0 scrollbar-none snap-x">
          {[
            { id: "overview", label: "Dashboard HUD", icon: Flame },
            { id: "workout", label: "Workout Module", icon: Dumbbell },
            { id: "nutrition", label: "Nutrition Module", icon: Utensils },
            { id: "progress", label: "Progress Logs", icon: TrendingUp },
            { id: "chat", label: "Trainer Chat", icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl font-space text-xs tracking-widest uppercase transition-all border cursor-pointer flex-shrink-0 snap-start ${
                  activeTab === tab.id
                    ? "bg-brand-accent/15 border-brand-accent text-white shadow-[0_0_15px_rgba(255,30,30,0.1)]"
                    : "bg-brand-card/50 border-white/5 hover:border-brand-accent/30 text-brand-muted hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? "text-brand-accent" : "text-brand-muted"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Habit checklist quick display */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 mt-6 hidden lg:block">
            <h3 className="font-space text-xs tracking-wider uppercase text-white font-bold mb-3 border-b border-white/5 pb-2">
              Habit Checklist
            </h3>
            <div className="flex flex-col gap-3 font-inter text-xs text-brand-muted">
              {clientProfile.habits.map((habit, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded border border-brand-accent/50 flex items-center justify-center text-[10px] text-brand-accent">✔</div>
                  <span>{habit}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Dashboard Area */}
        <main className="lg:col-span-9 flex flex-col gap-6">
          {/* TAB 1: OVERVIEW HUD */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-8">
              {/* Gamification Streak & Stats Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-accent/20 bg-gradient-to-r from-brand-accent/5 to-transparent flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="font-space font-extrabold text-2xl sm:text-3xl uppercase tracking-wider text-white mb-2">
                    Welcome Back, {clientProfile.name}!
                  </h2>
                  <p className="font-inter text-brand-muted text-sm max-w-md">
                    You have logged meals and completed exercises today. Keep the streak active and stack more XP!
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-black/60 border border-brand-accent/30 px-6 py-4 rounded-2xl shadow-[0_0_20px_rgba(255,30,30,0.1)]">
                  <Flame className="w-8 h-8 text-brand-accent animate-bounce" />
                  <div className="text-left">
                    <div className="font-orbitron font-extrabold text-2xl text-white">{clientProfile.dailyStreak} DAYS</div>
                    <div className="font-space text-[10px] tracking-wider uppercase text-brand-muted">Daily Streak</div>
                  </div>
                </div>
              </div>

              {/* Progress Summary Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Calories HUD Ring */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                  <div className="font-space text-xs tracking-wider uppercase text-brand-muted">Calories HUD</div>
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Circle SVG */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="44" strokeWidth="8" stroke="rgba(255,255,255,0.05)" fill="transparent" />
                      <circle cx="56" cy="56" r="44" strokeWidth="8" stroke="#FF1E1E" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 44} 
                        strokeDashoffset={2 * Math.PI * 44 * (1 - Math.min(1, consumedCalories / (clientDiet?.targetCalories || 2000)))} 
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-orbitron text-lg font-bold">{consumedCalories}</span>
                      <span className="font-space text-[9px] text-brand-muted">/ {clientDiet?.targetCalories || 2000} KCAL</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab("nutrition")}
                    className="font-space text-[10px] text-brand-accent uppercase tracking-widest hover:underline"
                  >
                    Manage Nutrition →
                  </button>
                </div>

                {/* Hydration HUD */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
                  <div className="font-space text-xs tracking-wider uppercase text-brand-muted">Hydration Target</div>
                  <div className="flex items-center gap-3">
                    <Droplet className="w-8 h-8 text-blue-500 animate-pulse" />
                    <div className="text-left">
                      <div className="font-orbitron text-xl font-bold">{clientDiet?.waterIntake || 0} ml</div>
                      <div className="font-space text-[9px] text-brand-muted">Target: {clientDiet?.waterTarget || 3500} ml</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateWaterIntake(currentUser.id, -250)}
                      className="px-3 py-1 bg-white/5 border border-white/10 hover:border-brand-danger/30 rounded font-orbitron text-xs cursor-pointer"
                    >
                      -250ml
                    </button>
                    <button
                      onClick={() => updateWaterIntake(currentUser.id, 250)}
                      className="px-3 py-1 bg-brand-accent/20 border border-brand-accent/40 rounded text-brand-glow font-orbitron text-xs cursor-pointer"
                    >
                      +250ml
                    </button>
                  </div>
                </div>

                {/* Daily Workout status */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-4">
                  <div className="flex items-center justify-between">
                    <div className="font-space text-xs tracking-wider uppercase text-brand-muted">Active Routine</div>
                    <Dumbbell className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="font-space font-bold uppercase text-white tracking-wider truncate mb-1">
                      {clientWorkout ? clientWorkout.title : "No Plan Assigned"}
                    </h4>
                    <p className="font-inter text-brand-muted text-xs">
                      {clientWorkout 
                        ? `${clientWorkout.exercises.filter(e => e.completed).length} of ${clientWorkout.exercises.length} Exercises Complete`
                        : "Ask coach to assign workouts"
                      }
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("workout")}
                    className="w-full text-center py-2.5 rounded-xl border border-white/10 hover:border-brand-accent/40 bg-white/5 hover:bg-brand-accent/5 font-space text-[10px] tracking-widest uppercase transition-all cursor-pointer"
                  >
                    Open exercises
                  </button>
                </div>
              </div>

              {/* announcements */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left">
                <h3 className="font-space font-bold uppercase tracking-wider text-xs text-white mb-4 border-b border-white/5 pb-2">
                  Trainer Announcements
                </h3>
                <div className="flex flex-col gap-4">
                  {announcements.map((ann, i) => (
                    <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-xl">
                      <div className="font-space font-bold text-xs text-brand-glow uppercase mb-1">{ann.title}</div>
                      <p className="font-inter text-xs text-brand-muted leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORKOUT MODULE */}
          {activeTab === "workout" && (
            <div className="flex flex-col gap-6">
              {clientWorkout ? (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
                    <div>
                      <h2 className="font-space font-bold text-2xl uppercase tracking-wider text-white">
                        {clientWorkout.title}
                      </h2>
                      <p className="font-inter text-brand-muted text-xs mt-1">{clientWorkout.description}</p>
                    </div>

                    {/* Rest Timer panel */}
                    <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-3.5 rounded-xl">
                      <Clock className="w-5 h-5 text-brand-accent animate-spin" />
                      <div className="text-left font-orbitron">
                        <div className="text-xs text-brand-muted uppercase font-space">Rest Timer</div>
                        <div className="text-sm font-bold text-white">{timerSeconds} SECS</div>
                      </div>
                      <div className="flex gap-1.5 ml-2">
                        {timerActive ? (
                          <button onClick={pauseTimer} className="px-2 py-0.5 bg-brand-warning/20 border border-brand-warning/30 text-brand-warning rounded text-[10px] font-space cursor-pointer">PAUSE</button>
                        ) : (
                          <button onClick={startTimer} className="px-2 py-0.5 bg-brand-success/20 border border-brand-success/30 text-brand-success rounded text-[10px] font-space cursor-pointer">START</button>
                        )}
                        <button onClick={resetTimer} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-space cursor-pointer">RESET</button>
                      </div>
                    </div>
                  </div>

                  {/* Exercises Checklist */}
                  <div className="flex flex-col gap-4">
                    {clientWorkout.exercises.map((exercise) => (
                      <div 
                        key={exercise.id} 
                        className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col md:flex-row justify-between gap-4 ${
                          exercise.completed ? "border-brand-success/30 bg-brand-success/5" : "border-white/5"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => toggleExercise(currentUser.id, clientWorkout.id, exercise.id)}
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs transition-all cursor-pointer mt-1 ${
                              exercise.completed 
                                ? "bg-brand-success border-brand-success text-black" 
                                : "border-white/20 hover:border-brand-accent bg-black"
                            }`}
                          >
                            {exercise.completed && "✓"}
                          </button>

                          <div className="text-left">
                            <h4 className="font-space font-bold uppercase text-white tracking-wider text-base">
                              {exercise.name}
                            </h4>
                            <p className="font-inter text-xs text-brand-muted leading-relaxed mt-1 max-w-xl">
                              {exercise.instructions}
                            </p>
                          </div>
                        </div>

                        {/* Sets HUD details */}
                        <div className="flex items-center gap-6 self-start md:self-center bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl">
                          <div className="text-center">
                            <div className="font-orbitron font-bold text-white text-sm">{exercise.sets}</div>
                            <div className="font-space text-[8px] text-brand-muted uppercase">Sets</div>
                          </div>
                          <div className="h-6 w-px bg-white/5" />
                          <div className="text-center">
                            <div className="font-orbitron font-bold text-white text-sm">{exercise.reps}</div>
                            <div className="font-space text-[8px] text-brand-muted uppercase">Reps</div>
                          </div>
                          <div className="h-6 w-px bg-white/5" />
                          <div className="text-center">
                            <div className="font-orbitron font-bold text-brand-glow text-sm">{exercise.weight}</div>
                            <div className="font-space text-[8px] text-brand-muted uppercase">Weight</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="glass-panel p-12 text-center text-brand-muted font-space text-sm">
                  No active workout plans assigned to you yet. Reach out to Coach Hari via the chat hub.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NUTRITION MODULE */}
          {activeTab === "nutrition" && (
            <div className="flex flex-col gap-6">
              {clientDiet ? (
                <>
                  {/* Macros stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="glass-panel p-4 rounded-xl text-center">
                      <div className="font-space text-[10px] text-brand-muted uppercase">Calories consumed</div>
                      <div className="font-orbitron font-extrabold text-white text-lg mt-1">{consumedCalories} kcal</div>
                      <div className="font-inter text-[9px] text-brand-muted">Target: {clientDiet.targetCalories} kcal</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl text-center">
                      <div className="font-space text-[10px] text-brand-muted uppercase">Protein</div>
                      <div className="font-orbitron font-extrabold text-brand-glow text-lg mt-1">{consumedProtein}g</div>
                      <div className="font-inter text-[9px] text-brand-muted">Target: {clientDiet.targetProtein}g</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl text-center">
                      <div className="font-space text-[10px] text-brand-muted uppercase">Carbs</div>
                      <div className="font-orbitron font-extrabold text-white text-lg mt-1">{consumedCarbs}g</div>
                      <div className="font-inter text-[9px] text-brand-muted">Target: {clientDiet.targetCarbs}g</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl text-center">
                      <div className="font-space text-[10px] text-brand-muted uppercase">Fats</div>
                      <div className="font-orbitron font-extrabold text-white text-lg mt-1">{consumedFat}g</div>
                      <div className="font-inter text-[9px] text-brand-muted">Target: {clientDiet.targetFat}g</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Logged Meals List */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                      <h3 className="font-space font-bold uppercase tracking-wider text-xs text-white border-b border-white/5 pb-2 text-left">
                        Today's Logged Meals
                      </h3>

                      {clientDiet.meals.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {clientDiet.meals.map((meal) => (
                            <div key={meal.id} className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 text-left">
                                {meal.imageSnap ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMealPhoto({ name: meal.name, url: meal.imageSnap! })}
                                    className="relative w-12 h-12 rounded-lg overflow-hidden border border-brand-accent/40 bg-black shrink-0 hover:scale-105 transition-transform cursor-pointer group"
                                    title="Click to view full photo"
                                  >
                                    <img src={meal.imageSnap} alt={meal.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <Camera className="w-3.5 h-3.5 text-white" />
                                    </div>
                                  </button>
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 text-brand-muted">
                                    <Utensils className="w-4 h-4" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-space font-bold text-xs uppercase text-white flex items-center gap-2">
                                    <span>{meal.name}</span>
                                    {meal.imageSnap && (
                                      <span className="text-[8px] bg-brand-accent/20 border border-brand-accent/30 text-brand-glow px-1.5 py-0.5 rounded font-space uppercase">
                                        Snap
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-inter text-[10px] text-brand-muted mt-0.5">
                                    {meal.time} • P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-orbitron font-bold text-brand-glow text-xs">{meal.calories} kcal</span>
                                <button
                                  onClick={() => deleteMeal(currentUser.id, meal.id)}
                                  className="text-brand-muted hover:text-brand-danger transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 bg-black/40 border border-white/5 text-center text-brand-muted font-space text-xs rounded-xl">
                          No meals logged today yet. Fill the log panel to register metrics.
                        </div>
                      )}
                    </div>

                    {/* Meal Logging Form */}
                    <div className="lg:col-span-5">
                      <form onSubmit={handleAddMealSubmit} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 text-left">
                        <h3 className="font-space font-bold uppercase text-xs text-white border-b border-white/5 pb-2">
                          Log Nutritional Intake
                        </h3>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-space text-[9px] uppercase text-brand-muted">Meal Description</label>
                          <input
                            type="text"
                            required
                            value={mealName}
                            onChange={(e) => setMealName(e.target.value)}
                            className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white outline-none font-inter text-xs"
                            placeholder="e.g. Scrambled eggs or Whey protein shake"
                          />
                        </div>

                        {/* Food Snap Input */}
                        <div className="flex flex-col gap-1.5">
                          <label className="font-space text-[9px] uppercase text-brand-muted flex items-center justify-between">
                            <span>Attach Food Snap (Optional)</span>
                            <span className="text-[8px] text-brand-glow">Purged at midnight</span>
                          </label>
                          {mealSnap ? (
                            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-brand-accent/40 bg-black">
                              <img src={mealSnap} alt="Food snap preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setMealSnap("")}
                                className="absolute top-2 right-2 p-1 bg-black/80 hover:bg-brand-danger text-white rounded-full transition-colors cursor-pointer"
                                title="Remove snap"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center gap-2 border border-dashed border-white/20 hover:border-brand-accent px-4 py-3 rounded-xl cursor-pointer bg-black/40 hover:bg-brand-accent/5 transition-all text-xs font-space text-brand-muted hover:text-white">
                              <Camera className="w-4 h-4 text-brand-accent" />
                              <span>Take Camera Photo / Upload Snap</span>
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleSnapUpload}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-space text-[9px] uppercase text-brand-muted">Calories (kcal)</label>
                            <input
                              type="number"
                              required
                              value={mealCalories}
                              onChange={(e) => setMealCalories(Number(e.target.value))}
                              className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white outline-none font-inter text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-space text-[9px] uppercase text-brand-muted">Protein (g)</label>
                            <input
                              type="number"
                              required
                              value={mealProtein}
                              onChange={(e) => setMealProtein(Number(e.target.value))}
                              className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white outline-none font-inter text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-space text-[9px] uppercase text-brand-muted">Carbs (g)</label>
                            <input
                              type="number"
                              required
                              value={mealCarbs}
                              onChange={(e) => setMealCarbs(Number(e.target.value))}
                              className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white outline-none font-inter text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-space text-[9px] uppercase text-brand-muted">Fat (g)</label>
                            <input
                              type="number"
                              required
                              value={mealFat}
                              onChange={(e) => setMealFat(Number(e.target.value))}
                              className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white outline-none font-inter text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-space text-[9px] uppercase text-brand-muted">Meal Type</label>
                          <select
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value as any)}
                            className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white outline-none font-inter text-xs"
                          >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack / Shake</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-brand-accent hover:bg-brand-accent-sec text-white rounded-xl font-space font-semibold text-xs tracking-wider uppercase transition-colors mt-2 cursor-pointer"
                        >
                          Submit Meal Log
                        </button>
                      </form>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-panel p-12 text-center text-brand-muted font-space text-sm">
                  No diet plan details found. Ask Coach Hari to assign nutrition macros.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROGRESS LOGS */}
          {activeTab === "progress" && (
            <div className="flex flex-col gap-8">
              {/* Weight chart */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left">
                <h3 className="font-space font-bold uppercase tracking-wider text-xs text-white mb-6 border-b border-white/5 pb-2">
                  Body Weight Diagnostics Chart
                </h3>

                <div className="h-64 w-full font-orbitron text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={clientMeasurements}>
                      <XAxis dataKey="recordedAt" stroke="rgba(255,255,255,0.3)" />
                      <YAxis stroke="rgba(255,255,255,0.3)" domain={["auto", "auto"]} />
                      <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,30,30,0.3)" }} />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#FF1E1E" 
                        strokeWidth={3} 
                        dot={{ fill: "#FF1E1E", r: 4 }} 
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Log new statistics form */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
                <div className="md:col-span-6">
                  <form onSubmit={handleLogMeasurementsSubmit} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                    <h3 className="font-space font-bold uppercase text-xs text-white border-b border-white/5 pb-2">
                      Record Diagnostics Update
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-space text-[9px] uppercase text-brand-muted">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={logWeight}
                          onChange={(e) => setLogWeight(Number(e.target.value))}
                          className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white outline-none font-inter text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-space text-[9px] uppercase text-brand-muted">Body Fat %</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={logBodyFat}
                          onChange={(e) => setLogBodyFat(Number(e.target.value))}
                          className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white outline-none font-inter text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-space text-[9px] uppercase text-brand-muted">Waist Circumference (cm)</label>
                        <input
                          type="number"
                          required
                          value={logWaist}
                          onChange={(e) => setLogWaist(Number(e.target.value))}
                          className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white outline-none font-inter text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-space text-[9px] uppercase text-brand-muted">Bicep Size (cm)</label>
                        <input
                          type="number"
                          required
                          value={logBiceps}
                          onChange={(e) => setLogBiceps(Number(e.target.value))}
                          className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white outline-none font-inter text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-accent hover:bg-brand-accent-sec text-white rounded-xl font-space font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      Update Stats Log
                    </button>
                  </form>
                </div>

                <div className="md:col-span-6 flex flex-col gap-4">
                  <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <h4 className="font-space font-bold uppercase text-xs text-white mb-3">Key Metrics Tracker</h4>
                    <div className="flex flex-col gap-2 font-inter text-xs text-brand-muted">
                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span>Height:</span>
                        <span className="text-white font-bold">{clientProfile.height} cm</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span>Starting weight:</span>
                        <span className="text-white font-bold">87.0 kg</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span>Current weight:</span>
                        <span className="text-brand-glow font-bold">{clientProfile.currentWeight} kg</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span>Goal target weight:</span>
                        <span className="text-white font-bold">{clientProfile.targetWeight} kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TRAINER CHAT HUB */}
          {activeTab === "chat" && (
            <div className="glass-panel rounded-2xl border border-white/5 flex flex-col h-[500px]">
              {/* Chat Header */}
              <div className="bg-black/60 border-b border-white/5 px-6 py-4 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-xs font-bold text-white">
                    CH
                  </div>
                  <div>
                    <h4 className="font-space font-bold text-xs uppercase text-white">Coach Hari</h4>
                    <span className="font-inter text-[9px] text-brand-success font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-success" /> Active Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Message Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {clientMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col max-w-[75%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
                    >
                      <div className={`p-3.5 rounded-2xl text-left text-xs leading-relaxed ${
                        isMe 
                          ? "bg-brand-accent text-white rounded-br-none" 
                          : "bg-brand-card border border-white/5 text-white rounded-bl-none"
                      }`}>
                        {msg.content}
                        
                        {/* Attachments */}
                        {msg.mediaUrl && (
                          <div className="mt-3 p-2 bg-black/40 rounded-lg border border-white/10 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-brand-glow" />
                            <span className="text-[10px] text-brand-muted truncate max-w-[120px]">{msg.fileName}</span>
                            <span className="text-[8px] bg-brand-accent px-1.5 py-0.5 rounded text-white font-bold uppercase">PDF</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[8px] text-brand-muted mt-1 font-orbitron">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChat} className="bg-black/60 border-t border-white/5 p-4 flex gap-3">
                <input
                  type="text"
                  required
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  className="flex-1 bg-black border border-white/10 focus:border-brand-accent px-4 py-3 rounded-xl text-white outline-none font-inter text-xs"
                  placeholder="Type message to Coach Hari..."
                />
                <button
                  type="submit"
                  className="px-4 bg-brand-accent hover:bg-brand-accent-sec rounded-xl text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Food Photo Viewer Modal */}
      {selectedMealPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedMealPhoto(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-brand-sec-bg border border-brand-accent/40 rounded-2xl overflow-hidden p-4 flex flex-col gap-4 text-left shadow-[0_0_50px_rgba(255,30,30,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-space font-bold uppercase text-sm text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-brand-glow" />
                <span>{selectedMealPhoto.name} Food Snap</span>
              </h3>
              <button
                onClick={() => setSelectedMealPhoto(null)}
                className="p-1.5 bg-white/10 hover:bg-brand-danger text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black border border-white/5">
              <img src={selectedMealPhoto.url} alt={selectedMealPhoto.name} className="w-full h-full object-contain" />
            </div>
            <div className="font-inter text-xs text-brand-muted text-center">
              Food photo verified • Auto-purged from storage at midnight
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
