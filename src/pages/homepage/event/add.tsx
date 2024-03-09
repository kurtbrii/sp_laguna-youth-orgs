/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import UploadImage from "~/components/UploadImage";
import Image from "next/image";
import LocationForm from "~/components/LocationForm";
import { type SubmitHandler, useForm } from "react-hook-form";
import { createEventSchema } from "~/utils/schemaValidation";
import { z } from "zod";

interface EventProps {
  name: string;
  createdAt: string;
  details: string;
  location: string;
  organizationId: string;
  date: string;
  partners: string[];
  images: string[];
  organizedBy: string;
}

const Add = () => {
  const createEvent = api.event.createEvent.useMutation();

  const { data: sessionData } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const orgId = user.data?.organization?.id ?? ""; // Ensure to handle potential undefined

  const [partner, setPartner] = useState("");

  // ! REACT USEFORM
  type EventSchema = z.infer<typeof createEventSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EventSchema>();

  const formData = watch();

  const onSubmit: SubmitHandler<EventSchema> = (data) => {
    console.log("Data", data);

    createEvent.mutate({
      name: formData.name,
      organizedBy: user?.data?.organization?.orgName ?? "",
      details: formData.details,
      location: formData.location,
      organizationId: orgId,
      date: formData.date,
      partners: formData.partners,
      images: formData.images,
    });

    window.location.replace("/homepage");
  };

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  if (user.error ?? !user.data?.organization) {
    return <div>Error loading user data</div>;
  }

  const handlePartner = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartner(e.target.value);
    console.log(partner);
  };

  const handleAddPartner = () => {
    const currentArray = formData.partners ?? [];
    setValue("partners", [...currentArray, partner]);
    setPartner("");

    console.log("partners", getValues("partners"));
  };

  const handleRemovePartner = (index: number) => {
    const updatedPartners = [...(getValues("partners") ?? [])];
    updatedPartners.splice(index, 1);
    setValue("partners", updatedPartners);
  };

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
          ADD AN EVENT
        </p>
      </section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="myForm"
        className="mx-40 mb-5 mt-12 flex flex-col gap-4 text-sm phone:mx-5"
      >
        <input
          {...register("name")}
          // required
          type="text"
          value={formData.name}
          name="name"
          className="h-12 w-full rounded border  p-2 shadow"
          placeholder="Event Name"
        />

        <textarea
          {...register("details")}
          // required
          className=" w-full rounded border p-2 shadow "
          name="details"
          value={formData.details}
          rows={10}
          placeholder="Details"
        />

        <div className="flex gap-2">
          <LocationForm
            register={register}
            // handleChange={...setValue("location")}
            string={formData.location}
          />

          <input
            {...register("date")}
            // required
            type="datetime-local"
            value={formData.date}
            name="date"
            className="h-12 w-1/2 rounded border p-2 shadow"
            placeholder="Input Date"
          />
        </div>

        <div>
          <input
            {...register("partners")}
            type="text"
            name="partners"
            value={partner}
            className=" h-12 w-1/2 rounded border p-2 shadow"
            placeholder="Input Partner"
            onChange={handlePartner}
          />
          <IconButton className="h-12 w-12" onClick={handleAddPartner}>
            <AddBoxIcon />
          </IconButton>
          {getValues("partners")?.length
            ? getValues("partners")?.map((partner: string, index: number) => (
                <div key={index} className="flex">
                  <p className="w-1/2 text-sm">{partner}</p>
                  <IconButton onClick={() => handleRemovePartner(index)}>
                    <ClearIcon />
                  </IconButton>
                </div>
              ))
            : null}
        </div>

        <UploadImage string={"events"} handleAddImages={handleAddImages} />

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

        <div className="my-20 flex justify-center ">
          <div className="flex gap-4 phone:flex-col">
            <button
              disabled={isSubmitting}
              type="submit"
              className="btn-active px-20 py-3"
            >
              {isSubmitting ? "Loading..." : "Create Event"}
            </button>

            <button
              onClick={() => window.location.replace("/homepage")}
              type="reset"
              className="btn-outline   px-20 py-3"
              style={{ color: "#ec4b42", borderColor: "#ec4b42" }}
            >
              Discard
            </button>
          </div>
        </div>

        {/* <LocationForm /> */}
      </form>

      {/* <button onClick={() }>dsd</button> */}
    </div>
  );
};

export default Add;
