// Array de estabelecimentos fictícios
const establishments = [
    {
        id: 1,
        name: "Auto Center Express",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlpxFY8_5RBci20jDqofLuhaUeRUhWNARHY303wyD9QQmEfYEL0FLA_I-AE6wfc8Chrfw&usqp=CAU",
        distance: "1.2 km",
        rating: 4.8,
        reviewCount: 120,
        type: "Oficina Mecânica • Elétrica",
        availability: "Disponível agora",
        categories: ["Mecânica", "Elétrica"],
        horaInicio: "08:00",
        horaFim: "18:00",
        atendeADomicilio: false,
        atendePontoProprio: true,
        estabelecimentoTipo: "oficina",
        verificado: true
    },
    {
        id: 2,
        name: "Lava Jato Premium",
        image: "https://www.carrosnovale.com.br/wp-content/uploads/2017/06/Fachada-Automec.jpeg",
        distance: "2.5 km",
        rating: 4.6,
        reviewCount: 85,
        type: "Lava Jato • Polimento",
        availability: "Disponível agora",
        categories: ["Lava Jato", "Polimento"],
        horaInicio: "07:00",
        horaFim: "20:00",
        atendeADomicilio: false,
        atendePontoProprio: true,
        estabelecimentoTipo: "lava_jato",
        verificado: true
    },
    {
        id: 3,
        name: "João Mecânico",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlpxFY8_5RBci20jDqofLuhaUeRUhWNARHY303wyD9QQmEfYEL0FLA_I-AE6wfc8Chrfw&usqp=CAU",
        distance: "3.0 km",
        rating: 4.9,
        reviewCount: 210,
        type: "Mecânico Autônomo • Atende a domicílio",
        availability: "Disponível em 30min",
        categories: ["Mecânico", "Atendimento a domicílio"],
        horaInicio: "08:00",
        horaFim: "17:00",
        atendeADomicilio: true,
        atendePontoProprio: false,
        estabelecimentoTipo: "mecanico",
        verificado: true
    },
    {
        id: 4,
        name: "Guincho Rápido",
        image: "https://source.unsplash.com/random/300x200/?tow,truck",
        distance: "5.0 km",
        rating: 4.7,
        reviewCount: 95,
        type: "Guincho • Resgate 24h",
        availability: "Disponível agora",
        categories: ["Guincho", "Resgate"],
        horaInicio: "00:00",
        horaFim: "23:59",
        atendeADomicilio: true,
        atendePontoProprio: true,
        estabelecimentoTipo: "guincho",
        verificado: false
    },
    {
        id: 5,
        name: "Carlos Especialista",
        image: "https://source.unsplash.com/random/300x200/?mechanic,worker",
        distance: "2.8 km",
        rating: 4.9,
        reviewCount: 156,
        type: "Especialista em Injeção Eletrônica",
        availability: "Disponível agora",
        categories: ["Injeção Eletrônica", "Mecânico"],
        horaInicio: "09:00",
        horaFim: "19:00",
        atendeADomicilio: false,
        atendePontoProprio: true,
        estabelecimentoTipo: "mecanico",
        verificado: true
    },
    {
        id: 6,
        name: "Mariana Técnica",
        image: "https://source.unsplash.com/random/300x200/?auto,technician",
        distance: "3.5 km",
        rating: 4.8,
        reviewCount: 132,
        type: "Especialista em Elétrica Automotiva",
        availability: "Disponível em 15min",
        categories: ["Elétrica", "Mecânico"],
        horaInicio: "08:30",
        horaFim: "18:30",
        atendeADomicilio: true,
        atendePontoProprio: true,
        estabelecimentoTipo: "mecanico",
        verificado: false
    },
    {
        id: 7,
        name: "Oficina do Pedro",
        image: "https://source.unsplash.com/random/300x200/?car,workshop",
        distance: "4.2 km",
        rating: 4.5,
        reviewCount: 78,
        type: "Oficina Completa • Peças",
        availability: "Disponível em 1h",
        categories: ["Oficina", "Peças"],
        horaInicio: "08:00",
        horaFim: "17:00",
        atendeADomicilio: false,
        estabelecimentoTipo: "oficina",
        verificado: false
    },
    {
        id: 8,
        name: "Lava Rápido do Zé",
        image: "https://source.unsplash.com/random/300x200/?car,wash",
        distance: "1.8 km",
        rating: 4.3,
        reviewCount: 65,
        type: "Lava Jato • Enceramento",
        availability: "Disponível agora",
        categories: ["Lava Jato", "Enceramento"],
        horaInicio: "07:30",
        horaFim: "19:30",
        atendeADomicilio: false,
        estabelecimentoTipo: "lava_jato",
        verificado: false
    }
];

// Função para verificar se o estabelecimento está aberto no momento atual
function isEstablishmentOpen(horaInicio, horaFim) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    return currentTime >= horaInicio && currentTime <= horaFim;
}

// Função para renderizar os estabelecimentos na página
function renderEstablishments(containerId, categoryFilter = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Limpar o container
    container.innerHTML = '';
    
    // Filtrar estabelecimentos se necessário
    let filteredEstablishments = establishments;
    if (categoryFilter) {
        filteredEstablishments = establishments.filter(est => 
            est.categories.some(cat => cat.toLowerCase().includes(categoryFilter.toLowerCase()))
        );
    }
    
    // Limitar a 4 estabelecimentos para exibição
    const displayEstablishments = filteredEstablishments.slice(0, 4);
    
    // Renderizar cada estabelecimento
    displayEstablishments.forEach(est => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.dataset.id = est.id;
        
        // Verifica se o estabelecimento está aberto
        const isOpen = isEstablishmentOpen(est.horaInicio, est.horaFim);
        const statusClass = isOpen ? 'status-open' : 'status-closed';
        const statusText = isOpen ? 'Aberto' : 'Fechado';
        
        // Prepara o ícone de verificado se aplicável
        const verifiedBadge = est.verificado ? 
            '<span class="verified-badge"><i class="fas fa-check-circle"></i></span>' : '';
        
        // Prepara o texto de atendimento a domicílio se aplicável
        const domicilioText = est.atendeADomicilio ? 
            '<span class="domicilio-text">• Atende a domicílio</span>' : '';
        
        // Formata o tipo de estabelecimento para exibição
        let tipoEstabelecimento = '';
        switch(est.estabelecimentoTipo) {
            case 'oficina':
                tipoEstabelecimento = 'Oficina';
                break;
            case 'lava_jato':
                tipoEstabelecimento = 'Lava Jato';
                break;
            case 'guincho':
                tipoEstabelecimento = 'Guincho';
                break;
            case 'mecanico':
                tipoEstabelecimento = 'Mecânico';
                break;
            default:
                tipoEstabelecimento = est.estabelecimentoTipo;
        }
        
        // Verifica se está próximo do fechamento (menos de 1 hora)
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Converte horaFim para minutos desde o início do dia
        const [horaFimHour, horaFimMinute] = est.horaFim.split(':').map(Number);
        const horaFimTotal = horaFimHour * 60 + horaFimMinute;
        
        // Converte hora atual para minutos desde o início do dia
        const currentTotal = currentHour * 60 + currentMinute;
        
        // Calcula a diferença em minutos
        const minutesUntilClose = horaFimTotal - currentTotal;
        
        // Determina o texto de disponibilidade
        let availabilityText = est.availability;
        if (isOpen && minutesUntilClose <= 60) {
            // Se estiver aberto e faltar menos de 1 hora para fechar
            availabilityText = `Fecha em ${minutesUntilClose} min`;
        }
        
        // Gera tags de serviços prestados
        const serviceTagsHtml = est.categories.map(category => 
            `<span class="service-tag">${category}</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="service-image">
                <img src="${est.image}" alt="${est.name}">
                <span class="distance">${est.distance}</span>
                <span class="service-status ${statusClass}">${statusText}</span>
            </div>
            <div class="service-info">
                <h3>${est.name} ${verifiedBadge}</h3>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${est.rating} (${est.reviewCount})</span>
                </div>
                <p class="service-type">
                    <span class="establishment-type-badge">${tipoEstabelecimento}</span>
                    ${est.type}
                </p>
                <p class="delivery-time">
                    <i class="fas fa-clock"></i> ${availabilityText}
                </p>
                ${getAtendimentoText(est)}
                <p class="service-hours">${est.horaInicio} - ${est.horaFim}</p>
                <div class="service-tags">
                    ${serviceTagsHtml}
                </div>
            </div>
        `;
        
        // Adicionar evento de clique para abrir o modal
        card.addEventListener('click', () => {
            openBookingModal(card);
        });
        
        container.appendChild(card);
    });
}

// Função para obter o texto de atendimento baseado nas propriedades
function getAtendimentoText(establishment) {
    if (establishment.atendeADomicilio && establishment.atendePontoProprio) {
        return '<p class="domicilio-badge"><i class="fas fa-home"></i> Atende a domicílio</p>' +
               '<p class="local-badge"><i class="fas fa-store"></i> Atende no local</p>';
    } else if (establishment.atendeADomicilio) {
        return '<p class="domicilio-badge"><i class="fas fa-home"></i> Atende somente a domicílio</p>';
    } else if (establishment.atendePontoProprio) {
        return '<p class="local-badge"><i class="fas fa-store"></i> Atende somente no local</p>';
    } else {
        return ''; // Não atende de nenhuma forma
    }
}

// Exportar as funções e dados para uso em outros arquivos
window.EstablishmentsModule = {
    establishments,
    renderEstablishments
};