import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client & Trainer Authentication",
  description: "Sign in to access your customized personal training dashboard, active workout routines, daily food snap logs, and direct messaging with Coach Hari.",
  alternates: {
    canonical: "/auth",
  },
  openGraph: {
    title: "Client & Trainer Authentication | HARI FITNESS",
    description: "Sign in to access your customized personal training workspace, nutrition logs, and workout calendars.",
    url: "https://hari-fitness.vercel.app/auth",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
