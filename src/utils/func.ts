import { useForm } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useFormSetup = (defaultValues: any, resolver: any) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver,
  });

  return {
    register,
    handleSubmit,
    setValue,
    getValues,
    errors,
    isSubmitting,
  };
};


export { useFormSetup }