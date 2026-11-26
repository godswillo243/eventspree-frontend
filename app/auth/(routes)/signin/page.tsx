import { Metadata } from "next";
import AuthForm from "../../_components/auth-form";

export const metadata: Metadata = {
  title: "Eventspree | Sign in",
  description: "Sign in to Eventspree",
};

const SigninPage = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <AuthForm type="signin" />
    </div>
  );
};

export default SigninPage;
