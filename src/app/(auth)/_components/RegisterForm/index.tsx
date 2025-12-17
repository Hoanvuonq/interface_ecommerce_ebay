// "use client";

// import { useState, useEffect } from "react";
// import { RegisterForm } from "@/features/auth/components/RegisterForm";
// import { VerifyForm } from "@/features/auth/components/VerifyForm";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { RegisterRequest } from "@/features/auth/types/type.auth";

// export default function RegisterPage({ type }: { type: "user" | "shop" }) {
//   const router = useRouter();
//   const theme = useSelector((state: RootState) => state.theme.name);

//   const [step, setStep] = useState<"register" | "verify">(
//     typeof window !== "undefined"
//       ? (localStorage.getItem(`registerStep_${type}`) as
//           | "register"
//           | "verify") || "register"
//       : "register"
//   );

//   const [formData, setFormData] = useState<RegisterRequest>({
//     username: "",
//     password: "",
//     email: "",
//   });

//   useEffect(() => {
//     const savedForm = localStorage.getItem(`registerForm_${type}`);
//     if (savedForm) {
//       setFormData(JSON.parse(savedForm));
//     }
//   }, [type]);

//   useEffect(() => {
//     if (step === "verify") {
//       localStorage.setItem(`registerStep_${type}`, "verify");
//       localStorage.setItem(`registerForm_${type}`, JSON.stringify(formData));
//     }
//   }, [step, formData, type]);

//   return (
//     <>
//       {step === "register" && (
//         <RegisterForm
//           type={type}
//           initialValues={formData}
//           onSuccess={(data) => {
//             setFormData(data);
//             setStep("verify");
//           }}
//         />
//       )}

//       {step === "verify" && (
//         <div
//           className={
//             theme === "dark"
//               ? "flex min-h-screen items-center justify-center bg-gray-900"
//               : "flex min-h-screen items-center justify-center bg-gray-100"
//           }
//         >
//           <VerifyForm
//             email={formData.email}
//             onSuccess={() => {
//               localStorage.removeItem(`registerStep_${type}`);
//               localStorage.removeItem(`registerForm_${type}`);
//               localStorage.removeItem(`registerChecked_${type}`);
//               router.push(type === "shop" ? "/shop/login" : "/login");
//             }}
//             type={type}
//           />
//         </div>
//       )}
//     </>
//   );
// }