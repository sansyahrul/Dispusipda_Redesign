"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setAlert({
        type: "error",
        message: "Email atau password salah!",
      });
      setLoading(false);
      return;
    }

    setAlert({
      type: "success",
      message: "Login berhasil! Mengalihkan...",
    });

    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 1500);

    setLoading(false);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-login.jpg')" }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative overflow-hidden">
        {alert && (
          <div
            className={`absolute top-0 left-0 w-full text-center py-3 text-sm font-medium ${
              alert.type === "success"
                ? "bg-blue-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {alert.message}
          </div>
        )}

        <div className="flex justify-center mt-6 mb-4">
          <Image
            src="/Logo_Dispusipda.png"
            alt="Logo"
            width={150}
            height={150}
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          PERPUSTAKAAN DEPOSIT
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 pr-10"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 rounded-lg font-semibold transition`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 DISPUSIPDA Jawa Barat
        </p>
      </div>
    </div>
  );
}
