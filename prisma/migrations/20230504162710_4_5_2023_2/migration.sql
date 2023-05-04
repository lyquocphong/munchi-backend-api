/*
  Warnings:

  - Made the column `refresh_token` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "refresh_token" SET NOT NULL;
