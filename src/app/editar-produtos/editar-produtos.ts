import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-produtos',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './editar-produtos.html',
  styleUrl: './editar-produtos.css',
})
export class EditarProdutos {
  // Instanciando a biblioteca de HTTP Client
  private http = inject(HttpClient);

  //instanciando a bilbioteca ActivatedRoute 
  private activatedRoute = inject(ActivatedRoute);

  //Atributo para armazenar o ID do roduto 
  id : string = '';

  // Atributos
  mensagem = signal<string>('');

  // Estrutura do formulário
  formulario = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    descricao: new FormControl('', [Validators.required]),
    preco: new FormControl('', [Validators.required]),
    quantidade: new FormControl('', [Validators.required])
  });

  // Evento executado quando a página é aberta
  ngOnInit() {
    // Capturar o ID enviado na URL
    this.id = this.activatedRoute.snapshot.paramMap.get('id') as string;

    // Consultar os dados do produto através do ID
    this.http.get('http://localhost:5145/api/produtos/' + this.id)
      .subscribe((data: any) => {
        // Preencher o formulário com os dados do produto obtido
        this.formulario.patchValue(data);
      });
  }

  // Função para atualizar o produto na API
  atualizarProduto() {
    // Atualizar os dados do produto
    this.http.put('http://localhost:5145/api/produtos/' + this.id, this.formulario.value)
      .subscribe((data: any) => {
        this.mensagem.set(data.mensagem); // Ajustado para a sintaxe correta de Signal (.set)
      });
  }
}