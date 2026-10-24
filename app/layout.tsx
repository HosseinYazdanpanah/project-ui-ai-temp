import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "HAFS | Hossein AI Freelance System",
  description: "HAFS: سامانه مدیریت مرحله‌به‌مرحله پروژه‌های فریلنسری طراحی و توسعه وب",
  applicationName: "HAFS",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
