import { decemberFair } from './december-data.js'
import { fairEditions } from './fair-data.js'

const escapeMarkup = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character])
const arrow = '<svg class="icon" aria-hidden="true"><use href="{{base}}icons/interface.svg#arrow-right" /></svg>'
const colors = ['yellow', 'blue', 'pink']

function renderActivity(activity, color) {
  return `<article id="activity-${activity.id}" class="fair-activity fair-color-${color} reveal" aria-labelledby="activity-title-${activity.id}">
    <img class="fair-activity-image" src="{{base}}images/feira/activities/${activity.id}.svg" alt="Ilustração: ${escapeMarkup(activity.title)}" width="480" height="300" loading="lazy" decoding="async" />
    <div class="fair-activity-body">
      <p class="fair-activity-number">ATIVIDADE ${String(activity.number).padStart(2, '0')}</p>
      <h4 id="activity-title-${activity.id}">${escapeMarkup(activity.title)}</h4>
      <p class="fair-activity-summary">${escapeMarkup(activity.summary)}</p>
      <div class="fair-activity-exhibition"><span>EXPOSIÇÃO</span><h5>${escapeMarkup(activity.exhibition)}</h5><p><strong>Com:</strong> ${escapeMarkup(activity.exhibitor)}</p></div>
      <details class="fair-activity-details"><summary class="button-tinted fair-button fair-button-${color}">Sobre a exposição<span aria-hidden="true">+</span></summary><div><p>${escapeMarkup(activity.description)}</p></div></details>
      <div class="fair-activity-interaction"><span>EXPERIMENTE E PARTICIPE</span><p>${escapeMarkup(activity.interaction)}</p></div>
    </div>
  </article>`
}

export function renderDecemberPage() {
  const { intro, schedule, axes, integration } = decemberFair
  const edition = fairEditions.find(({ route }) => route === 'feira/202612')
  const day = schedule.date.slice(-2)
  const dateLabel = `${day} de dezembro de 2026`
  const shortDate = schedule.date.split('-').reverse().join('/')
  return `
    <section id="inicio" class="fair-encounter-hero fair-color-yellow" aria-labelledby="encounter-title">
      <div class="hero-image fair-image fair-encounter-image" aria-hidden="true"></div><div class="fair-encounter-shade" aria-hidden="true"></div>
      <div class="container fair-encounter-inner">
        <nav class="fair-breadcrumb" aria-label="Caminho da página"><a href="{{base}}feira">Feira</a><span aria-hidden="true">/</span><span aria-current="page">${dateLabel}</span></nav>
        <div class="fair-encounter-copy"><p class="fair-edition-label"><span aria-hidden="true"></span> PRIMEIRA EDIÇÃO</p>
          <img class="fair-encounter-logo" src="{{base}}images/feira/femais.svg" alt="FEMAIS-ES" width="1033" height="736" />
          <h1 id="encounter-title"><time datetime="${schedule.date}">${day} de dezembro<br />de 2026</time><span class="fair-yellow">.</span></h1>
          <p class="fair-encounter-campus">${schedule.venue}</p><p class="fair-encounter-lead">Ciência, tecnologia e criatividade<br />em um encontro para descobrir juntos.</p>
          <p class="fair-encounter-description">Projetos das escolas, experiências interativas e novas aprendizagens no mundo da inovação. Explore a programação do encontro da FEMAIS-ES em Vila Velha.</p>
          <div class="hero-actions"><a class="button-tinted fair-button fair-button-yellow" href="#program">Programação ${arrow}</a><a class="button-tinted fair-button fair-button-blue" href="#atividades">Explore os estandes ${arrow}</a></div>
        </div>
        <div class="fair-encounter-facts"><span><strong>${edition.institutions.length}</strong> instituições participantes</span><span><strong>${axes.reduce((count, axis) => count + axis.activities.length, 0)}</strong> atividades para explorar</span><span><strong>${axes.length}</strong> eixos de conhecimento</span></div>
      </div>
    </section>

    <nav class="fair-encounter-navigation" aria-label="Navegação do encontro"><div class="container"><a href="#program">Programação</a><a href="#experiencia">Experiência</a><a href="#atividades">Eixos e estandes</a><a href="#participacao">Participantes</a><a href="#integration">Jornada de Integração</a></div></nav>

    <section id="program" class="section fair-program" aria-labelledby="program-title"><div class="container">
      <div class="fair-section-top reveal"><div class="section-heading"><p class="eyebrow">PROGRAME SUA VISITA</p><h2 id="program-title">Nosso encontro é no<br /><span class="fair-blue">Ifes Vila Velha.</span></h2><p>A programação da FEMAIS-ES será realizada em <time datetime="${schedule.date}">${dateLabel} (${shortDate})</time>, no Ifes Vila Velha. Uma tarde de descobertas, trocas e participação.</p></div><p class="fair-program-month"><span>DEZEMBRO DE 2026</span><strong>${day}</strong></p></div>
      <ol class="fair-schedule">${schedule.items.map((item, index) => `<li class="reveal fair-color-${colors[index % 3]}"><span class="fair-schedule-dot" aria-hidden="true"></span><time datetime="${item.time}">${item.displayTime}</time><h3>${escapeMarkup(item.title)}</h3></li>`).join('')}</ol>
    </div></section>

    <section id="experiencia" class="section fair-encounter-experience" aria-labelledby="encounter-experience-title"><div class="container fair-encounter-experience-grid">
      <div class="reveal"><p class="eyebrow">EXPLORE. INTERAJA. ACUMULE APRENDIZAGENS.</p><h2 id="encounter-experience-title">A curiosidade<br /><span class="fair-pink">vale pontos.</span></h2></div>
      <div class="reveal"><p>${escapeMarkup(intro)}</p><a class="button-tinted fair-button fair-button-pink" href="{{base}}feira/regulamento">Consulte o regulamento ${arrow}</a></div>
    </div></section>

    <section id="atividades" class="section fair-encounter-activities" aria-labelledby="encounter-activities-title"><div class="container">
      <div class="section-heading reveal"><p class="eyebrow">CADA ESTANDE, UMA NOVA DESCOBERTA</p><h2 id="encounter-activities-title">Cinco eixos.<br /><span class="fair-yellow">Muitas formas de aprender.</span></h2><p>Conheça as 20 atividades do encontro, as exposições e quem estará compartilhando suas experiências. Escolha um eixo para começar a explorar.</p></div>
      <nav class="fair-axis-index" aria-label="Eixos de atividades">${axes.map((axis, index) => `<a class="fair-color-${colors[index % 3]}" href="#${axis.id}"><span>${axis.number}</span>${escapeMarkup(axis.title)}${arrow}</a>`).join('')}</nav>
      ${axes.map((axis, index) => `<section id="${axis.id}" class="fair-encounter-axis fair-color-${colors[index % 3]}" aria-labelledby="axis-title-${axis.id}"><div class="fair-axis-heading reveal"><span class="fair-axis-mark" aria-hidden="true">${axis.number}</span><div><p class="eyebrow">EIXO ${axis.number}</p><h3 id="axis-title-${axis.id}">${escapeMarkup(axis.title)}</h3><p>${escapeMarkup(axis.description)}</p></div><a href="#atividades" class="fair-axis-return" aria-label="Voltar ao índice dos eixos">↑</a></div><div class="fair-activity-grid">${axis.activities.map((activity) => renderActivity(activity, colors[index % 3])).join('')}</div></section>`).join('')}
    </div></section>

    <section id="participacao" class="section fair-encounter-participation" aria-labelledby="encounter-participation-title"><div class="container">
      <div class="section-heading reveal"><p class="eyebrow">COMUNIDADE ESCOLAR EM ENCONTRO</p><h2 id="encounter-participation-title">Quem participa<br /><span class="fair-blue">desta etapa.</span></h2><p>Esta edição recebe professores, estudantes, pais e responsáveis convidados do Programa Mais Ciência na Escola das instituições abaixo, além de demais autoridades convidadas.</p></div>
      <ul class="fair-encounter-schools">${edition.institutions.map(({ name, city }) => `<li class="reveal"><span>${escapeMarkup(name)}</span>${city ? `<small>${escapeMarkup(city)}</small>` : ''}</li>`).join('')}</ul>
    </div></section>

    <section id="integration" class="section fair-integration" aria-labelledby="integration-title"><div class="container"><div class="fair-integration-panel reveal">
      <div class="fair-integration-art"><img src="{{base}}${integration.image}" alt="Jornada de Integração do Ifes 2026" width="300" height="213" loading="lazy" /><p>30 DE NOVEMBRO<br /><span>A 4 DE DEZEMBRO DE 2026</span></p></div>
      <div class="fair-integration-copy"><p class="eyebrow">CONHECIMENTO QUE SE ENCONTRA</p><h2 id="integration-title">Jornada de Integração<span class="fair-pink">.</span></h2><p>${escapeMarkup(integration.description)}</p><a class="button-tinted fair-button fair-button-pink" href="${integration.link.url}" target="_blank" rel="noopener noreferrer" aria-label="${integration.link.label} (abre em nova aba)">${integration.link.label} ${arrow}</a></div>
    </div></div></section>

    <section class="fair-encounter-end"><div class="container"><div><p class="eyebrow">CONTINUE EXPLORANDO</p><h2>Uma descoberta<br />leva a outra<span class="fair-yellow">.</span></h2></div><div class="fair-encounter-end-actions"><a class="button-tinted fair-button fair-button-yellow" href="{{base}}feira#edicao">Conheça os outros encontros ${arrow}</a><a class="button-tinted fair-button fair-button-blue" href="{{base}}feira/regulamento">Regulamento ${arrow}</a></div></div></section>`
}
