import { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/* ────────────────────────────────────────────────────────────────────────────
 * Colour tokens — sourced from the Transflo Figma Tokens file.
 * Each family ramps from 50 (lightest) to 900 (darkest).
 * Surface includes a 0 (pure white) for raised surfaces over content.
 * ────────────────────────────────────────────────────────────────────────── */

interface Swatch { shade: number; hex: string; }

const COLOR_TOKENS: Record<string, Swatch[]> = {
  blue: [
    { shade: 50, hex: '#E9F1F8' }, { shade: 100, hex: '#D3E3F1' },
    { shade: 200, hex: '#A7C7E4' }, { shade: 300, hex: '#7CACD6' },
    { shade: 400, hex: '#5090C9' }, { shade: 500, hex: '#2474BB' },
    { shade: 600, hex: '#2068A8' }, { shade: 700, hex: '#1D5D96' },
    { shade: 800, hex: '#164670' }, { shade: 900, hex: '#0E2E4B' },
  ],
  cyan: [
    { shade: 50, hex: '#F1FAFE' }, { shade: 100, hex: '#E3F5FD' },
    { shade: 200, hex: '#C7EBFB' }, { shade: 300, hex: '#AAE1F8' },
    { shade: 400, hex: '#8ED7F6' }, { shade: 500, hex: '#72CDF4' },
    { shade: 600, hex: '#67B8DC' }, { shade: 700, hex: '#5BA4C3' },
    { shade: 800, hex: '#447B92' }, { shade: 900, hex: '#2E5262' },
  ],
  teal: [
    { shade: 50, hex: '#F3FBFB' }, { shade: 100, hex: '#C7EEEA' },
    { shade: 200, hex: '#9AE0D9' }, { shade: 300, hex: '#6DD3C8' },
    { shade: 400, hex: '#41C5B7' }, { shade: 500, hex: '#14B8A6' },
    { shade: 600, hex: '#119C8D' }, { shade: 700, hex: '#0E8174' },
    { shade: 800, hex: '#0B655B' }, { shade: 900, hex: '#084A42' },
  ],
  green: [
    { shade: 50, hex: '#E5F9EA' }, { shade: 100, hex: '#CCF2D6' },
    { shade: 200, hex: '#99E5AC' }, { shade: 300, hex: '#66D983' },
    { shade: 400, hex: '#33CC59' }, { shade: 500, hex: '#00BF30' },
    { shade: 600, hex: '#00AC2B' }, { shade: 700, hex: '#009926' },
    { shade: 800, hex: '#00731D' }, { shade: 900, hex: '#004C13' },
  ],
  yellow: [
    { shade: 50, hex: '#FEFDE8' }, { shade: 100, hex: '#FEFAD2' },
    { shade: 200, hex: '#FCF5A4' }, { shade: 300, hex: '#FBF177' },
    { shade: 400, hex: '#F9EC49' }, { shade: 500, hex: '#F8E71C' },
    { shade: 600, hex: '#DFD019' }, { shade: 700, hex: '#C6B916' },
    { shade: 800, hex: '#958B11' }, { shade: 900, hex: '#635C0B' },
  ],
  orange: [
    { shade: 50, hex: '#FFF6E5' }, { shade: 100, hex: '#FFEDCC' },
    { shade: 200, hex: '#FFDA99' }, { shade: 300, hex: '#FFC866' },
    { shade: 400, hex: '#FFB533' }, { shade: 500, hex: '#FFA300' },
    { shade: 600, hex: '#E59300' }, { shade: 700, hex: '#CC8200' },
    { shade: 800, hex: '#996200' }, { shade: 900, hex: '#664100' },
  ],
  red: [
    { shade: 50, hex: '#FBE9EA' }, { shade: 100, hex: '#F8D2D5' },
    { shade: 200, hex: '#F0A5AB' }, { shade: 300, hex: '#E97980' },
    { shade: 400, hex: '#E14C56' }, { shade: 500, hex: '#DA1F2C' },
    { shade: 600, hex: '#C41C28' }, { shade: 700, hex: '#AE1923' },
    { shade: 800, hex: '#83131A' }, { shade: 900, hex: '#570C12' },
  ],
  pink: [
    { shade: 50, hex: '#FEF6FA' }, { shade: 100, hex: '#FAD3E7' },
    { shade: 200, hex: '#F7B0D3' }, { shade: 300, hex: '#F38EC0' },
    { shade: 400, hex: '#F06BAC' }, { shade: 500, hex: '#EC4899' },
    { shade: 600, hex: '#C93D82' }, { shade: 700, hex: '#A5326B' },
    { shade: 800, hex: '#822854' }, { shade: 900, hex: '#5E1D3D' },
  ],
  purple: [
    { shade: 50, hex: '#FBF7FF' }, { shade: 100, hex: '#EAD6FD' },
    { shade: 200, hex: '#DAB6FC' }, { shade: 300, hex: '#C996FA' },
    { shade: 400, hex: '#B975F9' }, { shade: 500, hex: '#A855F7' },
    { shade: 600, hex: '#8F48D2' }, { shade: 700, hex: '#763CAD' },
    { shade: 800, hex: '#5C2F88' }, { shade: 900, hex: '#432263' },
  ],
  indigo: [
    { shade: 50, hex: '#F7F7FE' }, { shade: 100, hex: '#DADAFC' },
    { shade: 200, hex: '#BCBDF9' }, { shade: 300, hex: '#9EA0F6' },
    { shade: 400, hex: '#8183F4' }, { shade: 500, hex: '#6366F1' },
    { shade: 600, hex: '#5457CD' }, { shade: 700, hex: '#4547A9' },
    { shade: 800, hex: '#363885' }, { shade: 900, hex: '#282960' },
  ],
  bluegray: [
    { shade: 50, hex: '#F7F8F9' }, { shade: 100, hex: '#DADEE3' },
    { shade: 200, hex: '#BCC3CD' }, { shade: 300, hex: '#9FA9B7' },
    { shade: 400, hex: '#818EA1' }, { shade: 500, hex: '#64748B' },
    { shade: 600, hex: '#556376' }, { shade: 700, hex: '#465161' },
    { shade: 800, hex: '#37404C' }, { shade: 900, hex: '#282E38' },
  ],
  surface: [
    { shade: 0,   hex: '#FFFFFF' }, { shade: 50,  hex: '#FBFCFC' },
    { shade: 100, hex: '#F7F8F9' }, { shade: 200, hex: '#F3F5F7' },
    { shade: 300, hex: '#EFF2F4' }, { shade: 400, hex: '#E2E6EB' },
    { shade: 500, hex: '#C6CCD6' }, { shade: 600, hex: '#A9B3C2' },
    { shade: 700, hex: '#8D9AAE' }, { shade: 800, hex: '#717B8B' },
    { shade: 900, hex: '#5A626F' },
  ],
  black: [
    { shade: 50,  hex: '#FAFAFA' }, { shade: 100, hex: '#F5F5F5' },
    { shade: 200, hex: '#E5E5E5' }, { shade: 300, hex: '#D4D4D4' },
    { shade: 400, hex: '#A3A3A3' }, { shade: 500, hex: '#737373' },
    { shade: 600, hex: '#525252' }, { shade: 700, hex: '#404040' },
    { shade: 800, hex: '#262626' }, { shade: 900, hex: '#000000' },
  ],
};

const FAMILY_ORDER = [
  'blue', 'cyan', 'teal', 'green', 'yellow', 'orange', 'red',
  'pink', 'purple', 'indigo', 'bluegray', 'surface', 'black',
];

// ─── Semantic text tokens — purpose-named, not shade-named ────────────────────
interface TextToken {
  name: string;
  variable: string;
  hex: string;
  description: string;
  example: string;
}

const TEXT_TOKENS: TextToken[] = [
  { name: 'Heading', variable: '--t-heading', hex: '#111827',           description: 'Page titles, section headings.',                  example: 'Headings & display copy' },
  { name: 'Body',    variable: '--t-body',    hex: '#374151',           description: 'Long-form text, paragraphs, default copy.',       example: 'Long-form body paragraphs that read comfortably.' },
  { name: 'Main',    variable: '--t-main',    hex: '#3D3D3D',           description: 'Main / default emphasis text.',                   example: 'Emphasis text and default labels.' },
  { name: 'Muted',   variable: '--t-muted',   hex: '#6B7280',           description: 'Captions, helper text, input placeholders.',      example: 'Captions, helper text, and placeholders.' },
  { name: 'Mid',     variable: '--t-mid',     hex: 'rgba(0,0,0,0.50)',  description: '50 % black — secondary text on light surfaces.',  example: 'Secondary text on light backgrounds.' },
  { name: 'Light',   variable: '--t-light',   hex: 'rgba(0,0,0,0.30)',  description: '30 % black — disabled / tertiary text.',          example: 'Disabled state or tertiary metadata.' },
  { name: 'Dark',    variable: '--t-dark',    hex: '#000000',           description: 'Pure black for high-emphasis.',                   example: 'High-emphasis copy.' },
  { name: 'Black',   variable: '--t-black',   hex: '#000000',           description: 'Pure black — explicit hard-coded usage.',         example: 'Strict black where needed.' },
  { name: 'White',   variable: '--t-white',   hex: '#FFFFFF',           description: 'White text for dark backgrounds.',                example: 'Reverse text on dark backgrounds.' },
];

/** Pick black or white text for the best contrast on a given hex background. */
function readableTextColor(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 145 ? '#111827' : '#FFFFFF';
}

// ─── Component ────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-color-tokens',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ct">

      <header class="ct__header">
        <h2>Colour tokens</h2>
        <p>
          The full Transflo colour palette as exported from the Figma Tokens file.
          Each family ramps from 50 (lightest) to 900 (darkest). Click any swatch to copy its hex value.
        </p>
      </header>

      <!-- ── Text tokens ── -->
      <section class="ct__text-section">
        <h3 class="ct__section-title">Text</h3>
        <p class="ct__section-desc">
          Semantic text colours — use these directly in components instead of reaching for a raw grey shade.
        </p>

        <div class="ct__text-grid">
          <button
            *ngFor="let t of textTokens"
            class="ct__text-card"
            (click)="copy(t.variable)"
            [attr.aria-label]="t.name + ', ' + t.variable"
            type="button"
          >
            <div class="ct__text-sample" [style.color]="t.hex">{{ t.example }}</div>
            <div class="ct__text-meta">
              <div class="ct__text-name">{{ t.name }}</div>
              <code class="ct__text-var">{{ t.variable }}</code>
              <code class="ct__text-hex">{{ t.hex }}</code>
              <div class="ct__text-desc">{{ t.description }}</div>
            </div>
          </button>
        </div>
      </section>

      <h3 class="ct__section-title">Palette</h3>

      <div *ngFor="let family of families" class="ct__family">

        <div class="ct__family-head">
          <div class="ct__family-name">{{ family }}</div>
          <code class="ct__family-token">color.{{ family }}.&lt;shade&gt;</code>
        </div>

        <div class="ct__ramp">
          <button
            *ngFor="let swatch of tokens[family]"
            class="ct__swatch"
            [style.background]="swatch.hex"
            [style.color]="readable(swatch.hex)"
            (click)="copy(swatch.hex)"
            [attr.aria-label]="family + ' ' + swatch.shade + ', ' + swatch.hex"
            type="button"
          >
            <span class="ct__shade">{{ swatch.shade }}</span>
            <span class="ct__hex">{{ swatch.hex }}</span>
          </button>
        </div>

      </div>

      <div *ngIf="copied" class="ct__toast">Copied {{ copied }}</div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .ct {
      font-family: sans-serif;
      max-width: 1100px;
      padding: 24px;
    }
    .ct__header h2 {
      margin: 0 0 6px 0;
      font-size: 22px;
      color: #111827;
    }
    .ct__header p {
      margin: 0 0 24px 0;
      font-size: 13px;
      color: #6B7280;
      line-height: 1.5;
    }

    /* ── Text section ── */
    .ct__section-title {
      margin: 24px 0 4px 0;
      font-size: 16px;
      color: #111827;
    }
    .ct__section-desc {
      margin: 0 0 14px 0;
      font-size: 12px;
      color: #6B7280;
    }
    .ct__text-section { margin-bottom: 32px; }
    .ct__text-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    @media (max-width: 880px) {
      .ct__text-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 560px) {
      .ct__text-grid { grid-template-columns: 1fr; }
    }
    .ct__text-card {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      padding: 14px 14px 12px 14px;
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: box-shadow 0.12s, transform 0.12s;
    }
    .ct__text-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }
    .ct__text-sample {
      padding: 14px 4px;
      font-size: 16px;
      font-weight: 600;
      border-bottom: 1px dashed #E5E7EB;
      margin-bottom: 10px;
    }
    .ct__text-meta { display: flex; flex-direction: column; gap: 4px; }
    .ct__text-name {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
    }
    .ct__text-var,
    .ct__text-hex {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      color: #6B7280;
    }
    .ct__text-desc {
      font-size: 11px;
      color: #6B7280;
      line-height: 1.4;
      margin-top: 2px;
    }

    .ct__family {
      margin-bottom: 24px;
    }

    .ct__family-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .ct__family-name {
      font-size: 13px;
      font-weight: 700;
      text-transform: capitalize;
      color: #111827;
    }
    .ct__family-token {
      font-size: 11px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      color: #6B7280;
    }

    .ct__ramp {
      display: grid;
      grid-template-columns: repeat(11, minmax(0, 1fr));
      gap: 4px;
    }
    @media (max-width: 880px) {
      .ct__ramp { grid-template-columns: repeat(6, minmax(0, 1fr)); }
    }

    .ct__swatch {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      min-height: 84px;
      padding: 8px 10px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 6px;
      cursor: pointer;
      transition: transform 0.12s, box-shadow 0.12s;
      font-family: inherit;
    }
    .ct__swatch:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
    }

    .ct__shade {
      font-size: 11px;
      font-weight: 700;
    }
    .ct__hex {
      font-size: 11px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      opacity: 0.85;
    }

    .ct__toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 14px;
      background: #111827;
      color: #ffffff;
      border-radius: 6px;
      font-size: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
      animation: ct-toast-in 0.18s ease-out;
    }
    @keyframes ct-toast-in {
      from { opacity: 0; transform: translate(-50%, 6px); }
      to   { opacity: 1; transform: translate(-50%, 0); }
    }
  `],
})
export class ColorTokensComponent {
  tokens = COLOR_TOKENS;
  families = FAMILY_ORDER;
  textTokens = TEXT_TOKENS;
  copied: string | null = null;

  readable(hex: string) { return readableTextColor(hex); }

  copy(hex: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex).catch(() => {});
    }
    this.copied = hex;
    setTimeout(() => (this.copied = null), 1400);
  }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<ColorTokensComponent> = {
  title: 'Foundations/Colors',
  component: ColorTokensComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Transflo design system colour ramps, sourced directly from the Figma Tokens export. Click any swatch to copy its hex.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ColorTokensComponent>;

export const All: Story = {
  parameters: { docs: { description: { story: 'Every colour family at every shade.' } } },
};
