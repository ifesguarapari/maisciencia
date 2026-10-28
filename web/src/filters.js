export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
    .replace(/\s+/g, ' ')
}

export function filterInstitutions(institutions, { tab = 'schools', query = '', city = '' } = {}) {
  const search = normalizeText(query)
  const municipality = normalizeText(city)
  return institutions.filter((institution) => (
    institution.type === tab
    && (!municipality || normalizeText(institution.city) === municipality)
    && normalizeText(`${institution.name} ${institution.city}`).includes(search)
  ))
}

export function getCities(institutions, tab) {
  return [...new Set(institutions
    .filter((institution) => institution.type === tab)
    .map((institution) => institution.city))]
    .sort((first, second) => first.localeCompare(second, 'pt-BR'))
}
