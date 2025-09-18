// Navegação entre páginas e controle do drawer menu

document.addEventListener('DOMContentLoaded', function() {
    initPageNavigation();
    // initDrawerMenu será chamado após a criação do menu drawer em main.js
});

// Inicializar navegação entre páginas
function initPageNavigation() {
    // Adicionar evento para o botão de menu
    addMenuToggleEvent();
}

/**
 * Adiciona evento de clique ao botão de menu para abrir o drawer
 * Função mantida para compatibilidade, agora delega para o componente DrawerMenu
 */
function addMenuToggleEvent() {
    console.log('addMenuToggleEvent chamado - delegando para DrawerMenu');
    
    // Verificar se o DrawerMenu está disponível
    if (typeof DrawerMenu !== 'undefined') {
        // Usar o componente DrawerMenu para configurar eventos padrão
        DrawerMenu.getInstance().setupMenuToggleEvents();
        
        // Adicionar evento específico para o botão do menu na navegação inferior
        const menuButton = document.querySelector('.nav-item [data-action="menu"]');
        if (menuButton) {
            console.log('Botão de menu na navegação inferior encontrado, adicionando evento');
            
            // Remover eventos anteriores usando o método cloneNode
            const newMenuButton = menuButton.cloneNode(true);
            menuButton.parentNode.replaceChild(newMenuButton, menuButton);
            
            // Adicionar novo evento de clique
            newMenuButton.addEventListener('click', function(e) {
                console.log('Clique no botão de menu do bottom tab navigation');
                // Abrir o drawer diretamente usando a instância do DrawerMenu
                if (window.drawerMenu) {
                    console.log('Usando window.drawerMenu.open()');
                    window.drawerMenu.open();
                } else {
                    console.log('Usando DrawerMenu.getInstance().open()');
                    DrawerMenu.getInstance().open();
                }
            });
        }
    } else {
        console.error('DrawerMenu não está disponível. Certifique-se de que o arquivo drawer.js está carregado.');
    }
    
    // Atualizar ícones e classes ativas com base na página atual
    updateActiveNavItem();
    
    // Função para atualizar o item de navegação ativo com base na URL atual
    function updateActiveNavItem() {
        const currentPath = window.location.pathname;
        const navItems = document.querySelectorAll('.nav-item');
        
        // Remover classe ativa de todos os itens
        navItems.forEach(item => {
            item.classList.remove('active');
            
            // Atualizar ícones para outline
            const icon = item.querySelector('ion-icon');
            if (icon) {
                const iconName = icon.getAttribute('name');
                if (iconName && !iconName.includes('-outline') && iconName !== 'calendar') {
                    icon.setAttribute('name', iconName + '-outline');
                }
            }
        });
        
        // Definir o item ativo com base na URL atual
        let activeItemText = '';
        
        if (currentPath.includes('vehicles.html')) {
            activeItemText = 'Veículos';
        } else if (currentPath.includes('appointments.html')) {
            activeItemText = 'Agendamentos';
        } else if (currentPath.includes('services.html')) {
            activeItemText = 'Serviços';
        } else if (currentPath.includes('index.html')) {
            activeItemText = 'Início';
        } else if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/vcar/')) {
            activeItemText = 'Início';
        }
        
        // Aplicar classe ativa e atualizar ícone
        navItems.forEach(item => {
            const itemText = item.querySelector('span').textContent.trim();
            if (itemText === activeItemText) {
                item.classList.add('active');
                
                // Atualizar ícone para filled
                const icon = item.querySelector('ion-icon');
                if (icon) {
                    const iconName = icon.getAttribute('name');
                    if (iconName && iconName.includes('-outline')) {
                        icon.setAttribute('name', iconName.replace('-outline', ''));
                    }
                }
            }
        });
    }
    
    // Chamar a função quando a página carregar
    updateActiveNavItem();
}

// Inicializar drawer menu
function initDrawerMenu() {
    console.log('initDrawerMenu chamado');
    // Verificar se o drawer menu existe
    const drawerMenu = document.querySelector('.drawer-menu');
    if (!drawerMenu) {
        console.error('Drawer menu não encontrado no DOM');
        return;
    }
    
    // Adicionar evento de clique ao overlay existente
    const overlay = document.querySelector('.drawer-overlay');
    if (overlay) {
        console.log('Overlay encontrado, adicionando evento de clique');
        // Remover eventos anteriores para evitar duplicação
        overlay.removeEventListener('click', closeDrawerMenu);
        // Adicionar evento de clique
        overlay.addEventListener('click', () => {
            console.log('Overlay clicado, fechando drawer menu');
            closeDrawerMenu();
        });
    } else {
        console.error('Overlay não encontrado no DOM');
    }
    
    // Adicionar evento para o botão de fechar
    const closeButton = document.querySelector('.drawer-close');
    if (closeButton) {
        console.log('Botão de fechar encontrado, adicionando evento de clique');
        // Remover eventos anteriores para evitar duplicação
        closeButton.removeEventListener('click', closeDrawerMenu);
        closeButton.addEventListener('click', () => {
            console.log('Botão de fechar clicado, fechando drawer menu');
            closeDrawerMenu();
        });
    } else {
        console.error('Botão de fechar não encontrado no DOM');
    }
    
    // Adicionar eventos para os itens do menu
    const drawerItems = document.querySelectorAll('.drawer-item');
    drawerItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemText = item.querySelector('span').textContent.trim();
            
            // Implementar ações para cada item do menu
            switch(itemText) {
                case 'Perfil':
                    console.log('Navegando para Perfil');
                    // Implementar navegação para perfil
                    break;
                case 'Meus Veículos':
                    window.location.href = window.location.pathname.includes('/pages/') ? 
                        'vehicles.html' : 'pages/vehicles.html';
                    break;
                case 'Configurações':
                    console.log('Navegando para Configurações');
                    // Implementar navegação para configurações
                    break;
                case 'Suporte':
                    console.log('Navegando para Suporte');
                    // Implementar navegação para suporte
                    break;
                case 'Sair':
                    console.log('Realizando logout');
                    // Implementar logout
                    break;
                default:
                    break;
            }
            
            // Fechar o drawer após a seleção
            closeDrawerMenu();
        });
    });
}

/**
 * Abre ou fecha o menu drawer
 * Função mantida para compatibilidade, agora delega para o componente DrawerMenu
 */
function toggleDrawerMenu() {
    console.log('toggleDrawerMenu chamado - delegando para DrawerMenu');
    
    // Verificar se o DrawerMenu está disponível
    if (typeof DrawerMenu !== 'undefined') {
        // Usar o componente DrawerMenu
        DrawerMenu.getInstance().toggle();
    } else {
        console.error('DrawerMenu não está disponível. Certifique-se de que o arquivo drawer.js está carregado.');
    }
}

// Fechar drawer menu
function closeDrawerMenu() {
    const drawer = document.querySelector('.drawer-menu');
    const overlay = document.querySelector('.drawer-overlay');
    
    if (!drawer || !overlay) {
        console.error('Drawer menu ou overlay não encontrado');
        return;
    }
    
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('drawer-open');
    document.body.style.overflow = ''; // Restaurar rolagem do body
}

// Exportar funções para uso em outros arquivos
window.Navigation = {
    initDrawerMenu,
    toggleDrawerMenu,
    closeDrawerMenu,
    addMenuToggleEvent
};