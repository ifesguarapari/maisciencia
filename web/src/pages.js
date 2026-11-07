const workshopDescription = 'Esta página está em construção. Em breve, você encontrará aqui mais informações sobre esta oficina.'

export const placeholderPages = {
  login: {
    title: 'Acesso ao Aplicativo',
    description: 'O ambiente digital do Ifes Mais Ciência na Escola estará disponível em breve.',
    accent: '#67d5c7',
  },
  feira: {
    title: 'Feira',
    description: 'A página da feira está em construção. Em breve, você encontrará aqui mais informações.',
    accent: '#ed82b8',
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

export const routeEntries = ['index.html', ...Object.keys(placeholderPages).map((route) => `${route}/index.html`)]
