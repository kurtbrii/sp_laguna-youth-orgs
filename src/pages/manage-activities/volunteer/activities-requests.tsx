import React, { useState } from "react";
import Navbar from "../../../components/navbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import VolunteerNav from "~/components/VolunteerNav";

const VolunteerManageActivities = () => {
  const router = useRouter();

  const { data: sessionData, status: sessionStatus } = useSession();

  // const userData = sessionData?.user.organization.bio;

  const getOrganizations = api.volJoinOrg.getOrganizations.useQuery({});

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="mx-10  flex flex-col">
        <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            MANAGE ACTIVITIES
          </p>
        </section>

        <VolunteerNav />
      </div>
    </div>
  );
};

export default VolunteerManageActivities;
