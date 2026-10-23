
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

function definirMenu(aberto) {
    navMenu.classList.toggle('active', aberto);
    menuToggle.setAttribute('aria-expanded', String(aberto));
    menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        definirMenu(!navMenu.classList.contains('active'));
    });
    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => definirMenu(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) definirMenu(false);
    });
}
const tabLogin = document.getElementById('tabLogin');
const tabCadastro = document.getElementById('tabCadastro');
const loginForm = document.getElementById('loginForm');
const cadastroForm = document.getElementById('cadastroForm');

const modal = document.getElementById('modalSucesso');
const modalTexto = document.getElementById('modalTexto');
const btnFecharModal = document.getElementById('fecharModal');

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function contarLetras(texto) {
    const letras = texto.match(/\p{L}/gu);
    return letras ? letras.length : 0;
}

function aplicarValidacao(input, condicaoInvalida) {
    const pai = input.parentElement;
    pai.classList.toggle('invalid', condicaoInvalida);
    input.setAttribute('aria-invalid', String(condicaoInvalida));
    return !condicaoInvalida;
}

function limparErros(form) {
    form.querySelectorAll('.form-group').forEach((grupo) => grupo.classList.remove('invalid'));
    form.querySelectorAll('input').forEach((input) => input.removeAttribute('aria-invalid'));
}

const regras = {
    loginEmail: (v) => !validarEmail(v.trim()),
    loginSenha: (v) => v.trim() === '',
    nome: (v) => contarLetras(v) < 3,
    email: (v) => !validarEmail(v.trim()),
    senha: (v) => v.trim() === '' || v.length < 6,
};

function ativarValidacaoAoDigitar(form) {
    form.querySelectorAll('input').forEach((input) => {
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('invalid')) {
                aplicarValidacao(input, regras[input.id](input.value));
            }
        });
    });
}

function mostrarAba(aba) {
    const irParaLogin = aba === 'login';

    tabLogin.classList.toggle('active', irParaLogin);
    tabCadastro.classList.toggle('active', !irParaLogin);
    tabLogin.setAttribute('aria-selected', String(irParaLogin));
    tabCadastro.setAttribute('aria-selected', String(!irParaLogin));
    loginForm.classList.toggle('active', irParaLogin);
    cadastroForm.classList.toggle('active', !irParaLogin);

    limparErros(loginForm);
    limparErros(cadastroForm);
}

if (tabLogin && tabCadastro && loginForm && cadastroForm) {
    tabLogin.addEventListener('click', () => mostrarAba('login'));
    tabCadastro.addEventListener('click', () => mostrarAba('cadastro'));
}

let elementoAnterior = null;

function abrirModal(mensagem) {
    if (!modal) return;
    elementoAnterior = document.activeElement;
    modalTexto.textContent = mensagem;
    modal.classList.add('show');
    if (btnFecharModal) btnFecharModal.focus();
}

function fecharModal() {
    if (!modal) return;
    modal.classList.remove('show');
    if (elementoAnterior && typeof elementoAnterior.focus === 'function') {
        elementoAnterior.focus();
    }
}

if (btnFecharModal && modal) {
    btnFecharModal.addEventListener('click', fecharModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) fecharModal();
    });
}

if (loginForm) {
    ativarValidacaoAoDigitar(loginForm);

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail');
        const senha = document.getElementById('loginSenha');

        const v1 = aplicarValidacao(email, regras.loginEmail(email.value));
        const v2 = aplicarValidacao(senha, regras.loginSenha(senha.value));

        if (v1 && v2) {
            abrirModal('Bem-vindo de volta! Login efetuado com sucesso.');
            loginForm.reset();
            limparErros(loginForm);
        }
    });
}

if (cadastroForm) {
    ativarValidacaoAoDigitar(cadastroForm);

    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const senha = document.getElementById('senha');

        const v1 = aplicarValidacao(nome, regras.nome(nome.value));
        const v2 = aplicarValidacao(email, regras.email(email.value));
        const v3 = aplicarValidacao(senha, regras.senha(senha.value));

        if (v1 && v2 && v3) {
            abrirModal('Cadastro realizado! Obrigado por apoiar as escolas ribeirinhas.');
            cadastroForm.reset();
            limparErros(cadastroForm);
        }
    });
}
