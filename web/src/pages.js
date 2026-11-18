const workshopDescription = 'Esta página está em construção. Em breve, você encontrará aqui mais informações sobre esta oficina.'

export const contentPages = {
  feira: {
    title: 'FEMAIS-ES - Feira de Ciências no ES',
    description: 'Conheça a FEMAIS-ES, feira científica e tecnológica do Mais Ciência na Escola no Espírito Santo, com exposições de projetos escolares e uma experiência gamificada.',
    indexable: true,
  },
  'feira/regulamento': {
    title: 'Regulamento da FEMAIS-ES',
    description: 'Consulte o regulamento geral da FEMAIS-ES: participação, modalidades, inclusão, inscrições, apresentação, avaliação e organização da feira.',
    indexable: true,
  },
  'feira/202612': {
    title: 'FEMAIS-ES em 04/12/2026 - Ifes Vila Velha',
    description: 'Conheça a programação da FEMAIS-ES em 04 de dezembro de 2026 (04/12/2026), no Ifes Vila Velha: 20 atividades em cinco eixos, exposições e uma experiência gamificada.',
    indexable: true,
  },
}

export const placeholderPages = {
  login: {
    title: 'Acesso ao Aplicativo',
    description: 'O ambiente digital do Ifes Mais Ciência na Escola estará disponível em breve.',
    accent: '#67d5c7',
  },
  'feira/202703': {
    title: 'Março de 2027 - IFES Piúma',
    description: 'Esta página está em construção. Em breve, confira as informações do encontro da primeira edição da FEMAIS-ES no IFES Piúma.',
    accent: '#0096e1',
  },
  'feira/202706': {
    title: 'Junho de 2027 - IFES Linhares',
    description: 'Esta página está em construção. Em breve, confira as informações do encontro da primeira edição da FEMAIS-ES no IFES Linhares.',
    accent: '#f09bbe',
  },
  oficinas: {
    title: 'Oficinas',
    description: 'Esta página está em construção. Em breve, você poderá conhecer como as oficinas são planejadas e executadas.',
    accent: '#67d5c7',
  },
  'oficinas/ler': {
    title: 'Ler um Livro com Jogos',
    description: workshopDescription,
    accent: '#df8cba',
  },
  'oficinas/lancar': {
    title: 'Lançar Foguetes com Precisão',
    description: workshopDescription,
    accent: '#e3bd6b',
  },
  'oficinas/melhorar': {
    title: 'Melhorar a Cidade com Eletrônica',
    description: workshopDescription,
    accent: '#71d7c8',
  },
}

export const pages = { ...contentPages, ...placeholderPages }

export const routeEntries = ['index.html', ...Object.keys(pages).map((route) => `${route}/index.html`)]
