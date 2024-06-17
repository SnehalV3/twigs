import React, { useEffect, useState } from "react";
import { Box, Flex, Select, toast } from "@sparrowengg/twigs-react";
import { FormInput } from "@sparrowengg/twigs-react";
// import { Select } from "@sparrowengg/twigs-react";
// import { DatePicker } from "@sparrowengg/twigs-react";
// import { parseDate } from "@internationalized/date";
import { EyeOpenIcon } from "@sparrowengg/twigs-react-icons";
import { EyeCloseIcon } from "@sparrowengg/twigs-react-icons";
import { IconButton } from "@sparrowengg/twigs-react";
import { Button } from "@sparrowengg/twigs-react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProfileData, useGetProfileData } from "../services";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "@sparrowengg/twigs-react";
import { CircleLoader } from "@sparrowengg/twigs-react";
import { Checkbox } from "@sparrowengg/twigs-react";

// type SelectAllCheckBoxType = {
//   receiveKudos: boolean;
//   approveKudos: boolean;
// };

type InputType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cpassword: string;
  gender: {
    lable: string;
    value: string;
  }; //   dob: string;
  approveKudos: boolean;
  receiveKudos: boolean;
  age: number;
};

const Form = () => {
  const [toggle, setToggle] = useState({
    passToggle: true,
    cpassToggle: true,
  });
  const [allChecked, setAllChecked] = useState<boolean | "indeterminate">(
    false
  );
  const formSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is Required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required"),
    cpassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
    gender: Yup.object().required("Gender is required"),
    // dob: Yup.string().required("Date of Birth is required"),
    age: Yup.number().required("Age is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    getValues,
    watch,
  } = useForm<InputType>({ resolver: yupResolver(formSchema) });

  const handleChange = (e) => {
    const newValue = e.key;
    if (newValue === "" || newValue.includes("-")) {
      e.preventDefault();
    }
  };

  const { data, isLoading } = useGetProfileData();

  const { mutate } = useMutation({
    mutationFn: updateProfileData,
    onMutate: () => {
      toast({
        variant: "success",
        title: "Data updated",
        description: "Data updated Successfully",
      });
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Error in updation",
        description: "There was a problem in updating data.",
      });
    },
  });

  const onSubmit: SubmitHandler<InputType> = (data: InputType) => {
    console.log(data)
    mutate(data);
  };

  useEffect(() => {
    console.log(getValues("approveKudos"), getValues("receiveKudos"));
  }, [getValues]);

  useEffect(() => {
    reset(data);
  }, [isLoading]);

  useEffect(() => {
    const approve = getValues("approveKudos");
    const receive = getValues("receiveKudos");
    if (approve && receive) {
      setAllChecked(true);
      return;
    } 

    if (!approve && !receive) {
      setAllChecked(false);
    }

    if (approve || receive) {
      setAllChecked("indeterminate");
      return;
    }
  
    
  }, [watch("approveKudos"), watch("receiveKudos")]);

  if (isLoading) {
    return (
      <CircleLoader
        css={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
        color="secondary"
        size="xl"
      />
    );
  }

  const handleChecked = () => {
    setAllChecked(!allChecked);
    if (!allChecked) {
      setValue("receiveKudos", true);
      setValue("approveKudos", true);
    } else {
      setValue("receiveKudos", false);
      setValue("approveKudos", false);
    }
  };

  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "$10",
      }}
    >
      <Flex
        flexDirection="column"
        justifyContent="center"
        css={{
          margin: "$6",
          width: "50%",
        }}
        gap="$8"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput
          label="First Name"
          {...register("firstName")}
          error={errors.firstName?.message}
          errorBorder={errors.firstName?.message}
        />
        <FormInput
          label="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
          errorBorder={errors.lastName?.message}
        />
        <FormInput
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          errorBorder={errors.email?.message}
        />
        <FormInput
          label="Password"
          type="text"
          {...register("password")}
          error={errors.password?.message}
          errorBorder={errors.password?.message}
        />
        <FormInput
          label="Confirm Password"
          type={toggle.cpassToggle ? "password" : "text"}
          {...register("cpassword")}
          rightElement={
            <IconButton
              onClick={() =>
                setToggle({
                  ...toggle,
                  cpassToggle: !toggle.cpassToggle,
                })
              }
              variant="ghost"
              icon={toggle.cpassToggle ? <EyeOpenIcon /> : <EyeCloseIcon />}
            />
          }
          error={errors.cpassword?.message}
          errorBorder={errors.cpassword?.message}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => {
            return (
              <Select
                label="Select Gender"
                placeholder="Gender"
                size="lg"
                {...field}
                options={[
                  {
                    label: "Male",
                    value: "male",
                  },
                  {
                    label: "Female",
                    value: "female",
                  },
                  {
                    label: "Others",
                    value: "other",
                  },
                ]}
              />
            );
          }}
        />
        {/* <DatePicker
          // value={value}
          // onChange={setValue}
          label="Enter date of birth"
          {...register("dob")}
        /> */}
        <FormInput
          label="Enter your Age"
          type="number"
          {...register("age")}
          error={errors.age?.message}
          errorBorder={errors.age?.message}
          min="0"
          step="1"
          onKeyDown={(e) => handleChange(e)}
        />
        <Checkbox size="sm" checked={allChecked} onChange={handleChecked}>
          Notify on Slack
        </Checkbox>
        <Flex
          css={{
            flexDirection: "column",
            gap: "$5",
            marginLeft: "$5",
          }}
        >
          <Controller
            name="receiveKudos"
            control={control}
            render={({ field }) => {
              return (
                <Checkbox {...field} checked={field.value} size="sm">
                  When someone receives kudos
                </Checkbox>
              );
            }}
          />
          <Controller
            name="approveKudos"
            control={control}
            render={({ field }) => {
              return (
                <Checkbox {...field} checked={field.value} size="sm">
                  When the granted kudos are approved
                </Checkbox>
              );
            }}
          />
        </Flex>

        <Button
          size="md"
          type="submit"
          css={{ marginTop: "$5", width: "100%" }}
        >
          Submit
        </Button>
      </Flex>
    </Box>
  );
};

export default Form;
