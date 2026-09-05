// Originate's pixel-art "pet" character: a blocky SVG blob rendered with
// crisp edges and no anti-aliasing, one pose per pipeline state -- idle,
// thinking, searching, generating, waiting, done, failed, stopped.

const PET_COLORS = {
  body: '#FB8156',
  shadow: '#C9603A',
  ink: '#1E1B1F',
  cream: '#FCF6F1',
  warmCream: '#FEEED6',
  wizardNavy: '#1D3E7C',
  wizardNavyShadow: '#0C234D',
  deerstalker: '#74635C',
  spark: '#FBC544',
  glass: '#D8D4D2',
  glint: '#FFFFFF',
  waitAmber: '#E3B27A',
  failed: '#A8402B',
  muted: '#A08076',
};

function rect(x, y, w, h, fill, extra = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
}

function baseBody(bodyColor, shadowColor) {
  return [
    rect(6, 8, 10, 8, bodyColor, 'rx="1.5"'),
    rect(7, 15, 8, 2, shadowColor, 'rx="1"'),
    rect(5, 10, 2, 4, bodyColor, 'rx="1"'),
    rect(15, 10, 2, 4, bodyColor, 'rx="1"'),
    rect(8, 17, 2, 2, shadowColor),
    rect(12, 17, 2, 2, shadowColor),
  ].join('');
}

function eyesOpen() {
  return rect(8.5, 11, 1.6, 1.6, PET_COLORS.ink) + rect(12, 11, 1.6, 1.6, PET_COLORS.ink);
}

function eyesWink() {
  return rect(8.5, 11.7, 1.6, 0.5, PET_COLORS.ink) + rect(12, 11, 1.6, 1.6, PET_COLORS.ink);
}

function eyesShut() {
  return rect(8.5, 11.7, 1.6, 0.5, PET_COLORS.ink) + rect(12, 11.7, 1.6, 0.5, PET_COLORS.ink);
}

function eyesSquint() {
  return rect(8.3, 11.9, 2, 0.6, PET_COLORS.ink) + rect(11.8, 11.9, 2, 0.6, PET_COLORS.ink);
}

const POSE_BUILDERS = {
  idle: () => `
    ${baseBody(PET_COLORS.body, PET_COLORS.shadow)}
    ${eyesOpen()}
    ${rect(4, 12, 1.6, 2, PET_COLORS.cream, 'rx="0.5"')}
    ${rect(4.3, 10.6, 1, 1.2, PET_COLORS.warmCream, 'class="pet-steam"')}
  `,
  queued: () => `
    ${baseBody(PET_COLORS.muted, PET_COLORS.shadow)}
    ${eyesShut()}
    ${rect(4, 12, 1.6, 2, PET_COLORS.cream, 'rx="0.5"')}
  `,
  working: () => `
    ${baseBody(PET_COLORS.body, PET_COLORS.shadow)}
    ${eyesOpen()}
    ${rect(6.5, 15.5, 9, 1.4, PET_COLORS.ink, 'rx="0.3"')}
    ${rect(7.5, 13.5, 2, 1.6, PET_COLORS.ink, 'class="pet-tap"')}
    ${rect(11.5, 13.5, 2, 1.6, PET_COLORS.ink, 'class="pet-tap-alt"')}
  `,
  thinking: () => `
    ${baseBody(PET_COLORS.body, PET_COLORS.shadow)}
    ${eyesOpen()}
    ${rect(15, 5.5, 1.3, 1.3, PET_COLORS.glint, 'rx="0.6" class="pet-dot pet-dot-1"')}
    ${rect(16.8, 4, 1.6, 1.6, PET_COLORS.glint, 'rx="0.8" class="pet-dot pet-dot-2"')}
    ${rect(19, 2.2, 2.2, 2.2, PET_COLORS.glint, 'rx="1.1" class="pet-dot pet-dot-3"')}
  `,
  searching: () => `
    ${baseBody(PET_COLORS.body, PET_COLORS.shadow)}
    ${eyesWink()}
    ${rect(7.5, 5.5, 7, 2.6, PET_COLORS.deerstalker, 'rx="0.6"')}
    ${rect(6.5, 7.5, 2, 1, PET_COLORS.deerstalker)}
    ${rect(14, 7.5, 2, 1, PET_COLORS.deerstalker)}
    ${rect(16, 12, 2.6, 2.6, 'none', `stroke="${PET_COLORS.glass}" stroke-width="1" rx="1.3" class="pet-glint"`)}
    ${rect(15, 14.5, 1.2, 1.2, PET_COLORS.ink)}
  `,
  generating: () => `
    ${baseBody(PET_COLORS.body, PET_COLORS.shadow)}
    ${eyesOpen()}
    ${rect(7, 5, 8, 2.2, PET_COLORS.cream, 'rx="0.8"')}
    ${rect(15.5, 12, 3.5, 1.4, PET_COLORS.ink, 'rx="0.4"')}
    ${rect(16.5, 9.5, 1, 1.4, PET_COLORS.spark, 'class="pet-spark pet-spark-1"')}
    ${rect(18, 8.5, 1, 1.4, PET_COLORS.spark, 'class="pet-spark pet-spark-2"')}
    ${rect(19.4, 10, 1, 1.4, PET_COLORS.spark, 'class="pet-spark pet-spark-3"')}
  `,
  waiting: () => `
    ${baseBody(PET_COLORS.body, PET_COLORS.shadow)}
    ${eyesOpen()}
    ${rect(15, 4, 2, 6, PET_COLORS.body, 'rx="1"')}
    ${rect(15.4, 2, 1.4, 1.4, PET_COLORS.waitAmber, 'rx="0.7" class="pet-ask"')}
  `,
  done: () => `
    ${baseBody(PET_COLORS.body, PET_COLORS.shadow)}
    ${eyesWink()}
    ${rect(6.5, 3.6, 9, 4.4, PET_COLORS.wizardNavy, 'rx="1"')}
    ${rect(6.5, 6.6, 9, 1.4, PET_COLORS.cream)}
    ${rect(10.5, 1.6, 2, 2.4, PET_COLORS.wizardNavyShadow, 'rx="0.6"')}
    ${rect(3.5, 13, 3.5, 1, PET_COLORS.ink, 'rx="0.3"')}
    ${rect(1.5, 6, 1.4, 1.4, PET_COLORS.spark, 'rx="0.7" class="pet-twinkle pet-twinkle-1"')}
    ${rect(0.5, 9, 1.2, 1.2, PET_COLORS.spark, 'rx="0.6" class="pet-twinkle pet-twinkle-2"')}
    ${rect(2, 11, 1, 1, PET_COLORS.spark, 'rx="0.5" class="pet-twinkle pet-twinkle-3"')}
  `,
  stopped: () => `
    ${baseBody(PET_COLORS.muted, PET_COLORS.shadow)}
    ${eyesShut()}
  `,
  failed: () => `
    ${baseBody(PET_COLORS.failed, PET_COLORS.shadow)}
    ${eyesSquint()}
  `,
};

const PET_STATES = Object.keys(POSE_BUILDERS);

function renderPetSVG(state, widthPx = 48) {
  const build = POSE_BUILDERS[state] || POSE_BUILDERS.idle;
  return `<svg viewBox="0 0 22 20" width="${widthPx}" height="${Math.round((widthPx * 20) / 22)}" shape-rendering="crispEdges" class="pet-svg pet-state-${state}">${build()}</svg>`;
}
