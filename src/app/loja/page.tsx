import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Package,
  TrendingUp,
  Tag,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LojaPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { stockQuantity: "asc" },
  });

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStock).length;
  const totalStockValue = products.reduce((acc, p) => acc + p.stockQuantity * p.unitPrice, 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Loja (Pro Shop) & Controle de Estoque"
        subtitle="Equipamentos, vestuário, bolas e bebidas com alertas de estoque mínimo"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Barra Superior */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-arena-600" />
              <span>Gestão de Inventário e Produtos</span>
            </h2>
            <p className="text-xs text-slate-500">
              Controle integrado com saídas no PDV e reposição de fornecedores.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-arena-600 hover:bg-arena-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </button>
          </div>
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
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
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
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
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
      </div>
    </div>
  );
}
