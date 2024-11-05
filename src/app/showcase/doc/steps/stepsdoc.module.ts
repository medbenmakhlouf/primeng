import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMask } from 'primeng/inputmask';
import { Checkbox } from 'primeng/checkbox';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { AppDocModule } from '@layout/doc/app.doc.module';
import { AppCodeModule } from '@layout/doc/app.code.component';
import { BasicDoc } from './basicdoc';
import { ConfirmationDemo } from './confirmationdemo';
import { ImportDoc } from './importdoc';
import { InteractiveDoc } from './interactivedoc';
import { PaymentDemo } from './paymentdemo';
import { PersonalDemo } from './personaldemo';
import { RoutingDoc } from './routingdoc';
import { SeatDemo } from './seatdemo';
import { StyleDoc } from './styledoc';
import { TicketService } from '@service/ticketservice';
import { AccessibilityDoc } from './accessibilitydoc';
import { ButtonModule } from 'primeng/button';
import { ControlledDoc } from './controlleddoc';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        AppCodeModule,
        StepsModule,
        ToastModule,
        AppDocModule,
        FormsModule,
        DropdownModule,
        InputTextModule,
        InputMask,
        Checkbox,
        CardModule,
        ButtonModule,
        RouterModule,
    ],
    declarations: [
        BasicDoc,
        ImportDoc,
        StyleDoc,
        InteractiveDoc,
        ConfirmationDemo,
        PaymentDemo,
        PersonalDemo,
        SeatDemo,
        RoutingDoc,
        ControlledDoc,
        AccessibilityDoc,
    ],
    exports: [AppDocModule],
    providers: [TicketService],
})
export class StepsDocModule {}
