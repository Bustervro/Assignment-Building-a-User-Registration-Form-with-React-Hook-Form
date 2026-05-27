import { useEffect } from "react";
import { useForm } from "react-hook-form";
import "./App.css";

const STORAGE_KEY = "registrationDraft";

const defaultValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  terms: false,
};

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues,
  });

  const password = watch("password");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const draft = JSON.parse(saved);
      Object.entries(draft).forEach(([key, value]) => {
        setValue(key, value, { shouldValidate: true });
      });
    }
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert(`Registration successful, ${data.fullName}!`);
    localStorage.removeItem(STORAGE_KEY);
    reset(defaultValues);
  };

  return (
    <main className="page">
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>User Registration</h1>

        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          autoFocus
          {...register("fullName", {
            required: "Full name is required.",
            minLength: {
              value: 3,
              message: "Full name must be at least 3 characters.",
            },
          })}
        />
        <p className="error">{errors.fullName?.message}</p>

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
              message: "Enter a valid email address.",
            },
          })}
        />
        <p className="error">{errors.email?.message}</p>

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters.",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message: "Use uppercase, lowercase, and a number.",
            },
          })}
        />
        <p className="error">{errors.password?.message}</p>

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword", {
            required: "Confirm password is required.",
            validate: (value) =>
              value === password || "Passwords do not match.",
          })}
        />
        <p className="error">{errors.confirmPassword?.message}</p>

        <label htmlFor="role">Role / Account Type</label>
        <select
          id="role"
          {...register("role", {
            required: "Please select a role.",
          })}
        >
          <option value="">Select a role...</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Product Manager">Product Manager</option>
        </select>
        <p className="error">{errors.role?.message}</p>

        <label className="checkbox-row">
          <input
            type="checkbox"
            {...register("terms", {
              required: "You must accept the terms.",
            })}
          />
          I accept the Terms & Conditions
        </label>
        <p className="error">{errors.terms?.message}</p>

        {isSubmitting && <p className="loading">Registering user...</p>}

        <button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </main>
  );
}
