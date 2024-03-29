import { CountOfArtifactData } from './../../models/entities/countOfArtifactData';
import { ArtifactService } from 'src/app/services/artifact.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { ScrollService } from 'src/app/services/scroll.service';
import { allTranslates } from 'src/app/services/translation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  faComments = faComments;
  artifactCountData: CountOfArtifactData;

  constructor(
    private scrollService: ScrollService,
    private router: Router,
    private artifactService: ArtifactService
  ) {}

  ngOnInit(): void {
    this.getArtifactCount();
  }

  getArtifactCount() {
    this.artifactService.getArtifactCount().subscribe((response) => {
      this.artifactCountData = response.data;
    });
  }

  scrollTop(url: string, id: string) {
    this.scrollService.navigate(url, id, 0);
  }

  navigate(url: string, id: string) {
    this.router.navigateByUrl('');
  }

  getTranslate(key: string) {
    return allTranslates.get(key);
  }
}
