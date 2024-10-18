let garantiasFidejussoriasCounter = 0;
let modalidadesData = [];

export function inicializarGarantiasFidejussorias(modalidades) {
    modalidadesData = modalidades;

    $('#adicionar-garantia-fidejussoria').click(function () {
        adicionarLinhaGarantiaFidejussoria();
    });

    $(document).on('click', '.remover-garantia-fidejussoria', function () {
        $(this).closest('.garantia-fidejussoria-linha').remove();
    });
}

export function adicionarLinhaGarantiaFidejussoria(dados = {}) {
    const valorContrato = parseFloat($('#valor-contrato').val()) || 0;
    const garantiaId = `garantia-fidejussoria-${garantiasFidejussoriasCounter++}`;
    const novaLinha = `
        <div class="row mb-2 garantia-fidejussoria-linha" id="${garantiaId}">
            <div class="col-md-3">
                <input type="text" class="form-control garantia-fidejussoria-cpf" placeholder="CPF" value="${dados.cpf || ''}" required>
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control garantia-fidejussoria-nome" placeholder="Nome" value="${dados.nome || ''}" required>
            </div>
            <div class="col-md-2">
                <input type="number" class="form-control garantia-fidejussoria-percentual" value="100" readonly>
            </div>
            <div class="col-md-2">
                <input type="number" class="form-control garantia-fidejussoria-valor" value="${valorContrato.toFixed(2)}" readonly>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger remover-garantia-fidejussoria">Remover</button>
            </div>
        </div>
    `;
    $('#garantias-fidejussorias-container').append(novaLinha);
}

export function configurarSecaoGarantiasFidejussorias(modalidade) {
    const garantiasSection = $('#garantias-fidejussorias-section');
    const garantiasContainer = $('#garantias-fidejussorias-container');

    if (modalidade.permitirGarantiasFidejussorias) {
        garantiasSection.show();
        garantiasContainer.empty();
        garantiasFidejussoriasCounter = 0;
    } else {
        esconderSecaoGarantiasFidejussorias();
    }
}

export function esconderSecaoGarantiasFidejussorias() {
    $('#garantias-fidejussorias-section').hide();
    $('#garantias-fidejussorias-container').empty();
    garantiasFidejussoriasCounter = 0;
}

export function atualizarValoresGarantiasFidejussorias() {
    const valorContrato = parseFloat($('#valor-contrato').val()) || 0;
    $('.garantia-fidejussoria-valor').val(valorContrato.toFixed(2));
}