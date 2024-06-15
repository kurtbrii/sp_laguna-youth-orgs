/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Navbar from "../../../components/navbar";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import ActivitiesCard from "~/components/ActivitiesCard";
import { centersOfParticipation } from "~/utils/obj";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateVolunteerSchema } from "~/utils/schemaValidation";
import { SubmitHandler, useForm } from "react-hook-form";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import { type ActivityProps } from "~/utils/props";
import LoadingBar from "~/components/LoadingBar";

const filterSchema = z.object({
  centersTags: z.array(z.string()).optional(),
  customTags: z.array(z.string()).optional(),
  hasParticipants: z.boolean().optional(),
  hasVolunteers: z.boolean().optional(),
  hasOrganizations: z.boolean().optional(),
});

type FilterSchemaFields = z.infer<typeof filterSchema>;

const Index = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const volunteer = api.volunteer.getOne.useQuery({
    userId: sessionData?.user?.id ?? "",
  });

  // if (
  //   sessionStatus === "authenticated" &&
  //   sessionData?.user.role === "VOLUNTEER"
  // ) {
  // }

  const router = useRouter();
  const { id, name } = router.query;

  const [searchText, setSearchText] = useState((name as string) ?? "");

  const [callOrParticipation, setCurrentTag] = useState<string>("call");

  const [initialSearch, setInitialSearch] = useState<boolean>(true);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const [toggleFilter, setToggleFilter] = useState(false);
  const handleToggleFilter = () => {
    setToggleFilter(!toggleFilter);
  };

  // ! REACT USEFORM
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FilterSchemaFields>({
    defaultValues: {},
    resolver: zodResolver(filterSchema),
  });

  const formData = watch();

  const [take, setTake] = useState(12);

  const [allActivities, setAllActivities] = useState<
    ActivityProps["activity"][]
  >([]);

  const handleLoadMore = () => {
    setTake(take + 12);
    // setCursor(activityId);
  };

  const { isLoading: cardsLoading, data: activity } =
    api.activity.getActivities.useQuery({
      take: take,
      search: searchText,
      orgId: initialSearch ? (id as string) : undefined,
      centersTags:
        sessionData?.user?.role === "VOLUNTEER"
          ? volunteer?.data?.setTags
            ? volunteer?.data?.centersTags
            : centersOfParticipation
          : centersOfParticipation,
      customTags:
        sessionData?.user?.role === "VOLUNTEER"
          ? volunteer?.data?.setTags
            ? volunteer?.data?.customTags
            : []
          : [],
      filterCenterTags: formData.centersTags ?? [],
      filterCustomTags: formData.customTags ?? [],
      filterHasVolunteers: formData.hasVolunteers
        ? formData.hasVolunteers
        : undefined,
      filterHasOrganizations: formData.hasOrganizations
        ? formData.hasOrganizations
        : undefined,
      filterHasParticipants: formData.hasParticipants
        ? formData.hasParticipants
        : undefined,
      archived: false,
    });

  type data = "hasOrganizations" | "hasVolunteers" | "hasParticipants";

  const filterSetParams: data[] = [
    "hasOrganizations",
    "hasVolunteers",
    "hasParticipants",
  ];

  const filterLabel = [
    "Partnership",
    "Call for Volunteers",
    "Call for Participants",
  ];

  const [customTag, setCustomTag] = useState("");

  const handleCustomTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTag(e.target.value);
    console.log(customTag);
  };

  const handleAddCustomTag = () => {
    const currentArray = getValues("customTags") ?? [];
    setValue("customTags", [...currentArray, customTag]);
    setCustomTag("");
  };

  const handleRemoveCustomTag = (index: number) => {
    const updatedCustomTag = [...(getValues("customTags") ?? [])];
    updatedCustomTag.splice(index, 1);
    setValue("customTags", updatedCustomTag);
  };

  const handleCheckboxChange = (data: string) => {
    if (getValues("centersTags")?.includes(data)) {
      setValue(
        "centersTags",
        getValues("centersTags")?.filter((center) => center !== data),
      );
    } else {
      const centersTags = getValues("centersTags") ?? [];
      setValue("centersTags", [...centersTags, data]);
    }
  };

  useEffect(() => {
    if (initialSearch && searchText !== "") {
      setInitialSearch(false);
    }
    getValues("centersTags");
  }, [initialSearch, searchText, getValues]);

  useEffect(() => {
    if (activity) {
      setAllActivities([...activity]);
    }
  }, [activity]);

  // if (activity?.length === 0) {
  //   return <div>No data</div>;
  // }

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      {/* <button onClick={handleClick}>click</button>
      <button onClick={() => alert(sessionData?.user?.role)}>click</button> */}
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
              className="flex-1 rounded-l p-2 shadow-lg"
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
                className={`${
                  callOrParticipation === "call"
                    ? "border-secondary text-secondary"
                    : callOrParticipation === "custom"
                      ? "border-customBlack-100 text-customBlack-100"
                      : "border-primary text-primary"
                } w-full rounded-md border  bg-transparent px-2 py-2 text-sm font-bold  transition ease-in-out hover:bg-transparent focus:outline-none`}
                value={callOrParticipation}
                onChange={(e) => {
                  setCurrentTag(e.target.value);
                }}
              >
                <option value="call">Type of Activity</option>
                <option value="participation">Centers of Participations</option>
                <option value="custom">Custom Tags</option>
              </select>
            </div>
          </section>

          {/* ADD ACTIVITY */}
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
        <div className="bg-gradient mx-10 flex justify-between gap-4 rounded-md px-10 py-5">
          {/* FILTER BASED ACTIVITY CALL */}
          <section className="flex w-1/4 flex-col items-center gap-5">
            <p className="text-white">Filter Activity Call</p>

            <div className="flex flex-wrap justify-center gap-3">
              {filterSetParams.map((data: data, index: number) => (
                <div key={index} className="flex items-center">
                  {/* {data} */}
                  <input
                    {...register(data)}
                    id={data}
                    type="checkbox"
                    className="peer hidden"
                    checked={getValues(data)}
                    onChange={() => setValue(data, !getValues(data))}
                  />
                  <label
                    htmlFor={filterSetParams[index]}
                    className="cursor-pointer select-none rounded-lg border border-white px-4 py-2 text-center  text-xs text-white transition-colors duration-200 ease-in-out peer-checked:border-0 peer-checked:bg-white peer-checked:text-customBlack-100"
                  >
                    {filterLabel[index]}
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* FILTER BASED ON CENTERS OF PARTICIPATION */}
          <section className="flex w-2/4 flex-col items-center gap-5">
            <p className="text-white">Filter Centers of Participation</p>
            <div className="flex flex-wrap justify-center gap-3">
              {centersOfParticipation.map((data, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={data}
                    className="peer hidden"
                    checked={getValues("centersTags")?.includes(data)}
                    onChange={() => handleCheckboxChange(data)}
                  />
                  <label
                    htmlFor={data}
                    className="cursor-pointer select-none rounded-lg border border-white px-3 py-2 text-xs text-white transition-colors duration-200 ease-in-out peer-checked:border-0 peer-checked:bg-white peer-checked:text-customBlack-100"
                  >
                    {data}
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* CUSTOM TAGS  FILTER */}
          <section className="flex w-1/4 flex-col items-center gap-5">
            <p className="text-white">Custom Tags Filter</p>

            <div className="flex flex-wrap justify-center">
              <input
                type="text"
                name="customTags"
                className="rounded border p-2 text-xs shadow"
                placeholder="Add Custom Tag"
                onChange={handleCustomTag}
                value={customTag}
              />
              <IconButton className="h-8" onClick={handleAddCustomTag}>
                <AddBoxIcon />
              </IconButton>
            </div>

            <div className="flex flex-col flex-wrap justify-center">
              {getValues("customTags")?.length
                ? getValues("customTags")?.map((tag: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <p className="text-sm text-white">{tag}</p>
                      <IconButton onClick={() => handleRemoveCustomTag(index)}>
                        <ClearIcon />
                      </IconButton>
                    </div>
                  ))
                : null}
            </div>
          </section>
        </div>
      )}

      {/* ACTIVITIES CARD */}
      <div className="mb-5 mt-10 flex flex-wrap justify-center gap-5 ">
        {cardsLoading && allActivities.length === 0 ? (
          <LoadingBar />
        ) : (
          allActivities.map((queryActivity, index) => (
            <ActivitiesCard
              callOrParticipation={callOrParticipation}
              key={index}
              searchText={searchText}
              activity={queryActivity}
            />
          ))
        )}
      </div>

      {activity && activity.length == take && (
        <button
          className="btn-active mb-10 mt-10 w-1/5 self-center px-4 py-2 phone:mt-5 phone:w-full"
          onClick={() => handleLoadMore()}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Index;
