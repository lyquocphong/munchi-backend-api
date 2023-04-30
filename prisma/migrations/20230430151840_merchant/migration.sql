/*
  Warnings:

  - You are about to drop the column `accessToken` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[access_token]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "business" DROP CONSTRAINT "business_user_id_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_fkey";

-- DropIndex
DROP INDEX "session_accessToken_key";

-- DropIndex
DROP INDEX "user_userId_key";

-- AlterTable
ALTER TABLE "session" DROP COLUMN "accessToken",
ADD COLUMN     "access_token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "session_access_token_key" ON "session"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "user_user_id_key" ON "user"("user_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
