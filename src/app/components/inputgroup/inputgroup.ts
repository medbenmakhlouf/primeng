import { CommonModule } from '@angular/common';
import { Component, inject, Input, NgModule } from '@angular/core';
import { InputGroupStyle } from './style/inputgroupstyle';
import { BaseComponent } from 'primeng/basecomponent';

/**
 * InputGroup displays text, icon, buttons and other content can be grouped next to an input.
 * @group Components
 */
@Component({
    selector: 'p-inputgroup, p-inputGroup',
    standalone: true,
    imports: [CommonModule],
    template: ` <ng-content></ng-content> `,
    providers: [InputGroupStyle],
    host: {
        class: 'p-inputgroup',
        '[attr.data-pc-name]': 'inputgroup',
        '[class]': 'styleClass',
        '[style]': 'style',
    },
})
export class InputGroup extends BaseComponent {
    /**
     * Inline style of the element.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Class of the element.
     * @group Props
     */
    @Input() styleClass: string | undefined;

    _componentStyle = inject(InputGroupStyle);
}

@NgModule({
    imports: [InputGroup],
    exports: [InputGroup],
})
export class InputGroupModule {}
