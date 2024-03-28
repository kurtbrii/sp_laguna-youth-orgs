import React, { useEffect, useState } from "react";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { createSpeakerSchema } from "~/utils/schemaValidation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

interface ActivityProps {
  name: string;
  details: string;
  date: string;
  createdAt: string;
  location: string;

  hasOrganizations: boolean;
  hasVolunteers: boolean;
  hasParticipants: boolean;
  organizationId: string;
}

type SpeakerFields = z.infer<typeof createSpeakerSchema>;

const Add = () => {
  const createSpeaker = api.speaker.createSpeaker.useMutation();

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
  } = useForm<SpeakerFields>({
    defaultValues: {
      orgId: orgId,
    },
    resolver: zodResolver(createSpeakerSchema),
  });

  const onSubmit: SubmitHandler<SpeakerFields> = (data) => {
    console.log("Data", data);

    createSpeaker.mutate({
      name: getValues("name"),
      bio: getValues("bio"),
      email: getValues("email"),
      age: getValues("age"),
      orgId: orgId,
    });

    void router.back();
  };

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  if (user.error ?? !user.data?.organization) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
        <p className="font-custom-epilogue text-xl font-extrabold text-white">
          ADD A SPEAKER
        </p>
      </section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="myForm"
        className="mx-40 mb-5 mt-12 flex flex-col gap-4 text-sm"
      >
        <div className="flex gap-2">
          <div className="flex w-4/6 flex-col">
            <input
              {...register("name")}
              className="mb-2 h-12 w-full rounded border p-2 shadow"
              placeholder="Volunteer Name"
            />
            {errors.name && (
              <p className="text-customRed">{errors.name.message}</p>
            )}
          </div>

          <div className="flex w-2/6 flex-col">
            <input
              {...register("age")}
              type="number"
              min={10}
              max={40}
              className="h-12 w-full rounded border p-2 shadow "
              placeholder="Age"
            />
            {errors.age && (
              <p className="text-customRed">{errors.age.message}</p>
            )}
          </div>
        </div>

        <input
          {...register("email")}
          type=""
          className="mb-2 h-12 rounded border p-2 shadow"
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-customRed">{errors.email.message}</p>
        )}

        <textarea
          {...register("bio")}
          className=" w-full rounded border p-2 shadow "
          rows={10}
          placeholder="Bio/Advocacies"
        />
        {errors.bio && <p className="text-customRed">{errors.bio.message}</p>}

        <div className="my-20 flex justify-center">
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-active px-20 py-3"
            >
              Add Speaker
            </button>
            <button
              onClick={() => window.location.replace("/homepage/speakers")}
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

export default Add;
