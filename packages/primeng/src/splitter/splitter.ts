import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Signal,
    Component,
    contentChildren,
    ElementRef,
    OutputEmitterRef,
    TemplateRef,
    input,
    NgModule,
    output,
    viewChild,
    ViewEncapsulation,
    inject,
    numberAttribute,
    computed,
    effect,
    signal,
    untracked
} from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { BaseComponent } from 'primeng/basecomponent';
import { addClass, getHeight, getOuterHeight, getOuterWidth, getWidth, hasClass, removeClass } from '@primeuix/utils';
import { Nullable, VoidListener } from 'primeng/ts-helpers';
import { SplitterResizeEndEvent, SplitterResizeStartEvent } from './splitter.interface';
import { SplitterStyle } from './style/splitterstyle';

/**
 * Splitter is utilized to separate and resize panels.
 * @group Components
 */
@Component({
    selector: 'p-splitter',
    standalone: true,
    imports: [CommonModule, SharedModule],
    template: `
        <div #container [ngClass]="containerClass()" [class]="styleClass()" [ngStyle]="style()" [attr.data-pc-name]="'splitter'" [attr.data-p-gutter-resizing]="false" [attr.data-pc-section]="'root'">
            @for (panel of panels(); track i; let i = $index; let last = $last) {
                <div [ngClass]="panelContainerClass()" [class]="panelStyleClass()" [ngStyle]="panelStyle()" tabindex="-1" [attr.data-pc-name]="'splitter'" [attr.data-pc-section]="'root'">
                    <ng-container *ngTemplateOutlet="panel"></ng-container>
                </div>
                @if (!last) {
                    <div
                        class="p-splitter-gutter"
                        role="separator"
                        tabindex="-1"
                        (mousedown)="onGutterMouseDown(container, $event, i)"
                        (touchstart)="onGutterTouchStart(container, $event, i)"
                        (touchmove)="onGutterTouchMove($event)"
                        (touchend)="onGutterTouchEnd(container, $event)"
                        [attr.data-p-gutter-resizing]="false"
                        [attr.data-pc-section]="'gutter'"
                    >
                        <div
                            class="p-splitter-gutter-handle"
                            tabindex="0"
                            [ngStyle]="gutterStyle()"
                            [attr.aria-orientation]="layout()"
                            [attr.aria-valuenow]="prevSize()"
                            [attr.data-pc-section]="'gutterhandle'"
                            (keyup)="onGutterKeyUp(container, $event)"
                            (keydown)="onGutterKeyDown(container, $event, i)"
                        ></div>
                    </div>
                }
            }
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.p-splitter-panel-nested]': 'nested()'
    },
    providers: [SplitterStyle]
})
export class Splitter extends BaseComponent {
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass = input<string>();
    /**
     * Style class of the panel.
     * @group Props
     */
    panelStyleClass = input<string>();
    /**
     * Inline style of the component.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null>();
    /**
     * Inline style of the panel.
     * @group Props
     */
    panelStyle = input<{ [klass: string]: any } | null>();
    /**
     * Defines where a stateful splitter keeps its state, valid values are 'session' for sessionStorage and 'local' for localStorage.
     * @group Props
     */
    stateStorage = input<string>('session');
    /**
     * Storage identifier of a stateful Splitter.
     * @group Props
     */
    stateKey = input<string | null>(null);
    /**
     * Orientation of the panels. Valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    layout = input<string>('horizontal');
    /**
     * Size of the divider in pixels.
     * @group Props
     */
    gutterSize = input<number, any>(4, { transform: numberAttribute });
    /**
     * Step factor to increment/decrement the size of the panels while pressing the arrow keys.
     * @group Props
     */
    step = input<number, any>(5, { transform: numberAttribute });
    /**
     * Minimum size of the elements relative to 100%.
     * @group Props
     */
    minSizes = input<number[], any[]>([], { transform: (values) => values.map(numberAttribute) });
    /**
     * Size of the elements relative to 100%.
     * @group Props
     */
    panelSizes = input<number[], any[]>([], { transform: (values) => values.map(numberAttribute) });
    /**
     * Callback to invoke when resize ends.
     * @param {SplitterResizeEndEvent} event - Custom panel resize end event
     * @group Emits
     */
    onResizeEnd: OutputEmitterRef<SplitterResizeEndEvent> = output<SplitterResizeEndEvent>();
    /**
     * Callback to invoke when resize starts.
     * @param {SplitterResizeStartEvent} event - Custom panel resize start event
     * @group Emits
     */
    onResizeStart: OutputEmitterRef<SplitterResizeStartEvent> = output<SplitterResizeStartEvent>();

    _templates: Signal<readonly PrimeTemplate[]> = contentChildren(PrimeTemplate);
    _panels: Signal<readonly PrimeTemplate[]> = contentChildren('panel');

    containerViewChild: Signal<Nullable<ElementRef>> = viewChild<Nullable<ElementRef>>('container');

    nested = signal<boolean>(false);

    panels = computed<TemplateRef<any>[]>(() => {
        if (this._templates()) return this._templates().map((item) => item.template);
        if (this._panels()) return this._panels().map((item) => item.template);
        return [];
    });

    dragging: boolean = false;

    mouseMoveListener: VoidListener;

    mouseUpListener: VoidListener;

    touchMoveListener: VoidListener;

    touchEndListener: VoidListener;

    size: Nullable<number>;

    gutterElement: Nullable<ElementRef | HTMLElement>;

    startPos: Nullable<number>;

    prevPanelElement: Nullable<ElementRef | HTMLElement>;

    nextPanelElement: Nullable<ElementRef | HTMLElement>;

    nextPanelSize: Nullable<number>;

    prevPanelSize: Nullable<number>;

    initialized = computed<boolean>(() => (this.isStateful() ? this.savedPanelSizes() !== null : false));

    _panelSizes = computed(() => {
        const sizeFromPanels = this.panels()?.length > 0 ? this.computePanelSizes(this.panels(), this.panelSizes()) : [];
        const initialPanelSizes = !this.initialized() ? sizeFromPanels : this.savedPanelSizes();
        return { values: signal(initialPanelSizes) };
    });

    prevPanelIndex: Nullable<number>;

    timer: any;

    prevSize = computed(() => {
        const panelSizes = untracked(this._panelSizes().values);
        const value = !this.initialized() ? parseFloat(`${panelSizes[0]}`).toFixed(4) : undefined;
        return { value: signal(value) };
    });

    _componentStyle = inject(SplitterStyle);

    constructor() {
        super();
        effect(() => {
            const panels = this.panels();
            const panelSizes = untracked(this._panelSizes().values);
            if (isPlatformBrowser(this.platformId)) {
                if (panels && panels.length) {
                    if (!this.initialized()) {
                        if (this.el && this.el.nativeElement) {
                            this.resizeFromElements(panels, panelSizes);
                        }
                    } else {
                        if (this.containerViewChild()) {
                            this.resizeFromContainers((this.containerViewChild() as ElementRef).nativeElement, panelSizes);
                        }
                    }
                }
            }
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.nested.set(this.isNested());
    }

    resizeStart(container: HTMLDivElement, event: TouchEvent | MouseEvent, index: number, isKeyDown?: boolean) {
        this.gutterElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement).parentElement;
        this.size = this.horizontal() ? getWidth(container) : getHeight(container);

        if (!isKeyDown) {
            this.dragging = true;
            this.startPos = this.horizontal() ? (event instanceof MouseEvent ? event.pageX : event.changedTouches[0].pageX) : event instanceof MouseEvent ? event.pageY : event.changedTouches[0].pageY;
        }

        this.prevPanelElement = this.gutterElement.previousElementSibling as HTMLElement;
        this.nextPanelElement = this.gutterElement.nextElementSibling as HTMLElement;

        if (isKeyDown) {
            this.prevPanelSize = this.horizontal() ? getOuterWidth(this.prevPanelElement, true) : getOuterHeight(this.prevPanelElement, true);
            this.nextPanelSize = this.horizontal() ? getOuterWidth(this.nextPanelElement, true) : getOuterHeight(this.nextPanelElement, true);
        } else {
            this.prevPanelSize = (100 * (this.horizontal() ? getOuterWidth(this.prevPanelElement, true) : getOuterHeight(this.prevPanelElement, true))) / this.size;
            this.nextPanelSize = (100 * (this.horizontal() ? getOuterWidth(this.nextPanelElement, true) : getOuterHeight(this.nextPanelElement, true))) / this.size;
        }

        this.prevPanelIndex = index;
        addClass(this.gutterElement, 'p-splitter-gutter-resizing');
        this.gutterElement.setAttribute('data-p-gutter-resizing', 'true');
        addClass(container, 'p-splitter-resizing');
        container.setAttribute('data-p-resizing', 'true');
        this.onResizeStart.emit({ originalEvent: event, sizes: this._panelSizes().values() });
    }

    onResize(event: MouseEvent, step?: number, isKeyDown?: boolean) {
        let newPos, newPrevPanelSize, newNextPanelSize;

        if (isKeyDown) {
            if (this.horizontal()) {
                newPrevPanelSize = (100 * (this.prevPanelSize + step)) / this.size;
                newNextPanelSize = (100 * (this.nextPanelSize - step)) / this.size;
            } else {
                newPrevPanelSize = (100 * (this.prevPanelSize - step)) / this.size;
                newNextPanelSize = (100 * (this.nextPanelSize + step)) / this.size;
            }
        } else {
            if (this.horizontal()) newPos = (event.pageX * 100) / this.size - (this.startPos * 100) / this.size;
            else newPos = (event.pageY * 100) / this.size - (this.startPos * 100) / this.size;

            newPrevPanelSize = (this.prevPanelSize as number) + newPos;
            newNextPanelSize = (this.nextPanelSize as number) - newPos;
        }

        this.prevSize().value.set(parseFloat(newPrevPanelSize).toFixed(4));

        if (this.validateResize(newPrevPanelSize, newNextPanelSize)) {
            (this.prevPanelElement as HTMLElement).style.flexBasis = 'calc(' + newPrevPanelSize + '% - ' + (this.panels().length - 1) * this.gutterSize() + 'px)';
            (this.nextPanelElement as HTMLElement).style.flexBasis = 'calc(' + newNextPanelSize + '% - ' + (this.panels().length - 1) * this.gutterSize() + 'px)';
            this._panelSizes().values.update((values) => {
                values[this.prevPanelIndex as number] = newPrevPanelSize;
                values[(this.prevPanelIndex as number) + 1] = newNextPanelSize;
                return values;
            });
        }
    }

    resizeEnd(container: HTMLDivElement, event: MouseEvent | TouchEvent) {
        if (this.isStateful()) {
            this.saveState();
        }

        this.onResizeEnd.emit({ originalEvent: event, sizes: this._panelSizes().values() });
        removeClass(this.gutterElement as any, 'p-splitter-gutter-resizing');
        removeClass(container, 'p-splitter-resizing');
        this.clear();
    }

    onGutterMouseDown(container: HTMLDivElement, event: MouseEvent, index: number) {
        this.resizeStart(container, event, index);
        this.bindMouseListeners(container);
    }

    onGutterTouchStart(container: HTMLDivElement, event: TouchEvent, index: number) {
        if (event.cancelable) {
            this.resizeStart(container, event, index);
            this.bindTouchListeners(container);

            event.preventDefault();
        }
    }

    onGutterTouchMove(event) {
        this.onResize(event);
        event.preventDefault();
    }

    onGutterTouchEnd(container: HTMLDivElement, event: TouchEvent) {
        this.resizeEnd(container, event);
        this.unbindTouchListeners();

        if (event.cancelable) event.preventDefault();
    }

    repeat(container: HTMLDivElement, event, index, step) {
        this.resizeStart(container, event, index, true);
        this.onResize(event, step, true);
    }

    setTimer(container: HTMLDivElement, event, index, step) {
        this.clearTimer();
        this.timer = setTimeout(() => {
            this.repeat(container, event, index, step);
        }, 40);
    }

    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    onGutterKeyUp(container: HTMLDivElement, event) {
        this.clearTimer();
        this.resizeEnd(container, event);
    }

    onGutterKeyDown(container: HTMLDivElement, event, index) {
        switch (event.code) {
            case 'ArrowLeft': {
                if (this.horizontal()) {
                    this.setTimer(container, event, index, this.step() * -1);
                }

                event.preventDefault();
                break;
            }

            case 'ArrowRight': {
                if (this.horizontal()) {
                    this.setTimer(container, event, index, this.step());
                }

                event.preventDefault();
                break;
            }

            case 'ArrowDown': {
                if (this.layout() === 'vertical') {
                    this.setTimer(container, event, index, this.step() * -1);
                }

                event.preventDefault();
                break;
            }

            case 'ArrowUp': {
                if (this.layout() === 'vertical') {
                    this.setTimer(container, event, index, this.step());
                }

                event.preventDefault();
                break;
            }

            default:
                //no op
                break;
        }
    }

    validateResize(newPrevPanelSize: number, newNextPanelSize: number) {
        if (this.minSizes().length >= 1 && this.minSizes()[0] && this.minSizes()[0] > newPrevPanelSize) {
            return false;
        }

        if (this.minSizes().length > 1 && this.minSizes()[1] && this.minSizes()[1] > newNextPanelSize) {
            return false;
        }

        return true;
    }

    bindMouseListeners(container: HTMLDivElement) {
        if (!this.mouseMoveListener) {
            this.mouseMoveListener = this.renderer.listen(this.document, 'mousemove', (event) => {
                this.onResize(event);
            });
        }

        if (!this.mouseUpListener) {
            this.mouseUpListener = this.renderer.listen(this.document, 'mouseup', (event) => {
                this.resizeEnd(container, event);
                this.unbindMouseListeners();
            });
        }
    }

    bindTouchListeners(container: HTMLDivElement) {
        if (!this.touchMoveListener) {
            this.touchMoveListener = this.renderer.listen(this.document, 'touchmove', (event) => {
                this.onResize(event.changedTouches[0]);
            });
        }

        if (!this.touchEndListener) {
            this.touchEndListener = this.renderer.listen(this.document, 'touchend', (event) => {
                this.resizeEnd(container, event);
                this.unbindTouchListeners();
            });
        }
    }

    unbindMouseListeners() {
        if (this.mouseMoveListener) {
            this.mouseMoveListener();
            this.mouseMoveListener = null;
        }

        if (this.mouseUpListener) {
            this.mouseUpListener();
            this.mouseUpListener = null;
        }
    }

    unbindTouchListeners() {
        if (this.touchMoveListener) {
            this.touchMoveListener();
            this.touchMoveListener = null;
        }

        if (this.touchEndListener) {
            this.touchEndListener();
            this.touchEndListener = null;
        }
    }

    clear() {
        this.dragging = false;
        this.size = null;
        this.startPos = null;
        this.prevPanelElement = null;
        this.nextPanelElement = null;
        this.prevPanelSize = null;
        this.nextPanelSize = null;
        this.gutterElement = null;
        this.prevPanelIndex = null;
    }

    isNested() {
        if (this.el.nativeElement) {
            let parent = this.el.nativeElement.parentElement;
            while (parent && !hasClass(parent, 'p-splitter')) {
                parent = parent.parentElement;
            }

            return parent !== null;
        } else {
            return false;
        }
    }

    isStateful = computed<boolean>(() => this.stateKey() != null);

    getStorage = computed(() => {
        if (isPlatformBrowser(this.platformId)) {
            switch (this.stateStorage()) {
                case 'local':
                    return this.document.defaultView.localStorage;

                case 'session':
                    return this.document.defaultView.sessionStorage;

                default:
                    throw new Error(this.stateStorage() + ' is not a valid value for the state storage, supported values are "local" and "session".');
            }
        } else {
            throw new Error('Storage is not a available by default on the server.');
        }
    });

    savedPanelSizes = computed<number[] | null>(() => {
        const storage = this.getStorage();
        const stateString = storage.getItem(this.stateKey() as string);
        return stateString ? (JSON.parse(stateString) as any[]).map(numberAttribute) : null;
    });

    saveState() {
        this.getStorage().setItem(this.stateKey() as string, JSON.stringify(this._panelSizes()));
    }

    resizeChild(child, i: number, _panelSizes: number[]) {
        child.style.flexBasis = 'calc(' + _panelSizes[i] + '% - ' + (this.panels().length - 1) * this.gutterSize() + 'px)';
    }

    resizeFromContainers(container: HTMLDivElement, _panelSizes: number[]) {
        let children = Array.from(container.children).filter((child) => hasClass(child, 'p-splitter-panel'));
        children.forEach((child, i) => this.resizeChild(child, i, _panelSizes));
    }

    resizeFromElements(panels: TemplateRef<any>[], _panelSizes: number[]) {
        let children = [...this.el.nativeElement.children[0].children].filter((child) => hasClass(child, 'p-splitter-panel'));
        panels.forEach((_, i) => this.resizeChild(children[i], i, _panelSizes));
    }

    computePanelSizes(panels: TemplateRef<any>[], panelSizes: number[]) {
        let _panelSizes = [];
        panels.forEach((_, i) => {
            let panelInitialSize = panelSizes.length - 1 >= i ? panelSizes[i] : null;
            _panelSizes[i] = panelInitialSize || 100 / panels.length;
        });
        return _panelSizes;
    }

    containerClass = computed(() => {
        return {
            'p-splitter p-component': true,
            'p-splitter-horizontal': this.layout() === 'horizontal',
            'p-splitter-vertical': this.layout() === 'vertical'
        };
    });

    panelContainerClass() {
        return {
            'p-splitter-panel': true,
            'p-splitter-panel-nested': true
        };
    }

    gutterStyle = computed(() => {
        if (this.horizontal()) return { width: this.gutterSize() + 'px' };
        else return { height: this.gutterSize() + 'px' };
    });

    horizontal = computed<boolean>(() => this.layout() === 'horizontal');
}

@NgModule({
    imports: [Splitter, SharedModule],
    exports: [Splitter, SharedModule]
})
export class SplitterModule {}
