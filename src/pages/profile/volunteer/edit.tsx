import React, { useEffect, useState } from "react";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateVolunteerSchema } from "~/utils/schemaValidation";
import { SubmitHandler, useForm } from "react-hook-form";
import { centersOfParticipation } from "~/utils/obj";
import Switch from "react-switch";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddBoxIcon from "@mui/icons-material/AddBox";

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

  const [tags, setTags] = useState(false);

  const onSubmit: SubmitHandler<UpdateVolunteerFields> = (data) => {
    console.log("Data", data);

    updateVolunteer.mutate({
      id: volunteer?.id ?? "",
      phoneNumber: getValues("phoneNumber"),
      bio: getValues("bio"),
      sex: getValues("sex"),
      age: getValues("age"),
      centersTags: getValues("centersTags"),
      customTags: getValues("customTags"),
      setTags: tags,
    });

    alert("Successul");

    void router.push("/profile/volunteer");
  };

  const formData = watch();

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
    if (volunteer) {
      reset({
        id: volunteerId,
        phoneNumber: volunteer?.phoneNumber ?? "",
        bio: volunteer?.bio ?? "",
        sex: volunteer?.sex ?? "",
        age: volunteer?.age ?? undefined,
        centersTags: volunteer?.centersTags ?? [],
        customTags: volunteer?.customTags ?? [],
        setTags: volunteer?.setTags ?? false,
      });
    }
  }, []);

  useEffect(() => {
    setValue("phoneNumber", volunteer?.phoneNumber ?? "");
    setValue("bio", volunteer?.bio ?? "");
    setValue("sex", volunteer?.sex ?? "");
    setValue("centersTags", volunteer?.centersTags ?? []);
    setValue("customTags", volunteer?.customTags ?? []);
    setValue("setTags", volunteer?.setTags ?? false);
  }, [volunteerId, setValue, getValues]);

  useEffect(() => {
    setValue("id", volunteerId);
    getValues("setTags");
    getValues("centersTags");
    getValues("customTags");
    getValues("phoneNumber");
    getValues("bio");
    getValues("sex");
    getValues("age");
    setTags(getValues("setTags") ?? false);
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
        <section className="flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Details
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
        <section className="mt-6 flex flex-row items-center justify-center bg-secondary p-2 ">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Centers of Participation Tags
          </p>
        </section>
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
                className="peer-checked:btn-active cursor-pointer select-none rounded-lg border border-customBlack-100 px-6 py-3 text-customBlack-100 transition-colors duration-200 ease-in-out peer-checked:border-0  "
              >
                {data}
              </label>
            </div>
          ))}
        </div>
        {errors.centersTags && (
          <p className="text-customRed">{errors.centersTags.message}</p>
        )}
        <section className="mt-6 flex flex-row items-center justify-center bg-secondary p-2">
          <p className="font-custom-epilogue text-xl font-extrabold text-white">
            Custom Tags
          </p>
        </section>

        <div className="mb-20">
          <input
            type="text"
            name="customTags"
            className=" h-12 w-1/2 rounded border p-2 shadow"
            placeholder="Add Custom Tag"
            onChange={handleCustomTag}
            value={customTag}
          />
          <IconButton className="h-12 w-12" onClick={handleAddCustomTag}>
            <AddBoxIcon />
          </IconButton>
          {getValues("customTags")?.length
            ? getValues("customTags")?.map((tag: string, index: number) => (
                <div key={index} className="flex">
                  <p className="w-1/2 text-sm">{tag}</p>
                  <IconButton onClick={() => handleRemoveCustomTag(index)}>
                    <ClearIcon />
                  </IconButton>
                </div>
              ))
            : null}
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <Switch
            onChange={(checked) => setTags(checked)}
            checked={tags}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
          />

          <p className="w-5/12 text-center italic">
            Setting this on will enable you to automatically filter the
            activities section based on your selected tags.
          </p>
        </div>

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
