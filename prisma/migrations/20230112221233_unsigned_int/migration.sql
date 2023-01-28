/*
  Warnings:

  - The primary key for the `class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `class` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - The primary key for the `competitor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to alter the column `classId` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to alter the column `nationality` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(2)`.
  - You are about to alter the column `registration` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `license` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(1)`.
  - You are about to alter the column `ranking` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to alter the column `shortName` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `card` on the `competitor` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to alter the column `zeroTime` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `authorId` on the `event` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to alter the column `sportId` on the `event` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - The primary key for the `sport` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `sport` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.

*/
-- DropForeignKey
ALTER TABLE `competitor` DROP FOREIGN KEY `Competitor_classId_fkey`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_sportId_fkey`;

-- AlterTable
ALTER TABLE `class` DROP PRIMARY KEY,
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `competitor` DROP PRIMARY KEY,
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    MODIFY `classId` INTEGER UNSIGNED NOT NULL,
    MODIFY `nationality` CHAR(2) NULL,
    MODIFY `registration` VARCHAR(10) NOT NULL,
    MODIFY `license` CHAR(1) NULL,
    MODIFY `ranking` INTEGER UNSIGNED NULL,
    MODIFY `shortName` VARCHAR(10) NULL,
    MODIFY `card` INTEGER UNSIGNED NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `event` MODIFY `zeroTime` DATETIME NOT NULL,
    MODIFY `authorId` INTEGER UNSIGNED NULL,
    MODIFY `sportId` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `sport` DROP PRIMARY KEY,
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `Sport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Competitor` ADD CONSTRAINT `Competitor_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
