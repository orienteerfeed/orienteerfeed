/*
  Warnings:

  - You are about to alter the column `zeroTime` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `zeroTime` DATETIME NOT NULL;
