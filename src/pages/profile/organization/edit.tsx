import React, { useEffect, useState } from "react";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { userRouter } from "~/server/api/routers/user";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import EditProfile from "~/components/EditProfile";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateOrganizationSchema } from "~/utils/schemaValidation";

type UpdateOrganizationFields = z.infer<typeof updateOrganizationSchema>;

const EditOrganization = () => {
  const updateOrganization = api.organization.updateOrganization.useMutation();

  const router = useRouter();
  const { data: sessionData } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const orgId = user.data?.organization?.id ?? "";

  const org = user.data?.organization;

  const participation = org?.centersOfParticipation;

  const organizationQueryDataForm = {
    phoneNumber: org?.phoneNumber,
    bio: org?.bio,
    mission: org?.mission,
    vision: org?.vision,
    objectives: org?.objectives,
    health: participation?.health,
    education: participation?.education,
    economicEmpowerment: participation?.economicEmpowerment,
    socialInclusion: participation?.socialInclusion,
    peaceBuilding: participation?.peaceBuilding,
    governance: participation?.governance,
    activeCitizenship: participation?.activeCitizenship,
    environment: participation?.environment,
    globalMobility: participation?.globalMobility,
    agriculture: participation?.agriculture,
  };

  // ! REACT USEFORM
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateOrganizationFields>({
    defaultValues: {
      id: org?.id ?? "",
    },
    resolver: zodResolver(updateOrganizationSchema),
  });

  const onSubmit: SubmitHandler<UpdateOrganizationFields> = (data) => {
    console.log("Data", data);

    updateOrganization.mutate({
      id: org?.id ?? "",
      phoneNumber: getValues("phoneNumber"),
      bio: getValues("bio"),
      mission: getValues("mission"),
      vision: getValues("vision"),
      objectives: getValues("objectives"),
      health: getValues("health"),
      education: getValues("education"),
      economicEmpowerment: getValues("economicEmpowerment"),
      socialInclusion: getValues("socialInclusion"),
      peaceBuilding: getValues("peaceBuilding"),
      governance: getValues("governance"),
      activeCitizenship: getValues("activeCitizenship"),
      environment: getValues("environment"),
      globalMobility: getValues("globalMobility"),
      agriculture: getValues("agriculture"),
    });

    void router.replace("/profile/organization");
  };

  useEffect(() => {
    reset(organizationQueryDataForm);
  }, []);

  useEffect(() => {
    setValue("id", org?.id ?? "");
  }, [orgId, org?.id, setValue, getValues]);

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  if (user.error ?? !user.data?.organization) {
    return <div>Error loading user data</div>;
  }

  const centersData = [
    "health",
    "education",
    "economicEmpowerment",
    "socialInclusion",
    "peaceBuilding",
    "governance",
    "activeCitizenship",
    "environment",
    "globalMobility",
    "agriculture",
  ];

  const centerCapitalize = [
    "Health",
    "Education",
    "Economic Empowerment",
    "Social Inclusion and Equity",
    "Peace-Building and Security",
    "Governance",
    "ActiveCitizenship",
    "Environment",
    "Global Mobility",
    "Agriculture",
  ];

  const centersDataOrg = [
    getValues("health"),
    getValues("education"),
    getValues("economicEmpowerment"),
    getValues("socialInclusion"),
    getValues("peaceBuilding"),
    getValues("governance"),
    getValues("activeCitizenship"),
    getValues("environment"),
    getValues("globalMobility"),
    getValues("agriculture"),
  ];

  const errorMessage = [
    errors.health,
    errors.education,
    errors.economicEmpowerment,
    errors.socialInclusion,
    errors.peaceBuilding,
    errors.governance,
    errors.activeCitizenship,
    errors.environment,
    errors.globalMobility,
    errors.agriculture,
  ];

  return (
    <div className="flex flex-col font-custom-lexend text-customBlack-100">
      <Navbar />
      <section className=" mt-6 flex flex-row items-center justify-center bg-primary p-4 ">
        <p className="font-custom-epilogue text-xl font-extrabold text-white">
          UPDATE PROFILE
        </p>
      </section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="myForm"
        className="mx-40 mb-5 mt-12 flex flex-col gap-4 text-sm"
      >
        <section className=" mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            More Information
          </p>
        </section>

        <input
          {...register("phoneNumber")}
          type="text"
          className="h-12 w-full rounded border  p-2 shadow"
          placeholder="Mobile Number (09xxxxxxxxx)"
        />
        {errors.phoneNumber && (
          <p className="text-customRed">{errors.phoneNumber.message}</p>
        )}

        <textarea
          {...register("bio")}
          className=" w-full rounded border p-2 shadow "
          rows={10}
          placeholder="Bio"
        />
        {errors.bio && <p className="text-customRed">{errors.bio.message}</p>}

        <section className=" mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Mission
          </p>
        </section>
        <textarea
          {...register("mission")}
          className=" w-full rounded border p-2 shadow "
          rows={10}
          placeholder="Mission"
        />
        {errors.mission && (
          <p className="text-customRed">{errors.mission.message}</p>
        )}

        <section className=" mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Vision
          </p>
        </section>
        <textarea
          {...register("vision")}
          className=" w-full rounded border p-2 shadow "
          rows={10}
          placeholder="Vision"
        />
        {errors.vision && (
          <p className="text-customRed">{errors.vision.message}</p>
        )}

        <section className=" mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Objectives
          </p>
        </section>
        <textarea
          {...register("objectives")}
          className=" w-full rounded border p-2 shadow"
          rows={10}
          placeholder="Objectives"
        />
        {errors.objectives && (
          <p className="text-customRed">{errors.objectives.message}</p>
        )}

        {/* CENTERS OF PARTICIPATION */}
        <section className=" mt-20 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Centers of Participation
          </p>
        </section>

        {centersData.map((data, index) => (
          <div key={index}>
            <EditProfile
              errors={errorMessage}
              register={register}
              data={data}
              centersDataOrg={centersDataOrg}
              centerCapitalize={centerCapitalize}
              index={index}
            />
          </div>
        ))}
        <div className="my-20 flex justify-center">
          <div className="flex flex-col gap-4">
            <button type="submit" className="btn-active px-40 py-3">
              Update Profile
            </button>
            <button
              onClick={() => router.back()}
              type="reset"
              className="btn-outline   px-20 py-3"
              style={{ color: "#ec4b42", borderColor: "#ec4b42" }}
            >
              Discard
            </button>

            {/* <button onClick={() => alert(org?.id)}>buton</button> */}
          </div>
        </div>
      </form>

      {/* <button onClick={() }>dsd</button> */}
    </div>
  );
};

export default EditOrganization;
