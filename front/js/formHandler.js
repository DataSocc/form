import { calcularValores } from './calculations.js';
import { configurarSecaoGarantias } from './garantiasHandler.js';
import { configurarSecaoGarantiasFidejussorias } from './garantiasFidejussoriasHandler.js';


export function inicializarFormulario(produtos, modalidades) {
    preencherSelect('#produto', produtos, 'id', 'nome');

    $('#produto').change(function () {
        const produtoId = $(this).val();
        const modalidadesFiltradas = modalidades.filter(m => m.produtoId === produtoId);

        preencherSelect('#modalidade', modalidadesFiltradas, 'id', 'nome');
        $('#valor-contrato').val('');
        esconderCamposIOF();
        esconderCamposTAC();
        esconderSecaoGarantias();
        iniciarCamposModalidade();
    });

    $('#modalidade').change(function () {
        const modalidade = modalidades.find(m => m.id === $(this).val());
        if (!modalidade) return;

        if (modalidade.parcelasCarencia?.length) {
            const options = modalidade.parcelasCarencia.map(p =>
                `<option value="${p}">${p} meses</option>`
            );
            $('#parcelas-carencia').html(`<option value="">Selecione...</option>${options.join('')}`);
        }

        configurarCamposCalculados(modalidade);
        configurarSecaoGarantias(modalidade);
        configurarSecaoGarantiasFidejussorias(modalidade);
        preencherCamposModalidade(modalidade);
        calcularValores(modalidades);
    });
}

function preencherSelect(selector, data, valueKey, textKey) {
    const options = data.map(item =>
        `<option value="${item[valueKey]}">${item[textKey]}</option>`
    );
    $(selector).html(`<option value="">Selecione...</option>${options.join('')}`);
}

function configurarCamposCalculados(modalidade) {
    if (modalidade.calcularTac) {
        mostrarCamposTAC(modalidade.tac);
    } else {
        esconderCamposTAC();
    }

    if (modalidade.calcularIOF) {
        mostrarCamposIOF();
    } else {
        esconderCamposIOF();
    }
}

function preencherCamposModalidade(modalidade) {
    $('#juros').val(modalidade.juros);
    $('#mora').val(modalidade.mora);
    $('#multa').val(modalidade.multa);
    $('#iofAtraso').val(modalidade.iofAtraso);
    $('#taxaPre').val(modalidade.taxaPre);
    $('#taxaBNDES').val(modalidade.taxaBNDES);
}

export function iniciarCamposModalidade() {
    $('#juros, #mora, #multa, #iofAtraso, #taxaPre, #taxaBNDES').val('');
}

export function mostrarCamposTAC(tacConfig) {
    $('#tac-container').show();
    if (tacConfig) {
        $('#tac-info').text(`Mín: R$ ${tacConfig.valorMinimo} | Máx: R$ ${tacConfig.valorMaximo}`);
    }
}

export function esconderCamposTAC() {
    $('#tac-container').hide();
    $('#valor-tac').val('');
    $('#tac-info').text('');
}

export function mostrarCamposIOF() {
    $('#iof-container').show();
}

export function esconderCamposIOF() {
    $('#iof-container').hide();
    $('#valor-iof, #valor-liquido').val('');
}

export function esconderSecaoGarantias() {
    $('#garantias-section').hide();
    $('#garantias-container').empty();
}

