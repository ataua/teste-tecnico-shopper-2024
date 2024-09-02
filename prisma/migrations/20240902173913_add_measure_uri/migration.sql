/*
  Warnings:

  - Added the required column `measure_uri` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Measure" ADD COLUMN     "measure_uri" TEXT NOT NULL;
