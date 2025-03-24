document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.getElementById('terminal');
    const userInput = document.getElementById('user-input');
    const timerDisplay = document.getElementById('timer');
    
    // Variáveis do jogo
    let gameState = 'setup';
    let objetivo = '';
    let rodada = 1;
    let timeLeft = 180; // 3 minutos em segundos
    let timer;
    let isPlayerTurn = true;

    // Elementos de áudio (opcional)
    const diceSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3');
    const winSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
    const loseSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3');

    // Mostra mensagem no terminal
    function print(text, type = 'system') {
        const line = document.createElement('div');
        switch(type) {
            case 'player':
                line.className = 'player';
                line.textContent = `JOGADOR: ${text}`;
                break;
            case 'master':
                line.className = 'master';
                line.textContent = `MESTRE: ${text}`;
                break;
            case 'dice':
                line.className = 'dice';
                line.textContent = `🎲 ${text}`;
                break;
            case 'goal':
                line.className = 'goal';
                line.textContent = `OBJETIVO: ${text}`;
                break;
            default:
                line.textContent = text;
        }
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    // Atualiza o timer
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `Tempo restante: ${minutes}:${seconds}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            print('⏰ TEMPO ESGOTADO! O jogador não conseguiu completar o objetivo a tempo!', 'system');
            loseSound.play();
            endGame(false);
        }
        timeLeft--;
    }

    // Rola o dado
    function rollDice() {
        const result = Math.floor(Math.random() * 6) + 1;
        diceSound.play();
        print(`Resultado do dado: ${result} (${result <= 3 ? 'NEGATIVO' : 'POSITIVO'})`, 'dice');
        return result;
    }

    // Finaliza o jogo
    function endGame(success) {
        clearInterval(timer);
        userInput.disabled = true;
        
        if (success) {
            print('🎉 PARABÉNS! Você completou o objetivo dentro do tempo!', 'system');
            winSound.play();
        } else {
            print('💀 O MESTRE VENCEU! Melhor sorte na próxima vez!', 'system');
            loseSound.play();
        }
        
        print('\nRecarregue a página para jogar novamente.', 'system');
    }

    // Processa o input do usuário
    function processInput() {
        const text = userInput.value.trim();
        if (!text) return;
        
        userInput.value = '';
        
        if (text.toLowerCase() === 'sair') {
            endGame(false);
            return;
        }

        switch(gameState) {
            case 'setup':
                objetivo = text;
                print(text, 'goal');
                print('\nJOGADOR, descreva sua primeira ação:', 'system');
                gameState = 'player-turn';
                isPlayerTurn = true;
                // Inicia o timer quando o jogo começa
                timer = setInterval(updateTimer, 1000);
                break;
                
            case 'player-turn':
                print(text, 'player');
                print('\nRole o dado (digite "rolar")', 'system');
                gameState = 'roll-dice';
                break;
                
            case 'roll-dice':
                if (text.toLowerCase() === 'rolar') {
                    const diceResult = rollDice();
                    if (diceResult <= 3) {
                        print('\nMESTRE, descreva um cenário NEGATIVO:', 'system');
                    } else {
                        print('\nMESTRE, descreva um cenário POSITIVO:', 'system');
                    }
                    gameState = 'master-turn';
                    isPlayerTurn = false;
                } else {
                    print('Digite "rolar" para rolar o dado', 'system');
                }
                break;
                
            case 'master-turn':
                print(text, 'master');
                rodada++;
                
                if (rodada > 5) {
                    print('\nFim das 5 rodadas! O jogador alcançou o objetivo? (sim/não)', 'system');
                    gameState = 'end-game';
                } else {
                    print(`\nRodada ${rodada} de 5`, 'system');
                    print('JOGADOR, qual sua próxima ação?', 'system');
                    gameState = 'player-turn';
                    isPlayerTurn = true;
                }
                break;
                
            case 'end-game':
                if (text.toLowerCase() === 'sim') {
                    endGame(true);
                } else {
                    endGame(false);
                }
                break;
        }
    }

    // Configura eventos
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processInput();
        }
    });

    // Mensagem inicial
    print('=== RPG MESTRE E JOGADOR ===', 'system');
    print('REGRAS:', 'system');
    print('- 3 minutos para completar o objetivo', 'system');
    print('- 5 rodadas alternadas entre jogador e mestre', 'system');
    print('- Dado 1-3: cenário negativo | 4-6: positivo', 'system');
    print('Digite "sair" a qualquer momento para encerrar', 'system');
    print('-------------------------------------', 'system');
    print('MESTRE, defina o objetivo do jogador:', 'system');
});