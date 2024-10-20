import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { Dock } from 'primeng/dock';
import { GalleriaModule } from 'primeng/galleria';
import { MenubarModule } from 'primeng/menubar';
import { RadioButton } from 'primeng/radiobutton';
import { Terminal } from 'primeng/terminal';
import { ToastModule } from 'primeng/toast';
import { Tree } from 'primeng/tree';
import { AppDocModule } from '@layout/doc/app.doc.module';
import { AppCodeModule } from '@layout/doc/app.code.component';
import { AccessibilityDoc } from './accessibilitydoc';
import { AdvancedDoc } from './advanceddoc';
import { BasicDoc } from './basicdoc';
import { ImportDoc } from './importdoc';
import { StyleDoc } from './styledoc';
import { Tooltip } from 'primeng/tooltip';

@NgModule({
    imports: [
        CommonModule,
        AppCodeModule,
        RouterModule,
        Dock,
        FormsModule,
        RadioButton,
        MenubarModule,
        ToastModule,
        Dialog,
        GalleriaModule,
        Terminal,
        Tree,
        AppDocModule,
        Tooltip,
    ],
    declarations: [AdvancedDoc, BasicDoc, ImportDoc, StyleDoc, AccessibilityDoc],
    exports: [AppDocModule],
})
export class DockDocModule {}
