import React from "react";

const EditProfile = ({
  data,
  centersDataOrg,
  centerCapitalize,
  index,
  handleEventForm,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
  return (
    <>
      <p className="font-custom-epilogue text-lg ">{centerCapitalize[index]}</p>
      <textarea
        className=" w-full rounded border p-2 shadow "
        name={data}
        value={centersDataOrg[index]}
        onChange={handleEventForm}
        rows={6}
        placeholder={centerCapitalize[index]}
      />
    </>
  );
};

export default EditProfile;
