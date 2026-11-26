"use client";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "./form-input";
import { FormValues, signinSchema, signupSchema } from "@/lib/validators/auth";
import Spinner from "@/components/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import GoogleButton from "./google-button";
import { signin } from "@/lib/actions/auth";

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
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      ...(isSignIn ? {} : { name: "" }),
    },
    resolver: zodResolver(isSignIn ? signinSchema : signupSchema),
    mode: "onChange",
  });

  const title = isSignIn ? "Welcome back " : "Create your account.";
  const subtitle = isSignIn
    ? "Sign into your account"
    : "Create an account to start planning, list venues and list event services. ";

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      if (isSignIn) {
        await signin(values);
      } else {
        const { user } = await authService.signup(
          values as FormValues & { name: string },
        );
        router.push(
          `/auth/verify-email?${new URLSearchParams({ email: user.email })}`,
        );
      }
    } catch (e) {
      setError("root", { message: (e as Error).message });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-2">
      <h2 className="heading-2">{title}</h2>
      <p className="prose-body max-w-sm text-center">{subtitle}</p>
      <GoogleButton />
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
          href={isSignIn ? "/auth/signup" : "/auth/signin"}
          className="hover:text-neutral-800 font-semibold hover:underline"
        >
          {isSignIn ? "Create account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
