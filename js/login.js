// Script para as páginas de login e registro

document.addEventListener('DOMContentLoaded', function() {
    // Aplicar máscaras nos campos
    const cpfInputs = document.querySelectorAll('input[name="cpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value;
            value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
            
            if (value.length <= 11) {
                // Formata o CPF: 000.000.000-00
                value = value.replace(/^(\d{3})(\d)/, '$1.$2');
                value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
            }
            
            e.target.value = value;
        });
    });

    // Máscara para telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value;
            value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
            
            if (value.length <= 11) {
                // Formata o telefone: (00) 00000-0000
                value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                value = value.replace(/^\((\d{2})\) (\d{5})(\d)/, '($1) $2-$3');
            }
            
            e.target.value = value;
        });
    }

    // Validação do formulário de login
    const loginForm = document.querySelector('.login-form');
    if (loginForm && window.location.pathname.includes('login.html')) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cpf = document.getElementById('cpf')?.value;
            const password = document.getElementById('password')?.value;
            
            // Validação básica
            let isValid = true;
            let errorMessage = '';
            
            if (cpf && !validateCPF(cpf)) {
                isValid = false;
                errorMessage = 'CPF inválido. Por favor, verifique.';
            }
            
            if (password && password.length < 6) {
                isValid = false;
                errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
            }
            
            if (!isValid) {
                showError(errorMessage);
                return;
            }
            
            // Simulação de login bem-sucedido
            // Em um ambiente real, você enviaria esses dados para o servidor
            console.log('Login realizado com sucesso!');
            window.location.href = 'index.html'; // Redireciona para a página inicial após login
        });
    }
    
    // Validação do formulário de recuperação de senha
     if (loginForm && window.location.pathname.includes('forgot-password.html')) {
         loginForm.addEventListener('submit', function(e) {
             e.preventDefault();
             
             const cpf = document.getElementById('cpf')?.value;
             
             if (!validateCPF(cpf)) {
                 showError('CPF inválido. Por favor, verifique.');
                 return;
             }
             
             // Se chegou aqui, o formulário é válido
             showSuccess('Instruções de recuperação enviadas para o e-mail cadastrado.');
             // Em um ambiente real, você enviaria esses dados para o servidor
             // O redirecionamento é feito pela função showSuccess
         });
    }

    // Validação do formulário de registro
    const registerForm = document.querySelector('.register-container .login-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const cpf = document.getElementById('cpf')?.value;
            const phone = document.getElementById('phone')?.value;
            const password = document.getElementById('password')?.value;
            const confirmPassword = document.getElementById('confirm-password')?.value;
            const terms = document.getElementById('terms')?.checked;
            
            // Validação básica
            let isValid = true;
            let errorMessage = '';
            
            if (!name || name.length < 3) {
                isValid = false;
                errorMessage = 'Por favor, informe seu nome completo.';
            } else if (!validateEmail(email)) {
                isValid = false;
                errorMessage = 'E-mail inválido. Por favor, verifique.';
            } else if (!validateCPF(cpf)) {
                isValid = false;
                errorMessage = 'CPF inválido. Por favor, verifique.';
            } else if (!phone || phone.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Telefone inválido. Por favor, verifique.';
            } else if (!password || password.length < 6) {
                isValid = false;
                errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
            } else if (password !== confirmPassword) {
                isValid = false;
                errorMessage = 'As senhas não coincidem.';
            } else if (!terms) {
                isValid = false;
                errorMessage = 'Você precisa aceitar os termos de uso.';
            }
            
            if (!isValid) {
                showError(errorMessage);
                return;
            }
            
            // Simulação de registro bem-sucedido
            // Em um ambiente real, você enviaria esses dados para o servidor
            console.log('Cadastro realizado com sucesso!');
            window.location.href = 'login.html'; // Redireciona para a página de login após o cadastro
        });
    }
});

// Função para validar CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf.charAt(9)) !== digit1) {
        return false;
    }
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cpf.charAt(10)) === digit2;
}

// Função para validar e-mail
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para mostrar mensagem de erro
function showError(message) {
    // Verifica se já existe um elemento de erro
    let errorElement = document.querySelector('.error-message');
    
    if (!errorElement) {
        // Cria um novo elemento de erro
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        
        // Adiciona estilos ao elemento
        errorElement.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        errorElement.style.color = 'var(--error-color)';
        errorElement.style.padding = '12px';
        errorElement.style.borderRadius = 'var(--radius-sm)';
        errorElement.style.marginBottom = 'var(--spacing-md)';
        errorElement.style.fontSize = '14px';
        errorElement.style.textAlign = 'center';
        
        // Insere o elemento antes do botão de submit
        const form = document.querySelector('.login-form');
        const submitButton = form.querySelector('button[type="submit"]');
        form.insertBefore(errorElement, submitButton);
    }
    
    // Atualiza a mensagem de erro
    errorElement.textContent = message;
    
    // Adiciona animação de shake
    errorElement.style.animation = 'shake 0.5s';
    setTimeout(() => {
        errorElement.style.animation = '';
    }, 500);
}

// Função para exibir mensagens de sucesso
function showSuccess(message) {
    // Verifica se já existe um elemento de sucesso
    let successElement = document.querySelector('.success-message');
    
    if (!successElement) {
        // Cria um novo elemento de sucesso
        successElement = document.createElement('div');
        successElement.className = 'success-message';
        
        // Adiciona estilos ao elemento
        successElement.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
        successElement.style.color = 'var(--success-color, #22c55e)';
        successElement.style.padding = '12px';
        successElement.style.borderRadius = 'var(--radius-sm)';
        successElement.style.marginBottom = 'var(--spacing-md)';
        successElement.style.fontSize = '14px';
        successElement.style.textAlign = 'center';
        
        // Insere o elemento antes do botão de submit
        const form = document.querySelector('.login-form');
        const submitButton = form.querySelector('button[type="submit"]');
        form.insertBefore(successElement, submitButton);
    }
    
    // Atualiza a mensagem de sucesso
    successElement.textContent = message;
    
    // Adiciona animação de fade
    successElement.style.animation = 'fadeIn 0.5s';
    
    // Remover a mensagem após 2 segundos e redirecionar
    setTimeout(() => {
        successElement.style.opacity = '0';
        successElement.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            successElement.remove();
            window.location.href = 'login.html'; // Redireciona para a página de login
        }, 300);
    }, 2000);
}

// Adiciona a animação de shake ao CSS
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;
document.head.appendChild(style);