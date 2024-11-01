import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { AppDocModule } from '@layout/doc/app.doc.module';
import { AppCodeModule } from '@layout/doc/app.code.component';
import { AccessibilityDoc } from './accessibilitydoc';
import { BasicDoc } from './basicdoc';
import { DisabledDoc } from './disableddoc';
import { ImportDoc } from './importdoc';
import { InvalidDoc } from './invaliddoc';
import { MultipleDoc } from './multipledoc';
import { ReactiveFormsDoc } from './reactiveformsdoc';
import { TemplateDoc } from './templatedoc';
import { SizesDoc } from './sizesdoc';

@NgModule({
    imports: [CommonModule, AppCodeModule, AppDocModule, SelectButton, FormsModule, ReactiveFormsModule],
    exports: [AppDocModule],
    declarations: [ImportDoc, BasicDoc, MultipleDoc, TemplateDoc, InvalidDoc, SizesDoc, DisabledDoc, AccessibilityDoc, ReactiveFormsDoc],
})
export class SelectButtonDocModule {}
