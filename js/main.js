// Elementos DOM
const serviceCards = document.querySelectorAll('.service-card');
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.querySelector('.modal-close');
const modalServiceName = document.getElementById('modalServiceName');
const modalServiceType = document.getElementById('modalServiceType');
const bookingForm = document.getElementById('bookingForm');
const navItems = document.querySelectorAll('.nav-item');
const searchInput = document.querySelector('.search-bar input');

// Função para prevenir zoom em dispositivos móveis
function preventZoom() {
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchmove', function(event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, { passive: false });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado');
    console.log('Modal:', document.getElementById('add-vehicle-offcanvas'));
    console.log('Botão:', document.querySelector('.add-vehicle-btn'));
    
    // Prevenir zoom em dispositivos móveis
    preventZoom();
    
    // Inserir componentes reutilizáveis
    if (typeof Components !== 'undefined') {
        // Inserir header
        Components.createHeader();
        
        // Determinar a página atual para a navegação inferior
        let activePage = 'home';
        if (window.location.pathname.includes('vehicles.html')) {
            activePage = 'vehicles';
        } else if (window.location.pathname.includes('appointments.html')) {
            activePage = 'appointments';
        } else if (window.location.pathname.includes('services.html')) {
            activePage = 'services';
        } else if (window.location.pathname.includes('profile.html')) {
            activePage = 'profile';
        }
        
        // Inserir navegação inferior
        Components.createBottomNav(activePage);
        
        // O drawer menu agora é gerenciado pelo componente DrawerMenu
        // Não é necessário inicializar aqui, pois o DrawerMenu se inicializa automaticamente
        // quando o script drawer.js é carregado
    }
    
    // Chamar funções de inicialização apenas se estiverem disponíveis
    if (typeof initServiceCards === 'function') initServiceCards();
    if (typeof initModal === 'function') initModal();
    if (typeof initSearch === 'function') initSearch();
    if (typeof initLocationService === 'function') initLocationService();
    if (typeof initCategoryItems === 'function') initCategoryItems();
    if (typeof initSwipers === 'function') initSwipers();
    if (typeof initServiceAccordions === 'function') initServiceAccordions();
    if (typeof initVehicleOptions === 'function') initVehicleOptions();
    if (typeof initProgressiveForm === 'function') initProgressiveForm();

    // Criar container para notificações se não existir
    if (!document.getElementById('notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '80px';
        notificationContainer.style.left = '50%';
        notificationContainer.style.transform = 'translateX(-50%)';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }

    // Adicionar listener para o evento hashchange (botão voltar)
    window.addEventListener('hashchange', function (e) {
        // Se o hash foi removido e o modal está aberto, fechar o modal
        if (!window.location.hash && bookingModal && bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
    });
});

// Função para mostrar notificações
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');

    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.backgroundColor = type === 'success' ? 'var(--primary-color)' : 'var(--error-color)';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '8px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.justifyContent = 'space-between';
    notification.style.minWidth = '250px';
    notification.style.maxWidth = '90vw';
    notification.style.animation = 'fadeInUp 0.3s ease-out';

    // Adicionar conteúdo da notificação
    notification.innerHTML = `
        <span>${message}</span>
        <ion-icon name="close-outline" style="cursor: pointer; margin-left: 10px;"></ion-icon>
    `;

    // Adicionar ao container
    container.appendChild(notification);

    // Adicionar evento para fechar a notificação
    const closeIcon = notification.querySelector('ion-icon');
    closeIcon.addEventListener('click', () => {
        notification.style.animation = 'fadeOutDown 0.3s ease-out';
        setTimeout(() => {
            container.removeChild(notification);
        }, 280);
    });

    // Auto-remover após 3 segundos
    setTimeout(() => {
        if (container.contains(notification)) {
            notification.style.animation = 'fadeOutDown 0.3s ease-out';
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 280);
        }
    }, 3000);
}

// Inicializar opções de veículos
function initVehicleOptions() {
    console.log('Inicializando opções de veículos');
    // Elementos da lista de veículos
    const optionsIcons = document.querySelectorAll('.options-icon');
    const optionsDropdowns = document.querySelectorAll('.options-dropdown');
    const addVehicleBtn = document.querySelector('.add-vehicle-btn');
    console.log('Botão de adicionar veículo:', addVehicleBtn);

    // Elementos do modal de adicionar veículo
    const addVehicleOffcanvas = document.getElementById('add-vehicle-offcanvas');
    const closeAddVehicleOffcanvasBtn = document.querySelector('#add-vehicle-offcanvas .modal-close');
    const addVehicleForm = document.getElementById('add-vehicle-form');
    const vehicleFormNext = document.getElementById('vehicle-form-next');
    const vehicleFormBack = document.getElementById('vehicle-form-back');
    
    // Elementos do formulário progressivo
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const backButtons = document.querySelectorAll('.btn-back');
    const planOptions = document.querySelectorAll('.plan-option');
    let currentStep = 0;
    
    // Função para atualizar a visualização das etapas
    function updateStepView() {
        if (!formSteps || formSteps.length === 0) return;
        
        // Esconder todas as etapas
        formSteps.forEach((step, index) => {
            if (step) step.style.display = index === currentStep ? 'block' : 'none';
        });

        // Atualizar os indicadores de progresso
        if (progressSteps && progressSteps.length > 0) {
            progressSteps.forEach((step, index) => {
                if (!step) return;
                
                if (index < currentStep) {
                    step.classList.add('completed');
                    step.classList.remove('active');
                } else if (index === currentStep) {
                    step.classList.add('active');
                    step.classList.remove('completed');
                } else {
                    step.classList.remove('active', 'completed');
                }
            });
        }
    }

    // Elementos de select para marca e modelo
    const vehicleBrandSelect = document.getElementById('vehicleBrand');
    const vehicleModelSelect = document.getElementById('vehicleModel');
    const vehicleEngineSelect = document.getElementById('vehicleEngine');
    const vehicleEngineSizeSelect = document.getElementById('vehicleEngineSize');

    // Objeto com modelos por marca para popular o select de modelos dinamicamente
    const modelsByBrand = {
        'CHEVROLET': ['Onix', 'Prisma', 'Cruze', 'S10', 'Tracker'],
        'FIAT': ['Uno', 'Palio', 'Argo', 'Toro', 'Strada'],
        'FORD': ['Ka', 'Fiesta', 'Focus', 'Ranger', 'EcoSport'],
        'HONDA': ['Civic', 'City', 'Fit', 'HR-V', 'WR-V'],
        'HYUNDAI': ['HB20', 'Creta', 'i30', 'Tucson', 'Santa Fe'],
        'TOYOTA': ['Corolla', 'Yaris', 'Etios', 'Hilux', 'SW4'],
        'VOLKSWAGEN': ['Gol', 'Polo', 'Virtus', 'T-Cross', 'Amarok']
    };

    // Adicionar evento de mudança para o select de marca para atualizar os modelos
    if (vehicleBrandSelect && vehicleModelSelect) {
        vehicleBrandSelect.addEventListener('change', function () {
            const selectedBrand = this.value;

            // Limpar o select de modelos
            vehicleModelSelect.innerHTML = '<option value="" disabled selected>Selecione o modelo</option>';

            // Se uma marca foi selecionada, adicionar os modelos correspondentes
            if (selectedBrand && modelsByBrand[selectedBrand]) {
                modelsByBrand[selectedBrand].forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    vehicleModelSelect.appendChild(option);
                });
            }
        });
    }

    // Sincronizar os selects de motor e litragem
    if (vehicleEngineSelect && vehicleEngineSizeSelect) {
        vehicleEngineSelect.addEventListener('change', function () {
            vehicleEngineSizeSelect.value = this.value;
        });

        vehicleEngineSizeSelect.addEventListener('change', function () {
            vehicleEngineSelect.value = this.value;
        });
    }

    // Fechar todos os dropdowns quando clicar fora deles
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.vehicle-options')) {
            optionsDropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });

    // Adicionar evento de clique para cada ícone de opções
    if (optionsIcons && optionsIcons.length > 0) {
        optionsIcons.forEach((icon, index) => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();

                // Fechar todos os outros dropdowns
                if (optionsDropdowns && optionsDropdowns.length > 0) {
                    optionsDropdowns.forEach((dropdown, dropdownIndex) => {
                        if (index !== dropdownIndex) {
                            dropdown.style.display = 'none';
                        }
                    });
                }

                // Alternar visibilidade do dropdown atual
                const vehicleOptions = icon.closest('.vehicle-options');
                if (vehicleOptions) {
                    const dropdown = vehicleOptions.querySelector('.options-dropdown');
                    if (dropdown) {
                        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                    }
                }
            });
        });
    }

    // Adicionar evento para os itens do dropdown
    const optionItems = document.querySelectorAll('.option-item');
    if (optionItems && optionItems.length > 0) {
        optionItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();

                // Obter texto do item clicado
                const spanElement = item.querySelector('span');
                if (spanElement) {
                    const actionText = spanElement.textContent;

                    // Implementar ações com base no texto
                    if (actionText.includes('Cancelar')) {
                        showNotification('Solicitação de cancelamento enviada');
                    } else if (actionText.includes('Faturas')) {
                        showNotification('Redirecionando para pagamento de faturas');
                    }
                }

                // Fechar o dropdown após a ação
                const dropdown = item.closest('.options-dropdown');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            });
        });

        // Função para abrir o modal de adicionar veículo
        function openAddVehicleOffcanvas() {
            console.log('Abrindo modal', addVehicleOffcanvas);
            // Adicionar hash para controlar o estado do modal
            window.location.hash = 'add-vehicle';

            // Mostrar modal
            if (addVehicleOffcanvas) {
                addVehicleOffcanvas.classList.add('active');
                document.body.style.overflow = 'hidden'; // Impedir rolagem da página
                console.log('Adicionou classe active ao modal');
            } else {
                console.log('Modal não encontrado');
            }

            // Mostrar o indicador de arrasto apenas em dispositivos móveis
            const dragIndicator = document.querySelector('#add-vehicle-offcanvas .modal-drag-indicator');
            if (dragIndicator) {
                // Verificar se é dispositivo móvel (largura menor que 992px)
                if (window.innerWidth < 992) {
                    dragIndicator.style.display = 'none';
                } else {
                    dragIndicator.style.display = 'none';
                }
            }

            // Resetar o formulário e voltar para a primeira etapa
            if (addVehicleForm) {
                addVehicleForm.reset();
                currentStep = 0;
                updateStepView();
            }
        }

        // Função para fechar o modal de adicionar veículo
        function closeAddVehicleOffcanvas() {
            if (addVehicleOffcanvas) {
                addVehicleOffcanvas.classList.remove('active');
            }
            
            document.body.style.overflow = ''; // Restaurar rolagem da página

            // Esconder o indicador de arrasto
            const dragIndicator = document.querySelector('#add-vehicle-offcanvas .modal-drag-indicator');
            if (dragIndicator) {
                dragIndicator.style.display = 'none';
            }

            // Resetar a posição do modal (caso tenha sido arrastado anteriormente)
            const modalContent = document.querySelector('#add-vehicle-offcanvas .modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(0)';
            }
            
            // Garantir que o backdrop também seja resetado
            const backdrop = document.querySelector('#add-vehicle-offcanvas .modal-backdrop');
            if (backdrop) {
                backdrop.style.transform = 'none';
            }

            // Remover hash se estiver presente e se foi adicionado pelo modal
            if (window.location.hash === '#add-vehicle') {
                // Usar history.pushState para evitar um novo evento hashchange
                history.pushState("", document.title, window.location.pathname + window.location.search);
            }
        }

        // Adicionar evento para o botão de adicionar veículo
        if (addVehicleBtn) {
            console.log('Botão encontrado:', addVehicleBtn);
            addVehicleBtn.addEventListener('click', () => {
                console.log('Botão clicado');
                openAddVehicleOffcanvas();
            });
        } else {
            console.log('Botão não encontrado');
        }

        // Fechar modal ao clicar no botão de fechar
        if (closeAddVehicleOffcanvasBtn) {
            closeAddVehicleOffcanvasBtn.addEventListener('click', closeAddVehicleOffcanvas);
        }
        
        // Fechar modal ao clicar fora dele ou no backdrop
        window.addEventListener('click', (e) => {
            if (addVehicleOffcanvas && (e.target === addVehicleOffcanvas || e.target.classList.contains('modal-backdrop'))) {
                closeAddVehicleOffcanvas();
            }
        });
        
        // Adicionar eventos para os botões de navegação
        if (vehicleFormNext) {
            vehicleFormNext.addEventListener('click', () => {
                if (currentStep < formSteps.length - 1) {
                    // Avançar para a próxima etapa
                    currentStep++;
                    updateStepView();
                } else {
                    // Estamos na última etapa, finalizar o formulário
                    addVehicleForm.dispatchEvent(new Event('submit'));
                }
            });
        }
        
        if (vehicleFormBack) {
            vehicleFormBack.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateStepView();
                }
            });
        }

        // Implementar funcionalidade de arrasto para o modal usando o componente reutilizável
    if (typeof Components !== 'undefined') {
        Components.initDraggableModal('#add-vehicle-offcanvas .modal-content', '#add-vehicle-offcanvas .modal-drag-indicator', closeAddVehicleOffcanvas);
    }

        // Adicionar listener para o evento hashchange (botão voltar)
        window.addEventListener('hashchange', function (e) {
            // Se o hash foi removido e o modal está aberto, fechar o modal
            const addVehicleOffcanvas = document.getElementById('add-vehicle-offcanvas');
            if (!window.location.hash && addVehicleOffcanvas && addVehicleOffcanvas.classList.contains('active')) {
                closeAddVehicleOffcanvas();
            }
        });

        // Adicionar evento de submit ao formulário
        if (addVehicleForm) {
            addVehicleForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Aqui você implementaria a lógica para salvar os dados do veículo
                showNotification('Veículo adicionado com sucesso!');
                closeAddVehicleOffcanvas();
            });
        }

        // Função para inicializar o formulário progressivo
        function initProgressiveForm() {
            // Elementos do formulário progressivo
            const formSteps = document.querySelectorAll('.form-step');
            const progressSteps = document.querySelectorAll('.progress-step');
            const progressIndicator = document.querySelector('.progress-indicator');
            const nextButtons = document.querySelectorAll('.btn-next');
            const backButtons = document.querySelectorAll('.btn-back');
            const planOptions = document.querySelectorAll('.plan-option');
            const addVehicleForm = document.getElementById('add-vehicle-form');

            // Se não houver elementos do formulário progressivo, sair da função
            if (!formSteps.length) return;

            let currentStep = 0;

            // Função para atualizar a visualização das etapas
            function updateStepView() {
                // Esconder todas as etapas
                formSteps.forEach((step, index) => {
                    step.style.display = index === currentStep ? 'block' : 'none';
                });

                // Atualizar os indicadores de progresso
                progressSteps.forEach((step, index) => {
                    if (index < currentStep) {
                        step.classList.add('completed');
                        step.classList.remove('active');
                    } else if (index === currentStep) {
                        step.classList.add('active');
                        step.classList.remove('completed');
                    } else {
                        step.classList.remove('active', 'completed');
                    }
                });

                // Atualizar a barra de progresso
                if (progressIndicator) {
                    const progressPercentage = (currentStep / (formSteps.length - 1)) * 100;
                    progressIndicator.style.width = `${progressPercentage}%`;
                }
                
                // Atualizar botões de navegação
                if (vehicleFormBack) {
                    vehicleFormBack.style.display = currentStep === 0 ? 'none' : 'block';
                }
                
                if (vehicleFormNext) {
                    vehicleFormNext.textContent = currentStep === formSteps.length - 1 ? 'Finalizar' : 'Continuar';
                }
            }

            // Função para validar os campos da etapa atual
            function validateCurrentStep() {
                const currentFormStep = formSteps[currentStep];
                const requiredFields = currentFormStep.querySelectorAll('input[required], select[required]');
                let isValid = true;

                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('invalid');

                        // Adicionar mensagem de erro se não existir
                        let errorMsg = field.nextElementSibling;
                        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                            errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = 'Este campo é obrigatório';
                            errorMsg.style.color = 'var(--error-color)';
                            errorMsg.style.fontSize = '12px';
                            errorMsg.style.marginTop = '4px';
                            field.parentNode.insertBefore(errorMsg, field.nextSibling);
                        }
                    } else {
                        field.classList.remove('invalid');

                        // Remover mensagem de erro se existir
                        const errorMsg = field.nextElementSibling;
                        if (errorMsg && errorMsg.classList.contains('error-message')) {
                            errorMsg.remove();
                        }
                    }
                });

                return isValid;
            }

            // Função para avançar para a próxima etapa
            function goToNextStep() {
                if (currentStep < formSteps.length - 1) {
                    if (validateCurrentStep()) {
                        currentStep++;
                        updateStepView();
                        window.scrollTo(0, 0);
                    } else {
                        showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
                    }
                } else {
                    // Última etapa - enviar o formulário
                    if (validateCurrentStep()) {
                        if (addVehicleForm) {
                            addVehicleForm.submit();
                        }
                    } else {
                        showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
                    }
                }
            }

            // Função para voltar para a etapa anterior
            function goToPreviousStep() {
                if (currentStep > 0) {
                    currentStep--;
                    updateStepView();
                    window.scrollTo(0, 0);
                }
            }

            // Adicionar eventos aos botões de navegação
            nextButtons.forEach(button => {
                button.addEventListener('click', goToNextStep);
            });

            backButtons.forEach(button => {
                button.addEventListener('click', goToPreviousStep);
            });

            // Adicionar eventos às opções de plano
            planOptions.forEach(option => {
                option.addEventListener('click', () => {
                    // Remover seleção de todas as opções
                    planOptions.forEach(opt => opt.classList.remove('selected'));

                    // Selecionar a opção clicada
                    option.classList.add('selected');

                    // Marcar o radio button correspondente
                    const radio = option.querySelector('input[type="radio"]');
                    if (radio) {
                        radio.checked = true;
                    }
                });
            });

            // Adicionar evento de submit ao formulário
            if (addVehicleForm) {
                addVehicleForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                    if (validateCurrentStep()) {
                        // Aqui você implementaria a lógica para salvar os dados do veículo
                        showNotification('Veículo adicionado com sucesso!');

                        // Fechar o modal após o envio bem-sucedido
                        const addVehicleOffcanvasModal = document.getElementById('add-vehicle-offcanvas');
                        const closeBtn = addVehicleOffcanvasModal.querySelector('.modal-close');
                        if (closeBtn) {
                            closeBtn.click();
                        } else {
                            closeAddVehicleOffcanvas(); // Chamar a função diretamente se o botão não for encontrado
                        }

                        // Resetar o formulário e voltar para a primeira etapa
                        setTimeout(() => {
                            addVehicleForm.reset();
                            currentStep = 0;
                            updateStepView();
                        }, 500);
                    }
                });
            }

            // Inicializar a visualização da primeira etapa
            updateStepView();

            // Mostrar/esconder botões de navegação
            if (backButtons.length > 0) {
                backButtons.forEach(btn => {
                    btn.style.display = currentStep === 0 ? 'none' : 'block';
                });
            }

            // Atualizar texto do botão na última etapa
            if (nextButtons.length > 0) {
                nextButtons.forEach(btn => {
                    if (currentStep === formSteps.length - 1) {
                        btn.textContent = 'Finalizar';
                    } else {
                        btn.textContent = 'Continuar';
                    }
                });
            }
        }

        // Função para ir para a próxima etapa
        function goToNextStep() {
            // Validar campos da etapa atual antes de avançar
            const currentFormStep = formSteps[currentStep];
            const requiredFields = currentFormStep.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('invalid');

                    // Adicionar mensagem de erro se não existir
                    let errorMsg = field.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.style.color = 'red';
                        errorMsg.style.fontSize = '12px';
                        errorMsg.style.marginTop = '5px';
                        errorMsg.textContent = 'Este campo é obrigatório';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                } else {
                    field.classList.remove('invalid');

                    // Remover mensagem de erro se existir
                    const errorMsg = field.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });

            if (!isValid) {
                showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
                return;
            }

            // Se for a última etapa, enviar o formulário
            if (currentStep === formSteps.length - 1) {
                const form = document.getElementById('addVehicleForm');
                if (form) {
                    // Simular envio do formulário
                    showNotification('Veículo adicionado com sucesso!');

                    // Fechar o modal após um breve delay
                    setTimeout(() => {
                        const closeBtn = document.querySelector('.close-offcanvas');
                        if (closeBtn) closeBtn.click();

                        // Resetar o formulário para a primeira etapa
                        currentStep = 0;
                        updateStepView();
                    }, 1000);
                }
                return;
            }

            // Avançar para a próxima etapa
            if (currentStep < formSteps.length - 1) {
                currentStep++;
                updateStepView();

                // Rolar para o topo do formulário
                const modalContent = document.querySelector('.modal-content');
                if (modalContent) modalContent.scrollTop = 0;
            }
        }

        // Função para voltar para a etapa anterior
        function goToPreviousStep() {
            if (currentStep > 0) {
                currentStep--;
                updateStepView();

                // Rolar para o topo do formulário
                const modalContent = document.querySelector('.modal-content');
                if (modalContent) modalContent.scrollTop = 0;
            }
        }

        // Inicializar a visualização das etapas
        updateStepView();

        // Adicionar event listeners para os botões de navegação
        if (nextButtons.length > 0) {
            nextButtons.forEach(btn => {
                btn.addEventListener('click', goToNextStep);
            });
        }

        if (backButtons.length > 0) {
            backButtons.forEach(btn => {
                btn.addEventListener('click', goToPreviousStep);
            });
        }

        // Adicionar event listeners para as opções de plano
        if (planOptions.length > 0) {
            planOptions.forEach(option => {
                option.addEventListener('click', function () {
                    // Remover a classe 'selected' de todas as opções
                    planOptions.forEach(opt => opt.classList.remove('selected'));
                    // Adicionar a classe 'selected' à opção clicada
                    this.classList.add('selected');

                    // Marcar o input radio correspondente como selecionado
                    const radio = this.querySelector('input[type="radio"]');
                    if (radio) radio.checked = true;
                });
            });
        }

        // Adicionar event listeners para os campos de formulário para remover mensagens de erro
        const formInputs = document.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function () {
                this.classList.remove('invalid');

                // Remover mensagem de erro se existir
                const errorMsg = this.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            });
        });
    }
}

// Configurar os selects dinâmicos
// Verificar se estamos na página correta antes de acessar os elementos
const vehicleBrandSelect = document.getElementById('vehicleBrand');
const vehicleModelSelect = document.getElementById('vehicleModel');

if (vehicleBrandSelect && vehicleModelSelect) {
    // Dados de modelos por marca
    const modelsByBrand = {
        'CHEVROLET': ['Onix', 'Prisma', 'Cruze', 'S10', 'Tracker'],
        'FIAT': ['Uno', 'Argo', 'Mobi', 'Toro', 'Strada'],
        'FORD': ['Ka', 'Fiesta', 'Focus', 'Ranger', 'EcoSport'],
        'HONDA': ['Civic', 'City', 'Fit', 'HR-V', 'WR-V'],
        'HYUNDAI': ['HB20', 'Creta', 'i30', 'Tucson', 'Elantra'],
        'TOYOTA': ['Corolla', 'Yaris', 'Etios', 'Hilux', 'SW4'],
        'VOLKSWAGEN': ['Gol', 'Polo', 'Virtus', 'T-Cross', 'Amarok']
    };

    // Evento de mudança na marca para atualizar os modelos
    vehicleBrandSelect.addEventListener('change', function () {
        const selectedBrand = this.value;
        const models = modelsByBrand[selectedBrand] || [];

        // Limpar e preencher o select de modelos
        vehicleModelSelect.innerHTML = '<option value="" disabled selected>Selecione o modelo</option>';

        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            vehicleModelSelect.appendChild(option);
        });
    });

    // Sincronizar motor e litragem
    if (vehicleEngineSelect && vehicleEngineSizeSelect) {
        vehicleEngineSelect.addEventListener('change', function () {
            vehicleEngineSizeSelect.value = this.value;
        });

        vehicleEngineSizeSelect.addEventListener('change', function () {
            vehicleEngineSelect.value = this.value;
        });
    }
}



// Inicializar Swipers
function initSwipers() {
    // Verificar se os elementos existem antes de inicializar os swipers
    const bannerSwiperElement = document.querySelector('.banner-swiper');
    const categoriesSwiperElement = document.querySelector('.categories-swiper');

    // Banner Swiper
    if (bannerSwiperElement) {
        const bannerSwiper = new Swiper('.banner-swiper', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
        });
    }

    // Categories Swiper
    if (categoriesSwiperElement) {
        const categoriesSwiper = new Swiper('.categories-swiper', {
            slidesPerView: 4.5,
            spaceBetween: 10,
            freeMode: true,
            breakpoints: {
                320: {
                    slidesPerView: 3.5,
                    spaceBetween: 10,
                },
                480: {
                    slidesPerView: 4.5,
                    spaceBetween: 15,
                },
                640: {
                    slidesPerView: 5.5,
                    spaceBetween: 20,
                },
            },
        });
    }
}

// Inicializar cards de serviço
function initServiceCards() {
    // Verificar se serviceCards existe antes de prosseguir
    if (!serviceCards || serviceCards.length === 0) {
        return;
    }

    // Verificar se estamos na página de serviços
    const serviceOffcanvas = document.getElementById('serviceOffcanvas');
    const closeOffcanvasBtn = document.getElementById('closeOffcanvas');
    const offcanvasTitle = document.getElementById('offcanvasServiceTitle');
    const offcanvasContent = document.getElementById('offcanvasContent');

    // Verificar se estamos na página de serviços ou na página inicial
    const isServicePage = serviceOffcanvas && closeOffcanvasBtn && offcanvasTitle && offcanvasContent;

    // Se estamos na página inicial, configurar os cards para abrir o modal de agendamento
    if (!isServicePage) {
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                openBookingModal(card);
            });
        });
        return;
    }

    // Função para abrir o modal de serviço
    function openServiceOffcanvas(card) {
        // Obter dados do serviço
        const serviceName = card.querySelector('h3').textContent;
        const serviceInfo = card.querySelector('.service-info').innerHTML;
        const serviceStatus = card.querySelector('.service-status').textContent;

        // Definir título do modal
        offcanvasTitle.textContent = serviceName;

        // Adicionar hash para controlar o estado do modal
        window.location.hash = 'service-details';
        
        // Impedir rolagem da página
        document.body.style.overflow = 'hidden';
        
        // Mostrar o indicador de arrasto em dispositivos móveis
        const dragIndicator = document.querySelector('#serviceOffcanvas .modal-drag-indicator');
        if (dragIndicator && window.innerWidth < 992) {
            dragIndicator.style.display = 'block';
        }

        // Construir conteúdo do modal
        let content = `
            <div class="service-info-card">
                ${serviceInfo}
            </div>
        `;

        // Adicionar seções do acordeão (que foram removidas do HTML)
        content += `
            <div class="offcanvas-section">
                <h3><ion-icon name="construct-outline"></ion-icon> Serviços Executados</h3>
                <ul>
                    <li>Troca de óleo do motor</li>
                    <li>Substituição do filtro de óleo</li>
                    <li>Verificação de níveis de fluidos</li>
                </ul>
            </div>
            <div class="offcanvas-section">
                <h3><ion-icon name="document-text-outline"></ion-icon> Anotações</h3>
                <ul class="offcanvas-list">
                    <li class="offcanvas-list-item">
                        <ion-icon name="create-outline"></ion-icon>
                        <div class="offcanvas-list-item-content">
                            <div class="offcanvas-list-item-title">Anotação do técnico</div>
                            <div class="offcanvas-list-item-subtitle">Serviço realizado dentro do prazo previsto. Recomendada próxima troca em 10.000 km.</div>
                        </div>
                    </li>
                    <li class="offcanvas-list-item">
                        <ion-icon name="warning-outline"></ion-icon>
                        <div class="offcanvas-list-item-content">
                            <div class="offcanvas-list-item-title">Observação importante</div>
                            <div class="offcanvas-list-item-subtitle">Verificado desgaste nas pastilhas de freio. Recomendada troca nos próximos 3 meses.</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="offcanvas-section">
                <h3><ion-icon name="images-outline"></ion-icon> Mídias e Fotos</h3>
                <div class="media-grid">
                    <div class="media-item">
                        <img src="img/services/oil-change.jpg.svg" alt="Vídeo da troca">
                        <div class="media-type">
                            <ion-icon name="videocam-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="media-item">
                        <img src="img/services/full-inspection.jpg.svg" alt="Vídeo de inspeção">
                        <div class="media-type">
                            <ion-icon name="videocam-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="media-item">
                        <img src="img/services/oil-change.jpg.svg" alt="Foto do óleo">
                        <div class="media-type">
                            <ion-icon name="image-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="media-item">
                        <img src="img/services/electrical.jpg.svg" alt="Foto do filtro">
                        <div class="media-type">
                            <ion-icon name="image-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="media-item">
                        <img src="img/services/polishing.jpg.svg" alt="Foto do motor">
                        <div class="media-type">
                            <ion-icon name="image-outline"></ion-icon>
                        </div>
                    </div>
                </div>
            </div>
            <div class="offcanvas-section">
                <h3><ion-icon name="receipt-outline"></ion-icon> Recibos</h3>
                <ul class="offcanvas-list">
                    <li class="offcanvas-list-item">
                        <ion-icon name="receipt-outline"></ion-icon>
                        <div class="offcanvas-list-item-content">
                            <div class="offcanvas-list-item-title">Recibo de pagamento</div>
                            <div class="offcanvas-list-item-subtitle">R$ 180,00 - 05/10/2023</div>
                        </div>
                    </li>
                    <li class="offcanvas-list-item">
                        <ion-icon name="card-outline"></ion-icon>
                        <div class="offcanvas-list-item-content">
                            <div class="offcanvas-list-item-title">Comprovante cartão</div>
                            <div class="offcanvas-list-item-subtitle">Visa final 1234 - 05/10/2023</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="offcanvas-section">
                <h3><ion-icon name="document-outline"></ion-icon> Laudos</h3>
                <ul class="offcanvas-list">
                    <li class="offcanvas-list-item">
                        <ion-icon name="document-outline"></ion-icon>
                        <div class="offcanvas-list-item-content">
                            <div class="offcanvas-list-item-title">Laudo técnico</div>
                            <div class="offcanvas-list-item-subtitle">Emitido em 05/10/2023</div>
                        </div>
                    </li>
                    <li class="offcanvas-list-item">
                        <ion-icon name="clipboard-outline"></ion-icon>
                        <div class="offcanvas-list-item-content">
                            <div class="offcanvas-list-item-title">Relatório de inspeção</div>
                            <div class="offcanvas-list-item-subtitle">Checklist completo - 05/10/2023</div>
                        </div>
                    </li>
                </ul>
            </div>
        `;

        // Inserir conteúdo no modal
        offcanvasContent.innerHTML = content;

        // Mostrar modal
        serviceOffcanvas.classList.add('active');
    }

    // Função para fechar o modal de serviço
    function closeServiceOffcanvas() {
        serviceOffcanvas.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar rolagem da página
        
        // Esconder o indicador de arrasto
        const dragIndicator = document.querySelector('#serviceOffcanvas .modal-drag-indicator');
        if (dragIndicator) {
            dragIndicator.style.display = 'none';
        }
        
        // Resetar a posição do modal (caso tenha sido arrastado anteriormente)
        const modalContent = document.querySelector('#serviceOffcanvas .modal-content');
        if (modalContent) {
            modalContent.style.transform = 'translateY(0)';
        }
        
        // Garantir que o backdrop também seja resetado
        const backdrop = document.querySelector('#serviceOffcanvas .modal-backdrop');
        if (backdrop) {
            backdrop.style.transform = 'none';
        }

        // Remover hash se estiver presente e se foi adicionado pelo modal
        if (window.location.hash === '#service-details') {
            // Usar history.pushState para evitar um novo evento hashchange
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
    }

    // Adicionar evento de clique aos cards de serviço
    if (serviceCards && serviceCards.length > 0) {
        serviceCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Ignorar cliques em botões dentro do card
                if (e.target.closest('.btn-view-services')) {
                    return;
                }
                openServiceOffcanvas(card);
            });
        });
    }

    // Fechar modal ao clicar no botão de fechar
    if (closeOffcanvasBtn) {
        closeOffcanvasBtn.addEventListener('click', closeServiceOffcanvas);
    }

    // Fechar modal ao clicar no backdrop
    if (serviceOffcanvas) {
        serviceOffcanvas.addEventListener('click', (e) => {
            if (e.target === serviceOffcanvas || e.target.classList.contains('modal-backdrop')) {
                closeServiceOffcanvas();
            }
        });
    }
    
    // Implementar funcionalidade de arrasto para o modal
    if (typeof Components !== 'undefined' && serviceOffcanvas) {
        Components.initDraggableModal('#serviceOffcanvas .modal-content', '#serviceOffcanvas .modal-drag-indicator', closeServiceOffcanvas);
    }

    // Adicionar listener para o evento hashchange (botão voltar)
    if (serviceOffcanvas) {
        window.addEventListener('hashchange', function (e) {
            // Se o hash foi removido e o offcanvas está aberto, fechar o offcanvas
            if (!window.location.hash && serviceOffcanvas && serviceOffcanvas.classList.contains('active')) {
                closeServiceOffcanvas();
            }
        });
    }
}

// Função vazia para manter compatibilidade com código existente
function initServiceAccordions() {
    // Esta função foi substituída pela funcionalidade de offcanvas
}

// Funções do Modal
function initModal() {
    // Fechar modal ao clicar no X - verificar se o elemento existe
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            closeBookingModal();
        });
    }

    // Fechar modal ao clicar fora dele ou no backdrop
    window.addEventListener('click', (e) => {
        if (bookingModal && (e.target === bookingModal || e.target.classList.contains('modal-backdrop'))) {
            closeBookingModal();
        }
    });

    // Adicionar listener para o evento popstate (botão voltar do navegador)
    window.addEventListener('popstate', (e) => {
        if (bookingModal && bookingModal.classList.contains('active')) {
            bookingModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Implementar funcionalidade de arrasto para o modal usando o componente reutilizável
    if (typeof Components !== 'undefined' && bookingModal) {
        Components.initDraggableModal('#bookingModal .modal-content', '#bookingModal .modal-drag-indicator', closeBookingModal);
    }
    
    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', () => {
        if (bookingModal && bookingModal.classList.contains('active')) {
            const dragIndicator = document.querySelector('.modal-drag-indicator');
            if (dragIndicator) {
                if (window.innerWidth < 992) {
                    dragIndicator.style.display = 'none';
                } else {
                    dragIndicator.style.display = 'none';
                }
            }
        }
    });


    // Processar formulário de agendamento
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validar formulário
            if (!validateBookingForm()) {
                return; // Impedir envio se houver erros
            }

            const formData = new FormData(bookingForm);
            const bookingData = {};

            for (const [key, value] of formData.entries()) {
                bookingData[key] = value;
            }

            // Simulação de envio de dados
            console.log('Agendamento realizado:', bookingData);

            // Feedback ao usuário
            showNotification('Agendamento realizado com sucesso!');

            // Fechar modal
            closeBookingModal();

            // Resetar formulário
            bookingForm.reset();

            // Limpar classes de erro
            clearFormErrors();
        });
    }
}

// Validar formulário de agendamento
function validateBookingForm() {
    let isValid = true;
    const requiredFields = [
        { id: 'serviceDate', name: 'Data' },
        { id: 'serviceTime', name: 'Horário' },
        { id: 'vehicleSelect', name: 'Veículo' },
        { id: 'serviceTypeSelect', name: 'Motivo do agendamento' }
    ];

    // Limpar erros anteriores
    clearFormErrors();

    // Verificar campos obrigatórios
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element.value) {
            markFieldAsError(element, `${field.name} é obrigatório`);
            isValid = false;
        }
    });

    return isValid;
}

// Marcar campo como erro
function markFieldAsError(element, message) {
    // Adicionar classe de erro ao elemento
    element.classList.add('error');

    // Para selects, adicionar classe ao wrapper
    if (element.tagName === 'SELECT') {
        const wrapper = element.closest('.custom-select-wrapper');
        if (wrapper) {
            wrapper.classList.add('error');
        }
    }

    // Mostrar mensagem de erro
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = 'var(--error-color)';
    errorMessage.style.fontSize = '12px';
    errorMessage.style.marginTop = '4px';

    const formGroup = element.closest('.form-group');
    if (formGroup) {
        formGroup.appendChild(errorMessage);
    }

    // Adicionar evento para remover erro quando o campo for preenchido
    element.addEventListener('input', function () {
        if (element.value) {
            element.classList.remove('error');
            if (element.tagName === 'SELECT') {
                const wrapper = element.closest('.custom-select-wrapper');
                if (wrapper) {
                    wrapper.classList.remove('error');
                }
            }

            const errorMsg = formGroup.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    }, { once: true });
}

// Limpar erros do formulário
function clearFormErrors() {
    // Remover classes de erro
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });

    // Remover mensagens de erro
    document.querySelectorAll('.error-message').forEach(el => {
        el.remove();
    });
}

// Fechar modal de agendamento
function closeBookingModal() {
    if (bookingModal) {
        bookingModal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar rolagem do fundo

        // Esconder o indicador de arrasto
        const dragIndicator = document.querySelector('.modal-drag-indicator');
        if (dragIndicator) {
            dragIndicator.style.display = 'none';
        }

        // Resetar a posição do modal e do backdrop
        const modalContent = bookingModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'translateY(0)';
        }
        
        const modalBackdrop = bookingModal.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.style.transform = 'none';
        }

        // Remover o hash da URL
        if (window.location.hash === '#booking') {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        }
    }
}

function openBookingModal(serviceCardOrName, serviceType) {
    // Verificar se o modal existe
    if (!bookingModal || !modalServiceName || !modalServiceType) {
        console.error('Elementos do modal não encontrados');
        return;
    }

    // Verificar se o primeiro parâmetro é um elemento HTML (card) ou uma string (nome do serviço)
    if (serviceCardOrName instanceof HTMLElement) {
        // É um card, extrair as informações
        const card = serviceCardOrName;
        const serviceNameElement = card.querySelector('h3');
        const serviceTypeElement = card.querySelector('.service-type');

        if (serviceNameElement && serviceTypeElement) {
            const serviceName = serviceNameElement.textContent;
            const serviceTypeText = serviceTypeElement.textContent;

            modalServiceName.textContent = serviceName;
            modalServiceType.textContent = serviceTypeText;
        }
    } else {
        // É um nome de serviço direto
        modalServiceName.textContent = serviceCardOrName;
        modalServiceType.textContent = serviceType;
    }

    // Mostrar o indicador de arrasto apenas em dispositivos móveis
    const dragIndicator = document.querySelector('.modal-drag-indicator');
    if (dragIndicator) {
        // Verificar se é dispositivo móvel (largura menor que 992px)
        if (window.innerWidth < 992) {
            dragIndicator.style.display = 'none';
        } else {
            dragIndicator.style.display = 'none';
        }
    }

    // Adicionar hash à URL para controle do botão voltar
    window.location.hash = 'booking';

    // Gerar opções de data
    generateDateOptions();

    // Gerar opções de horário
    generateTimeOptions();

    // Inicializar os swipers de data e hora
    initDateTimeSwiper();

    // Abrir modal com animação
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Impedir rolagem do fundo

    // Resetar a posição do modal (caso tenha sido arrastado anteriormente)
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.transform = 'translateY(0)';
    }
}

// Gerar opções de data para os próximos 30 dias
function generateDateOptions() {
    const dateSwiperWrapper = document.getElementById('dateSwiperWrapper');
    const serviceDateElement = document.getElementById('serviceDate');

    // Verificar se os elementos existem
    if (!dateSwiperWrapper || !serviceDateElement) {
        return;
    }

    dateSwiperWrapper.innerHTML = '';

    const today = new Date();
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const weekday = weekdays[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const dateValue = date.toISOString().split('T')[0];

        const dateItem = document.createElement('div');
        dateItem.className = 'swiper-slide';
        dateItem.innerHTML = `
            <div class="date-item ${i === 0 ? 'selected' : ''}" data-date="${dateValue}">
                <span class="weekday">${weekday}</span>
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
        `;

        dateSwiperWrapper.appendChild(dateItem);

        // Selecionar a primeira data por padrão
        if (i === 0) {
            serviceDateElement.value = dateValue;
        }
    }
}

// Gerar opções de horário
function generateTimeOptions() {
    const timeSwiperWrapper = document.getElementById('timeSwiperWrapper');
    const serviceTimeElement = document.getElementById('serviceTime');

    // Verificar se os elementos existem
    if (!timeSwiperWrapper || !serviceTimeElement) {
        return;
    }

    timeSwiperWrapper.innerHTML = '';

    // Horários disponíveis (das 8h às 18h, de hora em hora)
    const startHour = 8;
    const endHour = 18;

    for (let hour = startHour; hour <= endHour; hour++) {
        const timeValue = `${hour.toString().padStart(2, '0')}:00`;
        const displayTime = `${hour}:00`;

        const timeItem = document.createElement('div');
        timeItem.className = 'swiper-slide';
        timeItem.innerHTML = `
            <div class="time-item ${hour === startHour ? 'selected' : ''}" data-time="${timeValue}">
                <span class="hour">${displayTime}</span>
            </div>
        `;

        timeSwiperWrapper.appendChild(timeItem);

        // Selecionar o primeiro horário por padrão
        if (hour === startHour) {
            serviceTimeElement.value = timeValue;
        }
    }
}

// Inicializar os swipers de data e hora
function initDateTimeSwiper() {
    // Verificar se os elementos existem antes de inicializar os swipers
    const dateSwiperElement = document.querySelector('.date-swiper');
    const timeSwiperElement = document.querySelector('.time-swiper');
    const serviceDateElement = document.getElementById('serviceDate');
    const serviceTimeElement = document.getElementById('serviceTime');

    // Se os elementos necessários não existirem, não prosseguir
    if (!dateSwiperElement || !timeSwiperElement || !serviceDateElement || !serviceTimeElement) {
        return;
    }

    // Destruir swipers existentes se houver
    if (window.dateSwiper) {
        window.dateSwiper.destroy();
    }
    if (window.timeSwiper) {
        window.timeSwiper.destroy();
    }

    // Inicializar swiper de datas
    window.dateSwiper = new Swiper('.date-swiper', {
        slidesPerView: 4.5,
        spaceBetween: 5,
        freeMode: true,
        breakpoints: {
            // Configurações compactas para celular
            320: {
                slidesPerView: 5,
                spaceBetween: 1,
            },
            360: {
                slidesPerView: 5.5,
                spaceBetween: 1,
            },
            480: {
                slidesPerView: 6,
                spaceBetween: 2,
            },
            640: {
                slidesPerView: 6.5,
                spaceBetween: 3,
            },
            // Configurações originais para tablet e desktop
            768: {
                slidesPerView: 5,
                spaceBetween: 15,
            },
            992: {
                slidesPerView: 6,
                spaceBetween: 20,
            },
            1200: {
                slidesPerView: 8,
                spaceBetween: 30,
            },
        },
    });

    // Inicializar swiper de horários
    window.timeSwiper = new Swiper('.time-swiper', {
        slidesPerView: 4.5,
        spaceBetween: 2,
        freeMode: true,
        breakpoints: {
            // Configurações compactas para celular
            320: {
                slidesPerView: 5,
                spaceBetween: 1,
            },
            360: {
                slidesPerView: 5.5,
                spaceBetween: 1,
            },
            480: {
                slidesPerView: 6,
                spaceBetween: 2,
            },
            640: {
                slidesPerView: 6.5,
                spaceBetween: 3,
            },
            // Configurações originais para tablet e desktop
            768: {
                slidesPerView: 5,
                spaceBetween: 15,
            },
            992: {
                slidesPerView: 6,
                spaceBetween: 20,
            },
            1200: {
                slidesPerView: 8,
                spaceBetween: 30,
            },
        },
    });

    // Adicionar eventos de clique para seleção de data
    const dateItems = document.querySelectorAll('.date-item');
    if (dateItems && dateItems.length > 0) {
        dateItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remover seleção anterior
                document.querySelectorAll('.date-item').forEach(el => {
                    el.classList.remove('selected');
                });

                // Adicionar seleção ao item clicado
                item.classList.add('selected');

                // Atualizar o valor do input hidden
                if (serviceDateElement) {
                    serviceDateElement.value = item.dataset.date;
                }
            });
        });
    }

    // Adicionar eventos de clique para seleção de horário
    const timeItems = document.querySelectorAll('.time-item');
    if (timeItems && timeItems.length > 0) {
        timeItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remover seleção anterior
                document.querySelectorAll('.time-item').forEach(el => {
                    el.classList.remove('selected');
                });

                // Adicionar seleção ao item clicado
                item.classList.add('selected');

                // Atualizar o valor do input hidden
                if (serviceTimeElement) {
                    serviceTimeElement.value = item.dataset.time;
                }
            });
        });
    }
}

// Navegação inferior
function initBottomNav() {
    // Não adicionar eventos de clique aqui, pois a navegação será gerenciada pelo navigation.js
    // Apenas configurar os ícones iniciais

    // Verificar se navItems existe antes de tentar iterar sobre ele
    if (navItems && navItems.length > 0) {
        // Configurar ícones iniciais (outline para não ativos, filled para ativos)
        navItems.forEach(item => {
            const icon = item.querySelector('ion-icon');
            if (icon) {
                const iconName = icon.getAttribute('name');
                if (item.classList.contains('active')) {
                    // Remover -outline se estiver ativo
                    if (iconName && iconName.includes('-outline')) {
                        icon.setAttribute('name', iconName.replace('-outline', ''));
                    }
                } else {
                    // Adicionar -outline se não estiver ativo e ainda não tiver
                    if (iconName && !iconName.includes('-outline') && iconName !== 'calendar') {
                        icon.setAttribute('name', iconName + '-outline');
                    }
                }
            }
        });
    }

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

// Barra de pesquisa
function initSearch() {
    // Verificar se o elemento searchInput existe antes de adicionar o event listener
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    console.log(`Pesquisando por: ${searchTerm}`);
                    showNotification(`Pesquisando por: ${searchTerm}`);
                    // Aqui você implementaria a lógica real de pesquisa
                }
            }
        });
    }
}

// Serviço de localização
function initLocationService() {
    const locationElement = document.querySelector('.location');
    const locationText = locationElement ? locationElement.querySelector('span') : null;
    
    // Constantes para armazenamento local
    const LOCATION_KEY = 'vcarclube_location';
    const LOCATION_TIMESTAMP_KEY = 'vcarclube_location_timestamp';
    const LOCATION_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutos em milissegundos

    // Função para verificar se a localização armazenada está expirada
    function isLocationExpired() {
        const timestamp = localStorage.getItem(LOCATION_TIMESTAMP_KEY);
        if (!timestamp) return true;
        
        const storedTime = parseInt(timestamp, 10);
        const currentTime = new Date().getTime();
        
        return (currentTime - storedTime) > LOCATION_REFRESH_INTERVAL;
    }

    // Função para salvar a localização no localStorage
    function saveLocation(locationName, latitude, longitude) {
        const locationData = {
            name: locationName,
            latitude: latitude,
            longitude: longitude
        };
        
        localStorage.setItem(LOCATION_KEY, JSON.stringify(locationData));
        localStorage.setItem(LOCATION_TIMESTAMP_KEY, new Date().getTime().toString());
    }

    // Função para carregar a localização do localStorage
    function loadLocation() {
        const locationData = localStorage.getItem(LOCATION_KEY);
        if (!locationData) return null;
        
        try {
            return JSON.parse(locationData);
        } catch (error) {
            console.error('Erro ao carregar localização do localStorage:', error);
            return null;
        }
    }

    // Função para atualizar a interface com a localização
    function updateLocationUI(locationName) {
        if (locationText) {
            locationText.textContent = locationName;
        }
    }

    // Função para obter o nome da cidade/bairro a partir das coordenadas
    function getLocationName(latitude, longitude) {
        // Verificar se temos uma localização válida no localStorage que não expirou
        if (!isLocationExpired()) {
            const storedLocation = loadLocation();
            if (storedLocation && storedLocation.name) {
                updateLocationUI(storedLocation.name);
                console.log(`Usando localização armazenada: ${storedLocation.name}`);
                return;
            }
        }

        // Se não temos localização armazenada ou está expirada, fazer nova requisição
        showNotification('Atualizando sua localização...');
        
        // Usando a API gratuita geocode.maps.co para geocodificação reversa
        const url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da API de geocodificação');
                }
                return response.json();
            })
            .then(data => {
                let locationName = 'Localização desconhecida';
                
                // Extrair informações relevantes da resposta
                if (data && data.address) {
                    // Tentar obter o bairro, cidade ou município
                    const suburb = data.address.suburb || '';
                    const city = data.address.city || data.address.town || data.address.village || '';
                    const state = data.address.state || '';
                    
                    if (suburb && city) {
                        locationName = `${suburb}, ${city}`;
                    } else if (suburb) {
                        locationName = suburb;
                    } else if (city) {
                        locationName = city;
                    } else if (state) {
                        locationName = state;
                    }
                }
                
                // Atualizar a interface e salvar no localStorage
                updateLocationUI(locationName);
                saveLocation(locationName, latitude, longitude);
                
                showNotification(`Localização atualizada: ${locationName}`);
                console.log(`Localização: ${latitude}, ${longitude} - ${locationName}`);
                // Aqui você implementaria a atualização real dos serviços próximos
            })
            .catch(error => {
                console.error('Erro ao obter nome da localização:', error);
                showNotification('Não foi possível obter o nome da sua localização.');
            });
    }

    // Carregar localização armazenada ao inicializar
    function initializeLocation() {
        const storedLocation = loadLocation();
        
        if (storedLocation && storedLocation.name && !isLocationExpired()) {
            // Se temos uma localização válida armazenada, usá-la
            updateLocationUI(storedLocation.name);
            console.log(`Inicializado com localização armazenada: ${storedLocation.name}`);
        }
    }

    // Inicializar com a localização armazenada (se existir)
    initializeLocation();

    // Verificar se o elemento locationElement existe antes de adicionar o event listener
    if (locationElement) {
        locationElement.addEventListener('click', () => {
            // Obter localização atual
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        // Obter o nome da localização a partir das coordenadas
                        getLocationName(latitude, longitude);
                    },
                    (error) => {
                        console.error('Erro ao obter localização:', error);
                        showNotification('Não foi possível obter sua localização.');
                    }
                );
            } else {
                showNotification('Geolocalização não é suportada neste navegador.');
            }
        });
    }
}

// Categorias
function initCategoryItems() {
    const categoryItems = document.querySelectorAll('.category-item');

    // Verificar se existem elementos categoryItems antes de adicionar event listeners
    if (categoryItems && categoryItems.length > 0) {
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                const categoryNameElement = item.querySelector('span');
                if (categoryNameElement) {
                    const categoryName = categoryNameElement.textContent;
                    console.log(`Categoria selecionada: ${categoryName}`);
                    showNotification(`Filtrando por: ${categoryName}`);
                    // Aqui você implementaria a filtragem real por categoria
                }
            });
        });
    }
}

// Utilitários
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Adicionar ao DOM
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remover após alguns segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Adicionar estilos para notificações
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            z-index: 1500;
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Adicionar estilos para notificações
addNotificationStyles();

// Simular carregamento de dados
function simulateLoading() {
    // Adicionar classe de carregamento ao body
    document.body.classList.add('loading');

    // Remover após um tempo
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 1500);
}

// Iniciar simulação de carregamento
simulateLoading();