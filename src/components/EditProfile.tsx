import React from "react";

const EditProfile = ({
  register,
  data,
  centersDataOrg,
  centerCapitalize,
  index,
  handleEventForm,
  errors,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
  return (
    <>
      <p className="font-custom-epilogue text-lg ">{centerCapitalize[index]}</p>
      <textarea
        {...register(data)}
        className=" w-full rounded border p-2 shadow "
        rows={6}
        placeholder={centerCapitalize[index]}
      />
      {errors[index] && (
        <p className="text-customRed">{errors[index]?.message ?? ""}</p>
      )}
    </>
  );
};

export default EditProfile;
