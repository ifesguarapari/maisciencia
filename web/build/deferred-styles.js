export function deferredPageStyles() {
  return [
    {
      name: 'compile-deferred-page-styles',
      apply: 'build',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          // Vite treats stylesheets with media as raw assets instead of compiling them.
          return html.replace(/(<link\b[^>]*\bid="page-styles"[^>]*?)\smedia="print"/, '$1')
        },
      },
    },
    {
      name: 'restore-deferred-page-styles',
      apply: 'build',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          const stylesheets = [...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*>/g)]
          if (stylesheets.length !== 1) {
            throw new Error('Page startup requires exactly one compiled stylesheet')
          }
          return html.replace(stylesheets[0][0], (tag) => tag.replace(/>$/, ' id="page-styles" media="print">'))
        },
      },
    },
  ]
}
