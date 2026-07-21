import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coach Hari Trainer Console",
  description: "Master trainer console for client roster management, routine assignment, daily food snap verification feeds, and broadcast announcements.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/dashboard/trainer",
  },
};

export default function TrainerDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
