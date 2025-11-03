const API_URL = 'http://localhost:3000/produtos';

// === FUNÇÃO GERAL DE REQUISIÇÃO ===
async function requisicaoAPI(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Erro de HTTP: ${response.status}`);
        }
        // DELETE não retorna JSON, GET/POST/PUT sim.
        return method !== 'DELETE' ? await response.json() : null;
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert(`Ocorreu um erro: ${error.message}`);
        return null; // Retorna null em caso de falha
    }
}

// === LÓGICA DE INDEX (Listagem) ===
if (document.getElementById('lista-produtos')) {
    async function listarProdutos() {
        const produtos = await requisicaoAPI(API_URL);
        const listaUl = document.getElementById('lista-produtos');
        listaUl.innerHTML = ''; // Limpa a lista antes de adicionar

        if (produtos && produtos.length > 0) {
            produtos.forEach(produto => {
    const li = document.createElement('li');
    // **VERIFIQUE ESTA LINHA:** O ID deve ser passado na URL
    li.innerHTML = `
        <strong>${produto.nome}</strong> - R$ ${produto.preco.toFixed(2)}
        (<a href="detalhes.html?id=${produto.id}">Detalhes</a> | 
        <a href="cadastro_produtos.html?id=${produto.id}">Editar</a>)
    `;
    listaUl.appendChild(li);
            });
        } else {
            listaUl.innerHTML = '<li>Nenhum produto cadastrado.</li>';
        }
    }
    listarProdutos();
}

// === LÓGICA DE DETALHES ===
if (window.location.pathname.includes('detalhes.html')) {
    // 1. Pega o ID da URL (?id=X)
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id'); // Deve ser '1', '2', etc.

    async function carregarDetalhes() {
        if (!produtoId) {
            // Se não encontrar ID, exibe mensagem
            document.querySelector('main').innerHTML = '<h1>Produto não encontrado.</h1>';
            return;
        }
        
        // 2. Faz a requisição GET para a API: http://localhost:3000/produtos/ID
        const produto = await requisicaoAPI(`${API_URL}/${produtoId}`);
        
        if (produto) {
            // 3. Atualiza o conteúdo da página (DOM)
            const main = document.querySelector('main');
            main.innerHTML = `
                <h1>Detalhes do Produto: ${produto.nome}</h1>
                <p><strong>ID:</strong> ${produto.id}</p>
                <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
                <p><strong>Descrição:</strong> ${produto.descricao}</p>
                <a href="index.html">Voltar para a lista</a>
            `;
        } else {
            document.querySelector('main').innerHTML = '<h1>Falha ao carregar o produto.</h1>';
        }
    }
    carregarDetalhes();
}


// === LÓGICA DE CADASTRO/EDIÇÃO (CRUD) ===
if (document.getElementById('form-produto')) {
    const form = document.getElementById('form-produto');
    const btnExcluir = document.getElementById('btn-excluir');
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');
    const isEdit = !!produtoId;
    
    if (isEdit) {
        document.getElementById('titulo-form').textContent = 'Editar Produto';
        btnExcluir.style.display = 'inline';
        // Carrega dados para edição
        async function carregarProdutoParaEdicao() {
            const produto = await requisicaoAPI(`${API_URL}/${produtoId}`);
            if (produto) {
                document.getElementById('nome').value = produto.nome;
                document.getElementById('preco').value = produto.preco;
                document.getElementById('descricao').value = produto.descricao;
            }
        }
        carregarProdutoParaEdicao();
    }

    // Lógica de Submissão (POST/PUT)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const produtoData = {
            nome: document.getElementById('nome').value,
            preco: parseFloat(document.getElementById('preco').value),
            descricao: document.getElementById('descricao').value
        };

        let resultado;
        if (isEdit) {
            // Requisição PUT (Atualização)
            resultado = await requisicaoAPI(`${API_URL}/${produtoId}`, 'PUT', produtoData);
            if (resultado) alert('Produto atualizado com sucesso!');
        } else {
            // Requisição POST (Criação)
            resultado = await requisicaoAPI(API_URL, 'POST', produtoData);
            if (resultado) alert('Produto cadastrado com sucesso! ID: ' + resultado.id);
        }

        if (resultado) {
             window.location.href = 'index.html'; // Redireciona
        }
    });

    // Lógica de Exclusão (DELETE)
    btnExcluir.addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            const resultado = await requisicaoAPI(`${API_URL}/${produtoId}`, 'DELETE');
            if (resultado !== null) { // A função retorna null em sucesso para DELETE
                alert('Produto excluído com sucesso!');
                window.location.href = 'index.html';
            }
        }
    });
}