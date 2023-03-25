/*
  Warnings:

  - You are about to alter the column `zeroTime` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `class` ADD COLUMN `maxTeamMembers` INTEGER NULL,
    ADD COLUMN `minTeamMembers` INTEGER NULL;

-- AlterTable
ALTER TABLE `competitor` ADD COLUMN `leg` INTEGER UNSIGNED NULL,
    ADD COLUMN `relayId` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `event` MODIFY `zeroTime` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `Relay` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `classId` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `organisation` VARCHAR(191) NULL,
    `shortName` VARCHAR(10) NULL,
    `bibNumber` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Competitor` ADD CONSTRAINT `Competitor_relayId_fkey` FOREIGN KEY (`relayId`) REFERENCES `Relay`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Relay` ADD CONSTRAINT `Relay_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
