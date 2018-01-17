/**
 * The module for the campaign page and all of its subpages
 */
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';

import { CharacterPage } from './character.component';
import { CharacterDirective } from './character.directive';
import { CharacterService } from './character.service';

import { CharacterList } from './views/character-list/character-list';
import { CharacterNew } from './views/character-new/character-new';

@NgModule({
    imports: [SharedModule, IonicPageModule.forChild(CharacterPage)],
    declarations: [
        CharacterPage, 
        CharacterList, 
        CharacterNew,
        CharacterDirective
    ],
    entryComponents: [
        CharacterPage,
        CharacterList,
        CharacterNew
    ],
    providers: [CharacterService],
    exports: [
        CharacterPage
    ]
})
export class CharacterModule {}