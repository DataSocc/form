export async function carregarDados() {
    try {
        const [produtos, modalidades] = await Promise.all([
            fetch('../data/produtos.json').then(res => res.json()),
            fetch('../data/modalidades.json').then(res => res.json())
        ]);

        return { produtos, modalidades };
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        throw error;
    }
}