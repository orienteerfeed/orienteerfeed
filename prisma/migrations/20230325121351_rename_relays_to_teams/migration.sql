/*
  Warnings:

  - You are about to drop the column `relayId` on the `competitor` table. All the data in the column will be lost.
  - You are about to alter the column `zeroTime` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `relay` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `competitor` DROP FOREIGN KEY `Competitor_relayId_fkey`;

-- DropForeignKey
ALTER TABLE `relay` DROP FOREIGN KEY `Relay_classId_fkey`;

-- AlterTable
ALTER TABLE `competitor` DROP COLUMN `relayId`,
    ADD COLUMN `teamId` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `event` MODIFY `zeroTime` DATETIME NOT NULL;

-- DropTable
DROP TABLE `relay`;

-- CreateTable
CREATE TABLE `Team` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `classId` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `organisation` VARCHAR(191) NULL,
    `shortName` VARCHAR(10) NULL,
    `bibNumber` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Competitor` ADD CONSTRAINT `Competitor_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
