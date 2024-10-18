import { carregarDados } from './dataLoader.js';
import { inicializarFormulario } from './formHandler.js';
import { inicializarCalculos } from './calculations.js';
import { inicializarGarantias, adicionarLinhaGarantia } from './garantiasHandler.js';
import { inicializarGarantiasFidejussorias, adicionarLinhaGarantiaFidejussoria, atualizarValoresGarantiasFidejussorias } from './garantiasFidejussoriasHandler.js';


let modalidadesData = [];

$(document).ready(async function () {
    try {
        const { produtos, modalidades } = await carregarDados();
        modalidadesData = modalidades;

        inicializarFormulario(produtos, modalidades);
        inicializarCalculos(modalidades);
        inicializarGarantias(modalidades);
        inicializarGarantiasFidejussorias(modalidades);

        $('#valor-contrato').on('input', function () {
            atualizarValoresGarantiasFidejussorias();
        });


        $('#form-produto').submit(function (e) {
            e.preventDefault();
            console.log('Dados salvos:', salvarDadosJSON());
            alert('Dados salvos com sucesso!');
        });

        $('#download-json').click(function () {
            const dados = salvarDadosJSON();
            const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'dados_formulario.json';
            a.click();
            URL.revokeObjectURL(a.href);
        });

        $('#upload-json').change(e => {
            const arquivo = e.target.files[0];
            if (arquivo) carregarDadosJSON(arquivo);
        });
    } catch (error) {
        console.error('Erro ao inicializar o formulário:', error);
        alert('Ocorreu um erro ao carregar o formulário. Por favor, tente novamente mais tarde.');
    }
});

function salvarDadosJSON() {
    const modalidadeId = $('#modalidade').val();
    const modalidade = modalidadesData.find(m => m.id === modalidadeId);
    const dados = {
        produto: $('#produto').val() || null,
        modalidade: {
            id: modalidadeId || null,
            nome: modalidade ? modalidade.nome : null
        },
        valorContrato: $('#valor-contrato').val() || null,
        parcelasCarencia: $('#parcelas-carencia').val() || null,
        numeroAvaliacao: $('#numero-avaliacao').val() || null,
        contratoBNDES: $('#contrato-bndes').val() || null,
        juros: $('#juros').val() || null,
        mora: $('#mora').val() || null,
        multa: $('#multa').val() || null,
        iofAtraso: $('#iofAtraso').val() || null,
        taxaPre: $('#taxaPre').val() || null,
        taxaBNDES: $('#taxaBNDES').val() || null,
        garantiasNaoFidejussorias: [],
        garantiasFidejussorias: []
    };

    if (modalidade?.calcularTac) {
        dados.tac = {
            valor: $('#valor-tac').val() || null
        };
    }

    if (modalidade?.calcularIOF) {
        dados.iof = {
            valor: $('#valor-iof').val() || null,
            valorLiquido: $('#valor-liquido').val() || null
        };
    }

    $('.garantia-nao-fidejussoria-linha').each(function () {
        dados.garantiasNaoFidejussorias.push({
            tipo: $(this).find('.garantia-tipo').val(),
            percentual: $(this).find('.garantia-percentual').val(),
            valor: $(this).find('.garantia-valor').val()
        });
    });

    $('.garantia-fidejussoria-linha').each(function () {
        dados.garantiasFidejussorias.push({
            cpf: $(this).find('.garantia-fidejussoria-cpf').val(),
            nome: $(this).find('.garantia-fidejussoria-nome').val(),
            percentual: $(this).find('.garantia-fidejussoria-percentual').val(),
            valor: $(this).find('.garantia-fidejussoria-valor').val()
        });
    });

    return dados;
}

async function carregarDadosJSON(arquivo) {
    try {
        const dados = JSON.parse(await arquivo.text());

        if (dados.produto) {
            $('#produto').val(dados.produto).trigger('change');

            setTimeout(() => {
                if (dados.modalidade && dados.modalidade.id) {
                    $('#modalidade').val(dados.modalidade.id).trigger('change');
                }
                if (dados.valorContrato) {
                    $('#valor-contrato').val(dados.valorContrato).trigger('input');
                }
                if (dados.parcelasCarencia) {
                    $('#parcelas-carencia').val(dados.parcelasCarencia);
                }
                if (dados.numeroAvaliacao) {
                    $('#numero-avaliacao').val(dados.numeroAvaliacao);
                }
                if (dados.contratoBNDES) {
                    $('#contrato-bndes').val(dados.contratoBNDES);
                }

                // Preencher campos da modalidade
                $('#juros').val(dados.juros);
                $('#mora').val(dados.mora);
                $('#multa').val(dados.multa);
                $('#iofAtraso').val(dados.iofAtraso);
                $('#taxaPre').val(dados.taxaPre);
                $('#taxaBNDES').val(dados.taxaBNDES);

                // Carregar garantias
                if (dados.garantiasNaoFidejussorias) {
                    dados.garantiasNaoFidejussorias.forEach(garantia => {
                        adicionarLinhaGarantia(garantia);
                    });
                }
                if (dados.garantiasFidejussorias) {
                    dados.garantiasFidejussorias.forEach(garantia => {
                        adicionarLinhaGarantiaFidejussoria(garantia);
                    });
                }
            }, 100);
        }
    } catch (error) {
        console.error('Erro ao carregar JSON:', error);
        alert('Erro ao carregar o arquivo. Verifique o formato do JSON.');
    }

}