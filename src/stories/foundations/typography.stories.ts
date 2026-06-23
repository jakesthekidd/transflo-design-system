import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/* ────────────────────────────────────────────────────────────────────────────
 * Typography tokens — Roboto, standard SaaS scale.
 *
 * Use the CSS variables defined in styles.scss directly:
 *   font:  var(--fw-semibold) var(--fs-lg)/var(--lh-snug) var(--font-sans);
 *   color: var(--t-heading);
 *
 * Or apply one of the preset utility classes (.t-h1, .t-body, .t-caption, …)
 * which combine the tokens into ready-made typographic styles.
 * ────────────────────────────────────────────────────────────────────────── */

interface Preset {
  cls: string;
  name: string;
  usage: string;
  size: string;
  weight: string;
  lineHeight: string;
  color: string;
}

const PRESETS: Preset[] = [
  { cls: 't-display',  name: 'Display',  usage: 'Marketing hero / landing.', size: '48 px', weight: 'Bold 700',     lineHeight: '1.2',  color: '--t-heading' },
  { cls: 't-h1',       name: 'H1',       usage: 'Page title.',                size: '36 px', weight: 'Bold 700',     lineHeight: '1.2',  color: '--t-heading' },
  { cls: 't-h2',       name: 'H2',       usage: 'Top of a major section.',    size: '30 px', weight: 'Bold 700',     lineHeight: '1.2',  color: '--t-heading' },
  { cls: 't-h3',       name: 'H3',       usage: 'Sub-section, card header.',  size: '24 px', weight: 'Semibold 600', lineHeight: '1.35', color: '--t-heading' },
  { cls: 't-h4',       name: 'H4',       usage: 'Form group / column head.',  size: '20 px', weight: 'Semibold 600', lineHeight: '1.35', color: '--t-heading' },
  { cls: 't-h5',       name: 'H5',       usage: 'Dialog / panel title.',      size: '18 px', weight: 'Semibold 600', lineHeight: '1.35', color: '--t-heading' },
  { cls: 't-h6',       name: 'H6',       usage: 'Small section title.',       size: '16 px', weight: 'Semibold 600', lineHeight: '1.35', color: '--t-heading' },
  { cls: 't-body-lg',  name: 'Body Lg',  usage: 'Lead paragraph, intro text.',size: '16 px', weight: 'Regular 400',  lineHeight: '1.65', color: '--t-body' },
  { cls: 't-body',     name: 'Body',     usage: 'Default body text.',         size: '14 px', weight: 'Regular 400',  lineHeight: '1.5',  color: '--t-body' },
  { cls: 't-body-sm',  name: 'Body Sm',  usage: 'Dense tables, sidebars.',    size: '13 px', weight: 'Regular 400',  lineHeight: '1.5',  color: '--t-body' },
  { cls: 't-label',    name: 'Label',    usage: 'Form labels, field titles.', size: '13 px', weight: 'Medium 500',   lineHeight: '1.35', color: '--t-main' },
  { cls: 't-caption',  name: 'Caption',  usage: 'Helper text, hints.',        size: '12 px', weight: 'Regular 400',  lineHeight: '1.35', color: '--t-muted' },
  { cls: 't-overline', name: 'Overline', usage: 'Section labels above title.',size: '12 px', weight: 'Semibold 600', lineHeight: '1.35', color: '--t-muted' },
  { cls: 't-code',     name: 'Code',     usage: 'Inline code, tokens, paths.',size: '13 px', weight: 'Regular 400',  lineHeight: '1.35', color: '--t-body' },
];

const SAMPLE: Record<string, string> = {
  't-display':  'Ship faster with Transflo',
  't-h1':       'Loads dashboard',
  't-h2':       'Recent activity',
  't-h3':       'Pre-trip inspection',
  't-h4':       'Customer details',
  't-h5':       'Edit shipment',
  't-h6':       'Documents',
  't-body-lg':  'The full Transflo design system, built on top of PrimeNG and Angular 21.',
  't-body':     'Add a section to summarise what changed in this load and why the driver was paged.',
  't-body-sm':  'BOL #4821 was delivered 12 minutes ahead of schedule by Driver Cummings.',
  't-label':    'Driver Name',
  't-caption':  'Optional. We will only show this when the inspection report is generated.',
  't-overline': 'Recent updates',
  't-code':     '{{workflow.start-load.pre-trip.temperature}}',
};

@Component({
  selector: 'app-typography-tokens',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tg">
      <header class="tg__header">
        <h2 class="t-h2">Typography</h2>
        <p class="t-body">
          Transflo standardises on <strong>Roboto</strong> (with <strong>Roboto&nbsp;Mono</strong> for code).
          Use the CSS variables (<code class="t-code">--fs-*</code>, <code class="t-code">--fw-*</code>,
          <code class="t-code">--lh-*</code>, <code class="t-code">--font-sans</code>) for fine control, or
          one of the preset classes below for instant typography.
        </p>
      </header>

      <!-- Font family chips -->
      <section class="tg__section">
        <h3 class="t-overline">Font families</h3>
        <div class="tg__family-grid">
          <div class="tg__family-card">
            <div class="tg__family-sample" style="font-family: var(--font-sans);">Roboto · Aa Bb 0123</div>
            <div class="tg__family-meta">
              <strong>--font-sans</strong>
              <span>Primary UI typeface</span>
            </div>
          </div>
          <div class="tg__family-card">
            <div class="tg__family-sample" style="font-family: var(--font-mono);">Roboto Mono · Aa Bb 0123</div>
            <div class="tg__family-meta">
              <strong>--font-mono</strong>
              <span>Code, tokens, file paths</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Weight chips -->
      <section class="tg__section">
        <h3 class="t-overline">Weights</h3>
        <div class="tg__weight-grid">
          <div class="tg__weight" style="font-weight: var(--fw-light);">    Light 300    <code>--fw-light</code></div>
          <div class="tg__weight" style="font-weight: var(--fw-regular);">  Regular 400  <code>--fw-regular</code></div>
          <div class="tg__weight" style="font-weight: var(--fw-medium);">   Medium 500   <code>--fw-medium</code></div>
          <div class="tg__weight" style="font-weight: var(--fw-semibold);"> Semibold 600 <code>--fw-semibold</code></div>
          <div class="tg__weight" style="font-weight: var(--fw-bold);">     Bold 700     <code>--fw-bold</code></div>
        </div>
      </section>

      <!-- Presets -->
      <section class="tg__section">
        <h3 class="t-overline">Presets</h3>
        <p class="t-caption" style="margin-top: 4px;">
          Each row uses a single utility class that bundles size + weight + line-height + colour.
        </p>

        <div class="tg__preset-list">
          <div *ngFor="let p of presets" class="tg__preset">
            <div class="tg__preset-sample" [ngClass]="p.cls">
              {{ samples[p.cls] }}
            </div>
            <div class="tg__preset-meta">
              <div class="tg__preset-name">{{ p.name }}</div>
              <code class="tg__preset-cls">.{{ p.cls }}</code>
              <div class="tg__preset-specs">
                {{ p.size }} · {{ p.weight }} · LH {{ p.lineHeight }} · <code>{{ p.color }}</code>
              </div>
              <div class="tg__preset-usage">{{ p.usage }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .tg {
      max-width: 1100px;
      padding: 24px;
      font-family: var(--font-sans);
    }
    .tg__header { margin-bottom: 28px; }
    .tg__header p { margin: 8px 0 0 0; max-width: 720px; }

    .tg__section { margin-bottom: 32px; }

    /* Family */
    .tg__family-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 10px;
    }
    @media (max-width: 720px) { .tg__family-grid { grid-template-columns: 1fr; } }
    .tg__family-card {
      padding: 16px 18px;
      background: var(--c-surface-0);
      border: 1px solid var(--c-surface-400);
      border-radius: 8px;
    }
    .tg__family-sample {
      font-size: 26px;
      color: var(--t-heading);
      margin-bottom: 8px;
    }
    .tg__family-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 12px;
      color: var(--t-muted);
    }
    .tg__family-meta strong {
      color: var(--t-body);
      font-family: var(--font-mono);
      font-size: 12px;
    }

    /* Weights */
    .tg__weight-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin-top: 10px;
    }
    @media (max-width: 880px) { .tg__weight-grid { grid-template-columns: repeat(2, 1fr); } }
    .tg__weight {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 14px 16px;
      background: var(--c-surface-0);
      border: 1px solid var(--c-surface-400);
      border-radius: 8px;
      font-size: 16px;
      color: var(--t-heading);
    }
    .tg__weight code {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--t-muted);
      font-weight: var(--fw-regular);
    }

    /* Presets */
    .tg__preset-list {
      display: flex;
      flex-direction: column;
      margin-top: 12px;
      border: 1px solid var(--c-surface-400);
      border-radius: 8px;
      overflow: hidden;
      background: var(--c-surface-0);
    }
    .tg__preset {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 280px;
      gap: 24px;
      padding: 18px 20px;
      border-bottom: 1px solid var(--c-surface-300);
    }
    .tg__preset:last-child { border-bottom: 0; }
    @media (max-width: 880px) {
      .tg__preset { grid-template-columns: 1fr; gap: 8px; }
    }

    .tg__preset-sample {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .tg__preset-meta {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .tg__preset-name {
      font: var(--fw-semibold) 13px/1.35 var(--font-sans);
      color: var(--t-heading);
    }
    .tg__preset-cls {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--t-body);
    }
    .tg__preset-specs {
      font: var(--fw-regular) 11px/1.4 var(--font-sans);
      color: var(--t-muted);
    }
    .tg__preset-specs code {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--t-muted);
    }
    .tg__preset-usage {
      font: var(--fw-regular) 11px/1.4 var(--font-sans);
      color: var(--t-muted);
      margin-top: 2px;
    }
  `],
})
export class TypographyTokensComponent {
  presets = PRESETS;
  samples = SAMPLE;
}

const meta: Meta<TypographyTokensComponent> = {
  title: 'Foundations/Typography',
  component: TypographyTokensComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Roboto-based type scale with standard SaaS sizing and semantic text colours. Use the preset utility classes (`.t-h1`, `.t-body`, `.t-caption`, …) or compose with the underlying tokens (`--fs-*`, `--fw-*`, `--lh-*`).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<TypographyTokensComponent>;

export const All: Story = {};
