"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Package,
  TrendingUp,
  Tag,
  X,
  Search,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  code: string | null;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minStock: number;
  cashbackPct: number;
  category: Category;
}

export function LojaClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [costPrice, setCostPrice] = useState("10.00");
  const [unitPrice, setUnitPrice] = useState("25.00");
  const [stockQuantity, setStockQuantity] = useState("20");
  const [minStock, setMinStock] = useState("5");
  const [cashbackPct, setCashbackPct] = useState("5.0");

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStock).length;
  const totalStockValue = products.reduce((acc, p) => acc + p.stockQuantity * p.unitPrice, 0);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === categoryId) || { id: "c1", name: "Geral" };

    const newProd: Product = {
      id: "prod-" + Date.now(),
      name,
      code: code || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      costPrice: parseFloat(costPrice) || 0,
      unitPrice: parseFloat(unitPrice) || 0,
      stockQuantity: parseInt(stockQuantity) || 0,
      minStock: parseInt(minStock) || 5,
      cashbackPct: parseFloat(cashbackPct) || 0,
      category: cat,
    };

    setProducts((prev) => [newProd, ...prev]);
    setIsNewModalOpen(false);
    showToast(`Produto "${name}" cadastrado com sucesso!`);

    setName("");
    setCode("");
  };

  const handleAdjustStock = (prodId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === prodId) {
          const updated = Math.max(0, p.stockQuantity + delta);
          return { ...p, stockQuantity: updated };
        }
        return p;
      })
    );
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Barra Superior */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por produto ou código SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-arena-500"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* 3 Cards de Indicadores de Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Total de Itens Cadastrados
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{products.length}</div>
          <div className="text-xs text-slate-500 mt-1">Bar, Restaurante e Pro Shop</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Valor Total do Estoque (Preço de Venda)
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(totalStockValue)}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Ativo circulante</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Alertas de Estoque Mínimo
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">{lowStockCount}</div>
          <div className="text-xs text-amber-700 font-medium mt-1">
            {lowStockCount > 0 ? "Itens precisando de reposição" : "Todos os níveis adequados"}
          </div>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Catálogo de Produtos e Níveis de Estoque</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <th className="p-3">Código / Produto</th>
                <th className="p-3">Categoria</th>
                <th className="p-3 text-right">Preço de Custo</th>
                <th className="p-3 text-right">Preço de Venda</th>
                <th className="p-3 text-center">Cashback (%)</th>
                <th className="p-3 text-center">Estoque Atual</th>
                <th className="p-3 text-center">Ajuste Rápido</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const isLowStock = p.stockQuantity <= p.minStock;

                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{p.code}</div>
                    </td>
                    <td className="p-3 text-slate-600">{p.category.name}</td>
                    <td className="p-3 text-right text-slate-500">{formatCurrency(p.costPrice)}</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {formatCurrency(p.unitPrice)}
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {p.cashbackPct}%
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800">
                      {p.stockQuantity} un.
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p.id, -1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p.id, 1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isLowStock
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isLowStock ? "Estoque Baixo" : "Normal"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Produto */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-arena-600" />
                <span>Cadastrar Novo Produto</span>
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Raquete Beach Tennis Carbono Pro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código / SKU</label>
                  <input
                    type="text"
                    placeholder="Ex: RAQ-001"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoria:</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preço de Custo (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preço de Venda (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Qtd. Inicial:</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estoque Mín.:</label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">% Cashback:</label>
                  <input
                    type="number"
                    value={cashbackPct}
                    onChange={(e) => setCashbackPct(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-purple-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold shadow-md shadow-arena-600/30"
                >
                  Cadastrar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

