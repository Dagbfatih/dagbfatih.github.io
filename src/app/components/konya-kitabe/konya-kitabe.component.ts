import { YoutubeVideoService } from './../../services/youtube-video.service';
import { Language } from './../../models/entities/language';
import { LanguageService } from './../../services/language.service';
import { SettingsService } from './../../services/settings.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { ScrollService } from 'src/app/services/scroll.service';
import { ArtifactTypeService } from './../../services/artifact-type.service';
import { ArtifactType } from './../../models/entities/artifactType';
import { HistPeriod } from './../../models/entities/histPeriod';
import { HistPeriodService } from './../../services/hist-period.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { ArtifactDetailsDto } from 'src/app/models/dtos/artifactDetailsDto';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { allTranslates } from 'src/app/services/translation.service';
import {
  faCaretDown,
  faCheckCircle,
  faMonument,
} from '@fortawesome/free-solid-svg-icons';
import Popper from 'popper.js';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
export declare var bootstrap: any;

@Component({
  selector: 'app-konya-kitabe',
  templateUrl: './konya-kitabe.component.html',
  styleUrls: ['./konya-kitabe.component.css'],
})
export class KonyaKitabeComponent implements OnInit {
  private popper: Popper;
  faCheckCircle = faCheckCircle;
  faCaret = faCaretDown;
  faMonument = faMonument;
  histPeriods: HistPeriod[] = [];
  artifactTypes: ArtifactType[] = [];
  artifacts: ArtifactDetailsDto[] = [];
  currentArtifact: ArtifactDetailsDto;
  searchEngineForm: FormGroup;
  currentLanguage: Language;
  baseUrl = environment.baseUrl;
  dataLoaded = false;
  latitude = '';
  longitude = '';

  constructor(
    private artifactService: ArtifactService,
    private histPeriodService: HistPeriodService,
    private artifactTypeService: ArtifactTypeService,
    private scrollService: ScrollService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private languageService: LanguageService,
    private youtubeVideoService: YoutubeVideoService,
  ) {

  }

  ngOnInit(): void {
    this.getAllArtifactsDetails();
    this.getAllHistPeriods();
    this.getAllArtifactTypes();
    this.getCurrentLanguage();
    this.runActiveStateManagement();
    this.createSearchEngineForm();
  }

  getCurrentLanguage() {
    let languageCode = this.settingsService.getLanguageCodeFromLocalStorage();
    this.languageService.getByCode(languageCode).subscribe((response) => {
      this.currentLanguage = response.data;
    });
  }

  getAllArtifactsDetails() {
    this.dataLoaded = false;
    this.artifactService
      .getAllDetailsAndDefaultImages()
      .subscribe((response) => {
        this.artifacts = response.data;
        this.dataLoaded = true;
        this.getCurrentArtifact();
      });
  }

  checkVideoExists(): boolean {
    if (this.currentArtifact.youtubeVideo) {
      if (this.currentArtifact.youtubeVideo.link.length <= 1) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  }

  setLocation() {
    this.latitude = this.currentArtifact.artifact.latitude?.toString()!;
    this.longitude = this.currentArtifact.artifact.longitude?.toString()!;
  }

  triggerOnEnded(event: any) {
    console.log('ended');
  }

  getCurrentArtifact() {
    this.activatedRoute.params.subscribe((param) => {
      if (param['id']) {
        this.currentArtifact = this.getArtifactById(+param['id'])!;
      } else if (param['period']) {
        if (this.checkHistPeriodContainsArtifact(param['period'])) {
          this.currentArtifact = this.artifacts.find(
            (a) =>
              a.artifact.histPeriodId ===
              this.getPeriodFromUrl(param['period']).id
          )!;
        } else {
          this.currentArtifact = this.artifacts[0];
          this.setLocation();
        }
      } else {
        this.currentArtifact = this.artifacts[0];
        this.setLocation();
      }
    });
  }

  createSearchEngineForm() {
    this.searchEngineForm = this.formBuilder.group({
      searchText: ['', Validators.required],
    });
  }

  runActiveStateManagement() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        $('.sub-link.active').removeClass('active');
        $('.sub-link').attr('id', function (i, val) {
          if (val === event.url) {
            $(this).addClass('active');
          }
        });
      }
    });
  }

  checkHistPeriodContainsArtifact(histPeriod: string): boolean {
    for (let i = 0; i < this.artifactTypes.length; i++) {
      const element = this.artifactTypes[i];
      let contains: boolean =
        this.getArtifactsByTypeAndPeriod(element.id, histPeriod).length > 0;

      if (contains) {
        return true;
      }
    }

    return false;
  }

  getCurrentVideoId(): string {
    return this.youtubeVideoService.getVideoIdFromLink(
      this.currentArtifact.youtubeVideo.link
    );
  }

  getAllArtifactTypes() {
    this.artifactTypeService.getAll().subscribe((response) => {
      this.artifactTypes = response.data;
    });
  }

  getPeriodFromUrl(paramName: string): HistPeriod {
    return this.histPeriods.find((h) => h.paramName === paramName)!;
  }

  getAllHistPeriods() {
    this.histPeriodService.getAll().subscribe((response) => {
      this.histPeriods = response.data;
    });
  }

  getArtifactById(id: number): ArtifactDetailsDto | undefined {
    return this.artifacts.find((a) => a.artifact.id === id);
  }

  getArtifactsByTypeAndPeriod(artifactTypeId: number, histPeriod: string) {
    return this.artifacts.filter(
      (a) =>
        a.artifactType.id === artifactTypeId &&
        a.historicalPeriod.paramName === histPeriod
    );
  }

  scroll(id: string) {
    setTimeout(() => {
      var element = document.getElementById(id);
      var headerOffset = 135;
      var elementPosition = element!.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }, 1);
  }

  getTranslate(key?: string) {
    return allTranslates.get(key ?? '');
  }
}
