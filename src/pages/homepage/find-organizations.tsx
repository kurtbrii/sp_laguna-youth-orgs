/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "~/components/navbar";
import OrgCard from "~/components/orgcard";
import { api } from "~/utils/api";
import { type NextPage } from "next";
import { useState, useEffect } from "react";
import LoadingBar from "~/components/LoadingBar";

const FindOrganizations: NextPage = () => {
  const [searchText, setSearchText] = useState("");

  const [take, setTake] = useState(12);

  const { data: organizations, isLoading: cardsLoading } =
    api.organization.getOrganizations.useQuery({
      search: searchText,
      take: take,
    });

  const [allOrganizations, setAllOrganizations] = useState<any[]>([]);

  const handleLoadMore = () => {
    setTake(take + 12);
    // setCursor(activityId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const [toggleFilter, setToggleFilter] = useState(false);
  const handleToggleFilter = () => {
    setToggleFilter(!toggleFilter);
  };

  useEffect(() => {
    if (organizations) {
      setAllOrganizations([...organizations]);
    }
  }, [organizations]);

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

        {/* <div
          className={`ml-12  rounded-t-md ${toggleFilter && "bg-gradient "}`}
        >
          <IconButton
            className="flex"
            onClick={handleToggleFilter}
            style={toggleFilter ? { color: "white" } : {}}
          >
            <TuneIcon />
          </IconButton>
        </div> */}
      </div>

      {/* {toggleFilter && (
        <div className="bg-gradient mx-10 rounded-md  px-10 py-5 ">
          <p className="text-white">ihg</p>
          <p>ihg</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
          <p>ih</p>
        </div>
      )} */}

      {cardsLoading && allOrganizations.length === 0 ? (
        <LoadingBar />
      ) : (
        <div className="mx-4 mb-5 mt-10 flex flex-wrap justify-center gap-5">
          {allOrganizations.map((organization) => (
            <OrgCard
              key={organization.id}
              searchText={searchText}
              organization={organization}
            />
          ))}
        </div>
      )}

      {organizations && organizations?.length == take && (
        <button
          className="btn-active mb-10 mt-10 w-1/5 self-center px-4 py-2 phone:mt-5 phone:w-full"
          onClick={() => handleLoadMore()}
        >
          Load More
        </button>
      )}

      {/* <button onClick={() => handleFetchOrganizations()}>button</button> */}
    </div>
  );
};

export default FindOrganizations;
