-- CreateTable
CREATE TABLE "resource_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resourceId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNTRANSLATED',
    "locale" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "resource_translations_resourceId_locale_key" ON "resource_translations"("resourceId", "locale");
