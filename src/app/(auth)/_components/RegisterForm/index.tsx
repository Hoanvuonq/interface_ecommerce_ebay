"use client";

import { useEffect, useRef, useState } from "react";
import { RegisterRequest } from "@/auth/_types/auth";
import { useRegisterBuyer, useRegisterShop } from "@/auth/_hooks/useAuth";
import { FaStore, FaUserPlus, FaMagic } from "react-icons/fa";
import Link from "next/link";
import { InputField } from "@/components/inputField";
import { ButtonField } from "@/components/buttonField";
import { generateSecurePassword } from "@/utils/passwordGenerator";
import { cn } from "@/utils/cn";
import { LeftSideForm } from "../LeftSideForm";
import { AUTH_PANEL_DATA, getAuthPanelData } from "../../_constants/future";
import { MobileFeatureList } from "../LeftSideForm/_components/FeatureMobile";
import { Design } from "@/components";
import { useToast } from "@/hooks/useToast";

import { useAuthForm, authValidation } from "../../_hooks/useAuthForm";

const Title = ({ level, className, children }: {
    level: number;
    className?: string;
    children: React.ReactNode;
}) => {
    const Tag = `h${level}` as React.ElementType;
    return <Tag className={className}>{children}</Tag>;
};

const Text = ({ className, children }: {
    className?: string;
    children: React.ReactNode;
}) => {
    return <span className={className}>{children}</span>;
};

const Divider = ({ className, children }: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div className={cn("flex items-center my-6", className)}>
            <div className="grow border-t border-gray-200 dark:border-slate-700"></div>
            {children && (
                <span className="mx-4 text-gray-400 text-sm font-medium">
                    {children}
                </span>
            )}
            <div className="grow border-t border-gray-200 dark:border-slate-700"></div>
        </div>
    );
};

type RegisterFormProps = {
    type: "user" | "shop";
    initialValues?: RegisterRequest;
    onSuccess?: (data: RegisterRequest) => void;
};

export function RegisterForm({ type, initialValues, onSuccess }: RegisterFormProps) {
    const { success } = useToast();
    const { handleRegisterBuyer, loading: loadingBuyer, error: errorBuyer } = useRegisterBuyer();
    const { handleRegisterShop, loading: loadingShop, error: errorShop } = useRegisterShop();
    
    const { error: toastError } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);

    // Form Logic Hook
    const { 
        formData, 
        errors: formErrors, 
        setFormData, 
        setErrors, 
        handleChange, 
        handleSubmit 
    } = useAuthForm(
        { 
            username: "", 
            email: "", 
            password: "", 
            confirmPassword: "", 
            ...initialValues 
        },
        authValidation.register // Sử dụng logic validate đăng ký
    );

    const loading = type === "shop" ? loadingShop : loadingBuyer;
    const panelType = type === "shop" ? "shop" : "default";
    const panelData = getAuthPanelData(panelType);

    useEffect(() => {
        usernameRef.current?.focus();
    }, []);

    const handleGeneratePassword = () => {
        const newPassword = generateSecurePassword({ length: 14 });
        setFormData((prev) => ({
            ...prev,
            password: newPassword,
            confirmPassword: newPassword
        }));
        
        setErrors((prev) => ({
            ...prev,
            password: undefined,
            confirmPassword: undefined
        }));
        
        success("Đã điền mật khẩu mạnh tự động!");
    };

    const onFinish = async (values: typeof formData) => {
        setSubmitting(true);
        try {
            const registerData: RegisterRequest = {
                username: values.username!,
                email: values.email!,
                password: values.password!
            };
            
            const res = type === "shop"
                ? await handleRegisterShop(registerData)
                : await handleRegisterBuyer(registerData);

            if (res) {
                success("Đăng ký thành công! Vui lòng kiểm tra email.");
                localStorage.setItem(`registerForm_${type}`, JSON.stringify(registerData));
                onSuccess?.(registerData);
            } else {
                toastError("Đăng ký thất bại", { 
                    description: errorBuyer || errorShop || "Vui lòng kiểm tra lại thông tin." 
                });
            }
        } catch (err: any) {
            toastError("Có lỗi xảy ra", { 
                description: err?.message || "Lỗi hệ thống, vui lòng thử lại sau." 
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <Design />
            <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
                <div className="hidden lg:flex lg:w-1/2 w-full items-center justify-center px-4 lg:px-12">
                    <LeftSideForm type={panelType} />
                </div>
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <div className="w-full max-w-md relative">
                        <div className="lg:hidden text-center mb-8">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className={`w-12 h-12 bg-linear-to-br ${panelData.logoGradientFrom} ${panelData.logoGradientTo} rounded-xl flex items-center justify-center shadow-lg`}>
                                    {type === "shop"
                                        ? (<FaStore className="text-white text-2xl" />)
                                        : (<FaUserPlus className="text-white text-2xl" />)}
                                </div>
                                <Title
                                    level={1}
                                    className={`mb-0! text-3xl! font-bold bg-linear-to-r ${panelData.brandColorFrom} ${panelData.brandColorTo} bg-clip-text text-transparent`}>
                                    CaLaTha
                                </Title>
                            </div>
                            <Text className="text-gray-600 dark:text-gray-300">
                                {panelData.welcome.title}
                            </Text>
                        </div>

                        <div
                            className="w-full shadow-2xl hover:shadow-3xl transition-all duration-300 relative z-10 bg-white/90 dark:bg-slate-800/90 border-2 border-pink-500/30 dark:border-pink-500/50 p-8 sm:p-10 rounded-3xl backdrop-blur-md"
                            style={{ backdropFilter: "blur(12px)" }}>
                            
                            <div className="text-center mb-8 pt-1">
                                <Title
                                    level={2}
                                    className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
                                    {type === "shop" ? "Đăng Ký Bán Hàng" : "Đăng Ký Tài Khoản"}
                                </Title>
                                <Text className="text-base text-gray-500 dark:text-gray-400">
                                    Nhập thông tin để tạo tài khoản mới
                                </Text>
                            </div>

                            <Divider>Đăng ký với email</Divider>

                            <form onSubmit={handleSubmit(onFinish)} className="mb-6">
                                <InputField
                                    label="Tên đăng nhập"
                                    name="username"
                                    placeholder="Nhập tên đăng nhập"
                                    value={formData.username}
                                    onChange={handleChange}
                                    errorMessage={formErrors.username}
                                    ref={usernameRef} />

                                <InputField
                                    label="Email"
                                    name="email"
                                    placeholder="example@email.com"
                                    type="text"
                                    value={formData.email}
                                    onChange={handleChange}
                                    errorMessage={formErrors.email} />

                                <div className="flex items-center justify-between mb-1">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Mật khẩu
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleGeneratePassword}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors cursor-pointer group">
                                        <FaMagic className="group-hover:rotate-12 transition-transform duration-300" />
                                        <span className="group-hover:underline">
                                            Gợi ý mật khẩu?
                                        </span>
                                    </button>
                                </div>

                                <InputField
                                    label=""
                                    name="password"
                                    placeholder="Nhập mật khẩu"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    errorMessage={formErrors.password} />

                                <InputField
                                    label="Xác nhận mật khẩu"
                                    name="confirmPassword"
                                    placeholder="Nhập lại mật khẩu"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    errorMessage={formErrors.confirmPassword} />

                                <ButtonField
                                    htmlType="submit"
                                    type="login"
                                    disabled={loading || submitting}
                                    loading={loading || submitting}
                                    className="w-full h-12 text-lg font-bold shadow-lg shadow-orange-500/20">
                                    {type === "shop" ? "Đăng Ký Cửa Hàng" : "Đăng Ký Ngay"}
                                </ButtonField>
                            </form>

                            <div className="text-center mt-6">
                                <Text className="text-gray-600 dark:text-gray-300">
                                    Đã có tài khoản?
                                    <Link
                                        className="text-orange-600 hover:text-orange-700 font-bold hover:underline ml-1"
                                        href={type === "shop" ? "/shop/login" : "/login"}>
                                        Đăng nhập ngay
                                    </Link>
                                </Text>
                            </div>
                        </div>

                        <MobileFeatureList features={AUTH_PANEL_DATA.return_customer.features} />
                    </div>
                </div>
            </div>
        </div>
    );
}