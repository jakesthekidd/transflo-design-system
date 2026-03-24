import type { Meta, StoryObj } from '@storybook/angular';
import { TimelineModule } from 'primeng/timeline';

const meta: Meta = {
  title: 'PrimeNG/Data Display/Timeline',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

const events = [
  { status: 'Ordered', date: 'Jan 5, 2025', icon: 'pi pi-shopping-cart', color: '#2474BB' },
  { status: 'Processing', date: 'Jan 6, 2025', icon: 'pi pi-cog', color: '#FFA300' },
  { status: 'Shipped', date: 'Jan 8, 2025', icon: 'pi pi-truck', color: '#72CDF4' },
  { status: 'Delivered', date: 'Jan 10, 2025', icon: 'pi pi-check', color: '#00BF30' },
];

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [TimelineModule] },
    props: { events },
    template: `
      <div style="max-width:400px">
        <p-timeline [value]="events">
          <ng-template #content let-event>
            <div>
              <strong>{{ event.status }}</strong>
              <p style="color:#6c757d; font-size:0.875rem; margin:0.25rem 0 0">{{ event.date }}</p>
            </div>
          </ng-template>
          <ng-template #marker let-event>
            <span class="p-timeline-event-marker" [style.background]="event.color">
              <i [class]="event.icon" style="color:#fff; font-size:0.75rem"></i>
            </span>
          </ng-template>
        </p-timeline>
      </div>
    `,
  }),
};

export const Horizontal: Story = {
  render: () => ({
    moduleMetadata: { imports: [TimelineModule] },
    props: { events },
    template: `
      <div style="width:600px">
        <p-timeline [value]="events" layout="horizontal" align="top">
          <ng-template #content let-event>
            <div style="text-align:center; font-size:0.8rem">
              <div><strong>{{ event.status }}</strong></div>
              <div style="color:#6c757d">{{ event.date }}</div>
            </div>
          </ng-template>
          <ng-template #marker let-event>
            <span class="p-timeline-event-marker" [style.background]="event.color">
              <i [class]="event.icon" style="color:#fff; font-size:0.75rem"></i>
            </span>
          </ng-template>
        </p-timeline>
      </div>
    `,
  }),
};
