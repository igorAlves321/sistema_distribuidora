let produtos = [];
let itensCarrinho = [];

// Função para carregar os produtos do JSON
function carregarProdutos() {
    // Em um ambiente real, você usaria isto:
    fetch('produtos.json')
        .then(response => response.json())
        .then(data => {
            produtos = data.produtos;
            preencherSelectProdutos();
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
            // Fallback para dados de exemplo caso o arquivo não seja encontrado
            usarDadosExemplo();
        });
}

// Função para usar dados de exemplo caso o JSON não seja carregado
function usarDadosExemplo() {
    produtos = [
        {"id": 1, "nome": "Caixa de Cerveja", "preco": 35.90},
        {"id": 2, "nome": "Garrafa de Vinho", "preco": 45.50},
        {"id": 3, "nome": "Refrigerante 2L", "preco": 8.99},
        {"id": 4, "nome": "Água Mineral 500ml", "preco": 2.50},
        {"id": 5, "nome": "Whisky", "preco": 89.90},
        {"id": 6, "nome": "Vodka", "preco": 65.75}
    ];
    preencherSelectProdutos();
}

// Função para preencher o select com os produtos
function preencherSelectProdutos() {
    const select = document.getElementById('produto');
    select.innerHTML = '<option value="">Selecione um produto</option>';
    
    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id;
        option.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)}`;
        select.appendChild(option);
    });
}

// Função para encontrar um produto pelo ID
function encontrarProduto(id) {
    return produtos.find(p => p.id === parseInt(id));
}

// Função para adicionar um item ao carrinho
function adicionarItem() {
    const produtoId = document.getElementById('produto').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    
    if (!produtoId) {
        alert('Por favor, selecione um produto.');
        return;
    }
    
    if (isNaN(quantidade) || quantidade <= 0) {
        alert('Por favor, digite uma quantidade válida.');
        return;
    }
    
    const produto = encontrarProduto(produtoId);
    
    if (produto) {
        // Verificar se o produto já está no carrinho
        const itemExistente = itensCarrinho.find(item => item.produto.id === produto.id);
        
        if (itemExistente) {
            // Atualizar a quantidade se o produto já estiver no carrinho
            itemExistente.quantidade += quantidade;
        } else {
            // Adicionar novo item
            itensCarrinho.push({
                produto: produto,
                quantidade: quantidade
            });
        }
        
        // Atualizar a tabela e o total
        atualizarTabela();
        calcularTotal();
        
        // Limpar campos
        document.getElementById('produto').value = '';
        document.getElementById('quantidade').value = '1';
    }
}

// Função para remover um item do carrinho
function removerItem(index) {
    itensCarrinho.splice(index, 1);
    atualizarTabela();
    calcularTotal();
}

// Função para atualizar a tabela de itens
function atualizarTabela() {
    const tbody = document.querySelector('#itens-tabela tbody');
    tbody.innerHTML = '';
    
    if (itensCarrinho.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum item adicionado</td></tr>';
        return;
    }
    
    itensCarrinho.forEach((item, index) => {
        const tr = document.createElement('tr');
        
        const subtotal = item.produto.preco * item.quantidade;
        
        tr.innerHTML = `
            <td>${item.produto.nome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.produto.preco.toFixed(2)}</td>
            <td>R$ ${subtotal.toFixed(2)}</td>
            <td>
                <button onclick="removerItem(${index})" class="btn btn-danger btn-sm">
                    <i class="bi bi-trash"></i> Remover
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Função para calcular o total do carrinho
function calcularTotal() {
    const total = itensCarrinho.reduce((soma, item) => {
        return soma + (item.produto.preco * item.quantidade);
    }, 0);
    
    document.getElementById('preco-total').textContent = total.toFixed(2);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
    
    // Adicionar evento ao botão
    document.getElementById('adicionar').addEventListener('click', adicionarItem);
});