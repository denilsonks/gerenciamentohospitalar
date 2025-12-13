import { supabase } from "@/config/supabase";
import { Internacao } from "@/models/Schema";

export async function getDashboardMetrics() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

    // Total de pacientes internados (ainda sem alta)
    const { count: totalInternados } = await supabase
        .from(Internacao.table)
        .select("*", { count: "exact", head: true })
        .eq(Internacao.fields.alta, false);

    // Internações realizadas hoje (ainda sem alta)
    const { count: internadosHoje } = await supabase
        .from(Internacao.table)
        .select("*", { count: "exact", head: true })
        .gte(Internacao.fields.createdAt, startOfDay)
        .eq(Internacao.fields.alta, false);


    // Internações realizadas no mês corrente (ainda sem alta)
    const { count: internadosMes } = await supabase
        .from(Internacao.table)
        .select("*", { count: "exact", head: true })
        .gte(Internacao.fields.createdAt, startOfMonth)
        .eq(Internacao.fields.alta, false);

    return {
        totalInternados: totalInternados || 0,
        internadosHoje: internadosHoje || 0,
        internadosMes: internadosMes || 0,
    };
}
