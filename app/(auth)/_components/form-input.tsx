import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { InputHTMLAttributes } from "react";
import { FieldErrors } from "react-hook-form";
import { useBoolean } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { FormValues } from "@/lib/validators/auth";

type FormInputProps = {
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  label: string;
  showVisibleButton?: boolean;
  showForgotPassword?: boolean;
  error?: FieldErrors<FormValues>[keyof FormValues];
} & InputHTMLAttributes<HTMLInputElement>;

const FormInput = ({
  label,
  showVisibleButton = true,
  showForgotPassword = false,
  type,
  error,
  ...props
}: FormInputProps) => {
  const isPassword = type === "password";
  const showPassword = useBoolean(false);

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between w-full">
        <label htmlFor={props.id} className="label">
          {label}
        </label>
        {isPassword && showForgotPassword && (
          <Link href={"/forgot-password"} className="prose-sm">
            Forgot password?
          </Link>
        )}
      </div>
      <div className="w-full relative">
        <input
          className={cn(error ? "input-error" : "input")}
          {...props}
          type={showPassword.value ? "text" : type}
        />
        {isPassword && showVisibleButton && (
          <button
            type="button"
            className="button-ghost p-0 size-6 absolute top-1.5 right-1.5"
            onClick={showPassword.toggle}
          >
            {showPassword.value ? <EyeIcon /> : <EyeClosedIcon />}
          </button>
        )}
      </div>
      <div className="error-text">
        {error && <p role="alert">{error.message}</p>}
      </div>
    </div>
  );
};

export default FormInput;
