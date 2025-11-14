-- CreateTable
CREATE TABLE `Content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul_berita` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `tanggal_publish` DATETIME(3) NOT NULL,
    `jam_publish` VARCHAR(191) NOT NULL,
    `status_berita` VARCHAR(191) NOT NULL,
    `jenis_berita` VARCHAR(191) NOT NULL,
    `id_kategori` INTEGER NOT NULL,
    `urutan` INTEGER NOT NULL,
    `keywords` VARCHAR(191) NULL,
    `isi` VARCHAR(191) NULL,
    `gambar_url` VARCHAR(191) NULL,
    `video_url` VARCHAR(191) NULL,
    `dokumen_url` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
