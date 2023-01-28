/*
  Warnings:

  - You are about to alter the column `zeroTime` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `externalId` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `class` ADD COLUMN `externalId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `event` MODIFY `zeroTime` DATETIME NOT NULL;
