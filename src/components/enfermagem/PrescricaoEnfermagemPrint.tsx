import { HOSPITAL_INFO } from '@/config/hospital';
import type { Paciente, Prescricao, Internacao, ItemPrescricao } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { Colaborador } from '@/models/Schema';

interface Props {
    paciente: Paciente;
    prescricao: Prescricao;
    internacao: Internacao | null;
    itens: ItemPrescricao[];
    medicoNome: string | null; // Nome do médico responsável (cabeçalho)
    // Para assinatura, usaremos o usuário logado (Enfermeiro)
}

export default function PrescricaoEnfermagemPrint({
    paciente,
    prescricao,
    internacao,
    itens,
    medicoNome
}: Props) {
    const { user } = useAuth();
    const [enfermeiroNome, setEnfermeiroNome] = useState<string>('');
    const [enfermeiroRegistroProfissional, setEnfermeiroRegistroProfissional] = useState<string>('');
    const [enfermeiroNumeroRegistro, setEnfermeiroNumeroRegistro] = useState<string>('');

    useEffect(() => {
        const fetchNurseInfo = async () => {
            if (user?.id) {
                const { data } = await supabase
                    .from(Colaborador.table)
                    .select('nome_completo, registro_profissional, numero_registro')
                    .eq(Colaborador.fields.identificadorUsuario, user.id)
                    .single();

                if (data) {
                    setEnfermeiroNome(data.nome_completo || 'Enfermeiro Responsável');
                    setEnfermeiroRegistroProfissional(data.registro_profissional || 'COREN');
                    setEnfermeiroNumeroRegistro(data.numero_registro || '');
                }
            }
        };
        fetchNurseInfo();
    }, [user]);

    const calcularIdade = (dataDeNascimento: string): number => {
        const hoje = new Date();
        const nascimento = new Date(dataDeNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    };

    const formatarData = (data: string): string => {
        if (!data) return '';
        if (data.includes('-') && !data.includes('T')) {
            data += 'T12:00:00';
        }
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarHorario = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const idade = paciente.dataDeNascimento ? calcularIdade(paciente.dataDeNascimento) : null;

    return (
        <div className="print-only" style={{
            width: '100%',
            minHeight: '260mm',
            padding: '8mm 10mm',
            backgroundColor: 'white',
            fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontSize: '11pt',
            color: '#222',
            position: 'relative',
            boxSizing: 'border-box'
        }}>
            {/* Cabeçalho Institucional */}
            <div style={{
                borderBottom: '1px solid #acacacff',
                paddingBottom: '15px',
                marginBottom: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                        <img
                            src={HOSPITAL_INFO.logo}
                            alt="Logo Hospital"
                            style={{ width: '70px', height: 'auto', objectFit: 'contain' }}
                        />
                        <div>
                            <h1 style={{ margin: '0 0 4px 0', fontSize: '16pt', fontWeight: '700', color: '#1a1a1a' }}>
                                {HOSPITAL_INFO.nome}
                            </h1>
                            <p style={{ margin: '0', fontSize: '9pt', color: '#555' }}>
                                {HOSPITAL_INFO.endereco} - {HOSPITAL_INFO.cidade}
                            </p>
                            <p style={{ margin: '0', fontSize: '9pt', color: '#555' }}>
                                Tel: {HOSPITAL_INFO.telefone} | CNPJ: {HOSPITAL_INFO.cnpj}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Título do Documento */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{
                    margin: 0,
                    fontSize: '14pt',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: '#2c3e50'
                }}>
                    Prescrição de Enfermagem
                </h2>
                <p style={{ margin: '4px 0', fontSize: '9pt', color: '#777' }}>
                    Emitida em: {formatarData(prescricao.dataPrescricao || new Date().toISOString())}
                </p>
            </div>

            {/* Dados do Paciente */}
            <div style={{
                marginBottom: '25px',
                padding: '15px 20px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px 20px' }}>
                    <div>
                        <span style={{ display: 'block', fontSize: '8.5pt', color: '#666', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0px' }}>Paciente</span>
                        <span style={{ fontWeight: '600', fontSize: '10pt', color: '#333' }}>{paciente.nomeCompleto}</span>
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '8.5pt', color: '#666', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0px' }}>Nascimento</span>
                        <span style={{ fontWeight: '600', fontSize: '10pt', color: '#333' }}>{paciente.dataDeNascimento ? formatarData(paciente.dataDeNascimento) : '-'}</span>
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '8.5pt', color: '#666', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0px' }}>Idade</span>
                        <span style={{ fontWeight: '600', fontSize: '10pt', color: '#333' }}>{idade ? `${idade} anos` : 'N/A'}</span>
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '8.5pt', color: '#666', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0px' }}>Prontuário</span>
                        <span style={{ fontWeight: '600', fontSize: '10pt', color: '#333' }}>{prescricao.registroProntuario || 'N/A'}</span>
                    </div>

                    {internacao && (
                        <>
                            <div>
                                <span style={{ display: 'block', fontSize: '8.5pt', color: '#666', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0px' }}>Médico Assistente</span>
                                <span style={{ fontWeight: '600', fontSize: '10pt', color: '#333' }}>{medicoNome || 'N/A'}</span>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '8.5pt', color: '#666', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0px' }}>Quarto / Leito</span>
                                <span style={{ fontWeight: '600', fontSize: '10pt', color: '#333' }}>{internacao.quarto || '-'} / {internacao.leito || '-'}</span>
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '8.5pt', color: '#666', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0px' }}>Convênio</span>
                                <span style={{ fontWeight: '600', fontSize: '10pt', color: '#333' }}>{internacao?.convenio || prescricao.convenio || 'Particular'}</span>
                            </div>
                        </>
                    )}
                </div>

                {paciente.alergias && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #dcdcdc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '9pt', color: '#d32f2f', fontWeight: '700', textTransform: 'uppercase' }}>Alergias:</span>
                        <span style={{ color: '#d32f2f', fontSize: '10pt', fontWeight: '500' }}>{paciente.alergias}</span>
                    </div>
                )}
            </div>

            {/* Tabela de Itens */}
            <div style={{ marginBottom: '25px' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: '0',
                    fontSize: '9pt',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    breakInside: 'auto'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f3eeeeff' }}>
                            <th style={{ padding: '10px 12px', textAlign: 'left', color: '#000000ff', fontWeight: '400', fontSize: '8pt', textTransform: 'uppercase', borderBottom: '1px solid #ccc', borderRight: '1px solid #9bafd3ff' }}>Cuidado / Item</th>
                            {/* Colunas removidas conforme pedido: Qtd, Tipo/Apresentação/Via */}
                            <th style={{ padding: '10px 12px', textAlign: 'center', color: '#000000ff', fontWeight: '400', fontSize: '8pt', textTransform: 'uppercase', borderBottom: '1px solid #ccc' }}>Aprazamento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itens.map((item, index) => (
                            <tr key={item.idItem}>
                                <td style={{ padding: '12px', verticalAlign: 'top', borderBottom: index === itens.length - 1 ? 'none' : '1px solid #ccc', borderRight: '1px solid #e9ecef' }}>
                                    <div style={{ fontWeight: '400', color: '#212529' }}>
                                        {item.produto} {/* Nome do Cuidado */}
                                        {item.seNecessario && <span style={{ fontWeight: 'normal', color: '#666', fontStyle: 'italic', fontSize: '0.9em' }}> (SN)</span>}
                                    </div>
                                    {item.observacoes && (
                                        <div style={{ fontSize: '07pt', color: '#0277bd', marginTop: '1px', fontStyle: 'italic' }}>
                                            Obs: {item.observacoes}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '12px', verticalAlign: 'top', textAlign: 'center', borderBottom: index === itens.length - 1 ? 'none' : '1px solid #ccc' }}>
                                    <div style={{ lineHeight: '1.5' }}>
                                        {item.horario && item.horario.length > 0
                                            ? item.horario.map(h => formatarHorario(h)).join(' - ')
                                            : item.frequencia || '-'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Assinatura do Enfermeiro */}
            <div style={{
                marginTop: 'auto',
                marginBottom: '25mm',
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: '30px'
            }}>
                <div style={{ width: '300px', textAlign: 'center' }}>
                    <div style={{ borderTop: '1px solid #918282ff', marginBottom: '8px', width: '80%', margin: '0 auto' }}></div>
                    <p style={{ margin: '0 0 2px 0', fontWeight: '600', fontSize: '10pt', color: '#000' }}>
                        {enfermeiroNome || 'Enfermeiro Responsável'}
                    </p>
                    <p style={{ margin: 0, color: '#555', fontSize: '9pt' }}>
                        {enfermeiroRegistroProfissional || 'COREN'}: {enfermeiroNumeroRegistro || '__________'}
                    </p>
                </div>
            </div>

            {/* Rodapé Fixo */}
            <div style={{
                position: 'absolute',
                bottom: '1mm',
                left: '15mm',
                right: '15mm',
                borderTop: '1px solid #e0e0e0',
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '8pt',
                color: '#888'
            }}>
                <div>
                    <strong>Validade:</strong> 24 horas
                </div>
                <div>
                    ID: {prescricao.identificador}
                </div>
                <div>
                    Gerado em {new Date().toLocaleString('pt-BR')}
                </div>
            </div>
        </div>
    );
}
