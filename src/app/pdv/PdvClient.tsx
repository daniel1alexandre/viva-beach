"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  QrCode,
  Banknote,
  Sparkles,
  Search,
  Store,
  User,
  CheckCircle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  code: string | null;
  unitPrice: number;
  stockQuantity: number;
  cashbackPct: number;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

interface Customer {
  id: string;
  name: string;
  walletBalance: number;
  phone: string;
}

interface CashRegister {
  id: string;
  registerNumber: number;
  status: string;
  operator: { name: string };
}

interface CartItem {
  product: Product;
  quantity: number;
}

export function PdvClient({
  initialProducts,
  categories,
  customers,
  cashRegisters,
}: {
  initialProducts: Product[];
  categories: Category[];
  customers: Customer[];
  cashRegisters: CashRegister[];
}) {
  const [selectedRegister, setSelectedRegister] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [useCashback, setUseCashback] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [saleFinished, setSaleFinished] = useState(false);

  // Filtragem de produtos
  const filteredProducts = initialProducts.filter((p) => {
    const matchCategory = selectedCategory === "ALL" || p.categoryId === selectedCategory;
    const matchQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchQuery;
  });

  // Operações de Carrinho
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setUseCashback(false);
  };

  // Cálculos Financeiros
  const subtotal = cart.reduce((acc, item) => acc + item.product.unitPrice * item.quantity, 0);

  // Cashback gerado nesta compra (ex: 5%)
  const cashbackGerado = cart.reduce(
    (acc, item) => acc + (item.product.unitPrice * item.quantity * item.product.cashbackPct) / 100,
    0
  );

  // Desconto de Cashback aplicado da carteira do cliente
  const cashbackAplicado =
    useCashback && selectedCustomer
      ? Math.min(selectedCustomer.walletBalance, subtotal)
      : 0;

  const total = Math.max(0, subtotal - cashbackAplicado);

  const handleFinishSale = () => {
    if (cart.length === 0) return;
    setSaleFinished(true);
    setTimeout(() => {
      setSaleFinished(false);
      clearCart();
    }, 2500);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto">
      {/* Coluna Esquerda: Catálogo & Seleção de Caixa */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Seletor de Caixa de Torneio (Caixa 1, 2 ou 3) */}
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold text-slate-800">Ponto de Atendimento / Caixa:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((num) => {
              const reg = cashRegisters.find((r) => r.registerNumber === num);
              const isActive = selectedRegister === num;
              return (
                <button
                  key={num}
                  onClick={() => setSelectedRegister(num)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-arena-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  Caixa {num} {num > 1 ? "(Torneio)" : "(Principal)"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Barra de Busca e Categorias */}
        <div className="p-3 border-b border-slate-200 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nome ou código do produto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-arena-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors ${
                selectedCategory === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todos os Itens
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grade de Produtos */}
        <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 content-start">
          {filteredProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              className="p-3 text-left rounded-xl border border-slate-200 hover:border-arena-400 hover:shadow-sm bg-white hover:bg-arena-50/20 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">{p.code}</span>
                <span className="text-xs font-semibold text-slate-900 line-clamp-2 mt-0.5">
                  {p.name}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(p.unitPrice)}
                </span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                  +{p.cashbackPct}% CB
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Coluna Direita: Comanda Aberta & Checkout com Cashback */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cabeçalho da Comanda */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-arena-400" />
            <span className="text-sm font-bold">Comanda Atual (Caixa {selectedRegister})</span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-300 hover:text-white transition-colors"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Identificação do Cliente (CRM & Carteira) */}
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Cliente & Carteira:
            </span>
          </div>

          <select
            value={selectedCustomer?.id || ""}
            onChange={(e) => {
              const cust = customers.find((c) => c.id === e.target.value) || null;
              setSelectedCustomer(cust);
              setUseCashback(false);
            }}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-arena-500"
          >
            <option value="">Cliente Balcão (Sem cadastro)</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — Saldo: {formatCurrency(c.walletBalance)}
              </option>
            ))}
          </select>

          {/* Opção de Resgatar Cashback */}
          {selectedCustomer && selectedCustomer.walletBalance > 0 && (
            <div className="mt-2 p-2 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-purple-900 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Usar saldo ({formatCurrency(selectedCustomer.walletBalance)})</span>
              </div>
              <input
                type="checkbox"
                checked={useCashback}
                onChange={(e) => setUseCashback(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
            </div>
          )}
        </div>

        {/* Itens do Carrinho */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-slate-300" />
              <span>Nenhum produto adicionado à comanda.</span>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div className="flex-1 pr-2">
                  <div className="font-semibold text-slate-900 truncate">{item.product.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {formatCurrency(item.product.unitPrice)} un.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1 text-slate-500 hover:bg-slate-100 rounded-l"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1 text-slate-500 hover:bg-slate-100 rounded-r"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-bold text-slate-900 w-16 text-right">
                    {formatCurrency(item.product.unitPrice * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Fechamento & Pagamento */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 space-y-3">
          {/* Formas de Pagamento */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
              Forma de Pagamento:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "PIX", label: "Pix", icon: QrCode },
                { id: "CARTAO", label: "Cartão TON", icon: CreditCard },
                { id: "DINHEIRO", label: "Dinheiro", icon: Banknote },
              ].map((m) => {
                const Icon = m.icon;
                const isSel = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                      isSel
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumo de Valores */}
          <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-200">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            {cashbackAplicado > 0 && (
              <div className="flex justify-between text-purple-700 font-medium">
                <span>Desconto Carteira (Cashback):</span>
                <span>-{formatCurrency(cashbackAplicado)}</span>
              </div>
            )}
            {cashbackGerado > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Cashback a Receber:</span>
                <span>+{formatCurrency(cashbackGerado)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1">
              <span>Total a Pagar:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Botão de Finalizar */}
          {saleFinished ? (
            <div className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-center text-xs flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Venda Concluída com Sucesso!</span>
            </div>
          ) : (
            <button
              disabled={cart.length === 0}
              onClick={handleFinishSale}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md ${
                cart.length > 0
                  ? "bg-arena-600 hover:bg-arena-500 text-white shadow-arena-600/30"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              Finalizar Venda • {formatCurrency(total)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
