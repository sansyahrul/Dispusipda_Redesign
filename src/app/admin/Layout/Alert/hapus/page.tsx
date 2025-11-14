"use client";

import React, { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";

type DeleteAlertDialogProps = {
  isOpen: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
};

export default function DeleteAlertDialog({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteAlertDialogProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen && !showSuccess) return null;

  const handleConfirm = async () => {
    await onConfirm();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onCancel();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 🔹 Transparent Backdrop + Blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* 🔹 Dialog Box */}
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 animate-fadeIn border border-gray-200">
        {!showSuccess ? (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
              Yakin Hapus?
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-center mb-8">
              Data yang dihapus tidak dapat dikembalikan!
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors font-medium"
              >
                Ya, Hapus!
              </button>
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
              >
                Batal
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ✅ Success Alert */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
              Terhapus!
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Data User berhasil dihapus!
            </p>

            <div className="flex gap-3">
              <button className="flex-1 px-6 bg-blue-900 py-3 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium">
                OK
              </button>
            </div>
          </>
        )}
      </div>

      {/* ✨ Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-scaleUp {
          animation: scaleUp 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
