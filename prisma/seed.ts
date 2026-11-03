import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed dos dados mestres da Arena VIVA...");

  // 1. Centros de Custo
  const costCenters = [
    { code: "01", name: "Locação de Quadras" },
    { code: "02", name: "Aulas e Turmas" },
    { code: "03", name: "Bar e Restaurante" },
    { code: "04", name: "Loja / Pro Shop" },
    { code: "05", name: "Eventos e Torneios" },
    { code: "06", name: "Administrativo e Geral" },
  ];

  for (const cc of costCenters) {
    await prisma.costCenter.upsert({
      where: { code: cc.code },
      update: {},
      create: cc,
    });
  }

  // 2. Contas Bancárias e de Recebíveis
  const bankAccounts = [
    { name: "Banco C6 (Principal)", initialBalance: 15000.0, currentBalance: 15000.0 },
    { name: "Mercado Pago (Pix Online)", initialBalance: 5200.0, currentBalance: 5200.0 },
    { name: "Nubank (Operacional)", initialBalance: 3400.0, currentBalance: 3400.0 },
    { name: "TON (Recebíveis Cartão)", initialBalance: 8900.0, currentBalance: 8900.0 },
    { name: "Caixa Físico Balcão", initialBalance: 600.0, currentBalance: 600.0 },
  ];

  for (const acc of bankAccounts) {
    const existing = await prisma.bankAccount.findFirst({ where: { name: acc.name } });
    if (!existing) {
      await prisma.bankAccount.create({ data: acc });
    }
  }

  // 3. Cadastro das 8 Quadras da Arena VIVA
  const courtsData = [
    { courtNumber: 1, name: "Quadra 1 - Central", covered: false, hasLighting: true },
    { courtNumber: 2, name: "Quadra 2 - Principal", covered: false, hasLighting: true },
    { courtNumber: 3, name: "Quadra 3 - Sol", covered: false, hasLighting: true },
    { courtNumber: 4, name: "Quadra 4 - Praia", covered: false, hasLighting: true },
    { courtNumber: 5, name: "Quadra 5 - Coberta A", covered: true, hasLighting: true },
    { courtNumber: 6, name: "Quadra 6 - Coberta B", covered: true, hasLighting: true },
    { courtNumber: 7, name: "Quadra 7 - Areia Branca", covered: false, hasLighting: true },
    { courtNumber: 8, name: "Quadra 8 - Sunset", covered: false, hasLighting: true },
  ];

  for (const court of courtsData) {
    await prisma.court.upsert({
      where: { courtNumber: court.courtNumber },
      update: court,
      create: {
        ...court,
        surface: "Areia",
        sportsSupported: "Beach Tennis, Vôlei de Praia, Futevôlei",
      },
    });
  }

  // 4. Usuários Iniciais (Admin, Gerente, Professor, Caixa)
  const users = [
    {
      name: "Administrador Arena VIVA",
      email: "admin@arenaviva.com.br",
      passwordHash: "hash_admin_123",
      role: "ADMIN",
      phone: "(11) 99999-0001",
    },
    {
      name: "Carlos Silveira (Gerente)",
      email: "gerencia@arenaviva.com.br",
      passwordHash: "hash_gerente_123",
      role: "GERENTE",
      phone: "(11) 99999-0002",
    },
    {
      name: "Professor Lucas Beach",
      email: "lucas.coach@arenaviva.com.br",
      passwordHash: "hash_prof_123",
      role: "PROFESSOR",
      phone: "(11) 99999-0003",
    },
    {
      name: "Mariana Caixa 1",
      email: "caixa1@arenaviva.com.br",
      passwordHash: "hash_caixa_123",
      role: "CAIXA",
      phone: "(11) 99999-0004",
    },
    {
      name: "Assessoria BPO Financeiro",
      email: "bpo@consultoriafinanceira.com.br",
      passwordHash: "hash_bpo_123",
      role: "BPO",
      phone: "(11) 99999-0005",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  // 5. Categorias e Produtos (Bar, Restaurante e Loja)
  const catBarBebidas = await prisma.category.create({
    data: { name: "Bebidas", type: "BAR" },
  });
  const catBarComidas = await prisma.category.create({
    data: { name: "Petiscos e Porções", type: "BAR" },
  });
  const catLoja = await prisma.category.create({
    data: { name: "Pro Shop Beach Tennis", type: "LOJA" },
  });

  const products = [
    {
      name: "Água Mineral Crystal 500ml",
      code: "BEB-001",
      categoryId: catBarBebidas.id,
      unitPrice: 6.0,
      costPrice: 1.8,
      stockQuantity: 120,
      minStock: 24,
      cashbackPct: 5.0,
    },
    {
      name: "Cerveja Corona Extra 330ml",
      code: "BEB-002",
      categoryId: catBarBebidas.id,
      unitPrice: 14.0,
      costPrice: 6.5,
      stockQuantity: 96,
      minStock: 24,
      cashbackPct: 5.0,
    },
    {
      name: "Isotônico Gatorade 500ml",
      code: "BEB-003",
      categoryId: catBarBebidas.id,
      unitPrice: 10.0,
      costPrice: 4.8,
      stockQuantity: 60,
      minStock: 15,
      cashbackPct: 5.0,
    },
    {
      name: "Açaí Tradicional 300ml c/ Granola",
      code: "COM-001",
      categoryId: catBarComidas.id,
      unitPrice: 22.0,
      costPrice: 9.0,
      stockQuantity: 40,
      minStock: 10,
      cashbackPct: 5.0,
    },
    {
      name: "Porção de Isca de Frango Crocante",
      code: "COM-002",
      categoryId: catBarComidas.id,
      unitPrice: 42.0,
      costPrice: 18.0,
      stockQuantity: 25,
      minStock: 5,
      cashbackPct: 5.0,
    },
    {
      name: "Tubo de Bolas Beach Tennis (3 Unidades)",
      code: "EQP-001",
      categoryId: catLoja.id,
      unitPrice: 65.0,
      costPrice: 38.0,
      stockQuantity: 30,
      minStock: 8,
      cashbackPct: 3.0,
    },
    {
      name: "Overgrip Profissional Absorvente",
      code: "EQP-002",
      categoryId: catLoja.id,
      unitPrice: 20.0,
      costPrice: 8.5,
      stockQuantity: 50,
      minStock: 10,
      cashbackPct: 3.0,
    },
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  // 6. Clientes Iniciais com Carteira de Cashback
  const customers = [
    {
      name: "Rodrigo Almeida",
      email: "rodrigo.almeida@email.com",
      phone: "(11) 98765-4321",
      cpf: "123.456.789-01",
      walletBalance: 45.0, // R$ 45 de saldo cashback acumulado
      status: "ATIVO",
    },
    {
      name: "Camila Fernandes",
      email: "camila.bt@email.com",
      phone: "(11) 98765-1122",
      cpf: "234.567.890-12",
      walletBalance: 28.5,
      status: "ATIVO",
    },
    {
      name: "Gabriel Martins (Mensalista Quadra 2)",
      email: "gabriel.m@email.com",
      phone: "(11) 98765-9988",
      cpf: "345.678.901-23",
      walletBalance: 60.0,
      status: "ATIVO",
    },
  ];

  for (const cust of customers) {
    await prisma.customer.create({ data: cust });
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
