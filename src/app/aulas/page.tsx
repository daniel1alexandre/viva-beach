import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { formatCurrency } from "@/lib/utils";
import {
  GraduationCap,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  AlertCircle,
  Plus,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AulasPage() {
  const classGroups = await prisma.classGroup.findMany({
    include: {
      professor: true,
      court: true,
      enrollments: {
        include: {
          customer: true,
          replacementCredits: true,
        },
      },
    },
    orderBy: { startTime: "asc" },
  });

  const professors = await prisma.user.findMany({
    where: { role: "PROFESSOR" },
  });

  const daysOfWeek = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header
        title="Aulas, Turmas e Mensalidades"
        subtitle="Substituição definitiva do Agil — Chamadas, reposições automáticas e contratos"
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Banner com Regras Homologadas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-arena-600" />
              <span>Regras de Negócio de Aulas da Arena VIVA (Homologadas)</span>
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              • <strong>Aviso prévio mínimo de 4 horas:</strong> cancelamento antecipado gera automaticamente 1 crédito de reposição e abre a vaga avulsa na turma.
              <br />
              • <strong>Limite:</strong> até 2 reposições acumuladas por mês (validade de 60 dias com mensalidade ativa).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-arena-600 hover:bg-arena-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Criar Nova Turma</span>
            </button>
          </div>
        </div>

        {/* Grade de Turmas Ativas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classGroups.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 text-sm">
              <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              Nenhuma turma cadastrada no momento.
            </div>
          ) : (
            classGroups.map((group) => {
              const vagasDisponiveis = group.maxStudents - group.enrollments.length;

              return (
                <div
                  key={group.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-arena-100 text-arena-800">
                        {group.sportType}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          vagasDisponiveis > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {vagasDisponiveis > 0 ? `${vagasDisponiveis} vagas livres` : "Lotada"}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base mt-2">
                      {group.name}
                    </h3>

                    <div className="text-xs text-slate-500 mt-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{daysOfWeek[group.dayOfWeek]} às {group.startTime} - {group.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Prof. {group.professor.name} • {group.court.name}</span>
                      </div>
                    </div>

                    {/* Alunos Matriculados */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-700 uppercase mb-2">
                        Alunos Matriculados ({group.enrollments.length}/{group.maxStudents}):
                      </div>

                      {group.enrollments.length === 0 ? (
                        <div className="text-[11px] text-slate-400 italic">Nenhum aluno matriculado ainda.</div>
                      ) : (
                        <div className="space-y-1.5">
                          {group.enrollments.map((enr) => (
                            <div
                              key={enr.id}
                              className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-50 border border-slate-100"
                            >
                              <span className="font-medium text-slate-800">{enr.customer.name}</span>
                              <span className="text-[10px] text-slate-500">{enr.planType}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">
                      {formatCurrency(group.monthlyPrice)} <span className="text-[10px] text-slate-400 font-normal">/mês</span>
                    </span>
                    <button className="text-xs font-bold text-arena-600 hover:text-arena-700">
                      Fazer Chamada →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

