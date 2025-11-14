import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ===========================
// 📥 GET — Ambil Semua User
// ===========================
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 }
    );
  }
}

// ===========================
// 📤 POST — Tambah User Baru
// ===========================
export async function POST(req: Request) {
  try {
    const { name, role, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        role,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json({ error: "Gagal membuat user" }, { status: 500 });
  }
}

// ===========================
// ✏️ PUT — Update Data User
// ===========================
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
