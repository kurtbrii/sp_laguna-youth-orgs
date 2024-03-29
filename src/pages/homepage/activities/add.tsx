import React, { useEffect, useState } from "react";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import UploadImage from "~/components/UploadImage";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Image from "next/image";
import { createActivitySchema } from "~/utils/schemaValidation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import LocationForm from "~/components/LocationForm";
import { centersOfParticipation } from "~/utils/obj";

type CreateActivityFields = z.infer<typeof createActivitySchema>;

const Add = () => {
  const createActivity = api.activity.createActivity.useMutation();

  const router = useRouter();
  const { data: sessionData } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const orgId = user.data?.organization?.id ?? ""; // Ensure to handle potential undefined

  // ! REACT USEFORM
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateActivityFields>({
    defaultValues: {
      name: "",
      details: "",
      date: "",
      location: "",
      hasOrganizations: false,
      hasVolunteers: false,
      hasParticipants: false,
      organizationId: orgId,
      images: [],
    },
    resolver: zodResolver(createActivitySchema),
  });

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
    setValue("organizationId", orgId);
  });

  const onSubmit: SubmitHandler<CreateActivityFields> = (data) => {
    console.log(data);

    createActivity.mutate({
      name: getValues("name"),
      details: getValues("details"),
      date: getValues("date"),
      location: getValues("location"),
      hasOrganizations: getValues("hasOrganizations"),
      hasVolunteers: getValues("hasVolunteers"),
      hasParticipants: getValues("hasParticipants"),
      organizationId: orgId,
      images: getValues("images") ?? [],
      centersTags: getValues("centersTags") ?? [],
    });

    void router.push("/homepage/activities");
  };

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  if (user.error ?? !user.data?.organization) {
    return <div>Error loading user data</div>;
  }

  const handleAddImages = (newImageUrl: string) => {
    const currentArray = getValues("images") ?? [];
    setValue("images", [...currentArray, newImageUrl]);
  };
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(getValues("images") ?? [])];
    updatedImages.splice(index, 1);
    setValue("images", updatedImages);
  };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
        <p className="font-custom-epilogue text-xl font-extrabold text-white">
          ADD AN ACTIVITY
        </p>
      </section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="myForm"
        className="mx-40 mb-5 mt-12 flex flex-col gap-4 text-sm"
      >
        <section className=" mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Details
          </p>
        </section>

        <input
          {...register("name")}
          type="text"
          className="h-12 w-full rounded border  p-2 shadow"
          placeholder="Activity Name"
        />
        {errors.name && <p className="text-customRed">{errors.name.message}</p>}

        <textarea
          {...register("details")}
          className=" w-full rounded border p-2 shadow "
          rows={10}
          placeholder="Details"
        />
        {errors.details && (
          <p className="text-customRed">{errors.details.message}</p>
        )}

        <div className="flex gap-2">
          <div className="flex w-1/2 flex-col">
            <LocationForm register={register} />
            {errors.location && (
              <p className="text-customRed">{errors.location.message}</p>
            )}
          </div>

          <div className="flex w-1/2 flex-col">
            <input
              {...register("date")}
              type="datetime-local"
              name="date"
              className="h-12 w-full rounded border p-2 shadow"
              placeholder="Input Date"
            />
            {errors.date && (
              <p className="text-customRed">{errors.date.message}</p>
            )}
          </div>
        </div>

        <UploadImage string={"activities"} handleAddImages={handleAddImages} />

        <div className="flex flex-wrap justify-center gap-4">
          {getValues("images")?.length
            ? getValues("images")?.map((data, index) => (
                <div className="relative " key={index}>
                  <div className="absolute right-0 top-0">
                    <IconButton
                      onClick={() => {
                        handleRemoveImage(index);
                      }}
                      className="mdi mdi-close cursor-pointer hover:text-white"
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>

                  <div
                    style={{
                      width: "240px", // Use 100% width for responsiveness
                      height: "150px", // Set a fixed height for all images
                      display: "flex",
                    }}
                  >
                    <Image
                      title={data}
                      className="rounded-md object-cover shadow-xl"
                      src={`https://res.cloudinary.com/dif5glv4a/image/upload/${data}`}
                      alt={`Uploaded file ${index}`}
                      width={240}
                      height={150}
                    />
                  </div>
                </div>
              ))
            : null}
        </div>

        <section className=" mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Type of Activity
          </p>
        </section>

        <div className="mb-6 flex items-center  justify-center gap-10">
          {/* CALL FOR PARTICIPANTS */}
          <div className="flex items-center  justify-center gap-2">
            <input
              {...register("hasParticipants")}
              type="checkbox"
              id="participants"
              onClick={() => {
                setValue("hasParticipants", !getValues("hasParticipants"));
              }}
            />
            <label htmlFor="participants">Call for Participants</label>
          </div>

          {/* CALL FOR VOLUNTEERS */}
          <div className="flex items-center  justify-center gap-2">
            <input
              type="checkbox"
              name="volunteers"
              id="volunteers"
              onClick={() => {
                setValue("hasVolunteers", !getValues("hasVolunteers"));
              }}
            />
            <label htmlFor="volunteers">Call for Volunteers</label>
          </div>

          {/* Partnership */}
          <div className=" flex items-center justify-center gap-2">
            <input
              type="checkbox"
              id="partnership"
              onClick={() => {
                setValue("hasOrganizations", !getValues("hasOrganizations"));
              }}
            />
            <label htmlFor="partnership">Partnerships</label>
          </div>
        </div>

        <section className="flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Centers of Participation
          </p>
        </section>

        <div className="flex flex-wrap justify-center gap-3">
          {centersOfParticipation.map((data, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`checkbox_${index}`}
                className="peer hidden"
                onChange={() => handleCheckboxChange(data)}
              />
              <label
                htmlFor={`checkbox_${index}`}
                className="peer-checked:btn-active cursor-pointer select-none rounded-lg border border-customBlack-100 px-6 py-3 text-customBlack-100 transition-colors duration-200 ease-in-out peer-checked:border-0  "
              >
                {data}
              </label>
            </div>
          ))}
        </div>

        <div className="my-20 flex justify-center">
          <div className="flex gap-4">
            <button type="submit" className="btn-active px-20 py-3">
              Create Activity
            </button>
            <button
              onClick={() => window.location.replace("/homepage/activities")}
              type="reset"
              className="btn-outline   px-20 py-3"
              style={{ color: "#ec4b42", borderColor: "#ec4b42" }}
            >
              Discard
            </button>
          </div>
        </div>
      </form>

      {/* <button onClick={() }>dsd</button> */}
    </div>
  );
};

export default Add;
