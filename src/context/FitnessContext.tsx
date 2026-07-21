"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "TRAINER" | "CLIENT";
  image?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  height: number; // cm
  currentWeight: number; // kg
  targetWeight: number; // kg
  activityLevel: string;
  medicalNotes: string;
  habits: string[];
  xp: number;
  level: number;
  streak: number;
  dailyStreak: number;
  lastActive: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  videoUrl?: string;
  instructions: string;
  completed: boolean;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  clientId: string;
  title: string;
  description: string;
  exercises: Exercise[];
  completedDates: string[]; // ['2026-07-08', '2026-07-07']
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  type: "breakfast" | "lunch" | "dinner" | "snack";
  time?: string;
  imageSnap?: string; // Base64 food photo snapshot
  dateLogged?: string; // YYYY-MM-DD
}

export interface DietPlan {
  id: string;
  clientId: string;
  title: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: Meal[];
  waterIntake: number; // ml logged today
  waterTarget: number; // ml target (e.g. 3500)
}

export interface MeasurementLog {
  id: string;
  clientId: string;
  weight: number;
  bodyFat: number;
  bmi: number;
  chest: number;
  waist: number;
  hip: number;
  biceps: number;
  thigh: number;
  shoulders: number;
  neck: number;
  recordedAt: string; // YYYY-MM-DD
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  mediaUrl?: string;
  fileType?: "pdf" | "image" | "voice";
  fileName?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "WORKOUT" | "MEAL" | "MESSAGE" | "ACHIEVEMENT" | "STREAK";
  isRead: boolean;
  createdAt: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  badgeCode: string;
  unlockedAt: string;
  xpAwarded: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export type DurationOption = "1month" | "6months" | "1year";

export interface PlanFeature {
  id: string;
  text: string;
  included: boolean;
}

export interface MembershipPlan {
  id: "standard" | "premium";
  title: string;
  badge?: string;
  prices: {
    "1month": number;
    "6months": number;
    "1year": number;
  };
  features: PlanFeature[];
}

export const DEFAULT_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "standard",
    title: "Standard",
    badge: "",
    prices: {
      "1month": 5899,
      "6months": 29999,
      "1year": 49999,
    },
    features: [
      { id: "s1", text: "Custom monthly workout routines", included: true },
      { id: "s2", text: "Macro targets & meal templates", included: true },
      { id: "s3", text: "Weekly progress reviews & reports", included: true },
      { id: "s4", text: "Access to client dashboard", included: true },
      { id: "s5", text: "Daily 1-on-1 coach check-ins", included: false },
      { id: "s6", text: "Priority chat support", included: false },
    ],
  },
  {
    id: "premium",
    title: "Premium",
    badge: "ADVANCED PREFERRED",
    prices: {
      "1month": 8999,
      "6months": 44999,
      "1year": 74999,
    },
    features: [
      { id: "p1", text: "Daily fitness & macro tracking to achieve goals", included: true },
      { id: "p2", text: "Daily Coach Hari check-in & guidance", included: true },
      { id: "p3", text: "Custom weekly modified workouts", included: true },
      { id: "p4", text: "1-on-1 diet plan updates & instant tweaks", included: true },
      { id: "p5", text: "Live chat support with Coach Hari", included: true },
      { id: "p6", text: "Hydration & habit trackers", included: true },
    ],
  },
];

interface FitnessContextType {
  currentUser: User | null;
  clients: ClientProfile[];
  workouts: WorkoutPlan[];
  diets: DietPlan[];
  messages: Message[];
  measurements: MeasurementLog[];
  notifications: Notification[];
  announcements: Announcement[];
  badges: Badge[];
  login: (email: string) => boolean;
  logout: () => void;
  updateWaterIntake: (clientId: string, amount: number) => void;
  addMeal: (clientId: string, meal: Omit<Meal, "id">) => void;
  deleteMeal: (clientId: string, mealId: string) => void;
  toggleExercise: (clientId: string, workoutId: string, exerciseId: string) => void;
  logMeasurements: (clientId: string, log: Omit<MeasurementLog, "id" | "recordedAt" | "clientId">) => void;
  addClient: (client: Omit<ClientProfile, "id" | "xp" | "level" | "streak" | "dailyStreak" | "lastActive">) => void;
  removeClient: (clientId: string) => void;
  assignWorkoutPlan: (clientId: string, plan: Omit<WorkoutPlan, "id" | "completedDates">) => void;
  assignDietPlan: (clientId: string, plan: Omit<DietPlan, "id">) => void;
  sendMessage: (senderId: string, receiverId: string, content: string, mediaFile?: { name: string; url: string; type: "pdf" | "image" | "voice" }) => void;
  markMessagesRead: (senderId: string, receiverId: string) => void;
  addAnnouncement: (title: string, content: string) => void;
  removeAnnouncement: (annId: string) => void;
  addXP: (clientId: string, xpAmount: number) => { leveledUp: boolean; newLevel: number };
  standardPrice: number;
  premiumPrice: number;
  membershipPlans: MembershipPlan[];
  updateMembershipPlans: (plans: MembershipPlan[]) => void;
  updatePricing: (standard: number, premium: number) => void;
  triggerCelebration: boolean;
  setTriggerCelebration: (val: boolean) => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

// Local Storage Helper
const getLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setLocalStorage = <T,>(key: string, value: T) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [diets, setDiets] = useState<DietPlan[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [triggerCelebration, setTriggerCelebration] = useState(false);
  const [standardPrice, setStandardPrice] = useState<number>(5899);
  const [premiumPrice, setPremiumPrice] = useState<number>(8999);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>(DEFAULT_MEMBERSHIP_PLANS);

  // Initialize and load from local storage
  useEffect(() => {
    // 1. Current User
    const storedUser = getLocalStorage<User | null>("hf_current_user", null);
    setCurrentUser(storedUser);

    // 2. Clients
    const initialClients: ClientProfile[] = [
      {
        id: "client-1",
        name: "Arjun Mehta",
        email: "client@hari.fit",
        age: 26,
        gender: "Male",
        height: 178,
        currentWeight: 84.5,
        targetWeight: 75.0,
        activityLevel: "Moderate",
        medicalNotes: "Minor left knee tendonitis, avoid heavy leg extensions.",
        habits: ["Drink 3L water", "10k steps", "8h sleep"],
        xp: 320,
        level: 2,
        streak: 5,
        dailyStreak: 5,
        lastActive: new Date().toISOString().split("T")[0],
      },
      {
        id: "client-2",
        name: "Karan Johar",
        email: "karan@gmail.com",
        age: 22,
        gender: "Male",
        height: 182,
        currentWeight: 68.0,
        targetWeight: 78.0,
        activityLevel: "Sedentary",
        medicalNotes: "None",
        habits: ["Drink 3.5L water", "Eat 150g protein"],
        xp: 140,
        level: 1,
        streak: 2,
        dailyStreak: 2,
        lastActive: new Date().toISOString().split("T")[0],
      },
      {
        id: "client-3",
        name: "Neha Sharma",
        email: "neha@outlook.com",
        age: 29,
        gender: "Female",
        height: 164,
        currentWeight: 69.2,
        targetWeight: 58.0,
        activityLevel: "Very Active",
        medicalNotes: "Lower back soreness if deadlifting incorrectly.",
        habits: ["Log meals", "No sugar challenge"],
        xp: 680,
        level: 3,
        streak: 12,
        dailyStreak: 12,
        lastActive: new Date().toISOString().split("T")[0],
      }
    ];
    setClients(getLocalStorage("hf_clients", initialClients));

    // 3. Workouts
    const initialWorkouts: WorkoutPlan[] = [
      {
        id: "workout-1",
        clientId: "client-1",
        title: "Push Day A (Hypertrophy)",
        description: "Focus on chest stretch and progressive overload on shoulder press.",
        exercises: [
          { id: "ex-1", name: "Incline Dumbbell Press", sets: 4, reps: "8-10", weight: "30kg", completed: true, instructions: "Set bench to 30 degrees. Keep chest up and shoulders down-and-back. Squeeze chest at peak." },
          { id: "ex-2", name: "Barbell Flat Bench Press", sets: 3, reps: "6-8", weight: "80kg", completed: true, instructions: "Arch lower back slightly, drive legs, touch mid-chest, push explosively." },
          { id: "ex-3", name: "Seated Dumbbell Shoulder Press", sets: 3, reps: "10-12", weight: "22kg", completed: false, instructions: "Keep elbows slightly tucked to protect shoulders. Press overhead." },
          { id: "ex-4", name: "Dumbbell Lateral Raises", sets: 4, reps: "15", weight: "10kg", completed: false, instructions: "Lean forward slightly. Lead with elbows, control the eccentric phase." },
          { id: "ex-5", name: "Rope Overhead Tricep Extension", sets: 3, reps: "12-15", weight: "25kg", completed: false, instructions: "Flail rope outwards at the top extension to fully contract triceps." }
        ],
        completedDates: [new Date().toISOString().split("T")[0]]
      },
      {
        id: "workout-2",
        clientId: "client-2",
        title: "Lean Bulk Plan - Pull A",
        description: "Heavy compound rows and lat isolation.",
        exercises: [
          { id: "ex-6", name: "Deadlift (Conventional)", sets: 3, reps: "5", weight: "100kg", completed: false, instructions: "Keep bar close to shins. Push floor away, stand tall." },
          { id: "ex-7", name: "Weighted Pull-Ups", sets: 3, reps: "6-8", weight: "10kg", completed: false, instructions: "Retract scapulae first. Pull chest to the bar." },
          { id: "ex-8", name: "Seated Cable Row (Wide Grip)", sets: 3, reps: "10-12", weight: "50kg", completed: false, instructions: "Squeeze shoulder blades together. Do not swing hips." }
        ],
        completedDates: []
      }
    ];
    setWorkouts(getLocalStorage("hf_workouts", initialWorkouts));

    // 4. Diets
    const initialDiets: DietPlan[] = [
      {
        id: "diet-1",
        clientId: "client-1",
        title: "Keto-Leaning Fat Loss Plan",
        targetCalories: 2000,
        targetProtein: 160,
        targetCarbs: 80,
        targetFat: 70,
        waterIntake: 2200,
        waterTarget: 3500,
        meals: [
          { id: "meal-1", name: "4 Whole Eggs scrambled in grass-fed Butter & Spinach", calories: 420, protein: 28, carbs: 4, fat: 34, type: "breakfast", time: "08:30 AM" },
          { id: "meal-2", name: "Grilled Chicken Breast (200g) with Broccoli & Quinoa", calories: 510, protein: 55, carbs: 32, fat: 12, type: "lunch", time: "01:30 PM" },
          { id: "meal-3", name: "Whey Protein Shake (2 scoops) + 30g Almonds", calories: 380, protein: 52, carbs: 10, fat: 16, type: "snack", time: "05:30 PM" }
        ]
      },
      {
        id: "diet-2",
        clientId: "client-2",
        title: "Lean Bulk Phase 1",
        targetCalories: 3000,
        targetProtein: 180,
        targetCarbs: 350,
        targetFat: 80,
        waterIntake: 1200,
        waterTarget: 4000,
        meals: [
          { id: "meal-4", name: "Oats (100g) + Milk (300ml) + Honey + Peanut Butter + Banana", calories: 850, protein: 32, carbs: 120, fat: 28, type: "breakfast", time: "08:00 AM" }
        ]
      }
    ];
    // Load diets and purge food snaps from previous days to save storage while keeping macro totals
    const todayStr = new Date().toISOString().split("T")[0];
    const loadedDiets = getLocalStorage<DietPlan[]>("hf_diets", initialDiets);
    let needPurgeSave = false;
    const sanitizedDiets = loadedDiets.map(diet => {
      const updatedMeals = diet.meals.map(meal => {
        const mealDate = meal.dateLogged || todayStr;
        if (meal.imageSnap && mealDate !== todayStr) {
          needPurgeSave = true;
          const { imageSnap, ...restMeal } = meal;
          return restMeal;
        }
        return meal;
      });
      return { ...diet, meals: updatedMeals };
    });
    if (needPurgeSave) {
      setLocalStorage("hf_diets", sanitizedDiets);
    }
    setDiets(sanitizedDiets);

    // 5. Messages
    const initialMessages: Message[] = [
      { id: "msg-1", senderId: "trainer", receiverId: "client-1", content: "Hey Arjun! Checked your check-in photos. The knee seems to be coping well. How did the push day workout feel today?", isRead: true, createdAt: "2026-07-08T10:00:00.000Z" },
      { id: "msg-2", senderId: "client-1", receiverId: "trainer", content: "Hey Coach! Flat bench felt strong. Knee was completely fine. But lateral raises felt a bit sticky on the right shoulder.", isRead: true, createdAt: "2026-07-08T10:15:00.000Z" },
      { id: "msg-3", senderId: "trainer", receiverId: "client-1", content: "Got it, let's lower the weight slightly and focus on leading with the elbow. I also shared your workout PDF for tomorrow.", isRead: false, createdAt: "2026-07-08T10:20:00.000Z", mediaUrl: "#", fileType: "pdf", fileName: "Tomorrow_Workout_Flow.pdf" }
    ];
    setMessages(getLocalStorage("hf_messages", initialMessages));

    // 6. Measurements
    const initialMeasurements: MeasurementLog[] = [
      { id: "m-1", clientId: "client-1", weight: 87.0, bodyFat: 21.4, bmi: 27.5, chest: 104, waist: 92, hip: 100, biceps: 38.5, thigh: 61, shoulders: 122, neck: 39, recordedAt: "2026-06-08" },
      { id: "m-2", clientId: "client-1", weight: 85.8, bodyFat: 19.8, bmi: 27.1, chest: 104.5, waist: 89.5, hip: 99, biceps: 38.8, thigh: 60.5, shoulders: 123, neck: 38.5, recordedAt: "2026-06-22" },
      { id: "m-3", clientId: "client-1", weight: 84.5, bodyFat: 18.2, bmi: 26.7, chest: 105, waist: 86.0, hip: 98, biceps: 39.0, thigh: 60, shoulders: 124, neck: 38.0, recordedAt: "2026-07-08" }
    ];
    setMeasurements(getLocalStorage("hf_measurements", initialMeasurements));

    // 7. Announcements
    const initialAnnouncements: Announcement[] = [
      { id: "ann-1", title: "💥 Group Weekly Challenge: 100% Macro Adherence", content: "To all clients! This week we are doing a streak challenge. Anyone who logs meals for 7 straight days and stays within 5% of their targets gets a free 30-minute coaching audit. Keep pushing!", date: "2026-07-07" },
      { id: "ann-2", title: "🏋️‍♂️ Correcting Squat Form Deep-Dive", content: "Check your chats for the squat form PDF explanation. Make sure you sit back and engage your glutes rather than letting your knees slide forward.", date: "2026-07-05" }
    ];
    setAnnouncements(getLocalStorage("hf_announcements", initialAnnouncements));

    // 8. Notifications
    const initialNotifications: Notification[] = [
      { id: "not-1", title: "New Workout Assigned", message: "Trainer assigned Push Day A (Hypertrophy) to you.", type: "WORKOUT", isRead: false, createdAt: new Date().toISOString() },
      { id: "not-2", title: "Streak Unlocked!", message: "You are on a 5-day active workout streak!", type: "STREAK", isRead: false, createdAt: new Date().toISOString() }
    ];
    setNotifications(getLocalStorage("hf_notifications", initialNotifications));

    // 9. Badges
    const initialBadges: Badge[] = [
      { id: "badge-1", title: "Iron Disciple", description: "Completed 5 workouts in a single week", badgeCode: "IRON", unlockedAt: "2026-07-04T12:00:00.000Z", xpAwarded: 100 },
      { id: "badge-2", title: "Hydration Master", description: "Reached 3.5L water goal 3 days in a row", badgeCode: "WATER", unlockedAt: "2026-07-07T18:00:00.000Z", xpAwarded: 50 }
    ];
    setBadges(getLocalStorage("hf_badges", initialBadges));

    // 10. Membership Plans
    const loadedPlans = getLocalStorage<MembershipPlan[]>("hf_membership_plans", DEFAULT_MEMBERSHIP_PLANS);
    setMembershipPlans(loadedPlans);

    const std = loadedPlans.find(p => p.id === "standard")?.prices["1month"] || 5899;
    const prem = loadedPlans.find(p => p.id === "premium")?.prices["1month"] || 8999;
    setStandardPrice(std);
    setPremiumPrice(prem);
  }, []);

  // Save updates helper
  const saveState = <T,>(key: string, data: T, setFn: (val: T) => void) => {
    setFn(data);
    setLocalStorage(key, data);
  };

  const login = (email: string): boolean => {
    let userObj: User | null = null;
    if (email.toLowerCase() === "harifitness2026@gmail.com") {
      userObj = {
        id: "trainer",
        email: "harifitness2026@gmail.com",
        name: "Coach Hari",
        role: "TRAINER",
        image: "/images/transformations/trainer-after.jpg",
      };
    } else {
      // Find matching client
      const matched = clients.find(c => c.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        userObj = {
          id: matched.id,
          email: matched.email,
          name: matched.name,
          role: "CLIENT",
          image: "/images/transformations/client-1-after.jpg",
        };
      }
    }

    if (userObj) {
      setCurrentUser(userObj);
      setLocalStorage("hf_current_user", userObj);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("hf_current_user");
    }
  };

  const addXP = (clientId: string, xpAmount: number) => {
    let leveledUp = false;
    let newLevel = 1;

    const updated = clients.map(client => {
      if (client.id === clientId) {
        const totalXp = client.xp + xpAmount;
        const currentLvl = client.level;
        // Level logic: 300 XP per level
        const nextLvl = Math.floor(totalXp / 300) + 1;
        if (nextLvl > currentLvl) {
          leveledUp = true;
          newLevel = nextLvl;
          setTriggerCelebration(true);
          
          // Add notification
          const newNot: Notification = {
            id: `not-${Date.now()}`,
            title: `Level Up! Level ${nextLvl}`,
            message: `Congratulations! You've unlocked Level ${nextLvl} on your journey.`,
            type: "ACHIEVEMENT",
            isRead: false,
            createdAt: new Date().toISOString()
          };
          saveState("hf_notifications", [newNot, ...notifications], setNotifications);
        }
        return {
          ...client,
          xp: totalXp,
          level: nextLvl
        };
      }
      return client;
    });

    saveState("hf_clients", updated, setClients);
    return { leveledUp, newLevel };
  };

  const updateWaterIntake = (clientId: string, amount: number) => {
    const updated = diets.map(d => {
      if (d.clientId === clientId) {
        const newIntake = Math.max(0, d.waterIntake + amount);
        // Award XP if client hits hydration target
        if (newIntake >= d.waterTarget && d.waterIntake < d.waterTarget) {
          addXP(clientId, 50);
          const newNot: Notification = {
            id: `not-${Date.now()}`,
            title: "Hydration Goal Complete!",
            message: `You've completed your daily water goal of ${(d.waterTarget/1000).toFixed(1)}L! +50 XP`,
            type: "MEAL",
            isRead: false,
            createdAt: new Date().toISOString()
          };
          setNotifications(prev => [newNot, ...prev]);
        }
        return { ...d, waterIntake: newIntake };
      }
      return d;
    });
    saveState("hf_diets", updated, setDiets);
  };

  const addMeal = (clientId: string, newMeal: Omit<Meal, "id">) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const mealObj: Meal = {
      ...newMeal,
      id: `meal-${Date.now()}`,
      dateLogged: newMeal.dateLogged || todayStr
    };

    const updated = diets.map(d => {
      if (d.clientId === clientId) {
        const newMeals = [...d.meals, mealObj];
        // Calculate totals and award XP for logging meals
        addXP(clientId, 15);
        return { ...d, meals: newMeals };
      }
      return d;
    });
    saveState("hf_diets", updated, setDiets);
  };

  const deleteMeal = (clientId: string, mealId: string) => {
    const updated = diets.map(d => {
      if (d.clientId === clientId) {
        return { ...d, meals: d.meals.filter(m => m.id !== mealId) };
      }
      return d;
    });
    saveState("hf_diets", updated, setDiets);
  };

  const toggleExercise = (clientId: string, workoutId: string, exerciseId: string) => {
    let allCompletedBefore = false;
    let allCompletedAfter = false;

    const updated = workouts.map(w => {
      if (w.id === workoutId && w.clientId === clientId) {
        allCompletedBefore = w.exercises.every(e => e.completed);
        
        const updatedEx = w.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return { ...ex, completed: !ex.completed };
          }
          return ex;
        });

        allCompletedAfter = updatedEx.every(e => e.completed);
        
        let completedDates = [...w.completedDates];
        const today = new Date().toISOString().split("T")[0];
        
        if (allCompletedAfter && !allCompletedBefore) {
          if (!completedDates.includes(today)) {
            completedDates.push(today);
            addXP(clientId, 100); // Complete workout grants 100 XP
            // Trigger badge check / streaks
            const newNot: Notification = {
              id: `not-${Date.now()}`,
              title: "Workout Completed!",
              message: `You successfully finished "${w.title}". +100 XP`,
              type: "WORKOUT",
              isRead: false,
              createdAt: new Date().toISOString()
            };
            setNotifications(prev => [newNot, ...prev]);
          }
        } else if (!allCompletedAfter && allCompletedBefore) {
          completedDates = completedDates.filter(d => d !== today);
        }

        return {
          ...w,
          exercises: updatedEx,
          completedDates
        };
      }
      return w;
    });

    saveState("hf_workouts", updated, setWorkouts);
  };

  const logMeasurements = (clientId: string, log: Omit<MeasurementLog, "id" | "recordedAt" | "clientId">) => {
    const today = new Date().toISOString().split("T")[0];
    const logObj: MeasurementLog = {
      ...log,
      clientId,
      id: `m-${Date.now()}`,
      recordedAt: today
    };

    const newLogs = [...measurements, logObj];
    saveState("hf_measurements", newLogs, setMeasurements);

    // Update weight on ClientProfile
    const updatedClients = clients.map(c => {
      if (c.id === clientId) {
        addXP(clientId, 30); // Logging weight grants 30 XP
        return { ...c, currentWeight: log.weight };
      }
      return c;
    });
    saveState("hf_clients", updatedClients, setClients);
  };

  const addClient = (newClient: Omit<ClientProfile, "id" | "xp" | "level" | "streak" | "dailyStreak" | "lastActive">) => {
    const id = `client-${Date.now()}`;
    const clientObj: ClientProfile = {
      ...newClient,
      id,
      xp: 0,
      level: 1,
      streak: 0,
      dailyStreak: 0,
      lastActive: new Date().toISOString().split("T")[0]
    };
    saveState("hf_clients", [...clients, clientObj], setClients);

    // Initialize default workout / diet plans for this new client
    const defaultWorkout: WorkoutPlan = {
      id: `workout-${Date.now()}`,
      clientId: id,
      title: "Introduction Fitness Plan",
      description: "Basic adaptation workouts assigned by Coach Hari.",
      exercises: [
        { id: `ex-new-1`, name: "Bodyweight Squats", sets: 3, reps: "15", weight: "BW", completed: false, instructions: "Keep torso vertical, descend until hips are lower than knees." },
        { id: `ex-new-2`, name: "Push-Ups", sets: 3, reps: "10-12", weight: "BW", completed: false, instructions: "Maintain a straight plank posture from head to heels." }
      ],
      completedDates: []
    };
    saveState("hf_workouts", [...workouts, defaultWorkout], setWorkouts);

    const defaultDiet: DietPlan = {
      id: `diet-${Date.now()}`,
      clientId: id,
      title: "Balanced Caloric Intake",
      targetCalories: 2200,
      targetProtein: 150,
      targetCarbs: 220,
      targetFat: 70,
      waterIntake: 0,
      waterTarget: 3000,
      meals: []
    };
    saveState("hf_diets", [...diets, defaultDiet], setDiets);
  };

  const removeClient = (clientId: string) => {
    saveState("hf_clients", clients.filter(c => c.id !== clientId), setClients);
    saveState("hf_workouts", workouts.filter(w => w.clientId !== clientId), setWorkouts);
    saveState("hf_diets", diets.filter(d => d.clientId !== clientId), setDiets);
    saveState("hf_measurements", measurements.filter(m => m.clientId !== clientId), setMeasurements);
  };

  const assignWorkoutPlan = (clientId: string, plan: Omit<WorkoutPlan, "id" | "completedDates">) => {
    const planObj: WorkoutPlan = {
      ...plan,
      id: `workout-${Date.now()}`,
      completedDates: []
    };
    
    // Deactivate previous active plans for this client, and append new
    const cleanWorkouts = workouts.filter(w => w.clientId !== clientId);
    saveState("hf_workouts", [...cleanWorkouts, planObj], setWorkouts);

    // Notify client
    const newNot: Notification = {
      id: `not-${Date.now()}`,
      title: "New Workout Assigned",
      message: `Coach Hari assigned a new workout plan: "${plan.title}"`,
      type: "WORKOUT",
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNot, ...prev]);
  };

  const assignDietPlan = (clientId: string, plan: Omit<DietPlan, "id">) => {
    const planObj: DietPlan = {
      ...plan,
      id: `diet-${Date.now()}`
    };

    const cleanDiets = diets.filter(d => d.clientId !== clientId);
    saveState("hf_diets", [...cleanDiets, planObj], setDiets);

    // Notify client
    const newNot: Notification = {
      id: `not-${Date.now()}`,
      title: "Diet Plan Updated",
      message: `Coach Hari updated your nutrition guidelines: "${plan.title}"`,
      type: "MEAL",
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNot, ...prev]);
  };

  const sendMessage = (
    senderId: string,
    receiverId: string,
    content: string,
    mediaFile?: { name: string; url: string; type: "pdf" | "image" | "voice" }
  ) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId,
      content,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    if (mediaFile) {
      newMsg.mediaUrl = mediaFile.url;
      newMsg.fileType = mediaFile.type;
      newMsg.fileName = mediaFile.name;
    }

    setMessages(prev => {
      const updated = [...prev, newMsg];
      setLocalStorage("hf_messages", updated);
      return updated;
    });

    // Add alert notification for client if sender is trainer
    if (senderId === "trainer") {
      const newNot: Notification = {
        id: `not-${Date.now()}`,
        title: "New Message from Coach",
        message: content.length > 50 ? `${content.substring(0, 50)}...` : content,
        type: "MESSAGE",
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => {
        const updated = [newNot, ...prev];
        setLocalStorage("hf_notifications", updated);
        return updated;
      });
    }
  };

  const markMessagesRead = (senderId: string, receiverId: string) => {
    setMessages(prev => {
      const updated = prev.map(msg => {
        if (msg.senderId === senderId && msg.receiverId === receiverId && !msg.isRead) {
          return { ...msg, isRead: true };
        }
        return msg;
      });
      setLocalStorage("hf_messages", updated);
      return updated;
    });
  };

  const addAnnouncement = (title: string, content: string) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split("T")[0]
    };
    
    setAnnouncements(prev => {
      const updated = [newAnn, ...prev];
      setLocalStorage("hf_announcements", updated);
      return updated;
    });

    // Send notifications to all active clients
    const newNots = clients.map(client => ({
      id: `not-${Date.now()}-${client.id}`,
      title: "New Announcement",
      message: title,
      type: "MESSAGE" as const,
      isRead: false,
      createdAt: new Date().toISOString()
    }));
    setNotifications(prev => {
      const updated = [...newNots, ...prev];
      setLocalStorage("hf_notifications", updated);
      return updated;
    });
  };

  const removeAnnouncement = (annId: string) => {
    setAnnouncements(prev => {
      const updated = prev.filter(ann => ann.id !== annId);
      setLocalStorage("hf_announcements", updated);
      return updated;
    });
  };

  const updateMembershipPlans = (newPlans: MembershipPlan[]) => {
    saveState("hf_membership_plans", newPlans, setMembershipPlans);
    const std = newPlans.find(p => p.id === "standard")?.prices["1month"] || 5899;
    const prem = newPlans.find(p => p.id === "premium")?.prices["1month"] || 8999;
    saveState("hf_price_standard", std, setStandardPrice);
    saveState("hf_price_premium", prem, setPremiumPrice);
  };

  const updatePricing = (standard: number, premium: number) => {
    saveState("hf_price_standard", standard, setStandardPrice);
    saveState("hf_price_premium", premium, setPremiumPrice);
    const updatedPlans = membershipPlans.map(p => {
      if (p.id === "standard") {
        return { ...p, prices: { ...p.prices, "1month": standard } };
      }
      if (p.id === "premium") {
        return { ...p, prices: { ...p.prices, "1month": premium } };
      }
      return p;
    });
    saveState("hf_membership_plans", updatedPlans, setMembershipPlans);
  };

  // Load and resolve Cloudinary URLs for current user profile images dynamically
  useEffect(() => {
    if (currentUser && currentUser.image && currentUser.image.startsWith("/images/transformations/")) {
      const fileName = currentUser.image.split("/").pop();
      if (fileName) {
        const url = getCloudinaryImageUrl(`transformations/${fileName}`, currentUser.image);
        if (url !== currentUser.image) {
          setCurrentUser(prev => prev ? { ...prev, image: url } : null);
        }
      }
    }
  }, [currentUser?.id, currentUser?.image]);

  return (
    <FitnessContext.Provider
      value={{
        currentUser,
        clients,
        workouts,
        diets,
        messages,
        measurements,
        notifications,
        announcements,
        badges,
        login,
        logout,
        updateWaterIntake,
        addMeal,
        deleteMeal,
        toggleExercise,
        logMeasurements,
        addClient,
        removeClient,
        assignWorkoutPlan,
        assignDietPlan,
        sendMessage,
        markMessagesRead,
        addAnnouncement,
        removeAnnouncement,
        addXP,
        standardPrice,
        premiumPrice,
        membershipPlans,
        updateMembershipPlans,
        updatePricing,
        triggerCelebration,
        setTriggerCelebration
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error("useFitness must be used within a FitnessProvider");
  }
  return context;
};
