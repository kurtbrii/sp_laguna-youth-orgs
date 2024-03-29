import React, { useState } from "react";
import Navbar from "../../../components/navbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import ParticipationNav from "~/components/ParticipationsNav";

const Participation = () => {
  const router = useRouter();
  const { id, name, tag } = router.query;

  const [searchText, setSearchText] = useState(name ?? "");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <div className="mx-10  flex flex-col">
        <div className=" my-4 flex h-12  ">
          <h1 className="text-gradient mb-6 font-custom-epilogue text-2xl font-extrabold text-transparent ">
            PYDP Centers of Participation
          </h1>
        </div>

        <div className=" flex items-center justify-between">
          {/* SEARCH FUNCTION */}
          <div className="flex w-2/5 items-center phone:w-full">
            <input
              type="text"
              value={searchText}
              name="search"
              onChange={handleSearchChange}
              className="flex-1 rounded-l p-2 shadow-lg"
              placeholder="Search"
            />
          </div>
        </div>

        <ParticipationNav searchText={searchText} orgId={id} tag={tag} />
      </div>
    </div>
  );
};

export default Participation;
