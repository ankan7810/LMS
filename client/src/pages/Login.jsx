import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useLoginUserMutation, useRegisterUserMutation } from "@/api/authApi";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  // Controls which tab is active (login or signup)
  const [activeTab, setActiveTab] = useState("login");

  // Login state (role removed)
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  // Signup state
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // Password toggles
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const navigate = useNavigate();

  const [
    loginUser,
    { data: loginData, error: loginError, isLoading: isLogginIn, isSuccess: isLoggingSuccess },
  ] = useLoginUserMutation();

  const [
    registerUser,
    { data: registerData, error: registerError, isLoading: isRegistering, isSuccess: isRegisterSuccess },
  ] = useRegisterUserMutation();

  const darkInputClass =
    "bg-black text-white border border-gray-600 placeholder-gray-400";

  // Handlers
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async (type) => {
    if (type === "signup") {
      if (!signupInput.role) {
        toast.error("Please choose a role (student or instructor).");
        return;
      }

      const payload = {
        name: signupInput.name.trim(),
        email: signupInput.email.trim(),
        password: signupInput.password,
        role: signupInput.role,
      };

      console.log("Register payload ->", payload);
      await registerUser(payload);
      return;
    }

    // LOGIN (no role)
    const payload = {
      email: loginInput.email.trim(),
      password: loginInput.password,
    };

    console.log("Login payload ->", payload);
    await loginUser(payload);
  };

  // Handle success + redirect logic
  useEffect(() => {
    if (isRegisterSuccess && registerData) {
      toast.success(registerData.message || "Signup successful");

      // RESET SIGNUP FIELDS
      setSignupInput({ name: "", email: "", password: "", role: "" });

      // SWITCH TO LOGIN TAB
      setActiveTab("login");
    }

    if (registerError) {
      toast.error(registerError?.data?.message || "Signup failed");
    }

    if (loginError) {
      toast.error(loginError?.data?.message || "Login failed");
    }

    if (isLoggingSuccess && loginData) {
      toast.success(loginData.message || "Login successful");

      // Reset login input
      setLoginInput({ email: "", password: "" });

      // Redirect to homepage
      navigate("/");
    }
  }, [
    isRegisterSuccess,
    isLoggingSuccess,
    registerData,
    loginData,
    registerError,
    loginError,
    navigate,
  ]);

  return (
    <div className="flex justify-center my-16 px-4 sm:px-8 md:px-16">
      {/* Controlled Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-[420px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* SIGNUP */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Name */}
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={signupInput.name}
                  onChange={handleSignupChange}
                  placeholder="Enter your name"
                  className={darkInputClass}
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={signupInput.email}
                  onChange={handleSignupChange}
                  placeholder="Enter your email"
                  className={darkInputClass}
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showSignupPassword ? "text" : "password"}
                    value={signupInput.password}
                    onChange={handleSignupChange}
                    placeholder="Password"
                    className={darkInputClass}
                  />
                  <button
                    type="button"
                    aria-label="toggle password"
                    onClick={() => setShowSignupPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showSignupPassword ? (
                      <EyeOff className="h-4 w-4 text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label>Select role</Label>
                <select
                  name="role"
                  value={signupInput.role}
                  onChange={handleSignupChange}
                  className={`w-full rounded-md px-3 py-2 ${darkInputClass}`}
                >
                  <option value="" disabled hidden>
                    Choose role
                  </option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
            </CardContent>

            <CardFooter>
              {isRegistering ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button onClick={() => handleRegistration("signup")}>Signup</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* LOGIN (no role dropdown) */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={loginInput.email}
                  onChange={handleLoginChange}
                  placeholder="abc@gmail.com"
                  className={darkInputClass}
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showLoginPassword ? "text" : "password"}
                    value={loginInput.password}
                    onChange={handleLoginChange}
                    placeholder="Password"
                    className={darkInputClass}
                  />
                  <button
                    type="button"
                    aria-label="toggle password"
                    onClick={() => setShowLoginPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4 text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button onClick={() => handleRegistration("login")} disabled={isLogginIn}>
                {isLogginIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;
