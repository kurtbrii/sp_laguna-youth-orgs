import React, { useState } from "react";
import NavBar from "~/components/navbar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import Router, { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <NavBar />
      <div className="flex flex-col">
        <div className="mx-10 my-4 flex h-12 flex-col justify-between font-custom-lexend ">
          <h1 className="mb-6 h-full w-1/2 bg-gradient-to-r from-primary to-secondary bg-clip-text font-custom-epilogue text-2xl font-extrabold text-transparent ">
            Recent Events
          </h1>

          <div className="inine-block">
            <div className="flex flex-shrink-0  items-center">
              <input
                type="text"
                value={searchText}
                name="search"
                onChange={handleSearchChange}
                className="w-1/3 rounded-l p-2  shadow-lg"
                placeholder="Search"
              />
              <button className="bg-gradient mr-3 flex rounded-r border-gray-300 p-2 shadow-lg ">
                <SearchIcon />
              </button>
              <IconButton>
                <TuneIcon />
              </IconButton>
            </div>

            <button
              className="btn-active mt-2 px-4 py-2"
              onClick={() => router.push("/events/add")}
            >
              Add Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
