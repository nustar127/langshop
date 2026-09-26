-- CreateTable
CREATE TABLE "stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resourceType" TEXT NOT NULL,
    "lastUpdated" DATETIME NOT NULL,
    "itemCount" INTEGER NOT NULL,
    "translatedCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNTRANSLATED',
    "locale" TEXT NOT NULL
);

CREATE UNIQUE INDEX "stats_resourceType_locale_key" ON "stats"("resourceType", "locale");
