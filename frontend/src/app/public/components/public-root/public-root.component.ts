import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-public-root',
  templateUrl: './public-root.component.html',
  styleUrls: ['./public-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicRootComponent {
}
