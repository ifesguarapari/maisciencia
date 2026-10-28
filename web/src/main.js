import Alpine from 'alpinejs'
import { registerSW } from 'virtual:pwa-register'
import { institutions, coordinators, collaborators } from './data.js'
import { filterInstitutions, getCities } from './filters.js'
import { getPageRoute, publicUrl } from './paths.js'

const sectionIds = ['inicio', 'sobre', 'oficinas', 'escolas', 'equipe', 'apoio']
const base = import.meta.env.BASE_URL
const pageRoute = getPageRoute(window.location.pathname, base)

async function prepareAppearance() {
  const hero = new Image()
  hero.src = publicUrl('images/background.webp', base)
  const resources = [
    hero.decode?.(),
    ...[...document.querySelectorAll('.site-header img')].map((image) => image.decode?.()),
    document.fonts?.load('700 1em "Plus Jakarta Sans"'),
    document.fonts?.load('400 1em Inter'),
  ]
  let timeout
  await Promise.race([
    Promise.allSettled(resources),
    new Promise((resolve) => { timeout = window.setTimeout(resolve, 1800) }),
  ])
  window.clearTimeout(timeout)
}

Alpine.data('landing', () => ({
  isLogin: pageRoute === 'login',
  isFair: pageRoute === 'feira',
  menuOpen: false,
  scrolled: false,
  activeSection: 'inicio',
  currentYear: new Date().getFullYear(),
  schoolTab: 'schools',
  searchQuery: '',
  selectedCity: '',
  openSchool: null,
  institutions,
  coordinators,
  collaborators,
  updateAvailable: false,
  updateApp: () => {},
  cleanup: [],

  iconUrl(name) {
    return publicUrl(`icons/interface.svg#${name}`, base)
  },

  get isPlaceholder() {
    return this.isLogin || this.isFair
  },

  get placeholderDescription() {
    return this.isFair
      ? 'A página da feira está em construção. Em breve, você encontrará aqui mais informações.'
      : 'O ambiente digital do Ifes Mais Ciência na Escola estará disponível em breve.'
  },

  get filteredInstitutions() {
    return filterInstitutions(this.institutions, {
      tab: this.schoolTab,
      query: this.searchQuery,
      city: this.selectedCity,
    })
  },

  get cities() {
    return getCities(this.institutions, this.schoolTab)
  },

  init() {
    if (this.isPlaceholder) {
      document.title = `${this.isFair ? 'Feira' : 'Acesso ao Aplicativo'} | Ifes Mais Ciência na Escola`
      document.querySelector('meta[name="description"]')?.setAttribute('content', this.placeholderDescription)
    }
    this.updateApp = registerSW({
      onNeedRefresh: () => {
        this.updateAvailable = true
      },
    })
    this.$watch('menuOpen', (open) => {
      document.body.classList.toggle('menu-open', open)
    })
    this.$nextTick(async () => {
      await window.siteStartup?.stylesReady
      await prepareAppearance()
      this.initializePage()
      window.requestAnimationFrame(() => window.siteStartup?.ready())
    })
  },

  closeMenu(restoreFocus = false) {
    this.menuOpen = false
    if (restoreFocus) this.$nextTick(() => this.$refs.menuButton?.focus())
  },

  setTab(tab) {
    if (!['schools', 'campuses'].includes(tab)) return
    this.schoolTab = tab
    this.clearFilters()
  },

  handleTabKey(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const tab = event.key === 'Home' ? 'schools'
      : event.key === 'End' ? 'campuses'
        : this.schoolTab === 'schools' ? 'campuses' : 'schools'
    this.setTab(tab)
    this.$nextTick(() => document.getElementById(`${tab}-tab`)?.focus())
  },

  clearFilters() {
    this.searchQuery = ''
    this.selectedCity = ''
    this.openSchool = null
  },

  toggleSchool(id) {
    this.openSchool = this.openSchool === id ? null : id
  },

  initializePage() {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktopMotion = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    let scrollFrame = 0

    const updateScroll = () => {
      scrollFrame = 0
      this.scrolled = window.scrollY > 28
      if (window.innerWidth >= 1024 && this.menuOpen) this.closeMenu()
      if (!this.isPlaceholder) {
        const current = sections.filter((section) => section.getBoundingClientRect().top <= 160).at(-1)
        this.activeSection = current?.id || 'inicio'
      }
      const offset = !this.isPlaceholder && desktopMotion.matches ? Math.min(window.scrollY * 0.12, 60) : 0
      document.documentElement.style.setProperty('--parallax', `${offset}px`)
    }
    const scheduleScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll)
    }
    window.addEventListener('scroll', scheduleScroll, { passive: true })
    window.addEventListener('resize', scheduleScroll, { passive: true })
    desktopMotion.addEventListener('change', scheduleScroll)
    this.cleanup.push(() => {
      window.removeEventListener('scroll', scheduleScroll)
      window.removeEventListener('resize', scheduleScroll)
      desktopMotion.removeEventListener('change', scheduleScroll)
      window.cancelAnimationFrame(scrollFrame)
    })
    updateScroll()

    const elements = [...document.querySelectorAll('.reveal, [data-count]')]
    const frames = new Map()
    const completed = new Set()
    const formatCount = (element, value) => {
      element.textContent = `${element.dataset.prefix || ''}${Math.round(value).toLocaleString('pt-BR')}${element.dataset.suffix || ''}`
    }
    const finishCount = (element) => {
      const value = Number(element.dataset.count)
      if (Number.isFinite(value)) formatCount(element, value)
      completed.add(element)
    }
    const animateCount = (element) => {
      const target = Number(element.dataset.count)
      if (!Number.isFinite(target) || completed.has(element)) return
      completed.add(element)
      const start = performance.now()
      const animate = (timestamp) => {
        const progress = Math.min((timestamp - start) / 1250, 1)
        formatCount(element, target * (1 - (1 - progress) ** 3))
        if (progress < 1) frames.set(element, window.requestAnimationFrame(animate))
        else frames.delete(element)
      }
      frames.set(element, window.requestAnimationFrame(animate))
    }
    const revealAll = () => {
      for (const element of elements) {
        element.classList.add('is-visible')
        if (element.hasAttribute('data-count')) {
          window.cancelAnimationFrame(frames.get(element))
          frames.delete(element)
          finishCount(element)
        }
      }
    }

    let observer
    if (motion.matches || !('IntersectionObserver' in window)) {
      revealAll()
    } else {
      document.documentElement.classList.add('motion-ready')
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          if (entry.target.hasAttribute('data-count')) animateCount(entry.target)
          observer.unobserve(entry.target)
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' })
      elements.forEach((element) => observer.observe(element))
    }
    const updateMotion = () => {
      if (motion.matches) {
        observer?.disconnect()
        revealAll()
      }
    }
    motion.addEventListener('change', updateMotion)
    this.cleanup.push(() => {
      observer?.disconnect()
      motion.removeEventListener('change', updateMotion)
      frames.forEach((frame) => window.cancelAnimationFrame(frame))
    })
  },

  destroy() {
    this.cleanup.forEach((cleanup) => cleanup())
    document.body.classList.remove('menu-open')
  },
}))

window.Alpine = Alpine
Alpine.start()
