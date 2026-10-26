import { Component } from '@angular/core';
import { ContentEditor } from '../../posts/content-editor/content-editor';

@Component({
  selector: 'ngs-feed-component',
  imports: [ContentEditor],
  templateUrl: './feed-component.html',
  styleUrl: './feed-component.scss',
})
export class FeedComponent { }
