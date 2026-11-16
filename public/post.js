// Função para enviar os dados POST - CREATE
function enviarDados() {
    var nome = document.getElementById('nome').value.trim()
    var sobrenome = document.getElementById('sobrenome').value.trim()
    var cpf = document.getElementById('cpf').value.trim()
    var email = document.getElementById('email').value.trim().toLowerCase()
    var senha = document.getElementById('senha').value.trim()
    var rua = document.getElementById('rua').value.trim()
    var cep = document.getElementById('cep').value.trim()
    var cidade = document.getElementById('cidade').value.trim()
    var estado = document.getElementById('estado').value.trim()
    var telefone = document.getElementById('telefone').value.trim()

    if (nome == "" || sobrenome == "" || cpf == "" || email == "" || senha == "" ||
        rua == "" || cep == "" || cidade == "" || estado == "" || telefone == "") {
        alert('Preencha todos os campos!')
        return
    }

    fetch('http://localhost:3000/pessoas')
        .then(resposta => resposta.json())
        .then(dados => {
            var repetido = dados.find(pessoa =>
                String(pessoa.cpf).replace(/\D/g, '') == cpf.replace(/\D/g, '') ||
                String(pessoa.email).trim().toLowerCase() == email
            )

            if (repetido) {
                alert('CPF ou email já cadastrado!')
            } else {
                fetch('http://localhost:3000/pessoas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nome: nome,
                        sobrenome: sobrenome,
                        cpf: cpf,
                        email: email,
                        senha: String(senha),
                        rua: rua,
                        cep: cep,
                        cidade: cidade,
                        estado: estado,
                        telefone: telefone,
                        admin: false
                    })
                })
                .then(resposta => {
                    if (!resposta.ok) {
                        throw new Error('Não foi possível realizar o cadastro.')
                    }
                    return resposta.json()
                })
                .then(() => {
                    alert('Cadastro realizado com sucesso!')
                    window.location.href = 'login.html'
                })
            }
        })
        .catch(erro => {
            console.log('Erro:', erro)
            alert('Erro ao conectar com o servidor!')
        })
}