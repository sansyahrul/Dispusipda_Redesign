/*
  Warnings:

  - You are about to drop the column `gambar_url` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profile` DROP COLUMN `gambar_url`,
    ADD COLUMN `media_type` VARCHAR(191) NULL,
    ADD COLUMN `media_url` VARCHAR(191) NULL;
