"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFitness, ClientProfile, WorkoutPlan, DietPlan, Exercise, Meal, MembershipPlan } from "@/context/FitnessContext";
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  MessageSquare, 
  Volume2, 
  ChevronRight, 
  Check, 
  Plus, 
  Send,
  FileText,
  LogOut,
  Settings,
  Camera,
  Utensils,
  X
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TrainerDashboard() {
  const router = useRouter();
  const {
    currentUser,
    logout,
    clients,
    workouts,
    diets,
    messages,
    measurements,
    announcements,
    addClient,
    removeClient,
    assignWorkoutPlan,
    assignDietPlan,
    sendMessage,
    addAnnouncement,
    removeAnnouncement,
    standardPrice,
    premiumPrice,
    updatePricing,
    membershipPlans,
    updateMembershipPlans
  } = useFitness();

  const [activeTab, setActiveTab] = useState<"clients" | "assign" | "chat" | "broadcast" | "pricing_control">("clients");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedMealPhoto, setSelectedMealPhoto] = useState<{
    name: string;
    url: string;
    time?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);

  // Sync selectedClientId to valid client on load/change
  useEffect(() => {
    if (clients.length > 0 && (!selectedClientId || !clients.some(c => c.id === selectedClientId))) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  // Authentication Guard
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    } else if (currentUser.role !== "TRAINER") {
      router.push("/dashboard/client");
    }
  }, [currentUser]);

  // Selected Client Helpers
  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const clientMeasurements = measurements.filter(m => m.clientId === selectedClientId);
  const clientWorkout = workouts.find(w => w.clientId === selectedClientId);
  const clientDiet = diets.find(d => d.clientId === selectedClientId);

  // 1. Add Client Form State
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientAge, setNewClientAge] = useState(25);
  const [newClientGender, setNewClientGender] = useState("Male");
  const [newClientHeight, setNewClientHeight] = useState(175);
  const [newClientWeight, setNewClientWeight] = useState(75);
  const [newClientTarget, setNewClientTarget] = useState(70);
  const [newClientActivity, setNewClientActivity] = useState("Moderate");
  const [newClientMedical, setNewClientMedical] = useState("None");
  const [newClientHabits, setNewClientHabits] = useState("Drink 3L water");

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail) return;

    addClient({
      name: newClientName,
      email: newClientEmail,
      age: Number(newClientAge),
      gender: newClientGender,
      height: Number(newClientHeight),
      currentWeight: Number(newClientWeight),
      targetWeight: Number(newClientTarget),
      activityLevel: newClientActivity,
      medicalNotes: newClientMedical,
      habits: newClientHabits.split(",").map(h => h.trim())
    });

    setNewClientName("");
    setNewClientEmail("");
    setNewClientMedical("None");
    setShowAddClientModal(false);
    alert("New client registered! Initial adaptation workout and nutrition cards assigned automatically.");
  };

  // 2. Assign Workout Form State
  const [wPlanTitle, setWPlanTitle] = useState("Fat Loss Power routine");
  const [wPlanDesc, setWPlanDesc] = useState("Focus on fast pacing, compound compound pulls and core extensions.");
  
  // Array of exercises to assign
  const [assignExercises, setAssignExercises] = useState<Omit<Exercise, "id" | "completed">[]>([
    { name: "Decline Dumbbell Bench Press", sets: 4, reps: "8-10", weight: "24kg", instructions: "Touch upper chest. Squeeze chest contract." },
    { name: "Deadlift (Sumo Style)", sets: 3, reps: "5", weight: "120kg", instructions: "Keep back vertical, push floor away." }
  ]);

  const handleAddExerciseRow = () => {
    setAssignExercises([...assignExercises, { name: "", sets: 3, reps: "10", weight: "15kg", instructions: "" }]);
  };

  const handleRemoveExerciseRow = (index: number) => {
    if (assignExercises.length <= 1) {
      alert("A workout routine must have at least one exercise.");
      return;
    }
    setAssignExercises(assignExercises.filter((_, idx) => idx !== index));
  };

  const handleExerciseRowChange = (index: number, field: string, val: any) => {
    const updated = [...assignExercises];
    updated[index] = { ...updated[index], [field]: val };
    setAssignExercises(updated);
  };

  const handleAssignWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;

    const formattedExercises: Exercise[] = assignExercises.map((ex, i) => ({
      ...ex,
      id: `ex-assign-${Date.now()}-${i}`,
      completed: false
    }));

    assignWorkoutPlan(selectedClientId, {
      clientId: selectedClientId,
      title: wPlanTitle,
      description: wPlanDesc,
      exercises: formattedExercises
    });

    alert(`Workout routine assigned successfully to ${selectedClient?.name}!`);
    setActiveTab("clients");
  };

  // 3. Assign Diet Form State
  const [dPlanTitle, setDPlanTitle] = useState("Hypertrophy surplus plan");
  const [dPlanCalories, setDPlanCalories] = useState(2500);
  const [dPlanProtein, setDPlanProtein] = useState(160);
  const [dPlanCarbs, setDPlanCarbs] = useState(260);
  const [dPlanFat, setDPlanFat] = useState(70);
  const [dPlanWater, setDPlanWater] = useState(3500);

  const handleAssignDietSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;

    assignDietPlan(selectedClientId, {
      clientId: selectedClientId,
      title: dPlanTitle,
      targetCalories: Number(dPlanCalories),
      targetProtein: Number(dPlanProtein),
      targetCarbs: Number(dPlanCarbs),
      targetFat: Number(dPlanFat),
      meals: [
        { id: `meal-d1-${Date.now()}`, name: "Standard Breakfast: Oats, Whey and Berries", calories: 600, protein: 45, carbs: 70, fat: 12, type: "breakfast", time: "08:30 AM" }
      ],
      waterIntake: 0,
      waterTarget: Number(dPlanWater)
    });

    alert(`Diet guidelines assigned successfully to ${selectedClient?.name}!`);
    setActiveTab("clients");
  };

  // 4. Chat State
  const [trainerChatText, setTrainerChatText] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const clientMessages = messages.filter(m => m.senderId === selectedClientId || m.receiverId === selectedClientId);

  const handleTrainerSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !trainerChatText.trim()) return;

    sendMessage("trainer", selectedClientId, trainerChatText);
    setTrainerChatText("");
  };

  // 5. Broadcast State
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    addAnnouncement(annTitle, annContent);
    setAnnTitle("");
    setAnnContent("");
    alert("Broadcast posted! All active clients notified.");
  };

  // 6. Pricing & Plan Control Console State
  const [plansForm, setPlansForm] = useState<MembershipPlan[]>(membershipPlans || []);
  const [pricingError, setPricingError] = useState("");
  const [pricingSuccess, setPricingSuccess] = useState(false);

  useEffect(() => {
    if (membershipPlans && membershipPlans.length > 0) {
      setPlansForm(membershipPlans);
    }
  }, [membershipPlans]);

  const handlePriceChange = (planId: "standard" | "premium", duration: "1month" | "6months" | "1year", value: number) => {
    setPlansForm(prev =>
      prev.map(p => {
        if (p.id === planId) {
          return {
            ...p,
            prices: {
              ...p.prices,
              [duration]: value
            }
          };
        }
        return p;
      })
    );
  };

  const handleFeatureTextChange = (planId: "standard" | "premium", featId: string, newText: string) => {
    setPlansForm(prev =>
      prev.map(p => {
        if (p.id === planId) {
          return {
            ...p,
            features: p.features.map(f => (f.id === featId ? { ...f, text: newText } : f))
          };
        }
        return p;
      })
    );
  };

  const handleFeatureToggle = (planId: "standard" | "premium", featId: string) => {
    setPlansForm(prev =>
      prev.map(p => {
        if (p.id === planId) {
          return {
            ...p,
            features: p.features.map(f => (f.id === featId ? { ...f, included: !f.included } : f))
          };
        }
        return p;
      })
    );
  };

  const handleAddFeature = (planId: "standard" | "premium") => {
    setPlansForm(prev =>
      prev.map(p => {
        if (p.id === planId) {
          const newFeat = {
            id: `feat-${Date.now()}`,
            text: "New feature benefit",
            included: true
          };
          return {
            ...p,
            features: [...p.features, newFeat]
          };
        }
        return p;
      })
    );
  };

  const handleDeleteFeature = (planId: "standard" | "premium", featId: string) => {
    setPlansForm(prev =>
      prev.map(p => {
        if (p.id === planId) {
          if (p.features.length <= 1) {
            alert("Each membership plan must have at least one feature item.");
            return p;
          }
          return {
            ...p,
            features: p.features.filter(f => f.id !== featId)
          };
        }
        return p;
      })
    );
  };

  const handleSaveAllPlans = (e: React.FormEvent) => {
    e.preventDefault();
    setPricingError("");
    setPricingSuccess(false);

    for (const plan of plansForm) {
      if (plan.prices["1month"] <= 0 || plan.prices["6months"] <= 0 || plan.prices["1year"] <= 0) {
        setPricingError(`All pricing fields for ${plan.title} plan must be positive numbers.`);
        return;
      }
    }

    updateMembershipPlans(plansForm);
    setPricingSuccess(true);
    setTimeout(() => setPricingSuccess(false), 4000);
  };

  // Scroll chat bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedClientId, activeTab]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Dashboard Top Header */}
      <header className="bg-brand-sec-bg border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-black border border-brand-accent/50 shadow-[0_0_15px_rgba(255,30,30,0.3)]">
            <Dumbbell className="w-5 h-5 text-brand-glow drop-shadow-[0_0_8px_#FF1E1E] animate-pulse" />
          </div>
          <div>
            <h1 className="font-space font-bold uppercase tracking-wider text-sm text-white">Trainer Console</h1>
            <p className="font-inter text-brand-muted text-xs">Logged in: Coach Hari (Pro)</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2.5 rounded-lg bg-white/5 hover:bg-brand-danger/10 border border-white/5 hover:border-brand-danger/30 text-brand-muted hover:text-white transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 flex flex-row overflow-x-auto lg:flex-col gap-2 pb-3 lg:pb-0 scrollbar-none snap-x">
          {[
            { id: "clients", label: "Clients Directory", icon: Users },
            { id: "assign", label: "Assign Routines", icon: Dumbbell },
            { id: "chat", label: "Chat Hub", icon: MessageSquare },
            { id: "broadcast", label: "Broadcast News", icon: Volume2 },
            { id: "pricing_control", label: "Pricing Settings", icon: Settings }
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

          {/* Quick Info Summary */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 mt-6 hidden lg:block text-left">
            <h3 className="font-space text-xs tracking-wider uppercase text-white font-bold mb-3 border-b border-white/5 pb-2">
              Trainer Statistics
            </h3>
            <div className="flex flex-col gap-3 font-inter text-xs text-brand-muted">
              <div className="flex justify-between">
                <span>Active clients:</span>
                <span className="text-white font-bold">{clients.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-ins pending:</span>
                <span className="text-brand-glow font-bold">1</span>
              </div>
              <div className="flex justify-between">
                <span>Broadcasts posted:</span>
                <span className="text-white font-bold">{announcements.length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Console Area */}
        <main className="lg:col-span-9 flex flex-col gap-6">
          {/* TAB 1: CLIENTS DIRECTORY */}
          {activeTab === "clients" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Clients List Panel */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-space font-bold uppercase tracking-wider text-xs text-white">
                    Active Client Roster
                  </h3>
                  <button
                    onClick={() => setShowAddClientModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-accent hover:bg-brand-accent-sec text-white font-space text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Add client</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className={`glass-panel p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer w-full text-left ${
                        selectedClientId === client.id 
                          ? "border-brand-accent/60 bg-brand-accent/5" 
                          : "border-white/5"
                      }`}
                    >
                      <div>
                        <div className="font-space font-bold text-xs uppercase text-white">{client.name}</div>
                        <div className="font-inter text-[10px] text-brand-muted mt-0.5">{client.email}</div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${selectedClientId === client.id ? "text-brand-accent translate-x-1" : "text-brand-muted"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Client Biometrics & Details Deep Dive */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {selectedClient ? (
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-6 text-left relative">
                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                      <div>
                        <h2 className="font-space font-bold text-lg uppercase text-white">{selectedClient.name}</h2>
                        <span className="font-inter text-xs text-brand-muted">Age: {selectedClient.age} • Gender: {selectedClient.gender}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${selectedClient.name}?`)) {
                            removeClient(selectedClient.id);
                            setSelectedClientId(clients[0]?.id || "");
                          }
                        }}
                        className="p-2 bg-white/5 hover:bg-brand-danger/10 border border-white/5 hover:border-brand-danger/30 text-brand-muted hover:text-brand-danger rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-black/40 border border-white/5 p-3 rounded-lg text-center">
                        <div className="font-space text-[8px] uppercase text-brand-muted">Current Weight</div>
                        <div className="font-orbitron font-bold text-brand-glow text-sm mt-0.5">{selectedClient.currentWeight} kg</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-3 rounded-lg text-center">
                        <div className="font-space text-[8px] uppercase text-brand-muted">Target Weight</div>
                        <div className="font-orbitron font-bold text-white text-sm mt-0.5">{selectedClient.targetWeight} kg</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-3 rounded-lg text-center">
                        <div className="font-space text-[8px] uppercase text-brand-muted">Height</div>
                        <div className="font-orbitron font-bold text-white text-sm mt-0.5">{selectedClient.height} cm</div>
                      </div>
                    </div>

                    {/* Weight diagnostics chart */}
                    <div>
                      <h4 className="font-space text-[10px] tracking-wider uppercase text-brand-muted mb-3">Diagnostic trend logs</h4>
                      <div className="h-44 w-full font-orbitron text-[9px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={clientMeasurements}>
                            <XAxis dataKey="recordedAt" stroke="rgba(255,255,255,0.2)" />
                            <YAxis stroke="rgba(255,255,255,0.2)" domain={["auto", "auto"]} />
                            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,30,30,0.2)" }} />
                            <Line type="monotone" dataKey="weight" stroke="#FF1E1E" strokeWidth={2} dot={{ fill: "#FF1E1E", r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Active Plans display */}
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                      <div>
                        <h4 className="font-space text-[9px] uppercase text-brand-muted mb-1">Active workout plan</h4>
                        <div className="font-space text-xs font-semibold text-white uppercase truncate">
                          {clientWorkout ? clientWorkout.title : "No Plan Assigned"}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-space text-[9px] uppercase text-brand-muted mb-1">Active nutrition macros</h4>
                        <div className="font-space text-xs font-semibold text-white uppercase truncate">
                          {clientDiet ? `${clientDiet.targetCalories} kcal (P:${clientDiet.targetProtein}g)` : "No Macros Assigned"}
                        </div>
                      </div>
                    </div>

                    {/* Medical / physical notes */}
                    <div className="bg-brand-danger/5 border border-brand-danger/25 p-3.5 rounded-xl text-left">
                      <div className="font-space text-[9px] uppercase text-brand-danger font-semibold mb-1">Physical / Medical Diagnostics</div>
                      <p className="font-inter text-xs text-brand-muted leading-relaxed">
                        {selectedClient.medicalNotes || "No medical constraints listed."}
                      </p>
                    </div>

                    {/* Today's Food Snap Verification Feed */}
                    <div className="border-t border-white/5 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-space text-[10px] tracking-wider uppercase text-white font-bold flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-brand-glow" />
                          <span>Today's Food Snap Feed</span>
                        </h4>
                        <span className="text-[8px] font-space text-brand-muted uppercase">Purged at 12:00 AM</span>
                      </div>

                      {clientDiet && clientDiet.meals.some(m => m.imageSnap) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {clientDiet.meals.filter(m => m.imageSnap).map(meal => (
                            <div key={meal.id} className="p-3 bg-black/50 border border-brand-accent/30 rounded-xl flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setSelectedMealPhoto({
                                  name: meal.name,
                                  url: meal.imageSnap!,
                                  time: meal.time,
                                  calories: meal.calories,
                                  protein: meal.protein,
                                  carbs: meal.carbs,
                                  fat: meal.fat
                                })}
                                className="relative w-14 h-14 rounded-lg overflow-hidden border border-brand-accent/50 bg-black shrink-0 hover:scale-105 transition-transform cursor-pointer group"
                                title="Inspect snap photo"
                              >
                                <img src={meal.imageSnap} alt={meal.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Camera className="w-4 h-4 text-white" />
                                </div>
                              </button>
                              <div className="flex-1 min-w-0 text-left">
                                <div className="font-space font-bold text-xs uppercase text-white truncate">{meal.name}</div>
                                <div className="font-orbitron text-[10px] text-brand-glow font-bold mt-0.5">{meal.calories} kcal</div>
                                <div className="font-inter text-[9px] text-brand-muted">
                                  P:{meal.protein}g | C:{meal.carbs}g | F:{meal.fat}g
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-black/30 border border-white/5 rounded-xl text-center font-space text-[10px] text-brand-muted">
                          No food snaps uploaded by {selectedClient.name} today yet.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel p-12 text-center text-brand-muted font-space text-sm">
                    No clients enrolled yet. Enlist clients using the portal button.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ASSIGN ROUTINES PLANNER */}
          {activeTab === "assign" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {/* Workout Plan assigner */}
              <form onSubmit={handleAssignWorkoutSubmit} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                <h3 className="font-space font-bold uppercase text-xs text-brand-glow border-b border-white/5 pb-2">
                  Assign workout routine
                </h3>

                <div className="flex flex-col gap-1">
                  <label className="font-space text-[9px] uppercase text-brand-muted">Target client</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="bg-black border border-white/10 px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                  >
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-space text-[9px] uppercase text-brand-muted">Routine Title</label>
                  <input
                    type="text"
                    required
                    value={wPlanTitle}
                    onChange={(e) => setWPlanTitle(e.target.value)}
                    className="bg-black border border-white/10 px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-space text-[9px] uppercase text-brand-muted">Routine Description</label>
                  <textarea
                    rows={2}
                    value={wPlanDesc}
                    onChange={(e) => setWPlanDesc(e.target.value)}
                    className="bg-black border border-white/10 px-3 py-2 rounded-lg text-white font-inter text-xs outline-none resize-none"
                  />
                </div>

                {/* Exercises array builder */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <label className="font-space text-[9px] uppercase text-brand-muted">Exercises Checklist</label>
                    <button
                      type="button"
                      onClick={handleAddExerciseRow}
                      className="text-[9px] text-brand-accent hover:underline uppercase font-space flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add exercise
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 max-h-44 overflow-y-auto">
                    {assignExercises.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-lg flex flex-col gap-2">
                        <div className="grid grid-cols-12 gap-2">
                          <input
                            type="text"
                            placeholder="Name"
                            required
                            value={ex.name}
                            onChange={(e) => handleExerciseRowChange(idx, "name", e.target.value)}
                            className="col-span-6 bg-black border border-white/10 px-2 py-1 rounded text-white font-inter text-[10px] outline-none"
                          />
                          <input
                            type="number"
                            placeholder="Sets"
                            required
                            value={ex.sets}
                            onChange={(e) => handleExerciseRowChange(idx, "sets", Number(e.target.value))}
                            className="col-span-2 bg-black border border-white/10 px-2 py-1 rounded text-white font-inter text-[10px] outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Reps"
                            required
                            value={ex.reps}
                            onChange={(e) => handleExerciseRowChange(idx, "reps", e.target.value)}
                            className="col-span-2 bg-black border border-white/10 px-2 py-1 rounded text-white font-inter text-[10px] outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Weight"
                            required
                            value={ex.weight}
                            onChange={(e) => handleExerciseRowChange(idx, "weight", e.target.value)}
                            className="col-span-2 bg-black border border-white/10 px-2 py-1 rounded text-white font-inter text-[10px] outline-none"
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Short instructions"
                            value={ex.instructions}
                            onChange={(e) => handleExerciseRowChange(idx, "instructions", e.target.value)}
                            className="flex-1 bg-black border border-white/10 px-2 py-1 rounded text-white font-inter text-[9px] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExerciseRow(idx)}
                            className="p-1 bg-white/5 hover:bg-brand-danger/10 border border-white/5 hover:border-brand-danger/30 text-brand-muted hover:text-brand-danger rounded transition-colors cursor-pointer"
                            title="Remove Exercise"
                          >
                            <Trash2 className="w-3.5 h-3.5 font-bold" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-accent hover:bg-brand-accent-sec text-white rounded-xl font-space font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Assign Workout Routine
                </button>
              </form>

              {/* Diet Plan Assigner */}
              <form onSubmit={handleAssignDietSubmit} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                <h3 className="font-space font-bold uppercase text-xs text-brand-glow border-b border-white/5 pb-2">
                  Assign nutrition macros
                </h3>

                <div className="flex flex-col gap-1">
                  <label className="font-space text-[9px] uppercase text-brand-muted">Target client</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="bg-black border border-white/10 px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                  >
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-space text-[9px] uppercase text-brand-muted">Diet Title</label>
                  <input
                    type="text"
                    required
                    value={dPlanTitle}
                    onChange={(e) => setDPlanTitle(e.target.value)}
                    className="bg-black border border-white/10 px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-space text-[9px] uppercase text-brand-muted">Calories Limit</label>
                    <input
                      type="number"
                      required
                      value={dPlanCalories}
                      onChange={(e) => setDPlanCalories(Number(e.target.value))}
                      className="bg-black border border-white/10 px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-space text-[9px] uppercase text-brand-muted">Water Target (ml)</label>
                    <input
                      type="number"
                      required
                      value={dPlanWater}
                      onChange={(e) => setDPlanWater(Number(e.target.value))}
                      className="bg-black border border-white/10 px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-space text-[8px] uppercase text-brand-muted">Protein (g)</label>
                    <input
                      type="number"
                      required
                      value={dPlanProtein}
                      onChange={(e) => setDPlanProtein(Number(e.target.value))}
                      className="bg-black border border-white/10 px-2 py-2 rounded-lg text-white font-inter text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-space text-[8px] uppercase text-brand-muted">Carbs (g)</label>
                    <input
                      type="number"
                      required
                      value={dPlanCarbs}
                      onChange={(e) => setDPlanCarbs(Number(e.target.value))}
                      className="bg-black border border-white/10 px-2 py-2 rounded-lg text-white font-inter text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-space text-[8px] uppercase text-brand-muted">Fats (g)</label>
                    <input
                      type="number"
                      required
                      value={dPlanFat}
                      onChange={(e) => setDPlanFat(Number(e.target.value))}
                      className="bg-black border border-white/10 px-2 py-2 rounded-lg text-white font-inter text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-accent hover:bg-brand-accent-sec text-white rounded-xl font-space font-semibold text-xs tracking-wider uppercase transition-colors mt-auto cursor-pointer"
                >
                  Assign Nutrition Macros
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: INTEGRATED CHAT HUB */}
          {activeTab === "chat" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
              {/* Clients selector list */}
              <div className="lg:col-span-4 bg-brand-card/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 overflow-y-auto">
                <h4 className="font-space font-bold text-[9px] uppercase text-brand-muted text-left border-b border-white/5 pb-2 mb-2">Conversations</h4>
                {clients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`p-3 rounded-xl border text-left font-space text-xs transition-all cursor-pointer ${
                      selectedClientId === client.id
                        ? "bg-brand-accent/15 border-brand-accent text-white"
                        : "bg-black/35 border-transparent text-brand-muted hover:text-white"
                    }`}
                  >
                    {client.name}
                  </button>
                ))}
              </div>

              {/* Chat frame */}
              <div className="lg:col-span-8 glass-panel rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden">
                <div className="bg-black/60 border-b border-white/5 px-6 py-4 flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-xs font-bold text-white">
                      {selectedClient ? selectedClient.name.substring(0, 2).toUpperCase() : "CL"}
                    </div>
                    <div>
                      <h4 className="font-space font-bold text-xs uppercase text-white">{selectedClient ? selectedClient.name : "Select Client"}</h4>
                      <span className="font-inter text-[9px] text-brand-muted uppercase font-semibold">Active Client</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                  {clientMessages.map((msg) => {
                    const isMe = msg.senderId === "trainer";
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

                <form onSubmit={handleTrainerSendChat} className="bg-black/60 border-t border-white/5 p-4 flex gap-3">
                  <input
                    type="text"
                    required
                    value={trainerChatText}
                    onChange={(e) => setTrainerChatText(e.target.value)}
                    className="flex-1 bg-black border border-white/10 focus:border-brand-accent px-4 py-3 rounded-xl text-white outline-none font-inter text-xs"
                    placeholder={`Type message to ${selectedClient ? selectedClient.name : "client"}...`}
                  />
                  <button
                    type="submit"
                    className="px-4 bg-brand-accent hover:bg-brand-accent-sec rounded-xl text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: BROADCAST NEWS / CHALLENGES */}
          {activeTab === "broadcast" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Post form */}
              <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-brand-accent/20 bg-gradient-to-b from-brand-accent/5 to-transparent text-left flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Volume2 className="w-6 h-6 text-brand-accent animate-pulse" />
                  <h2 className="font-space font-bold uppercase tracking-wider text-lg text-white">
                    Broadcast Alert Console
                  </h2>
                </div>
                <p className="font-inter text-brand-muted text-xs leading-relaxed">
                  Publishing messages pushes announcements to all active client dashboards and sends them instant warnings to complete metrics.
                </p>

                <form onSubmit={handlePostAnnouncement} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-space text-[10px] tracking-wider uppercase text-brand-muted">Announcement Title</label>
                    <input
                      type="text"
                      required
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      className="bg-black border border-white/10 focus:border-brand-accent px-4 py-3 rounded-xl text-white outline-none font-inter text-xs"
                      placeholder="e.g. 💥 Weekly Hydration challenge!"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-space text-[10px] tracking-wider uppercase text-brand-muted">Alert message details</label>
                    <textarea
                      rows={4}
                      required
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      className="bg-black border border-white/10 focus:border-brand-accent px-4 py-3 rounded-xl text-white outline-none font-inter text-xs resize-none"
                      placeholder="Tell your clients what macros or steps limits they need to accomplish..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-brand-accent hover:bg-brand-accent-sec text-white font-space font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,30,30,0.15)] cursor-pointer"
                  >
                    Publish Broadcast Alert
                  </button>
                </form>
              </div>

              {/* History list */}
              <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 text-left flex flex-col gap-6">
                <h3 className="font-space font-bold uppercase text-xs text-white border-b border-white/5 pb-3">
                  Broadcasts History ({announcements.length})
                </h3>
                <div className="flex flex-col gap-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin">
                  {announcements.length === 0 ? (
                    <div className="text-center font-space text-xs text-brand-muted py-8">
                      No broadcast announcements posted yet.
                    </div>
                  ) : (
                    announcements.map((ann) => (
                      <div key={ann.id} className="p-4 bg-black/40 border border-white/5 rounded-xl flex justify-between items-start gap-4 hover:border-brand-accent/30 transition-all">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-space font-bold text-xs uppercase text-white">{ann.title}</span>
                            <span className="font-orbitron text-[8px] text-brand-muted">{ann.date}</span>
                          </div>
                          <p className="font-inter text-xs text-brand-muted leading-relaxed">
                            {ann.content}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Are you sure you want to remove this broadcast?")) {
                              removeAnnouncement(ann.id);
                            }
                          }}
                          className="p-2 bg-white/5 hover:bg-brand-danger/10 border border-white/5 hover:border-brand-danger/30 text-brand-muted hover:text-brand-danger rounded-lg transition-colors cursor-pointer"
                          title="Remove Broadcast"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRICING & PLAN CONTROL CONSOLE */}
          {activeTab === "pricing_control" && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-accent/20 bg-gradient-to-b from-brand-accent/5 to-transparent text-left flex flex-col gap-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-brand-accent animate-pulse" />
                  <div>
                    <h2 className="font-space font-bold uppercase tracking-wider text-lg text-white">
                      Membership &amp; Plan Control Console
                    </h2>
                    <p className="font-inter text-brand-muted text-xs">
                      Edit plan duration prices (1 Month, 6 Months, 1 Year) and custom feature bullet points live for landing page.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveAllPlans} className="flex flex-col gap-8">
                {pricingError && (
                  <div className="bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-xs p-3.5 rounded-xl text-center font-space">
                    {pricingError}
                  </div>
                )}
                {pricingSuccess && (
                  <div className="bg-brand-success/10 border border-brand-success/30 text-brand-success text-xs p-3.5 rounded-xl text-center font-space font-semibold">
                    ✓ All membership plans, duration packages, and feature bullets updated &amp; published to Landing Page!
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {plansForm.map((plan) => {
                    const isPremium = plan.id === "premium";
                    return (
                      <div
                        key={plan.id}
                        className={`p-6 rounded-2xl border flex flex-col gap-5 ${
                          isPremium
                            ? "bg-brand-accent/5 border-brand-accent/40 shadow-[0_0_20px_rgba(255,30,30,0.1)]"
                            : "bg-black/50 border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <h3 className="font-space font-bold uppercase text-sm text-white tracking-wider flex items-center gap-2">
                            <span className={isPremium ? "text-brand-glow" : "text-white"}>{plan.title} Plan</span>
                            {isPremium && (
                              <span className="text-[9px] bg-brand-accent px-2 py-0.5 rounded-full text-white font-semibold">
                                PREFERRED
                              </span>
                            )}
                          </h3>
                        </div>

                        {/* Duration Prices Editor */}
                        <div className="flex flex-col gap-3 bg-black/40 p-4 rounded-xl border border-white/5">
                          <span className="font-space text-[10px] uppercase text-brand-muted font-bold tracking-wider">
                            Duration Package Prices (₹)
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col gap-1">
                              <label className="font-space text-[8px] uppercase text-brand-muted">1 Month</label>
                              <input
                                type="number"
                                required
                                value={plan.prices["1month"]}
                                onChange={(e) => handlePriceChange(plan.id, "1month", Number(e.target.value))}
                                className="bg-black border border-white/15 focus:border-brand-accent px-2.5 py-2 rounded-lg text-white font-orbitron text-xs outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-space text-[8px] uppercase text-brand-muted">6 Months</label>
                              <input
                                type="number"
                                required
                                value={plan.prices["6months"]}
                                onChange={(e) => handlePriceChange(plan.id, "6months", Number(e.target.value))}
                                className="bg-black border border-white/15 focus:border-brand-accent px-2.5 py-2 rounded-lg text-white font-orbitron text-xs outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-space text-[8px] uppercase text-brand-muted">1 Year</label>
                              <input
                                type="number"
                                required
                                value={plan.prices["1year"]}
                                onChange={(e) => handlePriceChange(plan.id, "1year", Number(e.target.value))}
                                className="bg-black border border-white/15 focus:border-brand-accent px-2.5 py-2 rounded-lg text-white font-orbitron text-xs outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Feature Bullets Editor */}
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span className="font-space text-[10px] uppercase text-brand-muted font-bold tracking-wider">
                              Plan Features &amp; Benefits
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddFeature(plan.id)}
                              className="text-[9px] text-brand-accent hover:underline uppercase font-space flex items-center gap-1 cursor-pointer font-bold"
                            >
                              <Plus className="w-3 h-3" /> Add Feature
                            </button>
                          </div>

                          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                            {plan.features.map((feat) => (
                              <div
                                key={feat.id}
                                className="flex items-center gap-2 p-2 bg-black/60 border border-white/10 rounded-xl"
                              >
                                {/* Included/Excluded Toggle */}
                                <button
                                  type="button"
                                  onClick={() => handleFeatureToggle(plan.id, feat.id)}
                                  className={`px-2 py-1 rounded text-[10px] font-space font-bold uppercase transition-colors shrink-0 cursor-pointer ${
                                    feat.included
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                      : "bg-red-500/20 text-red-300 border border-red-500/40"
                                  }`}
                                  title="Click to toggle Included (✔) vs Excluded (✕)"
                                >
                                  {feat.included ? "✔ Included" : "✕ Excluded"}
                                </button>

                                {/* Feature Text Input */}
                                <input
                                  type="text"
                                  required
                                  value={feat.text}
                                  onChange={(e) => handleFeatureTextChange(plan.id, feat.id, e.target.value)}
                                  className="flex-1 bg-black border border-white/10 focus:border-brand-accent px-2.5 py-1.5 rounded-lg text-white font-inter text-xs outline-none min-w-0"
                                />

                                {/* Delete Feature */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFeature(plan.id, feat.id)}
                                  className="p-1.5 text-brand-muted hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                                  title="Remove feature"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-brand-accent hover:bg-brand-accent-sec text-white font-space font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(255,30,30,0.3)] hover:shadow-[0_0_35px_rgba(255,30,30,0.5)] cursor-pointer text-sm"
                >
                  Save &amp; Publish All Membership Plans
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Add Client Dialog Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-accent/30 w-full max-w-lg text-left max-h-[90vh] overflow-y-auto">
            <h3 className="font-space font-bold uppercase text-lg text-white border-b border-white/5 pb-3 mb-6">
              Register New Client
            </h3>

            <form onSubmit={handleAddClientSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[9px] uppercase text-brand-muted">Name</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                    placeholder="Arjun Mehta"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[9px] uppercase text-brand-muted">Email</label>
                  <input
                    type="email"
                    required
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                    placeholder="client@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[8px] uppercase text-brand-muted">Age (Yrs)</label>
                  <input
                    type="number"
                    required
                    value={newClientAge}
                    onChange={(e) => setNewClientAge(Number(e.target.value))}
                    className="bg-black border border-white/10 focus:border-brand-accent px-2 py-2 rounded-lg text-white font-inter text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[8px] uppercase text-brand-muted">Gender</label>
                  <select
                    value={newClientGender}
                    onChange={(e) => setNewClientGender(e.target.value)}
                    className="bg-black border border-white/10 focus:border-brand-accent px-2 py-2 rounded-lg text-white font-inter text-xs outline-none cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[8px] uppercase text-brand-muted">Height (cm)</label>
                  <input
                    type="number"
                    required
                    value={newClientHeight}
                    onChange={(e) => setNewClientHeight(Number(e.target.value))}
                    className="bg-black border border-white/10 focus:border-brand-accent px-2 py-2 rounded-lg text-white font-inter text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[9px] uppercase text-brand-muted">Current Weight (kg)</label>
                  <input
                    type="number"
                    required
                    value={newClientWeight}
                    onChange={(e) => setNewClientWeight(Number(e.target.value))}
                    className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-space text-[9px] uppercase text-brand-muted">Target Weight (kg)</label>
                  <input
                    type="number"
                    required
                    value={newClientTarget}
                    onChange={(e) => setNewClientTarget(Number(e.target.value))}
                    className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-space text-[9px] uppercase text-brand-muted">Medical constraint notes</label>
                <input
                  type="text"
                  value={newClientMedical}
                  onChange={(e) => setNewClientMedical(e.target.value)}
                  className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                  placeholder="e.g. Knee soreness or lower back pain"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-space text-[9px] uppercase text-brand-muted">Starting Habits (Comma separated)</label>
                <input
                  type="text"
                  value={newClientHabits}
                  onChange={(e) => setNewClientHabits(e.target.value)}
                  className="bg-black border border-white/10 focus:border-brand-accent px-3 py-2 rounded-lg text-white font-inter text-xs outline-none"
                  placeholder="e.g. Drink 3L water, 10k steps"
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-space font-semibold text-xs tracking-wider uppercase text-brand-muted hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-accent hover:bg-brand-accent-sec rounded-xl text-white font-space font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Register Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Food Snap Inspector Modal */}
      {selectedMealPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedMealPhoto(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-brand-sec-bg border border-brand-accent/40 rounded-2xl overflow-hidden p-5 flex flex-col gap-4 text-left shadow-[0_0_50px_rgba(255,30,30,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <h3 className="font-space font-bold uppercase text-sm text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-brand-glow" />
                  <span>{selectedMealPhoto.name} Food Snap</span>
                </h3>
                {selectedMealPhoto.time && (
                  <span className="font-inter text-[10px] text-brand-muted">Logged at {selectedMealPhoto.time}</span>
                )}
              </div>
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

            <div className="grid grid-cols-4 gap-2 bg-black/60 border border-white/5 p-3 rounded-xl text-center">
              <div>
                <div className="font-space text-[8px] text-brand-muted uppercase">Calories</div>
                <div className="font-orbitron font-bold text-brand-glow text-xs">{selectedMealPhoto.calories} kcal</div>
              </div>
              <div>
                <div className="font-space text-[8px] text-brand-muted uppercase">Protein</div>
                <div className="font-orbitron font-bold text-white text-xs">{selectedMealPhoto.protein}g</div>
              </div>
              <div>
                <div className="font-space text-[8px] text-brand-muted uppercase">Carbs</div>
                <div className="font-orbitron font-bold text-white text-xs">{selectedMealPhoto.carbs}g</div>
              </div>
              <div>
                <div className="font-space text-[8px] text-brand-muted uppercase">Fat</div>
                <div className="font-orbitron font-bold text-white text-xs">{selectedMealPhoto.fat}g</div>
              </div>
            </div>

            <div className="font-inter text-[10px] text-brand-muted text-center">
              Client food photo verified by Coach Hari • Auto-purged from storage at 12:00 AM
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
