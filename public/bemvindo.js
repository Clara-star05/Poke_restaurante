var usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'))

if (!usuario) {
    window.location.href = 'login.html'
} else {
    document.getElementById('saudacao').innerText = 'Olá, ' + usuario.nome + '!'

    if (usuario.admin === true || usuario.admin === "true") {
        document.getElementById('linkAdmin').style.display = 'inline-flex'
    }
}

var pokes = [
    {
        nome: 'Poke Salmão Clássico',
        descricao: 'Arroz japonês, salmão fresco em cubos, abacate, pepino sunomono, cebola roxa, gergelim e molho tarê.',
        preco: 44.90,
        tag: 'Mais Pedido'
    },
    {
        nome: 'Poke Tropical Manga & Camarão',
        descricao: 'Base de arroz ou mix de folhas, camarão grelhado, manga doce, cream cheese, chips de batata-doce e ponzu.',
        preco: 48.50,
        tag: 'Refrescante'
    },
    {
        nome: 'Poke Atum Spicy',
        descricao: 'Arroz gohan, atum fresco, edamame, cenoura ralada, cebolinha, gergelim torrado e maionese picante.',
        preco: 46.00,
        tag: 'Leve'
    }
]

var sushis = [
    {
        nome: 'Combinado Casa Poke (20 peças)',
        descricao: '8 uramakis salmão filadélfia, 4 hossomakis, 4 niguiris de salmão e 4 joês especiais.',
        preco: 59.90,
        tag: 'Especial'
    },
    {
        nome: 'Hot Roll Crocante (10 peças)',
        descricao: 'Sushi empanado e frito recheado com salmão, cream cheese e cebolinha, finalizado com molho tarê.',
        preco: 32.00,
        tag: 'Quente'
    },
    {
        nome: 'Niguiri Dupla Salmão & Camarão (8 peças)',
        descricao: '4 niguiris de salmão fresco maçaricado com raspas de limão e 4 niguiris de camarão.',
        preco: 36.50,
        tag: 'Clássico'
    }
]

var carrinho = []

function renderizarCatalogo(lista, containerId) {
    var container = document.getElementById(containerId)
    container.innerHTML = ''

    lista.forEach(function(item) {
        var card = document.createElement('div')
        card.className = 'card-produto'
        card.innerHTML = `
            <span class="tag-produto">${item.tag}</span>
            <h3>${item.nome}</h3>
            <p>${item.descricao}</p>
            <div class="rodape-card">
                <span class="preco-produto">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                <button class="botao botao-verde" onclick="adicionarItem('${item.nome}', ${item.preco})">+ Adicionar</button>
            </div>
        `
        container.appendChild(card)
    })
}

function adicionarItem(nome, preco) {
    carrinho.push({ nome: nome, preco: preco })
    atualizarCarrinho()
}

function atualizarCarrinho() {
    var resumo = document.getElementById('resumo-itens')
    var totalEl = document.getElementById('valor-total')

    if (carrinho.length === 0) {
        resumo.innerText = 'Nenhum item selecionado'
        totalEl.innerText = 'R$ 0,00'
        return
    }

    var total = carrinho.reduce((soma, item) => soma + item.preco, 0)
    resumo.innerText = carrinho.length + ' item(ns): ' + carrinho.map(i => i.nome).join(', ')
    totalEl.innerText = 'R$ ' + total.toFixed(2).replace('.', ',')
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert('Adicione pelo menos um Poke ou Sushi antes de finalizar!')
        return
    }
    alert('Pedido enviado para a cozinha da Casa Poke, ' + usuario.nome + '! Bom apetite!')
    carrinho = []
    atualizarCarrinho()
}

function sair() {
    sessionStorage.removeItem('usuarioLogado')
    window.location.href = 'index.html'
}

renderizarCatalogo(pokes, 'lista-pokes')
renderizarCatalogo(sushis, 'lista-sushis')