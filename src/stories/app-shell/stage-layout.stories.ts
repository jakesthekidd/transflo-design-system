import { Meta, StoryObj } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { SideNavComponent } from './side-nav.stories';

// ─── Stage Layout Component ───────────────────────────────────────────────────
@Component({
  selector: 'app-stage-layout',
  standalone: true,
  imports: [CommonModule, TooltipModule, SideNavComponent],
  template: `
    <div class="stage-shell">

      <!-- Z0: White bg, Side Nav lives here -->
      <app-side-nav [activeItem]="activeNavItem" />

      <!-- Z0 right side: 24px padding creates breathing room around Z1 -->
      <div class="stage-main">

        <!-- Z1: Single panel — blue header on top, off-white body below -->
        <div class="stage-panel">

          <!-- Z1 top: Blue Header -->
          <div class="stage-header">
            <div class="stage-header__title-row">
              <div class="stage-header__title-group">
                <i [class]="pageIcon + ' stage-header__page-icon'"></i>
                <span class="stage-header__title">{{ pageTitle }}</span>
              </div>
              <div class="stage-header__actions">
                <button class="stage-header__action-btn" pTooltip="Notifications" tooltipPosition="bottom">
                  <i class="pi pi-bell"></i>
                </button>
                <button class="stage-header__action-btn" pTooltip="Help" tooltipPosition="bottom">
                  <i class="pi pi-question-circle"></i>
                </button>
                <button class="stage-header__action-btn" pTooltip="Close" tooltipPosition="bottom">
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
            <div class="stage-header__divider"></div>

            <!-- Breadcrumbs variant -->
            <div *ngIf="navType === 'breadcrumbs'" class="stage-header__breadcrumb-row">
              <nav class="stage-breadcrumb">
                <span
                  *ngFor="let crumb of breadcrumbs; let last = last"
                  class="stage-breadcrumb__item"
                  [class.stage-breadcrumb__item--active]="last"
                >
                  <span class="stage-breadcrumb__label">{{ crumb }}</span>
                  <i *ngIf="!last" class="pi pi-chevron-right stage-breadcrumb__sep"></i>
                </span>
              </nav>
            </div>

            <!-- Tabs variant -->
            <div *ngIf="navType === 'tabs'" class="stage-header__tabs-row">
              <nav class="stage-tabs">
                <button
                  *ngFor="let tab of tabs"
                  class="stage-tabs__tab"
                  [class.stage-tabs__tab--active]="tab.id === activeTab"
                  (click)="activeTab = tab.id"
                  type="button"
                >
                  {{ tab.label }}
                </button>
              </nav>
            </div>
          </div>

          <!-- Z1 bottom: Off-white body -->
          <div class="stage-body" [class.stage-body--tabs]="navType === 'tabs'">

            <!-- Z3: White content card — overlaps up into the blue header -->
            <div class="stage-content" [class.stage-content--tabs]="navType === 'tabs'">
              <div class="stage-content__placeholder" *ngIf="showPlaceholder">
                <i class="pi pi-inbox stage-content__placeholder-icon"></i>
                <p>Page content renders here</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }

    /* Z0 — white shell, side nav sits flush left */
    .stage-shell {
      display: flex;
      width: 100%;
      height: 100vh;
      background: #ffffff;
      overflow: hidden;
    }

    /* Z0 right — 24px padding on all sides creates gap around Z1 panel */
    .stage-main {
      flex: 1;
      padding: 24px;
      display: flex;
      min-width: 0;
    }

    /* Z1 — single rounded panel: blue header flows into off-white body */
    .stage-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      overflow: hidden;
      min-height: 0;
    }

    /* Z1 top — blue header */
    .stage-header {
      background: #2474BB;
      flex-shrink: 0;
    }

    .stage-header__title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 68px;
      box-sizing: border-box;
    }

    .stage-header__title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stage-header__page-icon {
      color: #ffffff;
      font-size: 20px;
    }

    .stage-header__title {
      color: #ffffff;
      font-size: 18px;
      font-weight: 600;
      font-family: sans-serif;
    }

    .stage-header__actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stage-header__action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: rgba(255,255,255,0.8);
      cursor: pointer;
      font-size: 16px;
      transition: background 0.15s, color 0.15s;
    }

    .stage-header__action-btn:hover {
      background: rgba(255,255,255,0.15);
      color: #ffffff;
    }

    .stage-header__divider {
      height: 1px;
      background: rgba(255,255,255,0.25);
      margin: 0 24px;
    }

    .stage-header__breadcrumb-row {
      padding: 14px 24px 22px 24px;
      display: flex;
      align-items: center;
    }

    .stage-breadcrumb {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stage-breadcrumb__item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: sans-serif;
      font-size: 13px;
    }

    .stage-breadcrumb__label {
      color: rgba(255,255,255,0.7);
    }

    .stage-breadcrumb__item--active .stage-breadcrumb__label {
      color: #ffffff;
      font-weight: 600;
    }

    .stage-breadcrumb__sep {
      color: rgba(255,255,255,0.4);
      font-size: 10px;
    }

    /* Tabs variant — underline style */
    .stage-header__tabs-row {
      padding: 14px 24px 18px 24px;
      display: flex;
      align-items: center;
    }

    .stage-tabs {
      display: flex;
      align-items: center;
      gap: 28px;
    }

    .stage-tabs__tab {
      position: relative;
      padding: 4px 0;
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.65);
      font-family: sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.15s;
    }

    .stage-tabs__tab:hover {
      color: rgba(255,255,255,0.9);
    }

    .stage-tabs__tab--active,
    .stage-tabs__tab--active:hover {
      color: #ffffff;
      font-weight: 700;
    }

    .stage-tabs__tab--active::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -4px;
      height: 2px;
      background: #ffffff;
      border-radius: 1px;
    }

    /* Z1 bottom — off-white body, Z3 card sits on top of this */
    .stage-body {
      flex: 1;
      background: #F3F5F7;
      padding: 0 24px 24px 24px;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    /* Z3 — white content card, slight overlap into the bottom edge of blue header */
    .stage-content {
      flex: 1;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      overflow: auto;
      min-height: 0;
      margin-top: -10px;
      position: relative;
      z-index: 1;
    }

    /* Tabs variant — same overlap behavior as breadcrumbs, card stays as a full rounded panel */
    .stage-content--tabs {
      margin-top: -10px;
      border-radius: 8px;
    }

    .stage-body--tabs {
      padding-top: 0;
    }

    .stage-content__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 400px;
      gap: 12px;
      color: #9CA3AF;
      font-family: sans-serif;
    }

    .stage-content__placeholder-icon {
      font-size: 48px;
      color: #D1D5DB;
    }
  `],
})
export class StageLayoutComponent {
  @Input() pageTitle = 'Untitled Workflow';
  @Input() pageIcon  = 'pi pi-share-alt';
  @Input() breadcrumbs: string[] = ['Workflow Generator', 'Workflow Builder'];
  @Input() activeNavItem = 'workflows';
  @Input() showPlaceholder = true;
  @Input() navType: 'breadcrumbs' | 'tabs' = 'breadcrumbs';
  @Input() tabs: { id: string; label: string }[] = [
    { id: 'overview',  label: 'Overview'  },
    { id: 'details',   label: 'Details'   },
    { id: 'history',   label: 'History'   },
    { id: 'settings',  label: 'Settings'  },
  ];
  @Input() activeTab = 'overview';
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
const meta: Meta<StageLayoutComponent> = {
  title: 'App Shell/Stage Layout',
  component: StageLayoutComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    pageTitle:     { control: 'text' },
    pageIcon:      { control: 'text' },
    breadcrumbs:   { control: 'object' },
    activeNavItem: { control: 'select', options: ['loads', 'workflows', 'reports', 'documents'] },
    navType:       { control: 'inline-radio', options: ['breadcrumbs', 'tabs'] },
    activeTab:     { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<StageLayoutComponent>;

export const Default: Story = {
  args: {
    pageTitle:     'Untitled Workflow',
    pageIcon:      'pi pi-share-alt',
    breadcrumbs:   ['Workflow Generator', 'Workflow Builder'],
    activeNavItem: 'workflows',
    showPlaceholder: true,
    navType:       'breadcrumbs',
  },
};

export const WithTabs: Story = {
  args: {
    pageTitle:     'Shipment #4821',
    pageIcon:      'pi pi-truck',
    activeNavItem: 'loads',
    showPlaceholder: true,
    navType:       'tabs',
    activeTab:     'overview',
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'stops',    label: 'Stops'    },
      { id: 'documents',label: 'Documents'},
      { id: 'billing',  label: 'Billing'  },
      { id: 'history',  label: 'History'  },
    ],
  },
};

export const LoadsPage: Story = {
  args: {
    pageTitle:     'Loads',
    pageIcon:      'pi pi-truck',
    breadcrumbs:   ['Loads', 'Active Loads'],
    activeNavItem: 'loads',
    showPlaceholder: true,
    navType:       'breadcrumbs',
  },
};

export const ReportsPage: Story = {
  args: {
    pageTitle:     'Reports',
    pageIcon:      'pi pi-chart-bar',
    breadcrumbs:   ['Reports', 'Performance'],
    activeNavItem: 'reports',
    showPlaceholder: true,
    navType:       'breadcrumbs',
  },
};

export const DeepBreadcrumb: Story = {
  args: {
    pageTitle:     'Edit Shipment',
    pageIcon:      'pi pi-file-edit',
    breadcrumbs:   ['Loads', 'Active Loads', 'Shipment #4821', 'Edit'],
    activeNavItem: 'loads',
    showPlaceholder: true,
    navType:       'breadcrumbs',
  },
};

export const WorkflowWithTabs: Story = {
  args: {
    pageTitle:     'Untitled Workflow',
    pageIcon:      'pi pi-share-alt',
    activeNavItem: 'workflows',
    showPlaceholder: true,
    navType:       'tabs',
    activeTab:     'details',
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'details',  label: 'Details'  },
      { id: 'logs',     label: 'Logs'     },
      { id: 'settings', label: 'Settings' },
    ],
  },
};
