import React from "react";
import Dashboard from "@/components/Dashboard/Dashboard";
import SideNavigation from "@/components/SideNavigation";

export default function Home() {
  return <SideNavigation menu="1" konten={<Dashboard />} />;
}
