/*
  Warnings:

  - You are about to alter the column `zeroTime` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime`.
  - Added the required column `sportId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `relay` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sportId` INTEGER NOT NULL,
    MODIFY `date` DATE NOT NULL,
    MODIFY `zeroTime` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `password` VARCHAR(255) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Sport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Class` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `length` INTEGER NULL,
    `climb` INTEGER NULL,
    `controlsCount` INTEGER NULL,
    `competitorsCount` INTEGER NULL,
    `printedMaps` INTEGER NULL,
    `minAge` INTEGER NULL,
    `maxAge` INTEGER NULL,
    `sex` ENUM('B', 'M', 'F') NOT NULL DEFAULT 'B',
    `status` ENUM('NORMAL', 'DIVIDED', 'JOINED', 'INVALIDATED', 'INVALIDATEDNOFEE') NOT NULL DEFAULT 'NORMAL',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Competitor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` INTEGER NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NULL,
    `registration` VARCHAR(191) NOT NULL,
    `license` VARCHAR(191) NULL,
    `ranking` INTEGER NULL,
    `organisation` VARCHAR(191) NULL,
    `shortName` VARCHAR(191) NULL,
    `card` INTEGER NULL,
    `startTime` DATETIME(3) NULL,
    `finishTime` DATETIME(3) NULL,
    `time` INTEGER NULL,
    `status` ENUM('OK', 'Finished', 'MissingPunch', 'Disqualified', 'DidNotFinish', 'Active', 'Inactive', 'OverTime', 'SportingWithdrawal', 'NotCompeting', 'Moved', 'MovedUp', 'DidNotStart', 'DidNotEnter', 'Cancelled') NOT NULL DEFAULT 'Inactive',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `Sport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Competitor` ADD CONSTRAINT `Competitor_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
