/*
  Warnings:

  - You are about to drop the column `vacationId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the `vacations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_vacationId_fkey`;

-- DropIndex
DROP INDEX `Student_vacationId_fkey` ON `student`;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `vacationId`,
    ADD COLUMN `recessId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `vacations`;

-- CreateTable
CREATE TABLE `Recess` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Student_vacationId_fkey` ON `Student`(`recessId`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_vacationId_fkey` FOREIGN KEY (`recessId`) REFERENCES `Recess`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
