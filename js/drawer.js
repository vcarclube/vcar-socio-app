/**
 * Classe para gerenciar o menu drawer como um componente único
 */
class DrawerMenu {
    /**
     * Método estático para obter a instância única do DrawerMenu
     * @returns {DrawerMenu} A instância única do DrawerMenu
     */
    static getInstance() {
        if (!DrawerMenu.instance) {
            DrawerMenu.instance = new DrawerMenu();
        }
        return DrawerMenu.instance;
    }
    
    constructor() {
        // Singleton - garantir que só exista uma instância do drawer menu
        if (DrawerMenu.instance) {
            return DrawerMenu.instance;
        }
        DrawerMenu.instance = this;
        
        this.drawer = null;
        this.overlay = null;
        this.initialized = false;
        
        // Inicializar o drawer menu
        this.init();
    }
    
    /**
     * Inicializa o drawer menu
     */
    init() {
        console.log('Inicializando DrawerMenu');
        
        // Verificar se o drawer já existe
        if (document.querySelector('.drawer-menu')) {
            console.log('Drawer menu já existe, usando o existente');
            this.drawer = document.querySelector('.drawer-menu');
            this.overlay = document.querySelector('.drawer-overlay');
            this.setupEventListeners();
            this.initialized = true;
            return;
        }
        
        // Criar o drawer menu
        this.create();
    }
    
    /**
     * Cria e insere o componente de menu drawer na página
     */
    create() {
        console.log('Criando drawer menu');
        
        // Remover o drawer existente, se houver
        const existingDrawer = document.querySelector('.drawer-menu');
        if (existingDrawer) {
            console.log('Removendo drawer menu existente');
            existingDrawer.remove();
        }
        
        // Remover o overlay existente, se houver
        const existingOverlay = document.querySelector('.drawer-overlay');
        if (existingOverlay) {
            console.log('Removendo overlay existente');
            existingOverlay.remove();
        }
        
        const drawerMenuHTML = `
        <div class="drawer-menu">
            <div class="drawer-header">
                <div class="drawer-user">
                    <ion-icon name="person-circle-outline" class="user-avatar"></ion-icon>
                    <div class="drawer-user-info">
                        <h3>João Silva</h3>
                        <p>joao.silva@email.com</p>
                    </div>
                </div>
            </div>
            <div class="drawer-content">
                <ul class="drawer-menu-items" style="display: flex; flex-direction: column; gap: 8px; padding: 16px; list-style: none; margin: 0;">
                    <style>
                        .drawer-menu-item:hover {
                            background-color: rgba(0, 167, 76, 0.1);
                            transform: translateX(5px);
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        }
                        .drawer-menu-item:hover ion-icon {
                            transform: scale(1.2);
                        }
                        .drawer-menu-item.logout:hover {
                            background-color: rgba(239, 68, 68, 0.2);
                            transform: translateX(5px);
                            box-shadow: 0 2px 5px rgba(239, 68, 68, 0.2);
                        }
                        .drawer-menu-item.logout:hover ion-icon {
                            transform: scale(1.2);
                        }
                    </style>
                    <li class="drawer-menu-item" style="display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;" onclick="window.location.href='index.html'">
                        <ion-icon name="home-outline" style="font-size: 1.5rem; margin-right: 12px; color: var(--color-primary); transition: transform 0.2s ease;"></ion-icon>
                        <span style="font-weight: 500; letter-spacing: 0.5px;">Início</span>
                    </li>
                    <li class="drawer-menu-item" style="display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;" onclick="window.location.href='profile.html'">
                        <ion-icon name="person-outline" style="font-size: 1.5rem; margin-right: 12px; color: var(--color-primary); transition: transform 0.2s ease;"></ion-icon>
                        <span style="font-weight: 500; letter-spacing: 0.5px;">Meu Perfil</span>
                    </li>
                    <li class="drawer-menu-item" style="display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;" onclick="window.location.href='vehicles.html'">
                        <ion-icon name="car-outline" style="font-size: 1.5rem; margin-right: 12px; color: var(--color-primary); transition: transform 0.2s ease;"></ion-icon>
                        <span style="font-weight: 500; letter-spacing: 0.5px;">Meus Veículos</span>
                    </li>
                    <li class="drawer-menu-item" style="display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;" onclick="window.location.href='appointments.html'">
                        <ion-icon name="calendar-outline" style="font-size: 1.5rem; margin-right: 12px; color: var(--color-primary); transition: transform 0.2s ease;"></ion-icon>
                        <span style="font-weight: 500; letter-spacing: 0.5px;">Meus Agendamentos</span>
                    </li>
                    <li class="drawer-menu-item" style="display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;" onclick="window.location.href='services.html'">
                        <ion-icon name="construct-outline" style="font-size: 1.5rem; margin-right: 12px; color: var(--color-primary); transition: transform 0.2s ease;"></ion-icon>
                        <span style="font-weight: 500; letter-spacing: 0.5px;">Histórico de Serviços</span>
                    </li>
                </ul>
            </div>
            <div class="drawer-footer" style="padding: 16px; border-top: 1px solid rgba(0,0,0,0.1);">
                <div class="drawer-menu-item logout" style="display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; background-color: rgba(239, 68, 68, 0.1);">
                    <ion-icon name="log-out-outline" style="font-size: 1.5rem; margin-right: 12px; color: var(--error-color); transition: transform 0.2s ease;"></ion-icon>
                    <span style="font-weight: 500; letter-spacing: 0.5px;">Sair</span>
                </div>
            </div>
        </div>
        <div class="drawer-overlay"></div>
        `;

        // Inserir o menu drawer no final do body
        document.body.insertAdjacentHTML('beforeend', drawerMenuHTML);
        
        console.log('Menu drawer inserido no DOM');
        
        // Armazenar referências aos elementos
        this.drawer = document.querySelector('.drawer-menu');
        this.overlay = document.querySelector('.drawer-overlay');
        
        if (this.drawer && this.overlay) {
            console.log('Drawer menu e overlay encontrados após inserção');
            this.setupEventListeners();
            this.initialized = true;
        } else {
            console.error('Falha ao inserir drawer menu ou overlay');
        }
    }
    
    /**
     * Configura os event listeners para o drawer menu
     */
    setupEventListeners() {
        console.log('Configurando event listeners para o drawer menu');
        
        // Adicionar evento de clique ao botão de fechar
        const closeButton = this.drawer.querySelector('.drawer-close');
        if (closeButton) {
            console.log('Botão de fechar encontrado, adicionando evento de clique');
            closeButton.addEventListener('click', () => this.close());
        }
        
        // Adicionar evento de clique ao overlay
        this.overlay.addEventListener('click', () => this.close());
        
        // Adicionar evento de clique aos botões de menu
        this.setupMenuToggleButtons();
    }
    
    /**
     * Configura os botões de menu para abrir o drawer
     */
    setupMenuToggleButtons() {
        const menuToggles = document.querySelectorAll('.menu-toggle');
        console.log('Encontrados', menuToggles.length, 'botões de menu');
        
        // Função de manipulador de evento para reutilização
        const handleMenuClick = (e) => {
            e.preventDefault();
            console.log('Clique no botão de menu detectado');
            this.open(e);
        };
        
        menuToggles.forEach(menuToggle => {
            console.log('Adicionando evento de clique ao botão de menu');
            // Remover eventos anteriores usando o método cloneNode
            const newMenuToggle = menuToggle.cloneNode(true);
            menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
            newMenuToggle.addEventListener('click', handleMenuClick);
        });
    }
    
    /**
     * Configura eventos para os botões de menu toggle
     * Método chamado pelo navigation.js
     */
    setupMenuToggleEvents() {
        console.log('setupMenuToggleEvents chamado do DrawerMenu');
        this.setupMenuToggleButtons();
    }
    
    /**
     * Abre o drawer menu
     */
    open(e) {
        if (e) e.preventDefault();
        console.log('Abrindo drawer menu');
        
        if (!this.drawer || !this.overlay) {
            console.error('Drawer menu ou overlay não encontrado ao tentar abrir');
            return;
        }
        
        this.drawer.classList.add('open');
        this.overlay.classList.add('open');
        document.body.classList.add('drawer-open');
        document.body.style.overflow = 'hidden';
        
        // Adicionar hash para controlar o estado do drawer
        // Usar history.pushState para não acionar o evento popstate imediatamente
        if (window.location.hash !== '#drawer') {
            history.pushState(null, null, '#drawer');
        }
        
        console.log('Drawer menu aberto');
    }
    
    /**
     * Fecha o drawer menu
     */
    close() {
        console.log('Fechando drawer menu');
        
        if (!this.drawer || !this.overlay) {
            console.error('Drawer menu ou overlay não encontrado ao tentar fechar');
            return;
        }
        
        this.drawer.classList.remove('open');
        this.overlay.classList.remove('open');
        document.body.classList.remove('drawer-open');
        document.body.style.overflow = '';
        
        // Remover hash quando o drawer for fechado
        if (window.location.hash === '#drawer') {
            // Usar replaceState para não adicionar uma nova entrada no histórico
            history.replaceState(null, null, window.location.pathname);
            console.log('Hash removida');
        }
        
        console.log('Drawer menu fechado');
    }
    
    /**
     * Alterna o estado do drawer menu (aberto/fechado)
     */
    toggle(e) {
        if (e) e.preventDefault();
        console.log('Alternando estado do drawer menu');
        
        if (!this.drawer || !this.overlay) {
            console.error('Drawer menu ou overlay não encontrado ao tentar alternar');
            return;
        }
        
        if (this.drawer.classList.contains('open')) {
            this.close();
        } else {
            this.open();
        }
    }
}

// Exportar a classe para uso global imediatamente
window.DrawerMenu = DrawerMenu;

// Inicializar o drawer menu quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando DrawerMenu');
    window.drawerMenu = new DrawerMenu();
    
    // Adicionar evento para o botão voltar do navegador
    window.addEventListener('popstate', function(event) {
        console.log('Evento popstate detectado, hash:', window.location.hash);
        // Se o drawer estiver aberto, fechá-lo
        if (window.drawerMenu.drawer.classList.contains('open')) {
            console.log('Drawer está aberto, fechando via popstate');
            window.drawerMenu.close();
            // Adicionar nova entrada no histórico para evitar que o botão voltar saia da página
            history.pushState(null, null, window.location.pathname);
        }
    });
});