# ERP Arena VIVA by Baumann — Especificação de Escopo e Arquitetura

Este documento consolida o escopo funcional, regras de negócio homologadas e arquitetura para o desenvolvimento do ERP da **Arena VIVA by Baumann** (8 quadras de areia, bar/restaurante, loja, turmas/aulas, eventos/torneios e gestão financeira integrada).

---

## 1. Visão Geral dos Módulos e Regras de Negócio Aprovadas

### Módulo 1: Painel de Gestão (Dashboard Executivo e Operacional)
- **Operacional e Financeiro em Tempo Real:**
  - Vendas, recebimentos e faturamento do dia (separados por PDV, quadras, aulas e eventos).
  - Saldo em tempo real dos caixas físicos (abertos/fechados) e contas bancárias.
  - Painel de contas a pagar, a receber e inadimplência imediata.
  - Termômetro de ocupação das 8 quadras (taxa de ocupação em horários de pico vs. horários de vale).
  - Alertas de contratos e mensalidades próximos do vencimento/término.
  - DRE Gerencial consolidado e resultado por centro de receita (Locação, Aulas, Bar, Loja, Eventos).

---

### Módulo 2: Agenda e Locação de Quadras
- Cadastro das 8 quadras com características (cobertas/descobertas, iluminação, modalidades: Beach Tennis, Vôlei de Praia, Futevôlei).
- Reservas avulsas (horário único) e reservas recorrentes (mensalistas fixos).
- Tabela tarifária dinâmica: precificação por quadra, modalidade, dia da semana e faixa de horário (Peak / Off-Peak).
- Grade de bloqueios operacionais: aulas fixas, manutenções, clínicas, torneios e locações exclusivas.
- Gestão de sinal (depósito garantidor), saldo a receber no check-in e política de cancelamentos.
- Vinculação nativa: Reserva -> Cliente -> Comanda / Fatura -> Financeiro.
- **Regras Homologadas para Locações Recorrentes e Chuva:**
  - Ciclo de cobrança mensal pré-pago com geração automática de parcelas/faturas.
  - Intempéries (chuva/vento forte em quadras descobertas): geração automática de **crédito em horas** para reagendamento em até 60 dias (sem devolução em espécie).

---

### Módulo 3: Aulas, Turmas e Mensalidades (Substituição do Agil)
- Cadastro de modalidades, níveis (iniciante, intermediário, avançado), professores e alunos.
- Gestão de turmas: grade de horários, lotação máxima por quadra e controle de lista de presença (chamada digital pelo app/tablet do professor).
- Planos e contratos de mensalidade (mensal, trimestral, semestral, anual).
- Faturamento automático de parcelas vinculadas ao aluno/responsável.
- Painel de controle de inadimplência e bloqueio automático de novas marcações.
- **Regras Homologadas para Aulas:**
  - **Faltas e Reposições:** Cancelamento com aviso prévio mínimo de **4 horas** gera automaticamente 1 crédito de reposição e abre a vaga avulsa na turma para outro aluno. Falta sem aviso prévio perde o direito à reposição.
  - **Limite de Reposições:** Máximo de 2 reposições acumuladas por mês, com validade de até 60 dias (vinculadas à mensalidade ativa).
  - **Aula Experimental:** Cadastrada no sistema; se o aluno efetivar a matrícula em até 7 dias, o valor da experimental pode ser abatido ou abonado.
  - **Trancamento:** Permitido de 15 a 60 dias por ano, mediante aviso prévio de 7 dias úteis.

---

### Módulo 4: Clientes e Fidelização (CRM Unificado)
- Cadastro único integrado: o mesmo cliente para quadras, aulas, bar, loja e eventos.
- Módulo para dependentes e responsáveis legais/financeiros (menores de idade em turmas).
- Histórico 360° do cliente: consumo no bar/loja, histórico de locações, pagamentos e contratos vigentes.
- Consulta de bloqueios e restrições financeiras.
- **Regra Homologada para Fidelização (Cashback em Carteira Digital):**
  - Percentual configurável (ex: 3% a 5%) de cashback gerado em consumo no bar, loja e locações avulsas.
  - Saldo de carteira acumulado no cadastro do cliente, utilizável como abatimento direto no PDV/checkout.

---

### Módulo 5: Gestão e Geração de Contratos
- Repositório de minutas e modelos contratuais da Arena (mensalistas de quadra, planos de aula, patrocínios, eventos).
- Preenchimento automatizado (merge tags) com dados cadastrais e financeiros da contratação.
- Gestão do ciclo de vida: Rascunho -> Aguardando Assinatura -> Vigente -> Concluído / Cancelado.
- Gatilhos e notificações automáticas de renovação e reajuste.
- Assinatura híbrida: exportação em PDF para assinatura física com upload de via assinada, e integração via API com serviços de assinatura digital (ex: ZapSign / Clicksign).
- Controle de versionamento e aditivos contratuais.

---

### Módulo 6: Comissões de Professores e Colaboradores
- Regra de cálculo: valor fixo por parcela paga, atrelado ao contrato/inscrição, com flexibilidade por contrato.
- Vínculo direto de colaborador responsável pelo fechamento/execução.
- Provisionamento de comissão (prevista enquanto a parcela estiver a vencer).
- Liberação automática de comissão somente após a efetiva liquidação financeira da parcela.
- Relatório analítico por professor, período, aluno, turma e contrato.
- Controle de status: Prevista -> Liberada -> Paga.
- Envio automático para o Contas a Pagar após homologação do gestor.
- **Regra Homologada para Cancelamentos/Estornos:** Em caso de estorno ou cancelamento de mensalidade, a comissão correspondente é automaticamente revertida ou deduzida no próximo fechamento do colaborador.

---

### Módulo 7: Frente de Caixa (PDV)
- Operação flexível: 1 caixa fixo em dias normais e até 3 caixas simultâneos em torneios e grandes eventos.
- Autenticação e operador individual por caixa (segurança e rastreabilidade).
- Abertura de turno com fundo de troco (suprimento), sangrias parciais e fechamento cego com conferência de divergências.
- Suporte a múltiplas formas de pagamento: Pix, Cartão de Crédito/Débito, Dinheiro, Saldo de Carteira (Cashback) e Faturado/Boleto.
- Pagamento fracionado (divisão de conta em várias formas ou entre diferentes pessoas).
- Auditoria detalhada de cada transação (operador, horário, desconto concedido, cancelamento).

---

### Módulo 8: Bar, Restaurante e Comandas
- Abertura de comanda individual ou por grupo/mesa via número/cartão/nome.
- **Comandas Multi-Caixa em Tempo Real:** Os 3 caixas operam a mesma comanda simultaneamente durante torneios, sem conflitos de concorrência.
- Lançamento rápido de itens e combos com categorização visual no PDV.
- Fechamento parcial e divisão de comanda entre membros da mesa/dupla.
- **Cozinha e Estoque (Homologação V1):**
  - Impressão térmica de pedidos na cozinha/bar (ou tela simples de expedição KDS).
  - Controle de estoque focado em **produtos acabados** e porções prontas (sem necessidade de pesagem diária de insumos fracionados no V1).

---

### Módulo 9: Loja e Controle de Estoque
- Catálogo de produtos com grade de variações (tamanho, cor, modelo — raquetes, bolas, vestuário, acessórios).
- Controle de custos (preço de custo, margem e preço de venda).
- Movimentações de estoque: entradas por nota/compra, saídas por PDV, perdas/avarias e consumo interno.
- Ponto de pedido: definição de estoque mínimo com alertas de reposição.
- Registro de trocas e devoluções com emissão de vale-compras ou estorno.

---

### Módulo 10: Eventos e Torneios
- **Escopo Homologado V1 (Comercial, Operacional e Financeiro):**
  - Cadastro de eventos, clínicas e torneios.
  - Orçamento, venda e recebimento de inscrições de atletas e patrocinadores.
  - Centro de Custo individualizado por evento com DRE específico (apurando receitas e despesas com arbitragem, premiação, estrutura, etc.).
  - Modo Torneio para PDV (operação acelerada de múltiplos caixas integrados).
  - *Chaveamento esportivo:* mantido em plataformas consolidadas de ranking (LetzPlay/TorneioJá) para a V1, integrando a lista de inscritos.

---

### Módulo 11: Gestão Financeira (Substituição do Trio e Alinhamento BPO)
- Contas a Pagar e a Receber com baixa individual ou em lote.
- Fluxo de caixa diário, semanal e mensal (Previsto vs. Realizado).
- Estrutura de Plano de Contas Gerencial e Centros de Custo (Quadras, Aulas, Bar, Loja, Eventos, Administrativo).
- Demonstrativo do Resultado do Exercício (DRE) em regime de competência e caixa.
- Régua de cobrança automática com notificações via WhatsApp/E-mail.
- **Rotina com BPO:** O ERP centraliza a operação diária e fornece relatórios de conciliação / exportação padrão (OFX/CSV) para alimentação do Conta Azul ou perfil dedicado de BPO dentro do ERP.

---

### Módulo 12: Bancos, Cartões e Conciliação
- Gestão das contas operacionais: Banco C6, Mercado Pago e Nubank.
- Gestão de recebíveis e adquirente TON: conciliação de vendas, taxas aplicadas, prazos de repasse e antecipações.
- Conciliação bancária por importação de extratos (OFX / CSV) e conciliação de cartões.

---

### Módulo 13: Cobrança e Documentos Fiscais
- Emissão de cobranças bancárias com QR Code Pix Dinâmico e Boleto integrado.
- Emissão de recibos digitais e comprovantes de quitação com identificação da Arena.
- Módulo fiscal desacoplado, pronto para conexão com API de emissão (ex: Focus NFe / PlugNotas) para emissão de NFS-e (serviços) e NFC-e (bar e loja) conforme alinhamento com a contabilidade.

---

### Módulo 14: Compras e Fornecedores
- Cadastro completo de fornecedores.
- Pedidos de compra com aprovação e integração com Contas a Pagar e Estoque.
- Histórico de compras e variação de custos por fornecedor.

---

### Módulo 15: Usuários, Perfis de Acesso e Auditoria
- Matriz de perfis (RBAC):
  - Administrador Geral
  - Gerente Operacional
  - Operador de Caixa / Atendimento
  - Professor / Treinador
  - BPO Financeiro / Contador
- Logs imutáveis de auditoria em operações sensíveis (descontos, estornos, cancelamentos).
- Rotinas automatizadas de backup e segurança.
