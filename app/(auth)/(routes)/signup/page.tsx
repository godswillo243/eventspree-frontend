import { Metadata } from "next";
import AuthForm from "../../_components/auth-form";

export const metadata: Metadata = {
  title: "Eventspree | Create account",
  description: "Create an account on Eventspree",
};

const SignUpPage = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <AuthForm type="signup" />
    </div>
  );
};

export default SignUpPage;
