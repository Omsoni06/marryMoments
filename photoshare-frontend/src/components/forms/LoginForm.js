"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Camera,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "photographer",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(loginData);
    if (result.success) {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(registerData);
    if (result.success) {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-white rounded-3xl overflow-hidden">
          <CardHeader className="text-center space-y-6 pb-8 pt-10">
            {/* Logo with Glow Effect */}
            <div className="relative mx-auto">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-20"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Camera className="w-10 h-10 text-white" />
              </div>
            </div>

            <div>
              <CardTitle className="text-3xl font-bold text-slate-900">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base text-slate-600 mt-2">
                Sign in to your account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-5">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-4">
                    {/* Email Input */}
                    <div>
                      <Label
                        htmlFor="login-email"
                        className="text-sm font-medium text-slate-700 mb-2 block"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                          id="login-email"
                          type="email"
                          value={loginData.email}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              email: e.target.value,
                            })
                          }
                          className="pl-12 h-12 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 rounded-xl"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <Label
                        htmlFor="login-password"
                        className="text-sm font-medium text-slate-700 mb-2 block"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            })
                          }
                          className="pl-12 pr-12 h-12 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 rounded-xl"
                          placeholder="Enter password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg rounded-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-5">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-4">
                    {/* Name Input */}
                    <div>
                      <Label
                        htmlFor="register-name"
                        className="text-sm font-medium text-slate-700 mb-2 block"
                      >
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                          id="register-name"
                          type="text"
                          value={registerData.name}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              name: e.target.value,
                            })
                          }
                          className="pl-12 h-12 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 rounded-xl"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <Label
                        htmlFor="register-email"
                        className="text-sm font-medium text-slate-700 mb-2 block"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                          id="register-email"
                          type="email"
                          value={registerData.email}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              email: e.target.value,
                            })
                          }
                          className="pl-12 h-12 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 rounded-xl"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <Label
                        htmlFor="register-password"
                        className="text-sm font-medium text-slate-700 mb-2 block"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                          id="register-password"
                          type={showRegPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              password: e.target.value,
                            })
                          }
                          className="pl-12 pr-12 h-12 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 rounded-xl"
                          placeholder="Create password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showRegPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="flex items-center justify-center pt-2">
                      <Badge className="px-4 py-2 bg-indigo-50 text-indigo-700 border-indigo-200">
                        <Camera className="w-4 h-4 mr-2" />
                        Photographer Account
                      </Badge>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg rounded-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Secure authentication powered by PhotoShare Pro
          </p>
        </div>
      </div>
    </div>
  );
}
