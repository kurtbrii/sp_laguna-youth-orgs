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
import { SubmitHandler, useForm } from "react-hook-form";
import { updateEventSchema } from "~/utils/schemaValidation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type UpdateEventFields = z.infer<typeof updateEventSchema>;

const EditEvent = () => {
  const updateEvent = api.event.updateEvent.useMutation();

  const router = useRouter();
  const { data: sessionData } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const { id } = router.query;

  const orgId = user.data?.organization?.id ?? ""; // Ensure to handle potential undefined

  const eventQuery = api.event.getOne.useQuery({
    id: id as string,
  });

  const eventQueryData = eventQuery.data;

  const eventQueryDataForm = {
    name: eventQueryData?.name ?? "",
    createdAt: eventQueryData?.createdAt?.toLocaleString() ?? "",
    details: eventQueryData?.details ?? "",
    location: eventQueryData?.location ?? "",
    organizedBy: eventQueryData?.organizedBy ?? "",
    organizationId: orgId,
    date: eventQueryData?.date?.toLocaleDateString() ?? "",
    partners: eventQueryData?.partners ?? [],
    images: eventQueryData?.images ?? [],
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
  } = useForm<UpdateEventFields>({
    defaultValues: {
      organizedBy: user?.data?.organization?.orgName ?? "",
      organizationId: orgId,
      id: id as string,
    },
    resolver: zodResolver(updateEventSchema),
  });

  const formData = watch();

  useEffect(() => {
    setValue("id", id as string);
  });

  const onSubmit: SubmitHandler<UpdateEventFields> = (data) => {
    console.log("Data", data);

    updateEvent.mutate({
      name: getValues("name"),
      organizedBy: user?.data?.organization?.orgName ?? "",
      details: getValues("details"),
      location: getValues("location"),
      organizationId: orgId,
      date: getValues("date"),
      partners: getValues("partners"),
      images: getValues("images"),
      id: id as string,
    });

    window.location.replace("/homepage");
  };

  const [partner, setPartner] = useState("");

  useEffect(() => {
    if (eventQuery.data) {
      reset(formData);
      reset(eventQueryDataForm);
    }
  }, []);

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
    const currentArray = formData.images ?? [];
    // const currentArray = getValues("images") ?? [];
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
          EDIT EVENT
        </p>
      </section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="myForm"
        className="mx-40 mb-5 mt-12 flex flex-col gap-4 text-sm"
      >
        <input
          {...register("name")}
          type="text"
          className="h-12 w-full rounded border p-2 shadow"
          placeholder="Event Name"
        />
        {errors.name && <p className="text-customRed">{errors.name.message}</p>}

        <textarea
          {...register("details")}
          className=" w-full rounded border p-2 shadow "
          name="details"
          value={formData.details}
          rows={10}
          placeholder="Details"
        />
        {errors.details && (
          <p className="text-customRed">{errors.details.message}</p>
        )}

        <div className="flex gap-2">
          <LocationForm register={register} />
          {errors.location && (
            <p className="text-customRed">{errors.location.message}</p>
          )}

          <input
            {...register("date")}
            type="datetime-local"
            name="date"
            // onChange={handleEventForm}
            className="h-12 w-1/2 rounded border p-2 shadow"
            placeholder="Input Date"
          />
          {errors.date && (
            <p className="text-customRed">{errors.date.message}</p>
          )}
        </div>

        {errors.id && <p className="text-customRed">{errors.id.message}</p>}

        <div>
          <input
            // {...register("partners")}
            type="text"
            name="partners"
            className=" h-12 w-1/2 rounded border p-2 shadow"
            placeholder="Input Partner"
            onChange={handlePartner}
            value={partner}
          />
          <IconButton className="h-12 w-12" onClick={handleAddPartner}>
            <AddBoxIcon />
          </IconButton>
          <div className="mt-2 flex flex-col">
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

        <div className="my-20 flex justify-center">
          <div className="flex gap-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className="btn-active px-20 py-3"
            >
              {isSubmitting ? "Loading..." : "Edit Event"}
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
      </form>
    </div>
  );
};

export default EditEvent;
