import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {GeneralModule} from './general/general.module';
import {RtSvgSpriteModule} from './rt-svg-sprite/rt-svg-sprite.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GeneralModule, RtSvgSpriteModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
