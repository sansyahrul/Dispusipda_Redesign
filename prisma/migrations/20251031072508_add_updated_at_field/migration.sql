-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(191) NULL DEFAULT 'user',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul_profile` VARCHAR(191) NOT NULL,
    `tanggal_publish` DATETIME(3) NOT NULL,
    `jam_publish` VARCHAR(191) NOT NULL,
    `jenis_berita` VARCHAR(191) NOT NULL,
    `id_kategori` INTEGER NOT NULL,
    `isi` LONGTEXT NULL,
    `gambar_url` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hero_section` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul_section` VARCHAR(191) NOT NULL,
    `tanggal_publish` DATETIME(3) NOT NULL,
    `jam_publish` VARCHAR(191) NOT NULL,
    `jenis_berita` VARCHAR(191) NOT NULL,
    `id_kategori` INTEGER NOT NULL,
    `isi` LONGTEXT NULL,
    `gambar_url` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tujuan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul_tujuan` VARCHAR(191) NOT NULL,
    `tanggal_publish` DATETIME(3) NOT NULL,
    `jam_publish` VARCHAR(191) NOT NULL,
    `jenis_berita` VARCHAR(191) NOT NULL,
    `id_kategori` INTEGER NOT NULL,
    `isi` LONGTEXT NULL,
    `gambar_url` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `undang_undang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul_undang_undang` VARCHAR(191) NOT NULL,
    `tanggal_publish` DATETIME(3) NOT NULL,
    `jam_publish` VARCHAR(191) NOT NULL,
    `jenis_berita` VARCHAR(191) NOT NULL,
    `id_kategori` INTEGER NOT NULL,
    `isi` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
