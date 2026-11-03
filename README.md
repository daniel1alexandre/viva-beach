# 🏖️ Arena VIVA by Baumann — ERP de Gestão Esportiva

ERP completo e integrado desenvolvido para a **Arena VIVA by Baumann** (8 quadras de areia, bar/restaurante, pro shop, turmas/aulas, eventos e financeiro).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ (testado no Node.js v24)
- npm

### Passo a Passo

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Sincronizar Banco de Dados (SQLite com Prisma):**
   ```bash
   npx prisma db push
   node prisma/seed.mjs
   ```

3. **Iniciar o Servidor em Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse no navegador: [http://localhost:3000](http://localhost:3000)

4. **Visualizar e editar dados no Prisma Studio (opcional):**
   ```bash
   npm run db:studio
   ```

---

## 🏗️ Estrutura e Módulos Implementados

1. **Painel de Gestão Executiva (`/`):**
   - Vendas e recebimentos do dia em tempo real.
   - Saldo consolidado das contas bancárias (C6, Nubank, Mercado Pago, TON).
   - Termômetro de ocupação das 8 quadras (cobertas vs. descobertas).
   - Alertas operacionais e atalhos rápidos.

2. **Agenda & Locação das 8 Quadras (`/quadras`):**
   - Grade horária das 06:00 às 23:00.
   - Suporte a reservas avulsas e mensalistas recorrentes.
   - **Protocolo de Chuva / Intempéries:** geração automática de créditos em horas para remarcação em até 60 dias.

3. **Frente de Caixa & PDV Multi-Caixa (`/pdv`):**
   - Operação de 1 caixa em dias comuns e **até 3 caixas simultâneos** em torneios e grandes eventos.
   - Comanda unificada em tempo real.
   - **Programa de Fidelidade / Cashback:** acúmulo automático de saldo na carteira digital do cliente e abatimento no checkout.
   - Pagamentos divididos: Pix, Cartão TON e Dinheiro.

4. **Aulas, Turmas e Mensalidades (`/aulas`):**
   - Substituição do sistema *Agil*.
   - Chamada digital e controle de presenças.
   - **Regra de Falta e Reposição:** aviso com $\ge 4$ horas gera crédito de reposição e abre a vaga avulsa na turma.

5. **Gestão Financeira, DRE & Comissões (`/financeiro`):**
   - Substituição do sistema *Trio*.
   - DRE Gerencial por Centro de Custo (Quadras, Aulas, Bar, Loja, Eventos).
   - Apuração de comissões por colaborador/professor com base em parcelas pagas.
   - Exportação e relatórios compatíveis com a assessoria **BPO / Conta Azul**.

6. **Clientes & CRM (`/clientes`):**
   - Cadastro único para quadras, turmas, bar e loja.
   - Extrato do saldo de cashback em tempo real.

---

## 📄 Documentação Completa do Escopo
Consulte o documento em [`docs/escopo_erp_viva.md`](./docs/escopo_erp_viva.md) para detalhes de todas as regras de negócio homologadas.
