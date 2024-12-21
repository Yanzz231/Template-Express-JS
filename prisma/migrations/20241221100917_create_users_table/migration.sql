/*
  Warnings:

  - You are about to drop the column `token_verify` on the `users` table. All the data in the column will be lost.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `token_verify`,
    ADD COLUMN `otp_password` VARCHAR(191) NULL,
    ADD COLUMN `otp_password_reminder` VARCHAR(191) NULL,
    ADD COLUMN `otp_reminder` VARCHAR(191) NULL,
    ADD COLUMN `otp_verify` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;
