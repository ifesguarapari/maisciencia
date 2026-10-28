const schoolGroups = [
  ['Alfredo Chaves', ['EMEF Ana Araújo', 'EMEF Crubixá', 'EMEF Sagrada Família']],
  ['Anchieta', ['EMEB Josefina Ramos Nunes', 'EMEF Irmã Terezinha Godoy de Almeida', 'EMEIEF Professora Maria Luiza Flores']],
  ['Guarapari', ['EMEF Presidente Costa e Silva', 'EMEF Cândida Soares Machado', 'EMEIEF Constantino José Vieira']],
  ['Linhares', ['EMEF Prefeito Roberto Calmon', 'EMEFTI Evaldo Soella', 'EMEF Zeferino Batista Fiorot']],
  ['Serra', ['EMEF Dr. Hélio Ferraz', 'EMEF Irmã Dulce', 'EMEFTI Residencial Jacaraípe']],
  ['Viana', ['EMEF Orestes Souto Novaes', 'EMEF Dorival Brandão', 'EMEF Francisco de Assis Pereira']],
  ['Vila Velha', ['UMEFTI Professor Élson José de Souza', 'UMEIEFTI Reverendo Waldomiro Martins Ferreira', 'UMEFTI Macionília Maurício Bueno']],
]

const campusCities = [
  'Cachoeiro de Itapemirim',
  'Guarapari',
  'Linhares',
  'Piúma',
  'São Mateus',
  'Serra',
  'Venda Nova do Imigrante',
  'Viana',
  'Vila Velha',
]

export const institutions = [
  ...schoolGroups.flatMap(([city, names], group) => names.map((name, index) => ({
    id: `school-${group + 1}-${index + 1}`,
    name,
    city,
    type: 'schools',
  }))),
  ...campusCities.map((city, index) => ({
    id: `campus-${index + 1}`,
    name: `Campus ${city}`,
    city,
    type: 'campuses',
  })),
]

export const coordinators = [
  { id: 'coordinator-1', name: 'Walber Antonio Ramos Beltrame', role: 'Coordenador Geral', initials: 'WB' },
  { id: 'coordinator-2', name: 'Vinícius Gazzoli Rangel', role: 'Coordenador Estadual', initials: 'VR' },
  { id: 'coordinator-3', name: 'Naiara dos Santos Nobre', role: 'Coordenadora de Rede', initials: 'NN' },
]

export const collaborators = [
  { id: 'collaborator-1', name: 'Ramon Rosa Maia Vieira Junior', role: 'Colaboração em Pesquisa', initials: 'RJ' },
  { id: 'collaborator-2', name: 'Nanine Renata Passos dos Santos Pereira', role: 'Colaboração em Literatura', initials: 'NP' },
  { id: 'collaborator-3', name: 'Debora Assis Cantarela', role: 'Colaboração em Modelagem', initials: 'DC' },
  { id: 'collaborator-4', name: 'Ronald Corradi Costa', role: 'Colaboração em Eletrônica', initials: 'RC' },
  { id: 'collaborator-5', name: 'Fernando Gagno Júnior', role: 'Colaboração em Ciência', initials: 'FJ' },
  { id: 'collaborator-6', name: 'Marcelene Alves Duarte', role: 'Colaboração em Matemática', initials: 'MD' },
]
