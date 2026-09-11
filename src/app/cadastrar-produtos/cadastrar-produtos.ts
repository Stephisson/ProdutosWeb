import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastrar-produtos',
  imports: [
    CommonModule,       //Funções básicas do Angular 
    FormsModule,        //Formulários reativos 
    ReactiveFormsModule //Formulários reativos
  ],
  templateUrl: './cadastrar-produtos.html',
  styleUrl: './cadastrar-produtos.css',
})
export class CadastrarProdutos {
  //instanciando a biblioteca de HTTP Client
  private http = inject(HttpClient);

  //Atributos 
  mensagem = signal<string>('');

  //estrutura do formulário
  formulario = new FormGroup({ 
    nome : new FormControl('', [Validators.required]), 
    descricao : new FormControl('', [Validators.required]), 
    preco : new FormControl('', [Validators.required]), 
    quantidade : new FormControl('', [Validators.required]) });

  //função para enviar os dados para a API
  cadastrarProduto() { 
    //fazendo uma requisição POST para a API
    this.http.post('http://localhost:5145/api/produtos', 
      this.formulario.value)
      .subscribe((data: any) => {         //aguardando a resposta da API 
        this.mensagem.set(data.mensagem); //capturando a mensagem obtida da API 
        this.formulario.reset(); //limpando o formulário.
      });
  }
}