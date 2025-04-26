import * as Yup from "yup";

const userLoginValidationSchema = Yup.object({
    email: Yup.string()
        .email("Enter a valid email address (e.g., example@domain.com)")
        .matches(/^[^\s@]+@[^\s@]+\.(com|net)$/, "Only .com and .net domains are allowed")
        .required("Email is required"),

    password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .max(30, "Password must not exceed 30 characters")
        .matches(/^[^\s]*$/, "Only letters (A-Z, a-z) and numbers (0-9) are allowed. No spaces.")
        .required("Password is required")
});

export default userLoginValidationSchema;
