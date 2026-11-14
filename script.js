"use strict";

// ========================================
// CONFIGURAÇÕES
// ========================================

// Identificador do cartão NFC autorizado.
// Mantido conforme o seu projeto anterior.
const CARTAO_AUTORIZADO = "d7:4c:70:b1";

// Código fictício da surpresa.
const CODIGO_SECRETO = "VTG-7X29";

// ========================================
// ELEMENTOS
// ========================================

const telas = {
    nfc: document.getElementById("telaNFC"),
    terminal: document.getElementById("telaTerminal"),
    alerta: document.getElementById("telaAlerta"),
    codigo: document.getElementById("telaCodigo"),
    falha: document.getElementById("telaFalha"),
    quarto: document.getElementById("telaQuarto"),
    galeria: document.getElementById("telaGaleria")
};

const btnNFC = document.getElementById("btnNFC");
const btnTeste = document.getElementById("btnTeste");

const statusNFC = document.getElementById("statusNFC");
const entradaTerminal = document.getElementById("entradaTerminal");

const btnContinuarAlerta =
    document.getElementById("btnContinuarAlerta");

const entradaCodigo = document.getElementById("entradaCodigo");
const btnValidarCodigo = document.getElementById("btnValidarCodigo");
const mensagemCodigo = document.getElementById("mensagemCodigo");

const mensagensFalha = document.getElementById("mensagensFalha");
const progressoFalha = document.getElementById("progressoFalha");
const statusFalha = document.getElementById("statusFalha");

const bonequinho = document.getElementById("bonequinho");
const cobertor = document.querySelector(".cobertor");
const folhaJanela = document.getElementById("folhaJanela");

const textoBoo = document.getElementById("textoBoo");
const textoJanela = document.getElementById("textoJanela");
const mensagemQuarto = document.getElementById("mensagemQuarto");

const btnPularAnimacao =
    document.getElementById("btnPularAnimacao");

const notificacao = document.getElementById("notificacao");


// ========================================
// CONTROLE DAS TELAS
// ========================================

function mostrarTela(telaEscolhida) {
    Object.values(telas).forEach((tela) => {
        tela.classList.remove("ativa");
    });

    telaEscolhida.classList.add("ativa");

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}


// ========================================
// NOTIFICAÇÕES
// ========================================

let temporizadorNotificacao;

function notificar(mensagem) {
    notificacao.textContent = mensagem;
    notificacao.classList.add("mostrar");

    clearTimeout(temporizadorNotificacao);

    temporizadorNotificacao = setTimeout(() => {
        notificacao.classList.remove("mostrar");
    }, 3000);
}


// ========================================
// ACESSO AUTORIZADO
// ========================================

function liberarAcesso() {
    statusNFC.textContent = "Acesso autorizado!";

    mostrarTela(telas.terminal);

    setTimeout(() => {
        entradaTerminal.focus();
    }, 100);
}


// ========================================
// BOTÃO TEMPORÁRIO DE TESTE
// REMOVER NA VERSÃO FINAL
// ========================================

btnTeste.addEventListener("click", () => {
    liberarAcesso();
});


// ========================================
// LEITOR NFC
// ========================================

btnNFC.addEventListener("click", async () => {
    if (!("NDEFReader" in window)) {
        statusNFC.textContent =
            "Este navegador não oferece suporte ao Web NFC.";

        notificar(
            "Use um navegador compatível com Web NFC."
        );

        return;
    }

    try {
        const leitor = new NDEFReader();

        statusNFC.textContent =
            "Aproxime o cartão NFC do celular...";

        await leitor.scan();

        statusNFC.textContent =
            "Leitura iniciada. Aguardando cartão...";

        leitor.addEventListener("reading", (evento) => {
            const serial = (evento.serialNumber || "")
                .toLowerCase()
                .replace(/-/g, ":");

            console.log("Identificador NFC lido:", serial);

            if (serial === CARTAO_AUTORIZADO) {
                statusNFC.textContent =
                    "Cartão reconhecido!";

                liberarAcesso();
            } else {
                statusNFC.textContent =
                    "Cartão não reconhecido.";

                notificar("Cartão não reconhecido.");
            }
        });

        leitor.addEventListener("readingerror", () => {
            statusNFC.textContent =
                "Não foi possível ler este cartão.";
        });

    } catch (erro) {
        console.error("Erro NFC:", erro);

        statusNFC.textContent =
            "Não foi possível iniciar a leitura NFC.";

        notificar(
            "Verifique o navegador e a conexão segura HTTPS."
        );
    }
});


// ========================================
// TERMINAL: RESPOSTA S/N
// ========================================

entradaTerminal.addEventListener("keydown", (evento) => {
    if (evento.key !== "Enter") {
        return;
    }

    const resposta = entradaTerminal.value
        .trim()
        .toUpperCase();

    entradaTerminal.value = "";

    if (resposta === "N") {
        mostrarTela(telas.alerta);
        return;
    }

    if (resposta === "S") {
        mostrarTela(telas.codigo);

        setTimeout(() => {
            entradaCodigo.focus();
        }, 100);

        return;
    }

    notificar("Digite S para continuar ou N para ver o alerta.");
});


// ========================================
// ALERTA VERMELHO
// ========================================

btnContinuarAlerta.addEventListener("click", () => {
    mostrarTela(telas.terminal);

    setTimeout(() => {
        entradaTerminal.focus();
    }, 100);
});


// ========================================
// VALIDAR CÓDIGO FICTÍCIO
// ========================================

function validarCodigo() {
    const codigo = entradaCodigo.value
        .trim()
        .toUpperCase();

    if (codigo !== CODIGO_SECRETO) {
        mensagemCodigo.textContent =
            "Código incorreto. Tente novamente.";

        entradaCodigo.select();

        return;
    }

    mensagemCodigo.textContent = "";

    iniciarFalhaSimulada();
}

btnValidarCodigo.addEventListener("click", validarCodigo);

entradaCodigo.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        validarCodigo();
    }
});


// ========================================
// FALHA VISUAL SIMULADA
// ========================================

const mensagensErro = [
    "ERRO: Inicialização inesperada.",
    "Verificando integridade dos arquivos...",
    "AVISO: Interface instável.",
    "Tentando recuperar o sistema...",
    "Carregando componentes visuais...",
    "ERRO: Falha na interface.",
    "Iniciando recuperação...",
    "Preparando uma experiência especial..."
];

function esperar(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function iniciarFalhaSimulada() {
    mostrarTela(telas.falha);

    mensagensFalha.innerHTML = "";
    progressoFalha.style.width = "0%";

    for (let i = 0; i < mensagensErro.length; i++) {
        const linha = document.createElement("p");

        linha.textContent = "> " + mensagensErro[i];

        mensagensFalha.appendChild(linha);

        // Mantém as últimas linhas visíveis.
        while (mensagensFalha.children.length > 5) {
            mensagensFalha.removeChild(
                mensagensFalha.firstElementChild
            );
        }

        const porcentagem =
            Math.round(((i + 1) / mensagensErro.length) * 100);

        progressoFalha.style.width = porcentagem + "%";

        statusFalha.textContent =
            "Recuperando sistema... " + porcentagem + "%";

        await esperar(650);
    }

    statusFalha.textContent =
        "Recuperação visual concluída.";

    await esperar(1000);

    iniciarAnimacaoQuarto();
}


// ========================================
// ANIMAÇÃO DO QUARTO
// ========================================

let animacaoConcluida = false;
let temporizadoresAnimacao = [];

function agendarAnimacao(funcao, atraso) {
    const temporizador = setTimeout(funcao, atraso);

    temporizadoresAnimacao.push(temporizador);
}

function limparTemporizadoresAnimacao() {
    temporizadoresAnimacao.forEach(clearTimeout);
    temporizadoresAnimacao = [];
}

function iniciarAnimacaoQuarto() {
    animacaoConcluida = false;

    limparTemporizadoresAnimacao();

    bonequinho.classList.remove("acordando");
    cobertor.classList.remove("voando");
    folhaJanela.classList.remove("fechada");

    textoBoo.classList.remove("mostrar");
    textoJanela.classList.remove("mostrar");

    mensagemQuarto.textContent = "Tudo parece estar tranquilo...";

    mostrarTela(telas.quarto);

    // 1. Pequena pausa para criar expectativa.
    agendarAnimacao(() => {
        mensagemQuarto.textContent =
            "Enquanto isso, em um quarto qualquer...";
    }, 800);

    // 2. O bonequinho começa a acordar.
    agendarAnimacao(() => {
        mensagemQuarto.textContent =
            "O bonequinho ouviu alguma coisa!";

        bonequinho.classList.add("acordando");
        cobertor.classList.add("voando");

        tocarSomDespertar();
    }, 2400);

    // 3. O bonequinho fecha a janela com força.
    agendarAnimacao(() => {
        folhaJanela.classList.add("fechada");

        tocarSomJanela();

        textoJanela.classList.remove("mostrar");

        // Reinicia a animação do texto.
        void textoJanela.offsetWidth;

        textoJanela.classList.add("mostrar");

        tremerTela();
    }, 3700);

    // 4. O BOOOOO aparece!
    agendarAnimacao(() => {
        textoBoo.classList.remove("mostrar");

        void textoBoo.offsetWidth;

        textoBoo.classList.add("mostrar");

        mensagemQuarto.textContent = "";

        tocarSomBoo();
    }, 4100);

    // 5. Pausa e transição para a galeria.
    agendarAnimacao(() => {
        if (!animacaoConcluida) {
            abrirGaleria();
        }
    }, 6900);
}


// ========================================
// EFEITO DE TREMER A TELA
// ========================================

function tremerTela() {
    const quarto = document.querySelector(".quarto");

    quarto.animate(
        [
            { transform: "translateX(0)" },
            { transform: "translateX(-8px)" },
            { transform: "translateX(8px)" },
            { transform: "translateX(-5px)" },
            { transform: "translateX(5px)" },
            { transform: "translateX(0)" }
        ],
        {
            duration: 350,
            easing: "steps(5, end)"
        }
    );
}


// ========================================
// SONS GERADOS PELO NAVEGADOR
// ========================================

let contextoAudio = null;

function obterAudio() {
    if (!contextoAudio) {
        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) {
            return null;
        }

        contextoAudio = new AudioContext();
    }

    if (contextoAudio.state === "suspended") {
        contextoAudio.resume();
    }

    return contextoAudio;
}


// Pequeno som eletrônico ao acordar.
function tocarSomDespertar() {
    const audio = obterAudio();

    if (!audio) {
        return;
    }

    const inicio = audio.currentTime;

    const oscilador = audio.createOscillator();
    const volume = audio.createGain();

    oscilador.type = "square";

    oscilador.frequency.setValueAtTime(
        180,
        inicio
    );

    oscilador.frequency.exponentialRampToValueAtTime(
        330,
        inicio + 0.18
    );

    volume.gain.setValueAtTime(0.0001, inicio);

    volume.gain.exponentialRampToValueAtTime(
        0.08,
        inicio + 0.025
    );

    volume.gain.exponentialRampToValueAtTime(
        0.0001,
        inicio + 0.24
    );

    oscilador.connect(volume);
    volume.connect(audio.destination);

    oscilador.start(inicio);
    oscilador.stop(inicio + 0.25);
}


// Som sintetizado de uma janela batendo.
function tocarSomJanela() {
    const audio = obterAudio();

    if (!audio) {
        return;
    }

    const inicio = audio.currentTime;

    // Ruído curto para simular a pancada.
    const duracao = 0.24;
    const tamanho = Math.floor(audio.sampleRate * duracao);

    const buffer = audio.createBuffer(
        1,
        tamanho,
        audio.sampleRate
    );

    const canal = buffer.getChannelData(0);

    for (let i = 0; i < tamanho; i++) {
        const envelope = Math.exp(-i / (tamanho * 0.12));

        canal[i] = (Math.random() * 2 - 1) * envelope;
    }

    const fonte = audio.createBufferSource();
    const filtro = audio.createBiquadFilter();
    const volume = audio.createGain();

    fonte.buffer = buffer;

    filtro.type = "lowpass";
    filtro.frequency.setValueAtTime(900, inicio);

    volume.gain.setValueAtTime(0.0001, inicio);

    volume.gain.exponentialRampToValueAtTime(
        0.65,
        inicio + 0.012
    );

    volume.gain.exponentialRampToValueAtTime(
        0.0001,
        inicio + duracao
    );

    fonte.connect(filtro);
    filtro.connect(volume);
    volume.connect(audio.destination);

    fonte.start(inicio);

    // Pequena ressonância grave.
    const grave = audio.createOscillator();
    const volumeGrave = audio.createGain();

    grave.type = "triangle";

    grave.frequency.setValueAtTime(110, inicio);

    grave.frequency.exponentialRampToValueAtTime(
        55,
        inicio + 0.18
    );

    volumeGrave.gain.setValueAtTime(0.25, inicio);

    volumeGrave.gain.exponentialRampToValueAtTime(
        0.0001,
        inicio + 0.2
    );

    grave.connect(volumeGrave);
    volumeGrave.connect(audio.destination);

    grave.start(inicio);
    grave.stop(inicio + 0.21);
}


// Efeito sonoro eletrônico curto para o BOO.
function tocarSomBoo() {
    const audio = obterAudio();

    if (!audio) {
        return;
    }

    const inicio = audio.currentTime;

    const oscilador = audio.createOscillator();
    const volume = audio.createGain();

    oscilador.type = "sawtooth";

    oscilador.frequency.setValueAtTime(
        500,
        inicio
    );

    oscilador.frequency.exponentialRampToValueAtTime(
        170,
        inicio + 0.3
    );

    volume.gain.setValueAtTime(0.0001, inicio);

    volume.gain.exponentialRampToValueAtTime(
        0.12,
        inicio + 0.025
    );

    volume.gain.exponentialRampToValueAtTime(
        0.0001,
        inicio + 0.34
    );

    oscilador.connect(volume);
    volume.connect(audio.destination);

    oscilador.start(inicio);
    oscilador.stop(inicio + 0.35);
}


// ========================================
// PULAR ANIMAÇÃO
// ========================================

btnPularAnimacao.addEventListener("click", () => {
    abrirGaleria();
});


// ========================================
// ABRIR GALERIA
// ========================================

function abrirGaleria() {
    if (animacaoConcluida) {
        return;
    }

    animacaoConcluida = true;

    limparTemporizadoresAnimacao();

    mostrarTela(telas.galeria);

    notificar("Surpresa desbloqueada ❤️");

    // Desloca a página para o início da galeria.
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ========================================
// INICIALIZAÇÃO
// ========================================

console.log("Sistema de surpresa inicializado.");

console.log(
    "Modo de teste disponível. Remova o botão de teste antes da versão final."
);