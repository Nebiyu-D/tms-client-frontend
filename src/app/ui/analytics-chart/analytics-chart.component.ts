import { Component, computed, input } from '@angular/core';
import {Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'tms-analytics-chart',
  standalone: true,
  template: `
        <div class="chart-container">
      <h3>Enrollment Analytics</h3>
      <div class="chart-bars">
        <div class="bar approved" [style.height.px]="approvedHeight()">
          <span>Approved: {{ approvedCount() }}</span>
        </div>
        <div class="bar pending" [style.height.px]="pendingHeight()">
          <span>Pending: {{ pendingCount() }}</span>
        </div>
        <div class="bar rejected" [style.height.px]="rejectedHeight()">
          <span>Rejected: {{ rejectedCount() }}</span>
        </div>
      </div>
      <p class="chart-summary">Total records: {{ data().length }}</p>
    </div>
  `,
  styleUrl: './analytics-chart.component.scss'
})
export class AnalyticsChartComponent {
  data = input.required<Enrollment[]>();

  approvedCount = computed(() =>
    this.data().filter((e) => e.status === 'Approved').length
  );

  pendingCount = computed(() =>
    this.data().filter((e) => e.status === 'Pending').length
  );

  rejectedCount = computed(() =>
    this.data().filter((e) => e.status === 'Rejected').length
  );

  approvedHeight = computed(() => {
    return Math.max(20, this.approvedCount() * 3);
  });

  pendingHeight = computed(() => {
    return Math.max(20, this.pendingCount() * 3);
  });

  rejectedHeight = computed(() => {
    return Math.max(20, this.rejectedCount() * 3);
  });
}