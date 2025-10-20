import React, { createContext, ReactNode, useContext, useState } from "react";

interface FormValuesType {
  totalGoals: string;
  containerSize: string;
  wake: string;
  sleep: string;
}

interface FormErrorsType {
  totalGoals?: string;
  containerSize?: string;
  wake?: string;
  sleep?: string;
}

interface HydrationContextType {
  formValues: FormValuesType;
  errors: FormErrorsType;
  updateField: (field: keyof FormValuesType, value: string) => void;
  validateField: (field: keyof FormValuesType) => boolean;
  validateAll: () => boolean;
  validateSome: (fields: (keyof FormValuesType)[]) => boolean;
}

const HydrationContext = createContext<HydrationContextType | undefined>(
  undefined
);

export const HydrationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formValues, setFormValues] = useState<FormValuesType>({
    totalGoals: "10000",
    containerSize: "250",
    wake: "07:00",
    sleep: "20:00",
  });

  const [errors, setErrors] = useState<FormErrorsType>({});

  const updateField = (field: keyof FormValuesType, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined })); // clear old error
  };

  const validateField = (field: keyof FormValuesType) => {
    let error = "";

    if (!formValues[field] || formValues[field].trim() === "") {
      if (field === "totalGoals") {
        error = "Intake Goal is required";
      } else if (field === "containerSize") {
        error = "Container size is required";
      } else {
        error = `${field.slice(0, 1).toUpperCase()}${field.slice(1)} is required`;
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    return error === "";
  };

  const validateAll = () => {
    let valid = true;
    (Object.keys(formValues) as (keyof FormValuesType)[]).forEach((field) => {
      if (!validateField(field)) {
        valid = false;
      }
    });
    return valid;
  };

  const validateSome = (fields: (keyof FormValuesType)[]) => {
    let valid = true;
    fields.forEach((field) => {
      if (!validateField(field)) {
        valid = false;
      }
    });
    return valid;
  };

  const value: HydrationContextType = {
    formValues,
    errors,
    updateField,
    validateField,
    validateAll,
    validateSome,
  };

  return (
    <HydrationContext.Provider value={value}>
      {children}
    </HydrationContext.Provider>
  );
};

export const useHydration = () => {
  const context = useContext(HydrationContext);
  if (!context) {
    throw new Error("useHydration must be used within a HydrationProvider");
  }
  return context;
};
