import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { AppDocModule } from '@layout/doc/app.doc.module';
import { AppCodeModule } from '@layout/doc/app.code.component';
import { ArchitectureDoc } from './architecturedoc';
import { TabsModule } from 'primeng/tabs';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { BootstrapDoc } from './bootstrapdoc';
import { CaseDoc } from './casedoc';
import { ColorsDoc } from './colorsdoc';
import { ComponentDoc } from './componentdoc';
import { DarkModeDoc } from './darkmodedoc';
import { DefinePresetDoc } from './definepresetdoc';
import { DtDoc } from './dtdoc';
import { FocusRingDoc } from './focusringdoc';
import { FontDoc } from './fontdoc';
import { FormsDoc } from './formsdoc';
import { LibrariesDoc } from './librariesdoc';
import { NoirDoc } from './noirdoc';
import { OptionsDoc } from './optionsdoc';
import { PaletteDoc } from './palettedoc';
import { PresetsDoc } from './presetsdoc';
import { PrimaryDoc } from './primarydoc';
import { ResetDoc } from './resetdoc';
import { ReversedKeysDoc } from './reversedkeysdoc';
import { ScaleDoc } from './scaledoc';
import { ScopedTokensDoc } from './scopedtokensdoc';
import { SpecificityDoc } from './specifitydoc';
import { TailwindDoc } from './tailwinddoc';
import { ThemeDoc } from './themedoc';
import { UpdatePresetDoc } from './updatepresetdoc';
import { UpdatePrimaryPaletteDoc } from './updateprimarypalettedoc';
import { UpdateSurfacePaletteDoc } from './updatesurfacepalettedoc';
import { UsePresetDoc } from './usepresetdoc';
import { SurfaceDoc } from './surfacedoc';

@NgModule({
    imports: [CommonModule, RouterModule, TabsModule, AppCodeModule, AppDocModule, ButtonModule, PanelModule, ToggleSwitch, FormsModule],
    declarations: [
        ArchitectureDoc,
        BootstrapDoc,
        CaseDoc,
        ColorsDoc,
        ComponentDoc,
        DarkModeDoc,
        DefinePresetDoc,
        DtDoc,
        FocusRingDoc,
        FontDoc,
        FormsDoc,
        LibrariesDoc,
        NoirDoc,
        OptionsDoc,
        PaletteDoc,
        PresetsDoc,
        PrimaryDoc,
        ResetDoc,
        ReversedKeysDoc,
        ScaleDoc,
        ScopedTokensDoc,
        SpecificityDoc,
        TailwindDoc,
        ThemeDoc,
        UpdatePresetDoc,
        UpdatePrimaryPaletteDoc,
        UpdateSurfacePaletteDoc,
        UsePresetDoc,
        SurfaceDoc,
    ],
    exports: [
        AppDocModule,
        ArchitectureDoc,
        BootstrapDoc,
        CaseDoc,
        ColorsDoc,
        ComponentDoc,
        DarkModeDoc,
        DefinePresetDoc,
        DtDoc,
        FocusRingDoc,
        FontDoc,
        FormsDoc,
        LibrariesDoc,
        NoirDoc,
        OptionsDoc,
        PaletteDoc,
        PresetsDoc,
        PrimaryDoc,
        ResetDoc,
        ReversedKeysDoc,
        ScaleDoc,
        ScopedTokensDoc,
        SpecificityDoc,
        TailwindDoc,
        ThemeDoc,
        UpdatePresetDoc,
        UpdatePrimaryPaletteDoc,
        UpdateSurfacePaletteDoc,
        UsePresetDoc,
        SurfaceDoc,
    ],
})
export class ThemingDocModule {}
