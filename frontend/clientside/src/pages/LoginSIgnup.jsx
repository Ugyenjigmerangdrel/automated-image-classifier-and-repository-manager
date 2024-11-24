import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github, Twitter } from "lucide-react";
import InputField from "../components/forms/InputField";
import { useAuth } from "../context/AuthContext";

const LoginSignupPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [formErrors, setFormErrors] = useState(null);

  const toggleMode = () => {
    setEmail("");
    setPassword("");
    setName("");
    setIsLogin((prev) => !prev);
  };

  const formVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password, name };
    console.log(data);
    if (email !== "") {
      const loginError = await login(data);
      setFormErrors(loginError);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={formVariants}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <form onSubmit={handleOnSubmit} method="post">
                <div className="space-y-4">
                  {!isLogin && (
                    <InputField
                      icon={User}
                      placeholder="Full Name"
                      type="text"
                      value={name}
                      name="username"
                      onChange={(e) => setName(e.target.value)}
                    />
                  )}
                  <InputField
                    icon={Mail}
                    placeholder="Email"
                    type="email"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputField
                    icon={Lock}
                    placeholder="Password"
                    type="password"
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* ... (submit button and social login options) */}
                <div className="mt-8">
                  {formErrors !== null ? (
                    <p className="text-sm text-red-600 mb-3">{formErrors}</p>
                  ) : undefined}
                  <button
                    type="submit"
                    className={`text-white px-6 py-3 rounded-lg w-full flex items-center justify-center ${
                      isLogin ? "bg-blue-600" : "bg-green-600"
                    }`}
                  >
                    {isLogin ? "Sign In" : "Sign Up"}{" "}
                    <ArrowRight className="ml-2" size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* ... (right side panel) */}
      <div
        className={`w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 ${
          isLogin ? "bg-blue-600" : "bg-green-600"
        }`}
      >
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            {isLogin ? "New here?" : "Already have an account?"}
          </h2>
          <p className="text-gray-200 mb-8">
            {isLogin
              ? "Sign up and discover a great amount of new opportunities!"
              : "Sign in to access your account and continue your journey!"}
          </p>
          <button
            className="bg-white px-6 py-3 rounded-lg"
            style={{ color: isLogin ? "#2563EB" : "#059669" }}
            onClick={toggleMode}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;
