/*
  Warnings:

  - A unique constraint covering the columns `[fingerprint]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `student` MODIFY `fingerprint` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Student_fingerprint_key` ON `Student`(`fingerprint`);
