let garantiasCounter = 0;
let modalidadesData = [];

export function inicializarGarantias(modalidades) {
    modalidadesData = modalidades;
    
    $('#adicionar-garantia').click(function() {
        adicionarLinhaGarantia();
    });

    $(document).on('click', '.remover-garantia', function() {
        $(this).closest('.garantia-linha').remove();
    });
}

export function adicionarLinhaGarantia(dados = {}) {
    const modalidadeId = $('#modalidade').val();
    const modalidade = modalidadesData.find(m => m.id === modalidadeId);
    if (!modalidade || !modalidade.garantiasNaoFidejussorias || modalidade.garantiasNaoFidejussorias.length === 0) {
        console.warn('Modalidade não encontrada ou sem garantias não fidejussórias');
        return;
    }

    const garantiaId = `garantia-${garantiasCounter++}`;
    const novaLinha = `
        <div class="row mb-2 garantia-linha" id="${garantiaId}">
            <div class="col-md-4">
                <select class="form-select garantia-tipo" required>
                    <option value="">Selecione o tipo de garantia...</option>
                    ${modalidade.garantiasNaoFidejussorias.map(g => 
                        `<option value="${g.id}" ${dados.tipo === g.id ? 'selected' : ''}>${g.nome}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="col-md-3">
                <input type="number" class="form-control garantia-percentual" placeholder="Percentual" step="0.01" min="0" max="100" value="${dados.percentual || ''}" required>
            </div>
            <div class="col-md-3">
                <input type="number" class="form-control garantia-valor" placeholder="Valor" step="0.01" min="0" value="${dados.valor || ''}" required>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger remover-garantia">Remover</button>
            </div>
        </div>
    `;
    $('#garantias-container').append(novaLinha);
}

export function configurarSecaoGarantias(modalidade) {
    const garantiasSection = $('#garantias-section');
    const garantiasContainer = $('#garantias-container');

    if (modalidade.garantiasNaoFidejussorias && modalidade.garantiasNaoFidejussorias.length > 0) {
        garantiasSection.show();
        garantiasContainer.empty();
        garantiasCounter = 0;
    } else {
        esconderSecaoGarantias();
    }
}

export function esconderSecaoGarantias() {
    $('#garantias-section').hide();
    $('#garantias-container').empty();
    garantiasCounter = 0;
}