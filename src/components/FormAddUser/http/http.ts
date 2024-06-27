import { FormDataInterface } from "../interfaces/formData";

export const http = async (formDataWithoutConfirm: FormDataInterface) => {
    
      const res = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithoutConfirm),
      });

      return res
  };