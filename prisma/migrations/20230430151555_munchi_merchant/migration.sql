/*
  Warnings:

  - You are about to drop the column `businessId` on the `business` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `business` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `business` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[business_id]` on the table `business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refresh_token]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `business_id` to the `business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "business" DROP CONSTRAINT "business_userId_fkey";

-- DropIndex
DROP INDEX "business_businessId_key";

-- DropIndex
DROP INDEX "business_publicId_key";

-- DropIndex
DROP INDEX "user_publicId_key";

-- DropIndex
DROP INDEX "user_refreshToken_key";

-- AlterTable
ALTER TABLE "business" DROP COLUMN "businessId",
DROP COLUMN "publicId",
DROP COLUMN "userId",
ADD COLUMN     "business_id" INTEGER NOT NULL,
ADD COLUMN     "public_id" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "firstName",
DROP COLUMN "lastname",
DROP COLUMN "publicId",
DROP COLUMN "refreshToken",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "public_id" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT NOT NULL;

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "session" (
    "accessToken" TEXT NOT NULL,
    "token_type" TEXT NOT NULL DEFAULT 'Bearer',
    "expire_in" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "session_accessToken_key" ON "session"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "session_user_id_key" ON "session"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_business_id_key" ON "business"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_public_id_key" ON "business"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_public_id_key" ON "user"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_refresh_token_key" ON "user"("refresh_token");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
