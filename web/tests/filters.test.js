import assert from 'node:assert/strict'
import { test } from 'node:test'
import { institutions, coordinators, collaborators } from '../src/data.js'
import { filterInstitutions, getCities } from '../src/filters.js'

test('the provided network contains 21 schools, nine campuses, and 11 municipalities', () => {
  assert.equal(filterInstitutions(institutions).length, 21)
  assert.equal(filterInstitutions(institutions, { tab: 'campuses' }).length, 9)
  assert.equal(new Set(institutions.map((institution) => institution.city)).size, 11)
  assert.equal(new Set(institutions.map((institution) => institution.id)).size, 30)
  assert.equal(coordinators.length, 3)
  assert.equal(collaborators.length, 6)
})

test('name searches ignore accents, case, and repeated whitespace', () => {
  const results = filterInstitutions(institutions, { query: '   IRMA   dulce  ' })
  assert.deepEqual(results.map((institution) => institution.name), ['EMEF Irmã Dulce'])
})

test('search, municipality, and tab apply together', () => {
  const results = filterInstitutions(institutions, {
    tab: 'schools', query: 'professora', city: 'anchieta',
  })
  assert.deepEqual(results.map((institution) => institution.name), ['EMEIEF Professora Maria Luiza Flores'])
  assert.equal(filterInstitutions(institutions, { query: 'professora', city: 'Guarapari' }).length, 0)
})

test('searches do not leak institutions from the inactive tab', () => {
  const schools = filterInstitutions(institutions, { query: 'Guarapari' })
  const campuses = filterInstitutions(institutions, { query: 'Guarapari', tab: 'campuses' })
  assert.equal(schools.length, 3)
  assert.equal(campuses.length, 1)
  assert.equal(campuses[0].name, 'Campus Guarapari')
})

test('campus municipality searches support diacritics without changing official spelling', () => {
  const results = filterInstitutions(institutions, { tab: 'campuses', query: 'sao mateus' })
  assert.equal(results[0].city, 'São Mateus')
})

test('municipality options belong to the selected network and stay complete during search', () => {
  const schoolCities = getCities(institutions, 'schools')
  const campusCities = getCities(institutions, 'campuses')
  assert.equal(schoolCities.length, 7)
  assert.equal(campusCities.length, 9)
  assert.equal(schoolCities.includes('Piúma'), false)
  assert.equal(campusCities.includes('Piúma'), true)
  assert.equal(schoolCities[0], 'Alfredo Chaves')
})

test('an unmatched query returns an empty state and filtering never mutates source data', () => {
  const original = institutions.map((institution) => ({ ...institution }))
  assert.deepEqual(filterInstitutions(institutions, { query: 'not-a-school' }), [])
  filterInstitutions(institutions, { city: 'Viana' })
  assert.deepEqual(institutions, original)
})
