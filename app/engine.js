// Minimal renderer for the {{...}} placeholder syntax used in
// templates/core/*/SKILL.md.tmpl. See docs/ARCHITECTURE.md section 5 and
// cli/README.md for the spec this implements. Deliberately small: it only
// supports what the 9 shipped templates actually use --
//   {{path.to.value}}
//   {{path.to.value|| "fallback text"}}
//   {{#if path}} ... {{/if}}
//   {{#each path}} ... {{this.field}} ... {{/each}}
//   {{! author comment, never rendered }}
// This is the same mechanical substitution described in cli/README.md's
// `originate generate` spec -- a real implementation of the deferred
// generator, scoped to run entirely in the browser for this console.

function resolvePath(ctx, path) {
  const parts = path.trim().split('.');
  let cur = ctx;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function isTruthy(v) {
  if (Array.isArray(v)) return v.length > 0;
  if (v == null || v === false || v === '') return false;
  return true;
}

function formatValue(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
}

function stripComments(tmpl) {
  return tmpl.replace(/\{\{!\s*[\s\S]*?\}\}/g, '');
}

function renderInterpolations(tmpl, ctx) {
  return tmpl.replace(/\{\{\s*([^{}#/!][^{}]*?)\s*\}\}/g, (match, expr) => {
    const parts = expr.split('||');
    const pathPart = parts[0].trim();
    const fallbackPart = parts.length > 1 ? parts.slice(1).join('||').trim() : undefined;
    const val = resolvePath(ctx, pathPart);
    const empty = val === undefined || val === null || val === '' ||
      (Array.isArray(val) && val.length === 0);
    if (empty && fallbackPart !== undefined) {
      const m = fallbackPart.match(/^"(.*)"$/s);
      return m ? m[1] : fallbackPart;
    }
    return formatValue(val);
  });
}

function renderEach(tmpl, ctx) {
  return tmpl.replace(/\{\{#each ([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, pathExpr, inner) => {
    const arr = resolvePath(ctx, pathExpr.trim());
    if (!Array.isArray(arr)) return '';
    return arr.map((item) => {
      const itemCtx = Object.assign({}, ctx, { this: item });
      return renderInterpolations(inner, itemCtx);
    }).join('');
  });
}

function renderIf(tmpl, ctx) {
  return tmpl.replace(/\{\{#if ([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, pathExpr, inner) => {
    const val = resolvePath(ctx, pathExpr.trim());
    return isTruthy(val) ? renderInterpolations(inner, ctx) : '';
  });
}

function renderTemplate(source, ctx) {
  let t = stripComments(source);
  t = renderEach(t, ctx);
  t = renderIf(t, ctx);
  t = renderInterpolations(t, ctx);
  return t;
}
