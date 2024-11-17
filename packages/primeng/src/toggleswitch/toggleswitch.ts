import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    contentChild,
    contentChildren,
    ElementRef,
    OutputEmitterRef,
    forwardRef,
    inject,
    input,
    model,
    signal,
    computed,
    NgModule,
    numberAttribute,
    output,
    viewChild,
    TemplateRef,
    ViewEncapsulation,
    WritableSignal
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { AutoFocus } from 'primeng/autofocus';
import { BaseComponent } from 'primeng/basecomponent';
import { ToggleSwitchStyle } from './style/toggleswitchstyle';
import { ToggleSwitchChangeEvent } from './toggleswitch.interface';

/**
 * Context interface for the handle template.
 * @property {boolean} checked - A flag indicating whether the input is checked.
 * @group Interface
 */
export interface ToggleSwitchHandleTemplateContext {
    checked: boolean;
}

export const TOGGLESWITCH_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleSwitch),
    multi: true
};
/**
 * ToggleSwitch is used to select a boolean value.
 * @group Components
 */
@Component({
    selector: 'p-toggleswitch, p-toggleSwitch, p-toggle-switch',
    standalone: true,
    imports: [NgClass, NgStyle, NgTemplateOutlet, AutoFocus, SharedModule],
    template: `
        <div [ngClass]="cx('root')" [style]="sx('root')" [ngStyle]="style()" [class]="styleClass()" (click)="onClick($event)" [attr.data-pc-name]="'toggleswitch'" [attr.data-pc-section]="'root'">
            <input
                #input
                [attr.id]="inputId()"
                type="checkbox"
                role="switch"
                [ngClass]="cx('input')"
                [checked]="checked()"
                [disabled]="disabled()"
                [attr.aria-checked]="checked()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-label]="ariaLabel()"
                [attr.name]="name()"
                [attr.tabindex]="tabindex()"
                (focus)="onFocus()"
                (blur)="onBlur()"
                [attr.data-pc-section]="'hiddenInput'"
                [pAutoFocus]="autofocus()"
            />
            <span [ngClass]="cx('slider')" [attr.data-pc-section]="'slider'">
                <div [ngClass]="cx('handle')">
                    @if (customHandleTemplate()) {
                        <ng-container *ngTemplateOutlet="customHandleTemplate(); context: { checked: checked() }" />
                    }
                </div>
            </span>
        </div>
    `,
    providers: [TOGGLESWITCH_VALUE_ACCESSOR, ToggleSwitchStyle],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ToggleSwitch extends BaseComponent {
    /**
     * Inline style of the component.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null>();
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass = input<string>();
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number, any>(undefined, { transform: numberAttribute });
    /**
     * Identifier of the input element.
     * @group Props
     */
    inputId = input<string>();
    /**
     * Name of the input element.
     * @group Props
     */
    name = input<string>();
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled = model<boolean>();
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly = input<boolean, any>(undefined, { transform: booleanAttribute });
    /**
     * Value in checked state.
     * @group Props
     */
    trueValue = input<any>(true);
    /**
     * Value in unchecked state.
     * @group Props
     */
    falseValue = input<any>(false);
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    ariaLabel = input<string>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean, any>(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke when the on value change.
     * @param {ToggleSwitchChangeEvent} event - Custom change event.
     * @group Emits
     */
    onChange: OutputEmitterRef<ToggleSwitchChangeEvent> = output<ToggleSwitchChangeEvent>();

    input = viewChild.required<ElementRef>('input');
    /**
     * Callback to invoke when the on value change.
     * @type {TemplateRef<ToggleSwitchHandleTemplateContext>} context - Context of the template
     * @example
     * ```html
     * <ng-template #handle let-checked="checked"> </ng-template>
     * ```
     * @see {@link ToggleSwitchHandleTemplateContext}
     * @group Templates
     */
    handleTemplate = contentChild<TemplateRef<any> | undefined>('handle');
    /**
     * List of PrimeTemplate instances provided by the content.
     * @group Templates
     */
    sTemplates = contentChildren<PrimeTemplate | undefined>(PrimeTemplate);
    /**
     * Computes the custom input template if available.
     * @returns {TemplateRef<InputOtpInputTemplateContext> | undefined} The custom input template or undefined if not available.
     */
    customHandleTemplate = computed<TemplateRef<any>>(() => {
        if (this.sTemplates()) {
            const templates = this.sTemplates().reduce<{ [key: string]: TemplateRef<any> }>((prev, curr) => {
                prev[curr.getType()] = curr.template;
                return prev;
            }, {});
            return templates['handle'];
        }
        return this.handleTemplate();
    });

    modelValue: WritableSignal<any> = signal<any>(false);

    focused: WritableSignal<boolean> = signal<boolean>(false);

    onModelChange: Function = () => {};

    onModelTouched: Function = () => {};

    _componentStyle = inject(ToggleSwitchStyle);

    onClick(event: Event) {
        if (!this.disabled() && !this.readonly()) {
            this.modelValue.set(this.checked() ? this.falseValue() : this.trueValue());
            this.onModelChange(this.modelValue());
            this.onChange.emit({ originalEvent: event, checked: this.modelValue() });
            this.input().nativeElement.focus();
        }
    }

    onFocus() {
        this.focused.set(true);
    }

    onBlur() {
        this.focused.set(false);
        this.onModelTouched();
    }

    writeValue(value: any): void {
        this.modelValue.set(value);
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean): void {
        this.disabled.set(val);
    }

    checked = computed<boolean>(() => this.modelValue() === this.trueValue());
}

@NgModule({
    imports: [ToggleSwitch, SharedModule],
    exports: [ToggleSwitch, SharedModule]
})
export class ToggleSwitchModule {}
