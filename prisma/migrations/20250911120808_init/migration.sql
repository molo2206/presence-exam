/*
  Warnings:

  - A unique constraint covering the columns `[fingerprint]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Student_fingerprint_key` ON `student`;

-- AlterTable
ALTER TABLE `student` MODIFY `fingerprint` TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Student_fingerprint_key` ON `Student`(`fingerprint`(255));
