import React, { useState } from "react";
import Navbar from "../../../components/navbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import VolunteerNav from "~/components/VolunteerNav";
import JoinOrgCard from "~/components/JoinOrgCard";

const VolunteerManageActivities = () => {
  const router = useRouter();

  const { data: sessionData, status: sessionStatus } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const volunteer = user.data?.volunteer;

  const getOrganizations = api.volJoinOrg.getOrgOrVol.useQuery({
    volId: volunteer?.id,
    status: "PENDING",
  });

  const [searchText, setSearchText] = useState("");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="mx-10  flex flex-col font-custom-lexend text-customBlack-100">
        <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            MANAGE ACTIVITIES
          </p>
        </section>

        <VolunteerNav />

        <div className="mb-12 flex items-center justify-center gap-4 ">
          {getOrganizations.data?.map((data, index) => (
            <JoinOrgCard
              key={index}
              volunteer={volunteer}
              isVolunteer={false}
              organization={data.organization}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerManageActivities;
