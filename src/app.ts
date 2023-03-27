import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();
const PORT = 3000;
app.use(express.json());

// Rota para cadastrar um novo veículo
app.post("/carro", async (req: Request, res: Response) => {
  const { modelo, ano, compradorId } = req.body;

  // create carro
  const carro = await prisma.carro.create({
    data: {
      modelo: modelo,
      ano: ano,
      compradorId: compradorId,
    },
  });
  res.json(carro);
});

// Rota para cadastrar um novo usuário
app.post("/comprador", async (req: Request, res: Response) => {
  const { nome, email, contato } = req.body;

  // create comprador
  const comprador = await prisma.comprador.create({
    data: {
      nome: nome,
      email: email,
      contato: contato,
    },
  });
  res.json(comprador);
});

// Rota para um usuário alugar um veículo
app.post("/aluguel", async (req: Request, res: Response) => {
  const { carroId, compradorId, startDate, endDate } = req.body;

  // check if carro is available
  const carro = await prisma.carro.findUnique({
    //carro.findUnique({
    where: { id: carroId },
    include: { compras: true },
  });
  if (!carro) {
    return res.status(404).json({ message: "Carro not found" });
  }
  if (carro.compras.some((compra) => compra.status === "RENTED")) {
    return res.status(400).json({ message: "Carro is not available" });
  }

  // create compra
  const compra = await prisma.compra.create({
    data: {
      carroId: carro.id,
      compradorId: compradorId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: "RENTED",
    },
  });
  res.json(compra);
});

// Rota para um usuário devolver um veículo
app.post("/return", async (req: Request, res: Response) => {
  const { carroId, compradorId, endDate } = req.body;

  // check if compra exists and is active
  const compra = await prisma.compra.findFirst({
    where: {
      carroId: carroId,
      compradorId: compradorId,
      status: "RENTED",
    },
  });
  if (!compra) {
    return res.status(404).json({ message: "Compra not found" });
  }

  // update compra
  const updatedCompra = await prisma.compra.update({
    where: { id: compra.id },
    data: {
      endDate: new Date(endDate),
      status: "RETURNED",
    },
  });
  res.json(updatedCompra);
});

// Rota para editar um usuárFio
app.put("/comprador/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, email, contato } = req.body;

  // update comprador
  const updatedComprador = await prisma.comprador.update({
    where: { id: Number(id) },
    data: {
      nome: nome,
      email: email,
      contato: contato,
    },
  });
  res.json(updatedComprador);
});
app.get("/compradors", async (req: Request, res: Response) => {
  const compradors = await prisma.comprador.findMany({
    include: { carros: true, compras: true },
  });
  res.json(compradors);
});

// Rota para excluir um veículo
app.delete("/carro/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  // check if carro exists
  const carro = await prisma.carro.findUnique({
    where: { id: Number(id) },
  });
  if (!carro) {
    return res.status(404).json({ message: "Carro not found" });
  }

  // delete carro
  await prisma.carro.delete({
    where: { id: Number(id) },
  });
  res.json({ message: "Carro deleted successfully" });
});

// Rota para editar um veículo
app.put("/carro/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { modelo, ano, compradorId } = req.body;

  // check if carro exists
  const carro = await prisma.carro.findUnique({
    where: { id: Number(id) },
  });
  if (!carro) {
    return res.status(404).json({ message: "Carro not found" });
  }

  // update carro
  const updatedCarro = await prisma.carro.update({
    where: { id: Number(id) },
    data: {
      modelo: modelo,
      ano: ano,
      compradorId: compradorId,
    },
  });
  res.json(updatedCarro);
});

// Rota para excluir um usuário
app.delete("/comprador/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  // check if comprador exists
  const comprador = await prisma.comprador.findUnique({
    where: { id: Number(id) },
  });
  if (!comprador) {
    return res.status(404).json({ message: "Comprador not found" });
  }

  // delete comprador
  await prisma.comprador.delete({
    where: { id: Number(id) },
  });
  res.json({ message: "Comprador deleted successfully" });
});

// Rota para editar um usuário
app.put("/comprador/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, email, contato } = req.body;

  // check if comprador exists
  const comprador = await prisma.comprador.findUnique({
    where: { id: Number(id) },
  });
  if (!comprador) {
    return res.status(404).json({ message: "Comprador not found" });
  }

  // update comprador
  const updatedComprador = await prisma.comprador.update({
    where: { id: Number(id) },
    data: {
      nome: nome,
      email: email,
      contato: contato,
    },
  });
  res.json(updatedComprador);
});

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
