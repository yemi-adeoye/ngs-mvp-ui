import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngs-tags-previewer',
  imports: [],
  templateUrl: './tags-previewer.html',
  styleUrl: './tags-previewer.scss',
})
export class TagsPreviewer {

  @Input()
  previewTags: string[] = []

  @Input()
  onSelectedTagDelete = (tag: string) => { }
}
