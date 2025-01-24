import React from "react";
import Material from "@/components/Kelola/Material/Material";
import SideNavigation from "@/components/SideNavigation";

export default function Dashboard() {
  return <SideNavigation menu="2-3" submenu="2" konten={<Material />} />;
}
