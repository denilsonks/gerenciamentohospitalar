// src/services/db.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/config/supabase";

// SELECT ALL → Gera a lista de campos automaticamente usando schema.fields
export function selectAll(schema: any): string {
    return Object.values(schema.fields).join(", ");
}

// CONVERSÃO snake_case → camelCase (retorno do Supabase)
export function fromDatabase(schema: any, data: any) {
    if (!data) return null;

    const result: any = {};

    for (const camelKey of Object.keys(schema.fields)) {
        const snakeKey = schema.fields[camelKey];
        result[camelKey] = data[snakeKey];
    }

    return result;
}

// CONVERSÃO camelCase → snake_case (envio para Supabase)
export function toDatabase(schema: any, obj: any) {
    const result: any = {};


    for (const camelKey of Object.keys(schema.fields)) {
        const snakeKey = schema.fields[camelKey];

        if (obj[camelKey] !== undefined) {
            result[snakeKey] = obj[camelKey];
        }
    }

    return result;
}

export { supabase };
