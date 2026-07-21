import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Fitness Dashboard",
  description: "Private client workspace for active workout logging, nutrition macro targets, daily food photo snaps, body metrics diagnostics, and coach messaging.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/dashboard/client",
  },
};

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
