import Navbar from "~/components/navbar";
import OrgCard from "~/components/orgcard";
import { api } from "~/utils/api";
import { NextPage } from "next";
import { IconButton } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { useState } from "react";

const FindOrganizations: NextPage = () => {
  const [searchText, setSearchText] = useState("");

  const organizations = api.organization.getOrganizations.useQuery({
    search: searchText,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const [toggleFilter, setToggleFilter] = useState(false);
  const handleToggleFilter = () => {
    setToggleFilter(!toggleFilter);
  };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <div className="mx-10 my-4 flex h-12 font-custom-lexend ">
        <h1 className="text-gradient mb-2 h-full  font-custom-epilogue text-2xl font-extrabold   ">
          Find Organizations
        </h1>
      </div>

      {/* SEARCH FUNCTION */}
      <div className="mx-10 flex w-2/5 items-center phone:w-full">
        <input
          type="text"
          value={searchText}
          name="search"
          onChange={handleSearchChange}
          className="flex-1 rounded-l p-2 shadow-inner"
          placeholder="Search"
        />

        <div
          className={`ml-12  rounded-t-md ${toggleFilter && "bg-gradient "}`}
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

      {toggleFilter && (
        <div className="bg-gradient mx-10 rounded-md  px-10 py-5 ">
          <p className="text-white">ihg</p>
          <p>ihg</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
        </div>
      )}

      <div className="mx-4 mb-5 mt-10 flex flex-wrap justify-center gap-5">
        {organizations?.data?.map((organization) => (
          <OrgCard
            key={organization.id}
            searchText={searchText}
            organization={organization}
          />
        ))}
      </div>

      {/* <button onClick={() => handleFetchOrganizations()}>button</button> */}
    </div>
  );
};

export default FindOrganizations;
