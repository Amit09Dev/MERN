import * as Yup from 'yup';

export const SignUp = Yup.object({
    email: Yup.string().email().required("Please Enter your email"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/, "Password must contain at least one special character And both Lower and Uppercase letter")
        .required("Please Enter your password"),
    confirmpassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password')
});