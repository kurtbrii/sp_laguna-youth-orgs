import React, { useState } from "react";
import Navbar from "../../../components/navbar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import ActivitiesCard from "~/components/ActivitiesCard";

// type QueryActivity = {
//   id: string;
//   name: string;
//   details: string;
//   date: Date;
//   createdAt: Date;
//   location: string;
//   organization: {
//     user: {
//       id: string;
//       image: string | null;
//     };
//   };
//   hasOrganizations: boolean;
//   hasVolunteers: boolean;
//   hasParticipants: boolean;
//   organizationId: string;
// };

const Index = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const router = useRouter();

  const [searchText, setSearchText] = useState("");

  const [callOrParticipation, setCurrentTag] = useState<string>("call");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const [toggleFilter, setToggleFilter] = useState(false);
  const handleToggleFilter = () => {
    setToggleFilter(!toggleFilter);
  };

  const activity = api.activity.getActivities.useQuery({ search: searchText });

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <div className="mx-10  flex flex-col">
        <div className=" my-4 flex h-12">
          <h1 className="text-gradient  mb-6 font-custom-epilogue text-2xl font-extrabold">
            Get Involved
          </h1>
        </div>

        <div className=" flex items-center justify-between phone:flex-col">
          {/* SEARCH FUNCTION */}
          <div className="flex w-2/5 items-center phone:w-full">
            <input
              type="text"
              value={searchText}
              name="search"
              onChange={handleSearchChange}
              className="flex-1 rounded-l p-2 shadow-inner"
              placeholder="Search"
            />

            <div
              className={`ml-12 rounded-t-md ${toggleFilter && "bg-gradient "}`}
            >
              <IconButton
                className="flex"
                onClick={handleToggleFilter}
                style={toggleFilter ? { color: "white" } : {}}
              >
                <TuneIcon />
              </IconButton>
            </div>
          </div>

          <section className="flex flex-col">
            <div className="mx-20 flex justify-center">
              <select
                className={`${callOrParticipation === "call" ? "border-secondary text-secondary" : "border-primary text-primary"} w-full rounded-md border  bg-transparent px-2 py-2 text-sm font-bold  transition ease-in-out hover:bg-transparent focus:outline-none`}
                value={callOrParticipation}
                onChange={(e) => {
                  setCurrentTag(e.target.value);
                }}
              >
                <option value="call">Activity Call</option>
                <option value="participation">Centers of Participations</option>
              </select>
            </div>
          </section>

          {/* ADD EVENT */}
          {sessionData && sessionData?.user.role !== "VOLUNTEER" && (
            <button
              className="btn-active w-1/5 px-4 py-2 phone:mt-5 phone:w-full"
              onClick={() => router.push("/homepage/activities/add")}
            >
              Promote an Activity
            </button>
          )}
        </div>
      </div>

      {toggleFilter && (
        <div className="bg-gradient mx-10 rounded-md px-10 py-5 ">
          <p className="text-white">ihg</p>
          <p>ihg</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
        </div>
      )}

      {/* ACTIVITIES CARD */}
      <div className="mb-5 mt-10 flex flex-wrap justify-center gap-5 ">
        {activity?.data?.map((queryActivity) => (
          <ActivitiesCard
            callOrParticipation={callOrParticipation}
            key={queryActivity.id}
            searchText={searchText}
            activity={queryActivity}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
