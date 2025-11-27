import { Schema } from '../models/Schema';
import type { Paciente, Medico } from '../models/Schema';
import { mockPatients, mockDoctor } from '../data/mockSupabase';

// Generic conversion helpers
function fromDatabase<T>(schema: any, data: any): T {
    if (!data) return data;
    const result: any = {};
    Object.keys(schema.fields).forEach(key => {
        const dbField = schema.fields[key];
        if (data[dbField] !== undefined) {
            result[key] = data[dbField];
        }
    });
    return result as T;
}

// Service methods
export const db = {
    getPatients: async (): Promise<Paciente[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return mockPatients.map(p => fromDatabase<Paciente>(Schema.Paciente, p));
    },

    getDoctorProfile: async (): Promise<Medico> => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return fromDatabase<Medico>(Schema.Medico, mockDoctor);
    }
};
