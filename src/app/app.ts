import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  //instanciando a biblioteca de HTTP Client 
  private http = inject(HttpClient);

  //função para realizar a pesquisa de produtos
  consultarProdutos() {
    console.log('Consulta de produtos iniciada.');
    
    //realizando a requisição HTTP GET para obter a lista de produtos
    this.http.get('http://localhost:5145/api/produtos')
    .subscribe((produtos) => { //capturando a resposta da requisição
      //imprimindo os produtos no console do navegador
      console.log(produtos);
    });
  }
}