import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { KgFormatPipe } from './pipes/kg-format.pipe';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    MainLayoutComponent,
    ConfirmDialogComponent,
    KgFormatPipe,
    ToastComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SidebarComponent,
    HeaderComponent,
    MainLayoutComponent,
    ConfirmDialogComponent,
    KgFormatPipe,
    ToastComponent
  ]
})
export class SharedModule { }
