"use client";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "./form-input";
import { FormValues, signinSchema, signupSchema } from "@/lib/validators/auth";
import Image from "next/image";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  type: "signup" | "signin";
};

const AuthForm = ({ type }: AuthFormProps) => {
  const isSignIn = type === "signin";
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      ...(isSignIn ? {} : { name: "" }),
    },
    resolver: zodResolver(isSignIn ? signinSchema : signupSchema),
    reValidateMode: "onChange",
  });

  const title = isSignIn ? "Welcome back " : "Create your account.";
  const subtitle = isSignIn
    ? "Sign into your account"
    : "Create an account to start planning, list venues and list event services. ";

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    console.log(values);
  };

  const signInWithGoogle = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });
    router.push(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    );
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-2">
      <h2 className="heading-2">{title}</h2>
      <p className="prose-body max-w-sm text-center">{subtitle}</p>
      <button
        className="button-secondary w-full max-w-sm mt-8"
        onClick={signInWithGoogle}
      >
        <Image
          width="24"
          height="24"
          src="https://img.icons8.com/color/48/google-logo.png"
          alt="google-logo"
        />
        Continue with Google
      </button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full my-8 flex flex-col items-center justify-center gap-6"
      >
        {!isSignIn && (
          <FormInput
            label="Name"
            type="text"
            placeholder="John Doe"
            {...register("name")}
            error={errors["name" as keyof FormValues]}
          />
        )}
        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors["email"]}
        />
        <FormInput
          label="Password"
          type="password"
          placeholder="Enter a password"
          {...register("password")}
          error={errors["password"]}
          showForgotPassword={isSignIn}
        />

        <button className="button-primary w-full max-w-sm">
          {isSubmitting ? <Spinner /> : isSignIn ? "Sign in" : "Create account"}
        </button>
        <div className="error-text">
          {errors["root"] && <p role="alert">{errors["root"].message}</p>}
        </div>
      </form>
      <p className="prose-default text-center">
        {isSignIn ? "New to Eventspree? " : "Already have an account? "}
        <Link
          href={isSignIn ? "/signup" : "/signin"}
          className="hover:text-neutral-800 font-semibold hover:underline"
        >
          {isSignIn ? "Create account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
