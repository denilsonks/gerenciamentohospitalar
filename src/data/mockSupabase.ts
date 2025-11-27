export const mockPatients = [
    {
        id: "1",
        nome_completo: "Carlos Oliveira",
        data_nascimento: "1958-04-12",
        quarto: "304",
        leito: "A",
        convenio: "Unimed",
        alergia: true,
        detalhes_alergia: "Dipirona",
        data_ultima_prescricao: "2023-10-26T08:00:00",
        status_prescricao: "atrasada"
    },
    {
        id: "2",
        nome_completo: "Mariana Souza",
        data_nascimento: "1992-08-25",
        quarto: "201",
        leito: "B",
        convenio: "Particular",
        alergia: false,
        detalhes_alergia: null,
        data_ultima_prescricao: "2023-10-27T09:30:00",
        status_prescricao: "em_dia"
    },
    {
        id: "3",
        nome_completo: "Roberto Santos",
        data_nascimento: "1975-11-03",
        quarto: "105",
        leito: "A",
        convenio: "Bradesco Saúde",
        alergia: true,
        detalhes_alergia: "Penicilina",
        data_ultima_prescricao: "2023-10-26T18:00:00",
        status_prescricao: "pendente"
    },
    {
        id: "4",
        nome_completo: "Ana Pereira",
        data_nascimento: "1988-02-14",
        quarto: "304",
        leito: "B",
        convenio: "SulAmérica",
        alergia: false,
        detalhes_alergia: null,
        data_ultima_prescricao: "2023-10-27T07:00:00",
        status_prescricao: "em_dia"
    },
    {
        id: "5",
        nome_completo: "Fernando Costa",
        data_nascimento: "1965-06-30",
        quarto: "UTI-02",
        leito: "1",
        convenio: "Unimed",
        alergia: false,
        detalhes_alergia: null,
        data_ultima_prescricao: "2023-10-25T20:00:00",
        status_prescricao: "atrasada"
    }
];

export const mockDoctor = {
    id: "doc-001",
    nome: "Dr. André Martins",
    crm: "CRM/SP 123456",
    especialidade: "Cardiologia"
};
