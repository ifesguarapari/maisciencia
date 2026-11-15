import { pages, placeholderPages } from './pages.js'
import { regulation } from './regulation.js'
import { fairEditions } from './fair-data.js'

export { fairEditions } from './fair-data.js'

export function isFairRoute(route) {
  return Boolean(route && Object.hasOwn(pages, route) && (route === 'feira' || route.startsWith('feira/')))
}

const escapeMarkup = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character])

const arrow = '<svg class="icon" aria-hidden="true"><use href="{{base}}icons/interface.svg#arrow-right" /></svg>'

function renderEditions() {
  return fairEditions.map(({ route, month, year, location, color, institutions }, index) => `
    <article class="fair-edition-card fair-color-${color} reveal" style="--reveal-delay: ${index * 80}ms">
      <div class="fair-edition-card-top"><span>ENCONTRO</span><svg class="icon" aria-hidden="true"><use href="{{base}}icons/interface.svg#pin" /></svg></div>
      <h3>${month} <span>de ${year}</span></h3>
      <p class="fair-campus">${location}</p>
      <div class="fair-card-schools"><h4>Instituições participantes</h4><ul>${institutions.map(({ name, city }) => `<li><span class="fair-school-name">${escapeMarkup(name)}</span>${city ? `<span class="fair-school-city">${escapeMarkup(city)}</span>` : ''}</li>`).join('')}</ul></div>
      <a class="button-tinted fair-button fair-button-${color}" href="{{base}}${route}" aria-label="Saiba mais: ${month} de ${year} - ${location}">Saiba mais ${arrow}</a>
    </article>`).join('')
}

function renderRegulation() {
  return `
    <section id="regulamento" class="fair-document-hero" aria-labelledby="regulation-title"><div class="container">
      <nav class="fair-breadcrumb" aria-label="Caminho da página"><a href="{{base}}feira">Feira</a><span aria-hidden="true">/</span><span aria-current="page">Regulamento</span></nav>
      <p class="eyebrow">ORIENTAÇÕES PARA PARTICIPAR</p>
      <h1 id="regulation-title">Regulamento<span class="sr-only"> da </span><img class="fair-document-logo" src="{{base}}images/feira/femais.svg" alt="FEMAIS-ES" width="1033" height="736" /></h1>
      <p>Diretrizes para compartilhar descobertas com responsabilidade, inclusão e colaboração.</p>
      <a class="button-tinted fair-button fair-button-pink" href="{{base}}feira">Voltar à Feira ${arrow}</a>
    </div></section>
    <div class="container fair-document-layout">
      <aside class="fair-document-sidebar"><details class="fair-document-index" open><summary>Neste regulamento <span aria-hidden="true">⌄</span></summary><nav aria-label="Índice do regulamento">${regulation.sections.map((section) => `<a href="#${escapeMarkup(section.id)}"><span>${section.number.toString().padStart(2, '0')}</span>${escapeMarkup(section.title)}</a>`).join('')}</nav></details></aside>
      <article class="fair-document" aria-label="Regulamento geral completo da FEMAIS-ES">
        <div class="fair-document-preamble"><p class="eyebrow">REGULAMENTO GERAL</p><h2>${escapeMarkup(regulation.subtitle)}</h2>${regulation.preamble.map((text) => `<p>${escapeMarkup(text)}</p>`).join('')}</div>
        ${regulation.sections.map((section) => `<section id="${escapeMarkup(section.id)}" class="fair-document-section" aria-labelledby="rules-${section.number}"><h2 id="rules-${section.number}"><span>${section.number.toString().padStart(2, '0')}</span>${escapeMarkup(section.title)}</h2>${section.paragraphs.map((text) => `<p>${escapeMarkup(text)}</p>`).join('')}</section>`).join('')}
        <div class="fair-document-end"><a class="button-tinted fair-button fair-button-pink" href="{{base}}feira#edicao">Conheça os encontros ${arrow}</a><a class="button-tinted fair-button fair-button-blue" href="#regulamento">Voltar ao início do regulamento ${arrow}</a></div>
      </article>
    </div>`
}

function renderPlaceholder(route) {
  const edition = fairEditions.find((item) => item.route === route)
  const page = placeholderPages[route]
  return `
    <section id="inicio" class="fair-document-hero fair-stage-hero fair-color-${edition.color}" aria-labelledby="stage-title">
      <div class="fair-stage-image" aria-hidden="true"></div><div class="container">
        <nav class="fair-breadcrumb" aria-label="Caminho da página"><a href="{{base}}feira">Feira</a><span aria-hidden="true">/</span><span aria-current="page">Primeira edição</span></nav>
        <p class="eyebrow">PRIMEIRA EDIÇÃO</p>
        <img class="fair-stage-logo" src="{{base}}images/feira/femais.svg" alt="FEMAIS-ES" width="1033" height="736" />
        <h1 id="stage-title">${edition.month}<br />de ${edition.year}<span>.</span></h1>
        <p class="fair-stage-campus">${edition.location}</p>
        <p class="fair-stage-status">Em construção</p><p>${escapeMarkup(page.description)}</p>
        <a class="button-tinted fair-button fair-button-${edition.color}" href="{{base}}feira#edicao">Voltar à Feira ${arrow}</a>
      </div>
    </section>`
}

export function renderFairPage(template, route, base) {
  if (!isFairRoute(route)) throw new Error(`Unknown fair route: ${route}`)
  let html = template.replace('{{route}}', route)
  if (route !== 'feira') {
    const content = route === 'feira/regulamento' ? renderRegulation() : renderPlaceholder(route)
    html = html.replace(/<!-- fair-content:start -->[\s\S]*?<!-- fair-content:end -->/, () => content)
  } else {
    html = html.replace('{{edition-cards}}', renderEditions)
  }
  return html.replaceAll('{{base}}', base)
}
