import React from "react";
import SideNavigation from "@/components/SideNavigation";
import DetailPartInduk from "@/components/Dashboard/DetailPartInduk/DetailPartInduk";

const page = ({ params }) => {
    return (
        <SideNavigation menu="1" konten={<DetailPartInduk id={params.nomor} />} />
    );
}

export default page;