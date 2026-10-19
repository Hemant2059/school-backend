-- AlterTable
ALTER TABLE "LibraryBook" DROP COLUMN "author",
DROP COLUMN "title",
ADD COLUMN     "authorEn" TEXT,
ADD COLUMN     "authorNe" TEXT,
ADD COLUMN     "titleEn" TEXT NOT NULL,
ADD COLUMN     "titleNe" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TransportStop" DROP COLUMN "name",
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameNe" TEXT NOT NULL;
