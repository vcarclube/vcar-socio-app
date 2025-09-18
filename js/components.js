/**
 * Componentes reutilizáveis para a aplicação VCarClube
 */

/**
 * Inicializa a funcionalidade de arrastar para um modal
 * @param {string} modalSelector - Seletor do modal
 * @param {string} dragIndicatorSelector - Seletor do indicador de arrasto
 * @param {Function} closeModalFunction - Função para fechar o modal
 */
function initDraggableModal(modalSelector, dragIndicatorSelector, closeModalFunction) {
    const dragIndicator = document.querySelector(dragIndicatorSelector);
    const modalContent = document.querySelector(modalSelector);

    if (!dragIndicator || !modalContent) {
        console.error('Elementos de arrasto não encontrados:', { dragIndicator, modalContent });
        return;
    }

    let startY = 0;
    let currentY = 0;

    function handleDragStart(e) {
        startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        currentY = startY;

        dragIndicator.style.cursor = 'grabbing';

        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
    }

    function handleDragMove(e) {
        if (e.type === 'touchmove') {
            e.preventDefault(); // Prevenir scroll durante o arrasto
        }

        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        const diffY = clientY - startY;

        // Permitir arrasto em ambas as direções (para cima e para baixo)
        currentY = clientY;
        modalContent.style.transform = `translateY(${diffY}px)`;
        // Garantir que o backdrop não se mova durante o arrasto
        const modalParent = modalContent.closest('.modal');
        if (modalParent) {
            const backdrop = modalParent.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.style.transform = 'none';
            }
        }
    }

    function handleDragEnd() {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchend', handleDragEnd);

        dragIndicator.style.cursor = 'grab';

        const diffY = currentY - startY;

        // Se arrastar mais de 100px para baixo ou mais de 100px para cima, fechar o modal
        if (diffY > 100 || diffY < -100) {
            closeModalFunction();
        } else {
            // Caso contrário, voltar à posição original
            modalContent.style.transform = 'translateY(0)';
        }
    }

    dragIndicator.addEventListener('mousedown', handleDragStart);
    dragIndicator.addEventListener('touchstart', handleDragStart, { passive: false });
}

/**
 * Cria e insere o componente de header na página
 */
function createHeader() {
    const headerHTML = `
    <header class="header">
        <div class="header-container">
            <div class="logo" onclick="window.location.href='index.html'">
                <img src="img/logo-preto.png" alt="VCarClube Logo">
            </div>
            <div class="location">
                <i class="fas fa-map-marker-alt"></i>
                <span>Sua localização atual</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="user-profile" onclick="window.location.href='profile.html'">
                <i class="fas fa-user-circle"></i>
            </div>
        </div>
    </header>
    `;

    // Inserir o header no início do body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

/**
 * Cria e insere o componente de navegação inferior na página
 * @param {string} activePage - Nome da página ativa (home, vehicles, appointments, services, menu)
 */
function createBottomNav(activePage) {
    const bottomNavHTML = `
    <nav class="bottom-nav">
        <div class="nav-item ${activePage === 'home' ? 'active' : ''}" data-page="index.html">
            <div class="nav-content">
                <ion-icon name="${activePage === 'home' ? 'home' : 'home-outline'}"></ion-icon>
                <span>Início</span>
            </div>
        </div>
        <div class="nav-item ${activePage === 'vehicles' ? 'active' : ''}" data-page="vehicles.html">
            <div class="nav-content">
                <ion-icon name="${activePage === 'vehicles' ? 'car' : 'car-outline'}"></ion-icon>
                <span>Veículos</span>
            </div>
        </div>
        <div class="nav-item nav-item-center ${activePage === 'appointments' ? 'active' : ''}" data-page="appointments.html">
            <div class="nav-content">
                <div class="center-button">
                    <ion-icon name="calendar"></ion-icon>
                </div>
                <span>Agendamentos</span>
            </div>
        </div>
        <div class="nav-item ${activePage === 'services' ? 'active' : ''}" data-page="services.html">
            <div class="nav-content">
                <ion-icon name="${activePage === 'services' ? 'construct' : 'construct-outline'}"></ion-icon>
                <span>Serviços</span>
            </div>
        </div>
        <div class="nav-item ${activePage === 'menu' ? 'active' : ''}" data-action="menu">
            <div class="nav-content">
                <ion-icon name="${activePage === 'menu' ? 'menu' : 'menu-outline'}"></ion-icon>
                <span>Menu</span>
            </div>
        </div>
    </nav>
    `;

    // Inserir a navegação inferior no final do body
    document.body.insertAdjacentHTML('beforeend', bottomNavHTML);

    // Adicionar eventos de clique para navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            const action = this.getAttribute('data-action');
            
            if (action === 'menu') {
                // Abrir o drawer menu
                if (window.drawerMenu) {
                    window.drawerMenu.open();
                } else if (window.DrawerMenu) {
                    DrawerMenu.getInstance().open();
                }
            } else if (page) {
                // Navegar para a página
                window.location.href = page;
            }
        });
    });

    // Adicionar efeito de pressionar ao botão central
    const centerButton = document.querySelector('.center-button');
    if (centerButton) {
        centerButton.addEventListener('mousedown', () => {
            centerButton.style.transform = 'scale(0.95)';
        });

        centerButton.addEventListener('mouseup', () => {
            centerButton.style.transform = 'scale(1)';
        });

        centerButton.addEventListener('mouseleave', () => {
            centerButton.style.transform = 'scale(1)';
        });
    }
}

/**
 * Cria o HTML para o indicador de arrasto do modal
 * @returns {string} HTML do indicador de arrasto
 */
function getDragIndicatorHTML() {
    return `<div class="modal-drag-indicator" style='display: none;'><div class="drag-handle"></div></div>`;
}

/**
 * Nota: A classe DrawerMenu foi movida para o arquivo drawer.js
 * Este componente agora é gerenciado como um singleton no arquivo dedicado
 */



/**
 * Função legada para criar o menu drawer
 * Mantida para compatibilidade, mas agora delega para o componente DrawerMenu
 */
function createDrawerMenu() {
    console.log('createDrawerMenu chamado - delegando para DrawerMenu');
    
    // Verificar se o DrawerMenu está disponível
    if (typeof DrawerMenu !== 'undefined') {
        // Usar o componente DrawerMenu
        return DrawerMenu.getInstance();
    } else {
        console.error('DrawerMenu não está disponível. Certifique-se de que o arquivo drawer.js está carregado.');
    }
}

// Exportar as funções para uso em outros arquivos
window.Components = {
    createHeader,
    createBottomNav,
    createDrawerMenu,
    initDraggableModal,
    getDragIndicatorHTML
};