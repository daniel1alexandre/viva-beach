import { prisma } from "./prisma";

// Dados padrão de segurança para caso o banco de dados não esteja conectado (ex: ambiente serverless Vercel)
export const DEFAULT_COURTS = [
  { id: "c1", courtNumber: 1, name: "Quadra 1 - Central", covered: false, surface: "Areia", hasLighting: true },
  { id: "c2", courtNumber: 2, name: "Quadra 2 - Principal", covered: false, surface: "Areia", hasLighting: true },
  { id: "c3", courtNumber: 3, name: "Quadra 3 - Sol", covered: false, surface: "Areia", hasLighting: true },
  { id: "c4", courtNumber: 4, name: "Quadra 4 - Praia", covered: false, surface: "Areia", hasLighting: true },
  { id: "c5", courtNumber: 5, name: "Quadra 5 - Coberta A", covered: true, surface: "Areia", hasLighting: true },
  { id: "c6", courtNumber: 6, name: "Quadra 6 - Coberta B", covered: true, surface: "Areia", hasLighting: true },
  { id: "c7", courtNumber: 7, name: "Quadra 7 - Areia Branca", covered: false, surface: "Areia", hasLighting: true },
  { id: "c8", courtNumber: 8, name: "Quadra 8 - Sunset", covered: false, surface: "Areia", hasLighting: true },
];

export const DEFAULT_CUSTOMERS = [
  {
    id: "cust-1",
    name: "Rodrigo Almeida",
    email: "rodrigo.almeida@email.com",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-01",
    status: "ATIVO",
    walletBalance: 45.0,
    courtBookings: [{ id: "b1" }],
    classEnrollments: [{ id: "e1" }],
  },
  {
    id: "cust-2",
    name: "Camila Fernandes",
    email: "camila.bt@email.com",
    phone: "(11) 98765-1122",
    cpf: "234.567.890-12",
    status: "ATIVO",
    walletBalance: 28.5,
    courtBookings: [{ id: "b2" }],
    classEnrollments: [{ id: "e2" }],
  },
  {
    id: "cust-3",
    name: "Gabriel Martins (Mensalista)",
    email: "gabriel.m@email.com",
    phone: "(11) 98765-9988",
    cpf: "345.678.901-23",
    status: "ATIVO",
    walletBalance: 60.0,
    courtBookings: [{ id: "b3" }],
    classEnrollments: [],
  },
];

export const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "Bebidas", type: "BAR" },
  { id: "cat-2", name: "Petiscos e Porções", type: "BAR" },
  { id: "cat-3", name: "Pro Shop Beach Tennis", type: "LOJA" },
];

export const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "Água Mineral Crystal 500ml",
    code: "BEB-001",
    categoryId: "cat-1",
    unitPrice: 6.0,
    costPrice: 1.8,
    stockQuantity: 120,
    minStock: 24,
    cashbackPct: 5.0,
    category: { id: "cat-1", name: "Bebidas" },
  },
  {
    id: "p2",
    name: "Cerveja Corona Extra 330ml",
    code: "BEB-002",
    categoryId: "cat-1",
    unitPrice: 14.0,
    costPrice: 6.5,
    stockQuantity: 96,
    minStock: 24,
    cashbackPct: 5.0,
    category: { id: "cat-1", name: "Bebidas" },
  },
  {
    id: "p3",
    name: "Isotônico Gatorade 500ml",
    code: "BEB-003",
    categoryId: "cat-1",
    unitPrice: 10.0,
    costPrice: 4.8,
    stockQuantity: 60,
    minStock: 15,
    cashbackPct: 5.0,
    category: { id: "cat-1", name: "Bebidas" },
  },
  {
    id: "p4",
    name: "Açaí Tradicional 300ml c/ Granola",
    code: "COM-001",
    categoryId: "cat-2",
    unitPrice: 22.0,
    costPrice: 9.0,
    stockQuantity: 40,
    minStock: 10,
    cashbackPct: 5.0,
    category: { id: "cat-2", name: "Petiscos e Porções" },
  },
  {
    id: "p5",
    name: "Porção de Isca de Frango Crocante",
    code: "COM-002",
    categoryId: "cat-2",
    unitPrice: 42.0,
    costPrice: 18.0,
    stockQuantity: 25,
    minStock: 5,
    cashbackPct: 5.0,
    category: { id: "cat-2", name: "Petiscos e Porções" },
  },
  {
    id: "p6",
    name: "Tubo de Bolas Beach Tennis (3 Unidades)",
    code: "EQP-001",
    categoryId: "cat-3",
    unitPrice: 65.0,
    costPrice: 38.0,
    stockQuantity: 30,
    minStock: 8,
    cashbackPct: 3.0,
    category: { id: "cat-3", name: "Pro Shop Beach Tennis" },
  },
  {
    id: "p7",
    name: "Overgrip Profissional Absorvente",
    code: "EQP-002",
    categoryId: "cat-3",
    unitPrice: 20.0,
    costPrice: 8.5,
    stockQuantity: 50,
    minStock: 10,
    cashbackPct: 3.0,
    category: { id: "cat-3", name: "Pro Shop Beach Tennis" },
  },
];

export const DEFAULT_BANK_ACCOUNTS = [
  { id: "b1", name: "Banco C6 (Principal)", initialBalance: 15000.0, currentBalance: 15000.0 },
  { id: "b2", name: "Mercado Pago (Pix Online)", initialBalance: 5200.0, currentBalance: 5200.0 },
  { id: "b3", name: "Nubank (Operacional)", initialBalance: 3400.0, currentBalance: 3400.0 },
  { id: "b4", name: "TON (Recebíveis Cartão)", initialBalance: 8900.0, currentBalance: 8900.0 },
  { id: "b5", name: "Caixa Físico Balcão", initialBalance: 600.0, currentBalance: 600.0 },
];

export const DEFAULT_COST_CENTERS = [
  { id: "cc-1", code: "01", name: "Locação de Quadras" },
  { id: "cc-2", code: "02", name: "Aulas e Turmas" },
  { id: "cc-3", code: "03", name: "Bar e Restaurante" },
  { id: "cc-4", code: "04", name: "Loja / Pro Shop" },
  { id: "cc-5", code: "05", name: "Eventos e Torneios" },
  { id: "cc-6", code: "06", name: "Administrativo e Geral" },
];

export const DEFAULT_PROFESSORS = [
  { id: "prof-1", name: "Professor Lucas Beach", email: "lucas.coach@arenaviva.com.br", role: "PROFESSOR" },
  { id: "prof-2", name: "Professor Mateus Futevôlei", email: "mateus@arenaviva.com.br", role: "PROFESSOR" },
];

export const DEFAULT_CLASS_GROUPS = [
  {
    id: "cg-1",
    name: "Beach Tennis Intermediário Noite",
    sportType: "Beach Tennis",
    level: "Intermediário",
    dayOfWeek: 2, // Terça
    startTime: "19:00",
    endTime: "20:00",
    maxStudents: 6,
    monthlyPrice: 380.0,
    professor: { id: "prof-1", name: "Professor Lucas Beach" },
    court: { id: "c1", name: "Quadra 1 - Central" },
    enrollments: [
      { id: "enr-1", planType: "MENSAL", customer: { id: "cust-1", name: "Rodrigo Almeida" } },
      { id: "enr-2", planType: "SEMESTRAL", customer: { id: "cust-2", name: "Camila Fernandes" } },
    ],
  },
  {
    id: "cg-2",
    name: "Iniciantes de Futevôlei Manhã",
    sportType: "Futevôlei",
    level: "Iniciante",
    dayOfWeek: 4, // Quinta
    startTime: "08:00",
    endTime: "09:00",
    maxStudents: 6,
    monthlyPrice: 320.0,
    professor: { id: "prof-2", name: "Professor Mateus Futevôlei" },
    court: { id: "c2", name: "Quadra 2 - Principal" },
    enrollments: [
      { id: "enr-3", planType: "MENSAL", customer: { id: "cust-3", name: "Gabriel Martins" } },
    ],
  },
];

export const DEFAULT_BOOKINGS = [
  {
    id: "bk-1",
    courtId: "c1",
    startTime: "18:00",
    endTime: "19:00",
    sportType: "Beach Tennis",
    bookingType: "AVULSA",
    status: "CONFIRMADA",
    totalAmount: 110.0,
    paidAmount: 110.0,
    paymentStatus: "PAGO",
    customer: { name: "Rodrigo Almeida" },
    court: { id: "c1", courtNumber: 1, name: "Quadra 1 - Central", covered: false, surface: "Areia", hasLighting: true },
  },
  {
    id: "bk-2",
    courtId: "c2",
    startTime: "19:00",
    endTime: "20:00",
    sportType: "Beach Tennis",
    bookingType: "RECORRENTE_MENSALISTA",
    status: "CONFIRMADA",
    totalAmount: 100.0,
    paidAmount: 100.0,
    paymentStatus: "PAGO",
    customer: { name: "Gabriel Martins (Mensalista)" },
    court: { id: "c2", courtNumber: 2, name: "Quadra 2 - Principal", covered: false, surface: "Areia", hasLighting: true },
  },
  {
    id: "bk-3",
    courtId: "c5",
    startTime: "20:00",
    endTime: "21:00",
    sportType: "Beach Tennis",
    bookingType: "AVULSA",
    status: "PENDENTE_SINAL",
    totalAmount: 120.0,
    paidAmount: 50.0,
    paymentStatus: "PAGO_PARCIAL",
    customer: { name: "Camila Fernandes" },
    court: { id: "c5", courtNumber: 5, name: "Quadra 5 - Coberta A", covered: true, surface: "Areia", hasLighting: true },
  },
];

export const DEFAULT_CASH_REGISTERS = [
  { id: "cr-1", registerNumber: 1, status: "ABERTO", initialBalance: 300.0, calculatedBalance: 300.0, operator: { name: "Mariana Caixa 1" } },
  { id: "cr-2", registerNumber: 2, status: "FECHADO", initialBalance: 0.0, calculatedBalance: 0.0, operator: { name: "Operador Torneio" } },
  { id: "cr-3", registerNumber: 3, status: "FECHADO", initialBalance: 0.0, calculatedBalance: 0.0, operator: { name: "Operador Torneio" } },
];

export const DEFAULT_ORDER_TABS = [
  {
    id: "tab-1",
    tabNumber: 1,
    status: "ABERTA",
    subtotal: 68.0,
    totalAmount: 68.0,
    customer: { name: "Rodrigo Almeida" },
    items: [
      { id: "ti-1", quantity: 2, unitPrice: 14.0, totalPrice: 28.0, product: { name: "Cerveja Corona Extra 330ml" } },
      { id: "ti-2", quantity: 1, unitPrice: 40.0, totalPrice: 40.0, product: { name: "Porção de Isca de Frango" } },
    ],
  },
  {
    id: "tab-4",
    tabNumber: 4,
    status: "ABERTA",
    subtotal: 36.0,
    totalAmount: 36.0,
    customer: { name: "Camila Fernandes" },
    items: [
      { id: "ti-3", quantity: 1, unitPrice: 22.0, totalPrice: 22.0, product: { name: "Açaí Tradicional 300ml" } },
      { id: "ti-4", quantity: 2, unitPrice: 7.0, totalPrice: 14.0, product: { name: "Água Mineral 500ml" } },
    ],
  },
  {
    id: "tab-7",
    tabNumber: 7,
    status: "ABERTA",
    subtotal: 142.0,
    totalAmount: 142.0,
    customer: { name: "Mesa 3 (Torneio BT)" },
    items: [
      { id: "ti-5", quantity: 6, unitPrice: 14.0, totalPrice: 84.0, product: { name: "Cerveja Corona Extra 330ml" } },
      { id: "ti-6", quantity: 1, unitPrice: 58.0, totalPrice: 58.0, product: { name: "Combo Petiscos Especial" } },
    ],
  },
  {
    id: "tab-12",
    tabNumber: 12,
    status: "EM_PAGAMENTO",
    subtotal: 54.0,
    totalAmount: 54.0,
    customer: { name: "Gabriel Martins" },
    items: [
      { id: "ti-7", quantity: 1, unitPrice: 42.0, totalPrice: 42.0, product: { name: "Porção de Frango Crocante" } },
      { id: "ti-8", quantity: 2, unitPrice: 6.0, totalPrice: 12.0, product: { name: "Água Mineral 500ml" } },
    ],
  },
];

// Funções seguras de leitura com fallback automático
export async function getSafeCourts() {
  try {
    if (!prisma?.court) return DEFAULT_COURTS;
    const data = await prisma.court.findMany({ orderBy: { courtNumber: "asc" } });
    return data && data.length > 0 ? data : DEFAULT_COURTS;
  } catch (err) {
    return DEFAULT_COURTS;
  }
}

export async function getSafeCustomers() {
  try {
    if (!prisma?.customer) return DEFAULT_CUSTOMERS;
    const data = await prisma.customer.findMany({
      include: { courtBookings: true, classEnrollments: true },
      orderBy: { name: "asc" },
    });
    return data && data.length > 0 ? data : DEFAULT_CUSTOMERS;
  } catch (err) {
    return DEFAULT_CUSTOMERS;
  }
}

export async function getSafeBookings() {
  try {
    if (!prisma?.courtBooking) return DEFAULT_BOOKINGS;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const data = await prisma.courtBooking.findMany({
      where: { date: { gte: today, lt: tomorrow } },
      include: { court: true, customer: true },
      orderBy: { startTime: "asc" },
    });
    return data && data.length > 0 ? data : DEFAULT_BOOKINGS;
  } catch (err) {
    return DEFAULT_BOOKINGS;
  }
}

export async function getSafeProducts() {
  try {
    if (!prisma?.product) return DEFAULT_PRODUCTS;
    const data = await prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { name: "asc" },
    });
    return data && data.length > 0 ? data : DEFAULT_PRODUCTS;
  } catch (err) {
    return DEFAULT_PRODUCTS;
  }
}

export async function getSafeCategories() {
  try {
    if (!prisma?.category) return DEFAULT_CATEGORIES;
    const data = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return data && data.length > 0 ? data : DEFAULT_CATEGORIES;
  } catch (err) {
    return DEFAULT_CATEGORIES;
  }
}

export async function getSafeBankAccounts() {
  try {
    if (!prisma?.bankAccount) return DEFAULT_BANK_ACCOUNTS;
    const data = await prisma.bankAccount.findMany({ where: { active: true }, orderBy: { name: "asc" } });
    return data && data.length > 0 ? data : DEFAULT_BANK_ACCOUNTS;
  } catch (err) {
    return DEFAULT_BANK_ACCOUNTS;
  }
}

export async function getSafeCostCenters() {
  try {
    if (!prisma?.costCenter) return DEFAULT_COST_CENTERS;
    const data = await prisma.costCenter.findMany({ orderBy: { code: "asc" } });
    return data && data.length > 0 ? data : DEFAULT_COST_CENTERS;
  } catch (err) {
    return DEFAULT_COST_CENTERS;
  }
}

export async function getSafeClassGroups() {
  try {
    if (!prisma?.classGroup) return DEFAULT_CLASS_GROUPS as any;
    const data = await prisma.classGroup.findMany({
      include: {
        professor: true,
        court: true,
        enrollments: { include: { customer: true } },
      },
      orderBy: { startTime: "asc" },
    });
    return data && data.length > 0 ? data : (DEFAULT_CLASS_GROUPS as any);
  } catch (err) {
    return DEFAULT_CLASS_GROUPS as any;
  }
}

export async function getSafeProfessors() {
  try {
    if (!prisma?.user) return DEFAULT_PROFESSORS;
    const data = await prisma.user.findMany({ where: { role: "PROFESSOR" } });
    return data && data.length > 0 ? data : DEFAULT_PROFESSORS;
  } catch (err) {
    return DEFAULT_PROFESSORS;
  }
}

export async function getSafeCashRegisters() {
  try {
    if (!prisma?.cashRegister) return DEFAULT_CASH_REGISTERS as any;
    const data = await prisma.cashRegister.findMany({ include: { operator: true } });
    return data && data.length > 0 ? data : (DEFAULT_CASH_REGISTERS as any);
  } catch (err) {
    return DEFAULT_CASH_REGISTERS as any;
  }
}

export async function getSafeOrderTabs() {
  try {
    if (!prisma?.orderTab) return DEFAULT_ORDER_TABS as any;
    const data = await prisma.orderTab.findMany({
      include: {
        customer: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { tabNumber: "asc" },
    });
    return data && data.length > 0 ? data : (DEFAULT_ORDER_TABS as any);
  } catch (err) {
    return DEFAULT_ORDER_TABS as any;
  }
}

