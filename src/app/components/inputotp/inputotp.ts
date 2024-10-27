import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
    AfterContentInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ContentChildren,
    EventEmitter,
    forwardRef,
    inject,
    input,
    NgModule,
    Output,
    QueryList,
    TemplateRef,
    ViewEncapsulation,
    numberAttribute,
} from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoFocus } from 'primeng/autofocus';
import { InputOtpStyle } from './style/inputotpstyle';
import { PrimeTemplate } from 'primeng/api';
import { BaseComponent } from 'primeng/basecomponent';

export const INPUT_OTP_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputOtp),
    multi: true,
};

/**
 * Input change event.
 * @property {Event} originalEvent - browser event.
 * @property {any}  value - updated value.
 * @group Interface
 */
export interface InputOtpChangeEvent {
    originalEvent: Event;
    value: any;
}

/**
 * Context interface for the input template events.
 * @property {(event: Event, index: number) => void} input - input event.
 * @property {(event: Event)} keydown - keydown event.
 * @property {(event: Event)} focus - focus event.
 * @property {(event: Event)} blur - blur event.
 * @property {(event: Event)} paste - paste event.
 * @group Interface
 */
export interface InputOtpTemplateEvents {
    input: (event: Event, index: number) => void;
    keydown: (event: Event) => void;
    focus: (event: Event) => void;
    blur: (event: Event) => void;
    paste: (event: Event) => void;
}

/**
 * Context of the input template.
 * @property {number | string} $implicit - token value.
 * @property {InputOtpTemplateEvents} events - Browser events of the template.
 * @property {number} index - index of the token.
 * @group Interface
 */
export interface InputOtpInputTemplateContext {
    $implicit: number | string;
    events: InputOtpTemplateEvents;
    index: number;
}

/**
 * Input Otp is used to enter one time passwords.
 * @group Components
 */
@Component({
    selector: 'p-inputOtp, p-inputotp',
    standalone: true,
    imports: [NgClass, NgTemplateOutlet, InputText, AutoFocus],
    template: `
        @for (i of getRange(length()); track i; let i = $index) {
            @if (!inputTemplate) {
                <input
                    type="text"
                    pInputText
                    [value]="getModelValue(i)"
                    [maxLength]="1"
                    [type]="inputType"
                    class="p-inputotp-input"
                    [variant]="variant()"
                    [readonly]="readonly()"
                    [disabled]="disabled()"
                    [tabindex]="tabindex()"
                    (input)="onInput($event, i - 1)"
                    (focus)="onInputFocus($event)"
                    (blur)="onInputBlur($event)"
                    (paste)="onPaste($event)"
                    (keydown)="onKeyDown($event)"
                    pAutoFocus
                    [autofocus]="getAutofocus(i)"
                    [ngClass]="styleClass()"
                />
            } @else {
                <ng-container
                    *ngTemplateOutlet="inputTemplate; context: { $implicit: getToken(i - 1), events: getTemplateEvents(i - 1), index: i }"
                >
                </ng-container>
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [INPUT_OTP_VALUE_ACCESSOR, InputOtpStyle],
    host: {
        class: 'p-inputotp p-component',
    },
})
export class InputOtp extends BaseComponent implements AfterContentInit {
    /**
     * When present, it specifies that the component should have invalid state style.
     * @group Props
     */
    invalid = input<boolean, any>(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    disabled = input<boolean, any>(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that an input field is read-only.
     * @group Props
     */
    readonly = input<boolean, any>(false, { transform: booleanAttribute });
    /**
     * Specifies the input variant of the component.
     * @group Props
     */
    variant = input<'filled' | 'outlined'>('outlined');
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number | null, any>(null, { transform: numberAttribute });
    /**
     * Number of characters to initiate.
     * @group Props
     */
    length = input<number, any>(4, { transform: numberAttribute });
    /**
     * Style class of the input element.
     * @group Props
     */
    styleClass = input<string>();
    /**
     * Mask pattern.
     * @group Props
     */
    mask = input<boolean, any>(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that an input field is integer-only.
     * @group Props
     */
    integerOnly = input<boolean, any>(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean, any>(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke on value change.
     * @group Emits
     */
    @Output() onChange: EventEmitter<InputOtpChangeEvent> = new EventEmitter<InputOtpChangeEvent>();
    /**
     * Callback to invoke when the component receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onFocus: EventEmitter<Event> = new EventEmitter();
    /**
     * Callback to invoke when the component loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onBlur: EventEmitter<Event> = new EventEmitter();

    /**
     * Input template.
     * @param {InputOtpInputTemplateContext} context - Context of the template
     * @see {@link InputOtpInputTemplateContext}
     * @group Templates
     */
    @ContentChild('input') inputTemplate: TemplateRef<InputOtpInputTemplateContext>;

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'input':
                    this.inputTemplate = item.template;
                    break;

                default:
                    this.inputTemplate = item.template;
                    break;
            }
        });
    }

    tokens: any = [];

    onModelChange: Function = () => {};

    onModelTouched: Function = () => {};

    value: any;

    get inputType(): string {
        return this.mask() ? 'password' : 'text';
    }

    _componentStyle = inject(InputOtpStyle);

    getToken(index) {
        return this.tokens[index];
    }

    getTemplateEvents(index) {
        return {
            input: (event) => this.onInput(event, index),
            keydown: (event) => this.onKeyDown(event),
            focus: (event) => this.onFocus.emit(event),
            blur: (event) => this.onBlur.emit(event),
            paste: (event) => this.onPaste(event),
        };
    }

    onInput(event, index) {
        this.tokens[index] = event.target.value;
        this.updateModel(event);

        if (event.inputType === 'deleteContentBackward') {
            this.moveToPrev(event);
        } else if (event.inputType === 'insertText' || event.inputType === 'deleteContentForward') {
            this.moveToNext(event);
        }
    }

    updateModel(event: any) {
        const newValue = this.tokens.join('');
        this.onModelChange(newValue);

        this.onChange.emit({
            originalEvent: event,
            value: newValue,
        });
    }

    writeValue(value: any): void {
        if (value) {
            if (Array.isArray(value) && value.length > 0) {
                this.value = value.slice(0, this.length());
            } else {
                this.value = value.toString().split('').slice(0, this.length());
            }
        } else {
            this.value = value;
        }
        this.updateTokens();
        this.cd.markForCheck();
    }

    updateTokens() {
        if (this.value !== null && this.value !== undefined) {
            if (Array.isArray(this.value)) {
                this.tokens = [...this.value];
            } else {
                this.tokens = this.value.toString().split('');
            }
        } else {
            this.tokens = [];
        }
    }

    getModelValue(i: number) {
        return this.tokens[i - 1] || '';
    }

    getAutofocus(i: number): boolean {
        if (i === 1) {
            return this.autofocus();
        }
        return false;
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    moveToPrev(event) {
        let prevInput = this.findPrevInput(event.target);

        if (prevInput) {
            prevInput.focus();
            prevInput.select();
        }
    }

    moveToNext(event) {
        let nextInput = this.findNextInput(event.target);

        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    }

    findNextInput(element) {
        let nextElement = element.nextElementSibling;

        if (!nextElement) return;

        return nextElement.nodeName === 'INPUT' ? nextElement : this.findNextInput(nextElement);
    }

    findPrevInput(element) {
        let prevElement = element.previousElementSibling;

        if (!prevElement) return;

        return prevElement.nodeName === 'INPUT' ? prevElement : this.findPrevInput(prevElement);
    }

    onInputFocus(event) {
        event.target.select();
        this.onFocus.emit(event);
    }

    onInputBlur(event) {
        this.onBlur.emit(event);
    }

    onKeyDown(event) {
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        switch (event.code) {
            case 'ArrowLeft':
                this.moveToPrev(event);
                event.preventDefault();

                break;

            case 'ArrowUp':
            case 'ArrowDown':
                event.preventDefault();

                break;

            case 'Backspace':
                if (event.target.value.length === 0) {
                    this.moveToPrev(event);
                    event.preventDefault();
                }

                break;

            case 'ArrowRight':
                this.moveToNext(event);
                event.preventDefault();

                break;

            default:
                if (
                    (this.integerOnly() &&
                        !(
                            (event.code.startsWith('Digit') || event.code.startsWith('Numpad')) &&
                            Number(event.key) >= 0 &&
                            Number(event.key) <= 9
                        )) ||
                    (this.tokens.join('').length >= this.length() && event.code !== 'Delete')
                ) {
                    event.preventDefault();
                }

                break;
        }
    }

    onPaste(event) {
        if (!this.disabled() && !this.readonly()) {
            let paste = event.clipboardData.getData('text');

            if (paste.length) {
                let pastedCode = paste.substring(0, this.length() + 1);

                if (!this.integerOnly() || !isNaN(pastedCode)) {
                    this.tokens = pastedCode.split('');
                    this.updateModel(event);
                }
            }

            event.preventDefault();
        }
    }

    getRange(n: number): number[] {
        return Array.from({ length: n }, (_, index) => index + 1);
    }
}

@NgModule({
    imports: [InputOtp],
    exports: [InputOtp],
})
export class InputOtpModule {}
