import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';


@Injectable({ providedIn: 'root' })
export class GifsService {

    public gifList:Gif[] = []

    private _tagsHistory: string[] = []

    private API_KEY: string = "pqCywEHc5y86BZgftEUR4kFCj4N5agzE";
    private serviceUrl:string = 'https://api.giphy.com/v1/gifs'

    constructor(private http: HttpClient) {
        this.loadLocalStorage();
        console.log('Gif Service Ready');
     }

    get tagsHistory() {
        return [...this._tagsHistory];
    }

    private organizeHistory(tag: string) {
        tag = tag.toLowerCase();

        if (this._tagsHistory.includes(tag)) { //si ya lo teno, lo quito de la lista
            this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
        }

        this._tagsHistory.unshift(tag);

        this._tagsHistory = this._tagsHistory.splice(0, 10);//dejamos la lista en 10
        this.saveLocalStorage();

    }

    private saveLocalStorage():void{
        localStorage.setItem('history', JSON.stringify(this._tagsHistory));
    }

    private loadLocalStorage():void{

        if(!localStorage.getItem('history')) return; //si no hay no cargamos

        this._tagsHistory = JSON.parse(localStorage.getItem('history') !);

        console.log(this._tagsHistory[0]);

        if(this._tagsHistory.length > 0){
            this.searchtag(this._tagsHistory[0])
        }

    }

    searchtag(tag: string): void {

        if (tag.length === 0) return

        this.organizeHistory(tag)

        const params = new HttpParams()
        .set('api_key', this.API_KEY)
        .set('limit', 10)
        .set('q', tag)


        this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params}).subscribe(
            resp => {
                this.gifList = resp.data
                console.log(this.gifList);
            }
            
        );



        // fetch('https://api.giphy.com/v1/gifs/search?api_key=pqCywEHc5y86BZgftEUR4kFCj4N5agzE&q=goku&limit=10')
        // .then(resp => resp.json())
        // .then(data => console.log(data))
    }

}