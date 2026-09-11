import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-consultar-produtos',
  imports: [
    RouterLink,   //Biblioteca para navegação em rotas
    CommonModule, //Biblioteca de funções básicas do Angular
    NgxPaginationModule //Biblioteca de paginação
  ],
  templateUrl: './consultar-produtos.html',
  styleUrl: './consultar-produtos.css',
})

export class ConsultarProdutos {
  //Atributos signal
  mensagem = signal<string>(''); 
  produtos = signal<Array<any>>([]);

  //instanciando a biblioteca de HTTP Client 
  private http = inject(HttpClient); 
  
  //Variável para armazenar o numero da página 
  pagina: number = 1;

  //função para realizar a pesquisa de produtos 
  ngOnInit() {   
    //definindo uma mensagem inicial
    this.mensagem.set('Carregando produtos, por favor aguarde...');

    //realizando a requisição HTTP GET para obter a lista de produtos 
    this.http.get('http://localhost:5145/api/produtos')
      .subscribe((data) => {    //capturando a resposta da requisição 
        //atualizando o signal produtos com os dados recebidos 
        this.produtos.set(data as Array<any>);
        //limpando a mensagem de carregamento 
        this.mensagem.set(''); 
      });
  }
  //função para realizar a exclusão do produto na API
  excluirProduto(id: string) { 
    if(confirm('Deseja realmente excluir o produto selecionado?')) { 
      //enviando uma requisição HTTP DELETE para a API 
      this.http.delete('http://localhost:5145/api/produtos/' + id)
      .subscribe((data: any) => { 
        alert(data.mensagem); //exibindo mensagem 
        this.ngOnInit(); //executando a consulta 
      }); 
    }
  }
  //função para o paginador 
  pageChange(event: any) {
     this.pagina = event;
  }
}