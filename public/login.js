function entrar() {
    var email = document.getElementById('email').value.trim().toLowerCase()
    var senha = document.getElementById('senha').value.trim()

    if (email == "" || senha == "") {
        alert("Preencha todos os campos!")
        return
    }

    fetch('http://localhost:3000/pessoas')
        .then(response => response.json())
        .then(data => {
            var pessoa = data.find(function(p) {
                return String(p.email).trim().toLowerCase() === email &&
                       String(p.senha).trim() === senha
            })

            if (pessoa) {
                sessionStorage.setItem('usuarioLogado', JSON.stringify(pessoa))
                if (pessoa.admin === true || pessoa.admin === "true") {
                    window.location.href = 'admin.html'
                } else {
                    window.location.href = 'bemvindo.html'
                }
            } else {
                alert("Email ou senha inválidos!")
            }
        })
        .catch(erro => {
            console.log('Erro:', erro)
            alert('Erro ao conectar com o servidor! O json-server está rodando?')
        })
}