var dadosUsuarios = []

// Verificar acesso do administrador
var usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'))

if (!usuarioLogado || !(usuarioLogado.admin === true || usuarioLogado.admin === "true")) {
    alert('Acesso negado!')
    window.location.href = 'login.html'
} else {
    document.getElementById('conteudo').style.display = 'block'
    carregarUsuarios()
}

// Mostrar todos os usuários
function carregarUsuarios() {
    fetch('http://localhost:3000/pessoas')
        .then(resposta => resposta.json())
        .then(dados => {
            dadosUsuarios = dados
            mostrarUsuarios(dadosUsuarios)
        })
        .catch(() => alert('Erro ao conectar com o servidor!'))
}

// Criar a tabela
function mostrarUsuarios(dados) {
    var tabela = document.getElementById('tabela-corpo')
    tabela.innerHTML = ''

    dados.forEach(pessoa => {
        var linha = document.createElement('tr')
        var nome = document.createElement('td')
        var email = document.createElement('td')
        var cpf = document.createElement('td')
        var telefone = document.createElement('td')
        var cidade = document.createElement('td')
        var acoes = document.createElement('td')

        nome.innerText = pessoa.nome + ' ' + pessoa.sobrenome
        email.innerText = pessoa.email
        cpf.innerText = pessoa.cpf
        telefone.innerText = pessoa.telefone
        cidade.innerText = pessoa.cidade + '/' + pessoa.estado

        var ehAdmin = (pessoa.admin === true || pessoa.admin === "true" || pessoa.id == usuarioLogado.id)

        if (ehAdmin) {
            acoes.innerHTML = '<span style="color: #245b43; font-weight: 700;">Administrador (Protegido)</span>'
        } else {
            var botaoEditar = document.createElement('button')
            botaoEditar.innerText = 'Editar'
            botaoEditar.onclick = function() {
                abrirModalEdicao(pessoa)
            }

            var botaoApagar = document.createElement('button')
            botaoApagar.innerText = 'Apagar'
            botaoApagar.onclick = function() {
                apagarUsuario(pessoa)
            }

            acoes.appendChild(botaoEditar)
            acoes.appendChild(botaoApagar)
        }

        linha.appendChild(nome)
        linha.appendChild(email)
        linha.appendChild(cpf)
        linha.appendChild(telefone)
        linha.appendChild(cidade)
        linha.appendChild(acoes)
        tabela.appendChild(linha)
    })
}

// Buscar pelo CPF
function buscarUsuario() {
    var cpf = document.getElementById('buscarCPF').value
    cpf = cpf.replace(/\D/g, '')

    var resultado = dadosUsuarios.filter(pessoa =>
        String(pessoa.cpf).replace(/\D/g, '') === cpf
    )

    if (resultado.length > 0) {
        mostrarUsuarios(resultado)
    } else {
        alert('Usuário não encontrado!')
        mostrarUsuarios([])
    }
}

// Abrir modal com todos os dados e a senha
function abrirModalEdicao(pessoa) {
    document.getElementById('edit-id').value = pessoa.id
    document.getElementById('edit-nome').value = pessoa.nome || ''
    document.getElementById('edit-sobrenome').value = pessoa.sobrenome || ''
    document.getElementById('edit-cpf').value = pessoa.cpf || ''
    document.getElementById('edit-telefone').value = pessoa.telefone || ''
    document.getElementById('edit-email').value = pessoa.email || ''
    document.getElementById('edit-senha').value = pessoa.senha || ''
    document.getElementById('edit-rua').value = pessoa.rua || ''
    document.getElementById('edit-cep').value = pessoa.cep || ''
    document.getElementById('edit-cidade').value = pessoa.cidade || ''
    document.getElementById('edit-estado').value = pessoa.estado || ''

    document.getElementById('modal-edicao').style.display = 'flex'
}

function fecharModal() {
    document.getElementById('modal-edicao').style.display = 'none'
}

// Salvar edição do usuário
function salvarEdicao() {
    var id = document.getElementById('edit-id').value
    var novo = {
        id: id,
        nome: document.getElementById('edit-nome').value.trim(),
        sobrenome: document.getElementById('edit-sobrenome').value.trim(),
        cpf: document.getElementById('edit-cpf').value.trim(),
        telefone: document.getElementById('edit-telefone').value.trim(),
        email: document.getElementById('edit-email').value.trim().toLowerCase(),
        senha: document.getElementById('edit-senha').value.trim(),
        rua: document.getElementById('edit-rua').value.trim(),
        cep: document.getElementById('edit-cep').value.trim(),
        cidade: document.getElementById('edit-cidade').value.trim(),
        estado: document.getElementById('edit-estado').value.trim(),
        admin: false
    }

    if (!novo.nome || !novo.sobrenome || !novo.cpf || !novo.email || !novo.senha) {
        alert('Preencha os campos obrigatórios!')
        return
    }

    fetch(`http://localhost:3000/pessoas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novo)
    })
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error('Não foi possível atualizar o usuário.')
        }
        alert('Usuário atualizado com sucesso!')
        fecharModal()
        carregarUsuarios()
    })
    .catch(() => alert('Erro ao atualizar o usuário!'))
}

// Apagar usuário
function apagarUsuario(pessoa) {
    if (pessoa.admin === true || pessoa.admin === "true" || pessoa.id == usuarioLogado.id) {
        alert('A conta do administrador não pode ser apagada!')
        return
    }

    if (confirm('Tem certeza que deseja apagar o usuário ' + pessoa.nome + '?')) {
        fetch(`http://localhost:3000/pessoas/${pessoa.id}`, {
            method: 'DELETE'
        })
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Não foi possível apagar o usuário.')
            }
            alert('Usuário apagado!')
            carregarUsuarios()
        })
        .catch(() => alert('Erro ao apagar o usuário!'))
    }
}

// Sair da administração
function sairAdmin() {
    sessionStorage.removeItem('usuarioLogado')
    window.location.href = 'index.html'
}