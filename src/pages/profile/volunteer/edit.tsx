import React, { ChangeEventHandler, useEffect, useState } from "react";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { userRouter } from "~/server/api/routers/user";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateVolunteerSchema } from "~/utils/schemaValidation";
import { SubmitHandler, useForm } from "react-hook-form";

type UpdateVolunteerFields = z.infer<typeof updateVolunteerSchema>;

const EditVolunteer = () => {
  const updateVolunteer = api.volunteer.updateVolunteer.useMutation();

  const router = useRouter();
  const { data: sessionData } = useSession();

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const volunteerId = user.data?.volunteer?.id ?? "";

  const volunteer = user.data?.volunteer;

  // ! REACT USEFORM
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateVolunteerFields>({
    defaultValues: {},
    resolver: zodResolver(updateVolunteerSchema),
  });

  const volunteerQueryDataForm = {
    id: volunteerId,
    phoneNumber: volunteer?.phoneNumber ?? "",
    bio: volunteer?.bio ?? "",
    sex: volunteer?.sex ?? "",
    age: volunteer?.age ?? undefined,
  };

  const formData = watch();

  const onSubmit: SubmitHandler<UpdateVolunteerFields> = (data) => {
    console.log("Data", data);

    updateVolunteer.mutate({
      id: volunteer?.id ?? "",
      phoneNumber: getValues("phoneNumber"),
      bio: getValues("bio"),
      sex: getValues("sex"),
      age: getValues("age"),
    });

    alert("Successul");

    void router.push("/profile/volunteer");
  };

  useEffect(() => {
    reset(volunteerQueryDataForm);
  }, []);

  useEffect(() => {
    setValue("id", volunteerId);
  }, [volunteerId, setValue, getValues]);

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  if (user.error ?? !user.data?.volunteer) {
    return <div>Error loading user data</div>;
  }

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

        <div className="flex gap-3">
          <div className="h-full w-1/2">
            <input
              {...register("age")}
              type="number"
              min={10}
              max={40}
              className=" w-full rounded border p-2 shadow "
              placeholder="Age"
            />
            {errors.age && (
              <p className="text-customRed">{errors.age.message}</p>
            )}
          </div>

          <div className="h-full w-1/2">
            <select
              {...register("sex")}
              defaultValue={"Male"}
              id="example-dropdown"
              className=" w-full rounded border p-2 shadow "
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        {errors.sex && <p className="text-customRed">{errors.sex.message}</p>}

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
            {/* <button onClick={() => alert(volunteerData.sex)}>buton</button> */}
          </div>
        </div>
      </form>

      {/* <button onClick={() }>dsd</button> */}
    </div>
  );
};

export default EditVolunteer;
