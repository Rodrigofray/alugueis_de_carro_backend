-- CreateTable
CREATE TABLE "Carro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "compradorId" INTEGER,
    CONSTRAINT "Carro_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Comprador" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "carroId" INTEGER NOT NULL,
    "compradorId" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Compra_carroId_fkey" FOREIGN KEY ("carroId") REFERENCES "Carro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Compra_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Comprador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comprador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contato" TEXT NOT NULL
);
