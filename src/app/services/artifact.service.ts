import { CountOfArtifactData } from './../models/entities/countOfArtifactData';
import { ArtifactImage } from './../models/entities/artifactImage';
import { ItemResponseModel } from './../core/models/responseModels/ItemResponseModel';
import { ArtifactModelForPost } from './../models/entities/artifactModelForPost';
import { ResponseModel } from './../core/models/responseModels/responseModel';
import { ArtifactModelForTranslation } from './../models/entities/artifactTranslateModel';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListResponseModel } from './../core/models/responseModels/ListResponseModel';
import { ArtifactDetailsDto } from './../models/dtos/artifactDetailsDto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Artifact } from './../models/entities/artifact';
import { Injectable } from '@angular/core';
import { ServiceRepositoryBase } from '../core/services/service.repository.base';

@Injectable({
  providedIn: 'root',
})
export class ArtifactService extends ServiceRepositoryBase<Artifact> {
  apiUrl = environment.apiUrl + 'artifacts/';
  constructor(protected httpClient: HttpClient) {
    super('artifacts', httpClient);
  }

  addWithDetails(
    artifact: Artifact,
    artifactModels: ArtifactModelForTranslation[]
  ): Observable<ItemResponseModel<number>> {
    let artifactDelete: any = artifact;
    delete artifactDelete.artifactTranslates;

    let artifactModelForPost: ArtifactModelForPost = {
      artifact: artifactDelete,
      artifactModels: Object.assign([], artifactModels),
    };

    return this.httpClient.post<ItemResponseModel<number>>(
      this.apiUrl + 'addwithtranslations',
      artifactModelForPost
    );
  }

  updateWithDetails(
    artifact: Artifact,
    artifactModels: ArtifactModelForTranslation[]
  ): Observable<ResponseModel> {
    let artifactDelete: any = artifact;
    delete artifactDelete.artifactTranslates;

    let artifactModelForPost: ArtifactModelForPost = {
      artifact: artifactDelete,
      artifactModels: Object.assign([], artifactModels),
    };

    return this.httpClient.post<ResponseModel>(
      this.apiUrl + 'updatewithtranslations',
      artifactModelForPost
    );
  }

  getAllDetails(): Observable<ListResponseModel<ArtifactDetailsDto>> {
    return this.httpClient.get<ListResponseModel<ArtifactDetailsDto>>(
      this.apiUrl + 'getalldetails'
    );
  }

  getAllDetailsAndDefaultImages(): Observable<
    ListResponseModel<ArtifactDetailsDto>
  > {
    return this.httpClient.get<ListResponseModel<ArtifactDetailsDto>>(
      this.apiUrl + 'getalldetailsanddefaultimages'
    );
  }

  getDetailsById(
    id: number
  ): Observable<ItemResponseModel<ArtifactDetailsDto>> {
    return this.httpClient.get<ItemResponseModel<ArtifactDetailsDto>>(
      this.apiUrl + 'getdetailsbyid?id=' + id
    );
  }

  getArtifactCount(): Observable<ItemResponseModel<CountOfArtifactData>> {
    return this.httpClient.get<ItemResponseModel<CountOfArtifactData>>(
      this.apiUrl + 'getartifactcount'
    );
  }

  delete(artifact: Artifact): Observable<ResponseModel> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: artifact,
    };

    return this.httpClient.delete<ResponseModel>(
      this.apiUrl + 'deletewithtranslates',
      httpOptions
    );
  }
}
