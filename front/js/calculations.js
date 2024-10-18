import { mostrarCamposTAC, esconderCamposTAC, mostrarCamposIOF, esconderCamposIOF } from './formHandler.js';

export function inicializarCalculos(modalidades) {
    $('#valor-contrato').on('input', function() {
        const valor = $(this).val();
        if (valor === '' || parseFloat(valor) < 0) {
            $(this).val('');
        }
        calcularValores(modalidades);
    });
}

export function calcularValores(modalidades) {
    const valorContrato = parseFloat($('#valor-contrato').val()) || 0;
    const modalidadeId = $('#modalidade').val();
    if (!modalidadeId || valorContrato <= 0) {
        limparValores();
        return;
    }

    const modalidade = modalidades.find(m => m.id === modalidadeId);
    if (!modalidade) {
        limparValores();
        return;
    }

    let valorTotalDeducoes = 0;

    // Calcular TAC
    if (modalidade.calcularTac && modalidade.tac) {
        const tac = modalidade.tac;
        const percentual = parseFloat(modalidade.percentualPadrao) || 0;
        let valorTac = (valorContrato * percentual) / 100;
        
        // Aplicar limites apenas se forem números válidos
        const valorMinimo = parseFloat(tac.valorMinimo) || 0;
        const valorMaximo = parseFloat(tac.valorMaximo) || Infinity;
        
        valorTac = Math.max(valorMinimo, Math.min(valorMaximo, valorTac));
        
        if (!isNaN(valorTac)) {
            $('#valor-tac').val(valorTac.toFixed(2));
            valorTotalDeducoes += valorTac;
        }
        mostrarCamposTAC(tac);
    } else {
        esconderCamposTAC();
    }

    // Calcular IOF
    if (modalidade.calcularIOF) {
        const aliquota = parseFloat(modalidade.aliquotaIOF) || 0;
        const valorIof = valorContrato * aliquota;
        
        if (!isNaN(valorIof)) {
            $('#valor-iof').val(valorIof.toFixed(2));
            valorTotalDeducoes += valorIof;
        }
        mostrarCamposIOF();
    } else {
        esconderCamposIOF();
    }

    // Calcular valor líquido
    const valorLiquido = valorContrato - valorTotalDeducoes;
    if (!isNaN(valorLiquido)) {
        $('#valor-liquido').val(valorLiquido.toFixed(2));
    }
}

function limparValores() {
    $('#valor-tac').val('');
    $('#valor-iof').val('');
    $('#valor-liquido').val('');
}