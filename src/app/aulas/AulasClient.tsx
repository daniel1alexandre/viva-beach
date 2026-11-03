"use client";

import { useState } from "react";
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
  X,
  Check,
} from "lucide-react";

interface Professor {
  id: string;
  name: string;
}

interface Court {
  id: string;
  name: string;
}

interface Enrollment {
  id: string;
  planType: string;
  customer: {
    id: string;
    name: string;
  };
}

interface ClassGroup {
  id: string;
  name: string;
  sportType: string;
  level: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxStudents: number;
  monthlyPrice: number;
  professor: Professor;
  court: Court;
  enrollments: Enrollment[];
}

export function AulasClient({
  initialClassGroups,
  professors,
  courts,
}: {
  initialClassGroups: ClassGroup[];
  professors: Professor[];
  courts: Court[];
}) {
  const [classes, setClasses] = useState<ClassGroup[]>(initialClassGroups);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [activeCallClass, setActiveCallClass] = useState<ClassGroup | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  // Form de Nova Turma
  const [name, setName] = useState("");
  const [sportType, setSportType] = useState("Beach Tennis");
  const [level, setLevel] = useState("Iniciante");
  const [professorId, setProfessorId] = useState(professors[0]?.id || "");
  const [courtId, setCourtId] = useState(courts[0]?.id || "");
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("20:00");
  const [maxStudents, setMaxStudents] = useState("6");
  const [monthlyPrice, setMonthlyPrice] = useState("350");

  const daysOfWeek = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"
  ];

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const prof = professors.find((p) => p.id === professorId) || { id: "p1", name: "Professor Arena" };
    const court = courts.find((c) => c.id === courtId) || { id: "c1", name: "Quadra 1" };

    const newGroup: ClassGroup = {
      id: "class-" + Date.now(),
      name,
      sportType,
      level,
      professor: prof,
      court: court,
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
      maxStudents: parseInt(maxStudents) || 6,
      monthlyPrice: parseFloat(monthlyPrice) || 350,
      enrollments: [],
    };

    setClasses((prev) => [...prev, newGroup]);
    setIsNewClassModalOpen(false);
    showToast(`Turma "${name}" criada com sucesso para ${daysOfWeek[dayOfWeek]} às ${startTime}!`);

    setName("");
  };

  const handleOpenAttendance = (group: ClassGroup) => {
    setActiveCallClass(group);
    // Inicia todos como PRESENTE por padrão
    const initialAtt: Record<string, string> = {};
    group.enrollments.forEach((e) => {
      initialAtt[e.id] = "PRESENTE";
    });
    setAttendanceRecords(initialAtt);
  };

  const handleSaveAttendance = () => {
    if (!activeCallClass) return;

    let reposicoesGeradas = 0;
    Object.values(attendanceRecords).forEach((status) => {
      if (status === "FALTA_COM_AVISO") reposicoesGeradas++;
    });

    setActiveCallClass(null);
    showToast(
      `Chamada da turma "${activeCallClass.name}" finalizada! ${
        reposicoesGeradas > 0
          ? `${reposicoesGeradas} crédito(s) de reposição liberados automaticamente para os alunos com falta avisada.`
          : "Todos os presentes registrados."
      }`
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

      {/* Banner de Ação */}
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

        <button
          type="button"
          onClick={() => setIsNewClassModalOpen(true)}
          className="bg-arena-600 hover:bg-arena-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Turma</span>
        </button>
      </div>

      {/* Grade de Turmas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((group) => {
          const vagasDisponiveis = group.maxStudents - group.enrollments.length;

          return (
            <div
              key={group.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-arena-100 text-arena-800">
                    {group.sportType} • {group.level}
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
                <button
                  type="button"
                  onClick={() => handleOpenAttendance(group)}
                  className="text-xs font-bold text-arena-600 hover:text-arena-700 bg-arena-50 hover:bg-arena-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Fazer Chamada →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Criar Nova Turma */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-arena-600" />
                <span>Cadastrar Nova Turma</span>
              </h3>
              <button
                onClick={() => setIsNewClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome da Turma *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Beach Tennis Intermediário Noite"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modalidade:</label>
                  <select
                    value={sportType}
                    onChange={(e) => setSportType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="Beach Tennis">Beach Tennis</option>
                    <option value="Futevôlei">Futevôlei</option>
                    <option value="Vôlei de Praia">Vôlei de Praia</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nível:</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Professor Responsável:</label>
                  <select
                    value={professorId}
                    onChange={(e) => setProfessorId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    {professors.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quadra Fixa:</label>
                  <select
                    value={courtId}
                    onChange={(e) => setCourtId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    {courts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dia da Semana:</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
                  >
                    {daysOfWeek.map((d, idx) => (
                      <option key={idx} value={idx}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Início:</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Término:</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Máx. de Alunos (Vagas):</label>
                  <input
                    type="number"
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mensalidade (R$):</label>
                  <input
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewClassModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold shadow-md shadow-arena-600/30"
                >
                  Salvar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chamada Digital & Reposições Automáticas */}
      {activeCallClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Lista de Presença & Chamada Digital</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Turma: {activeCallClass.name} • Prof. {activeCallClass.professor.name}
                </p>
              </div>
              <button
                onClick={() => setActiveCallClass(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                <strong>Regra de Negócio:</strong> Alunos com <em>Falta com Aviso (&ge; 4h)</em> recebem 1 crédito automático no perfil para repor em até 60 dias e a vaga é liberada para outro aluno repor hoje.
              </div>

              {activeCallClass.enrollments.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  Nenhum aluno matriculado nesta turma para realizar chamada.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeCallClass.enrollments.map((enr) => {
                    const currentStatus = attendanceRecords[enr.id] || "PRESENTE";

                    return (
                      <div
                        key={enr.id}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between"
                      >
                        <span className="font-bold text-slate-900">{enr.customer.name}</span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceRecords((prev) => ({ ...prev, [enr.id]: "PRESENTE" }))
                            }
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              currentStatus === "PRESENTE"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200"
                            }`}
                          >
                            Presente
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceRecords((prev) => ({ ...prev, [enr.id]: "FALTA_COM_AVISO" }))
                            }
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              currentStatus === "FALTA_COM_AVISO"
                                ? "bg-amber-600 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200"
                            }`}
                          >
                            Falta c/ Aviso (Crédito)
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceRecords((prev) => ({ ...prev, [enr.id]: "FALTA_SEM_AVISO" }))
                            }
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              currentStatus === "FALTA_SEM_AVISO"
                                ? "bg-rose-600 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200"
                            }`}
                          >
                            Sem Aviso
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveCallClass(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="px-5 py-2.5 rounded-xl bg-arena-600 hover:bg-arena-500 text-white font-bold shadow-md shadow-arena-600/30"
                >
                  Salvar e Processar Reposições
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

