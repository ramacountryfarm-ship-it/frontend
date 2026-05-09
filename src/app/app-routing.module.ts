import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'locations',
        loadChildren: () => import('./modules/locations/locations.module').then(m => m.LocationsModule)
      },
      {
        path: 'bird-breeds',
        loadChildren: () => import('./modules/bird-breeds/bird-breeds.module').then(m => m.BirdBreedsModule)
      },
      {
        path: 'batches',
        loadChildren: () => import('./modules/batches/batches.module').then(m => m.BatchesModule)
      },
      {
        path: 'daily-log',
        loadChildren: () => import('./modules/daily-log/daily-log.module').then(m => m.DailyLogModule)
      },
      {
        path: 'egg-management',
        loadChildren: () => import('./modules/egg-management/egg-management.module').then(m => m.EggManagementModule)
      },
      {
        path: 'investments',
        loadChildren: () => import('./modules/investments/investments.module').then(m => m.InvestmentsModule)
      },
      {
        path: 'sales',
        loadChildren: () => import('./modules/sales/sales.module').then(m => m.SalesModule)
      },
      {
        path: 'vendors',
        loadChildren: () => import('./modules/vendors/vendors.module').then(m => m.VendorsModule)
      },
      {
        path: 'vaccination',
        loadChildren: () => import('./modules/vaccination/vaccination.module').then(m => m.VaccinationModule)
      },
      {
        path: 'flock-performance',
        loadChildren: () => import('./modules/flock-performance/flock-performance.module').then(m => m.FlockPerformanceModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./modules/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'analytics',
        loadChildren: () => import('./modules/analytics/analytics.module').then(m => m.AnalyticsModule)
      },
      {
        path: 'customers',
        loadChildren: () => import('./modules/customers/customers.module').then(m => m.CustomersModule)
      },
      {
        path: 'egg-trading',
        loadChildren: () => import('./modules/egg-trading/egg-trading.module').then(m => m.EggTradingModule)
      },
      {
        path: 'feed-management',
        loadChildren: () => import('./modules/feed-management/feed-management.module').then(m => m.FeedManagementModule)
      },
      {
        path: 'medicine',
        loadChildren: () => import('./modules/medicine/medicine.module').then(m => m.MedicineModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
