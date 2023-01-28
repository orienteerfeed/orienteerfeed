/*
  Warnings:

  - You are about to alter the column `zeroTime` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[name]` on the table `Sport` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `zeroTime` DATETIME NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Sport_name_key` ON `Sport`(`name`);
