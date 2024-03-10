import React, { useEffect, useState } from "react";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { userRouter } from "~/server/api/routers/user";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import UploadImage from "~/components/UploadImage";
import Image from "next/image";
import LocationForm from "~/components/LocationForm";
import { SubmitHandler, useForm } from "react-hook-form";
// import { updateActivitySchema } from "~/utils/schemaValidation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const updateActivitySchema = z.object({
  id: z.string(),
  name: z
    .string()
    .max(50, { message: "Activity name must be at most 50 characters" })
    .min(5, { message: "Event name must be at least 5 characters" }),
  date: z.string().min(1, { message: "Activity must have a date" }),
  details: z
    .string()
    .max(500, { message: "Activity details must be at most 500 characters" })
    .min(20, { message: "Event details must be at least 20 characters" }),
  hasOrganizations: z.boolean(),
  hasVolunteers: z.boolean(),
  hasParticipants: z.boolean(),
  location: z.string().min(5, { message: "Activity must have a location" }),
  organizationId: z.string(),
  images: z.array(z.string()).optional(),
});

type UpdateActivityFields = z.infer<typeof updateActivitySchema>;

const EditActivity = () => {
  const editActivity = api.activity.updateActivity.useMutation();

  const router = useRouter();

  const { id } = router.query;

  const { data: sessionData } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const activityQuery = api.activity.getOne.useQuery({
    id: id as string,
  });

  const activityQueryData = activityQuery.data;

  const orgId = user.data?.organization?.id ?? ""; // Ensure to handle potential undefined

  const activityQueryDataForm = {
    id: id as string,
    name: activityQueryData?.name ?? "",
    details: activityQueryData?.details ?? "",
    date: activityQueryData?.date?.toLocaleDateString() ?? "",
    createdAt: activityQueryData?.createdAt?.toLocaleString() ?? "",
    location: activityQueryData?.location ?? "",
    organizationId: orgId,
    images: activityQueryData?.images ?? [],

    hasOrganizations: activityQueryData?.hasOrganizations ?? false,
    hasVolunteers: activityQueryData?.hasVolunteers ?? false,
    hasParticipants: activityQueryData?.hasParticipants ?? false,
  };

  // ! REACT USEFORM
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateActivityFields>({
    defaultValues: {
      // id: "",
      // name: "",
      // details: "",
      // date: "",
      // location: "",
      // images: [],
      // hasOrganizations: false,
      // hasVolunteers: false,
      // hasParticipants: false,
      // organizationId: orgId,
    },
    resolver: zodResolver(updateActivitySchema),
  });

  const formData = watch();

  const onSubmit: SubmitHandler<UpdateActivityFields> = (data) => {
    console.log("Data", data);

    editActivity.mutate({
      id: id as string,
      name: getValues("name"),
      details: getValues("details"),
      date: getValues("date"),
      location: getValues("location"),
      images: getValues("images"),

      hasOrganizations: getValues("hasOrganizations"),
      hasVolunteers: getValues("hasVolunteers"),
      hasParticipants: getValues("hasParticipants"),
      organizationId: orgId,
    });

    // window.location.replace("/homepage/activities");
  };

  // useEffect(() => {
  //   if (activityQuery.data) {
  //     reset(formData);
  //     reset(activityQueryDataForm);
  //   }
  // }, []);

  const handleAddImages = (newImageUrl: string) => {
    const currentArray = getValues("images") ?? [];
    setValue("images", [...currentArray, newImageUrl]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(getValues("images") ?? [])];
    updatedImages.splice(index, 1);
    setValue("images", updatedImages);
  };

  useEffect(() => {
    if (activityQueryData) {
      reset(formData);
      reset(activityQueryDataForm);
      // reset(activityQueryDataForm);
    }
  }, []);

  useEffect(() => {
    setValue("organizationId", orgId);
    setValue("id", id as string);
    getValues("images");
  }, [orgId, id as string, setValue, getValues]);

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  if (user.error ?? !user.data?.organization) {
    return <div>Error loading user data</div>;
  }

  // const submitActivity = () => {
  //   editActivity.mutate({
  //     id: id as string,
  //     name: activitiesData.name,
  //     details: activitiesData.details,
  //     date: activitiesData.date,
  //     location: activitiesData.location,
  //     images: activitiesData.images,

  //     hasOrganizations: activitiesData.hasOrganizations,
  //     hasVolunteers: activitiesData.hasVolunteers,
  //     hasParticipants: activitiesData.hasParticipants,
  //     organizationId: orgId,
  //   });

  //   window.location.replace("/homepage/activities");
  // };

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
        <p className="font-custom-epilogue text-xl font-extrabold text-white">
          EDIT AN ACTIVITY
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
          name="name"
          className="h-12 w-full rounded border  p-2 shadow"
          placeholder="Event Name"
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
              {...register("hasVolunteers")}
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
              {...register("hasOrganizations")}
              type="checkbox"
              id="partnership"
              onClick={() => {
                setValue("hasOrganizations", !getValues("hasOrganizations"));
              }}
            />
            <label htmlFor="partnership">Partnerships</label>
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

        <div className="my-20 flex justify-center">
          <div className="flex gap-4">
            <button type="submit" className="btn-active px-20 py-3">
              Edit Activity
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

export default EditActivity;
