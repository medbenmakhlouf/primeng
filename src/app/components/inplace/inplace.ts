import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    contentChildren,
    OutputEmitterRef,
    inject,
    input,
    NgModule,
    output,
    Signal,
    TemplateRef,
    ViewEncapsulation,
    computed,
    model
} from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TimesIcon } from 'primeng/icons/times';
import { BaseComponent } from 'primeng/basecomponent';
import { InplaceStyle } from './style/inplacestyle';

@Component({
    selector: 'p-inplacedisplay, p-inplaceDisplay',
    standalone: true,
    template: '<ng-content></ng-content>',
})
export class InplaceDisplay {}

@Component({
    selector: 'p-inplacecontent, p-inplaceContent',
    standalone: true,
    template: '<ng-content></ng-content>',
})
export class InplaceContent {}
/**
 * Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.
 * @group Components
 */
@Component({
    selector: 'p-inplace',
    standalone: true,
    imports: [NgClass, NgStyle, NgTemplateOutlet, ButtonModule, TimesIcon],
    template: `
        <div
            [ngClass]="{ 'p-inplace p-component': true, 'p-inplace-closable': closable() }"
            [ngStyle]="style()"
            [class]="styleClass()"
            [attr.aria-live]="'polite'"
        >
            @if (!active()) {
                <div
                    class="p-inplace-display"
                    (click)="onActivateClick($event)"
                    tabindex="0"
                    role="button"
                    (keydown)="onKeydown($event)"
                    [ngClass]="{ 'p-disabled': disabled() }"
                >
                    <ng-content select="[pInplaceDisplay]"></ng-content>
                    <ng-container *ngTemplateOutlet="displayTemplate()"></ng-container>
                </div>
            } @else {
                <div class="p-inplace-content">
                    <ng-content select="[pInplaceContent]"></ng-content>
                    <ng-container
                        *ngTemplateOutlet="contentTemplate(); context: { closeCallback: onDeactivateClick.bind(this) }"
                    ></ng-container>
                    @if (closable()) {
                        @if (closeIcon()) {
                            <button
                                type="button"
                                [icon]="closeIcon()"
                                pButton
                                pRipple(click)="onDeactivateClick($event)"
                                [attr.aria-label]="closeAriaLabel()"
                            ></button>
                        } @else {
                            <button
                                type="button"
                                pButtonpRipple
                                [ngClass]="'p-button-icon-only'"
                                (click)="onDeactivateClick($event)"
                                [attr.aria-label]="closeAriaLabel()"
                            >
                                @if (!closeIconTemplate()) {
                                    <TimesIcon />
                                }
                                <ng-template *ngTemplateOutlet="closeIconTemplate()"></ng-template>
                            </button>
                        }
                    }
                </div>
            }
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [InplaceStyle],
})
export class Inplace extends BaseComponent {
    /**
     * Whether the content is displayed or not.
     * @group Props
     */
    active = model<boolean>(false);
    /**
     * Displays a button to switch back to display mode.
     * @group Props
     */
    closable = input<boolean, any>(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled = input<boolean, any>(false, { transform: booleanAttribute });
    /**
     * Allows to prevent clicking.
     * @group Props
     */
    preventClick = input<boolean, any>(undefined, { transform: booleanAttribute });
    /**
     * Inline style of the element.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null>();
    /**
     * Class of the element.
     * @group Props
     */
    styleClass = input<string>();
    /**
     * Icon to display in the close button.
     * @group Props
     */
    closeIcon = input<string>();
    /**
     * Establishes a string value that labels the close button.
     * @group Props
     */
    closeAriaLabel = input<string>();
    /**
     * Callback to invoke when inplace is opened.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onActivate: OutputEmitterRef<Event> = output<Event>();
    /**
     * Callback to invoke when inplace is closed.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onDeactivate: OutputEmitterRef<Event> = output<Event>();

    templates: Signal<readonly PrimeTemplate[]> = contentChildren(PrimeTemplate);

    private mappedTemplates = computed<{ [key: string]: TemplateRef<any> }>(() => {
        return (this.templates() || []).reduce((prev, item) => {
            prev[item.getType()] = item.template;
            return prev;
        }, {});
    });

    @ContentChild('display') displayTemplate = computed<TemplateRef<any> | undefined>(() => this.mappedTemplates()['display']);
    /**
     * Display template of the element.
     * @group Templates
     */
    @ContentChild('content') contentTemplate = computed<TemplateRef<any> | undefined>(() => this.mappedTemplates()['content']);
    /**
     * Content template of the element.
     * @group Templates
     */
    @ContentChild('closeicon') closeIconTemplate = computed<TemplateRef<any> | undefined>(() => this.mappedTemplates()['closeicon']);
    /**
     * Close icon template of the element.
     * @group Templates
     */

    _componentStyle = inject(InplaceStyle);

    onActivateClick(event: MouseEvent) {
        if (!this.preventClick()) this.activate(event);
    }

    onDeactivateClick(event: MouseEvent) {
        if (!this.preventClick()) this.deactivate(event);
    }
    /**
     * Activates the content.
     * @param {Event} event - Browser event.
     * @group Method
     */
    activate(event?: Event) {
        if (!this.disabled()) {
            this.active.set(true);
            this.onActivate.emit(event);
        }
    }
    /**
     * Deactivates the content.
     * @param {Event} event - Browser event.
     * @group Method
     */
    deactivate(event?: Event) {
        if (!this.disabled()) {
            this.active.set(false);
            this.onDeactivate.emit(event);
        }
    }

    onKeydown(event: KeyboardEvent) {
        if (event.code === 'Enter') {
            this.activate(event);
            event.preventDefault();
        }
    }
}

@NgModule({
    imports: [Inplace, InplaceContent, InplaceDisplay],
    exports: [Inplace, InplaceContent, InplaceDisplay],
})
export class InplaceModule {}
