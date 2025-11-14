import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ==== DELETE USER BY ID ====
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = Number(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // Cek apakah user ada
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Gagal menghapus user" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, role, email, password } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID user wajib dikirim untuk update" },
        { status: 400 }
      );
    }

    // Tipe aman buat Prisma update
    const dataToUpdate: {
      name?: string;
      role?: string;
      email?: string;
      password?: string;
    } = {};

    if (name) dataToUpdate.name = name;
    if (role) dataToUpdate.role = role;
    if (email) dataToUpdate.email = email;
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data user" },
      { status: 500 }
    );
  }
}
