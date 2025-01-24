import React from "react";
import PartInduk from "@/components/Kelola/PartInduk/PartInduk";
import SideNavigation from "@/components/SideNavigation";

export default function Dashboard() {
  return <SideNavigation menu="2-1" submenu="2" konten={<PartInduk />} />;
}
