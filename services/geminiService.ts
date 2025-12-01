import { GoogleGenAI } from "@google/genai";
import { Curso, Vendedora } from "../types";
import { CURSOS_MOCK, PROFESSORES_MOCK } from "../constants";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateCourseInsights = async (cursos: Curso[], vendedoras: Vendedora[]): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    // Prepare data summary for the prompt
    const cursosSummary = cursos.map(c => 
      `${c.tema} (${c.cidade}/${c.estado}): Faturou R$${c.faturamentoAtual} (Meta: R$${c.metaFaturamento})`
    ).join('\n');

    const vendedorasSummary = vendedoras.map(v => 
      `${v.nome}: Vendeu R$${v.vendasTotais}`
    ).join('\n');

    const prompt = `
      Atue como um analista de dados sênior para a empresa CGP (Centro de Capacitação em Gestão Pública).
      Analise os seguintes dados resumidos e forneça um insight executivo curto (máximo 3 parágrafos) focado em oportunidades de melhoria e destaques positivos.
      Use formatação Markdown simples.

      Dados dos Cursos:
      ${cursosSummary}

      Dados das Vendedoras:
      ${vendedorasSummary}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Erro ao conectar com a IA para análise.";
  }
};

export const sendMessageToAssistant = async (userMessage: string): Promise<string> => {
  if (!apiKey) return "Erro: Chave de API não configurada.";

  try {
    // Prepara o contexto (RAG simplificado via prompt)
    const contextData = JSON.stringify({
      cursos_disponiveis: CURSOS_MOCK.map(c => ({
        tema: c.tema,
        cidade: c.cidade,
        data: c.dataInicio,
        valor: c.valorInscricao,
        status: c.status
      })),
      professores: PROFESSORES_MOCK.map(p => ({
        nome: p.nome,
        especialidade: p.especialidade
      }))
    });

    const systemInstruction = `
      Você é o 'CGP Sales Mentor', um assistente de IA especializado em apoiar o time comercial da CGP (Centro de Capacitação em Gestão Pública).
      
      SEU OBJETIVO:
      1. Fornecer informações rápidas sobre os cursos (datas, locais, valores).
      2. Criar estratégias de vendas, scripts de abordagem e argumentos de persuasão.
      3. Ajudar a quebrar objeções de clientes (ex: "está caro", "não tenho tempo").

      CONTEXTO ATUAL DOS DADOS:
      ${contextData}

      DIRETRIZES:
      - Seja direto, motivador e profissional.
      - Use formatação Markdown (negrito, listas) para facilitar a leitura.
      - Se perguntarem sobre um curso específico, use os dados fornecidos.
      - Se pedirem uma estratégia, sugira técnicas como Spin Selling, Gatilhos Mentais ou AIDA adaptados ao setor público.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Desculpe, não consegui processar sua solicitação.";
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "Desculpe, estou enfrentando uma instabilidade técnica momentânea.";
  }
};