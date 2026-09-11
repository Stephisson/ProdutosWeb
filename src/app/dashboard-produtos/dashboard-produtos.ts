import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';

@Component({
  selector: 'app-dashboard-produtos',
  imports: [
    CommonModule,
    ChartModule
  ],
  templateUrl: './dashboard-produtos.html',
  styleUrl: './dashboard-produtos.css',
})
export class DashboardProdutos {
  //atributos graficoColunas
  graficoColunas = signal<Chart>(new Chart()); 
  graficoBarras = signal<Chart>(new Chart()); 
  graficoDonut = signal<Chart>(new Chart()); 
  graficoLinhas = signal<Chart>(new Chart());

  // Instanciando a biblioteca de HTTP Client
  private http = inject(HttpClient);

  // Função executada sempre que o componente é aberto ou inicializado
  ngOnInit() {
    this.obterQuantidadeProdutosMes();
    this.obterTotalProdutosMes();
    this.obterProdutosMaiorPreco();
    this.obterProdutosMaiorQuantidade();
  }

  obterQuantidadeProdutosMes() {
    this.http.get('http://localhost:5145/api/dashboard/quantidade-produtos-mes')
      .subscribe((data) => {
        //desenhando o gráfico de colunas
        const meses: string[] = []; 
        const quantidade : number[] = []; 
        
        //capturando e organizando os dados obtidos da API
        (data as any[]).forEach((item) => { 
          meses.push(item.mesAno); 
          quantidade.push(item.quantidadeProdutos); 
        });

        // Criar o gráfico
        this.graficoColunas.set(
          new Chart({
            chart:    { type: 'column'},
            title:    { text: 'Quantidade Produtos/Mês'},
            subtitle: { text: 'Somatório da quantidade de produtos cadastrados por mês.' },
            xAxis:    { categories: meses, title: { text: 'Mês / Ano' } },
            yAxis:    { min: 0, title: { text: 'Quantidade de produtos' }},
            series:   [ { name: 'Produtos', type: 'column', data: quantidade } ],
            legend:   { enabled: false },
            credits:  { enabled: false }
          })
        );
      });
  }

  obterTotalProdutosMes() {
    this.http.get('http://localhost:5145/api/dashboard/total-produtos-mes')
      .subscribe((data) => {

        //desenhando o gráfico de colunas 
        const meses: string[] = []; 
        const total : number[] = [];

        //capturando e organizando os dados obtidos da API 
        (data as any[]).forEach((item) => { 
          meses.push(item.mesAno); 
          total.push(item.valorTotal); 
        });

        //Criar o gráfico 
        this.graficoBarras.set( 
          new Chart({ 
            chart:    { type : 'bar' }, 
            title:    { text : 'Total Produtos/Mês' }, 
            subtitle: { text : 'Somatório do preço total de produtos cadastrados por mês.' },
            xAxis:    { categories: meses, title: { text : 'Mês / Ano' } },
            yAxis:    { min : 0, title: { text : 'Total de produtos' } }, 
            series:   [ { name: 'Produtos', type:'column', data: total } ], 
            legend:   { enabled: false }, 
            credits:  { enabled : false } }) );
      });
  }

  obterProdutosMaiorPreco() {
    this.http.get('http://localhost:5145/api/dashboard/produtos-maiorpreco')
      .subscribe((data) => {
        
        //Desenhando o gráfico de colunas 
        const nomes: string[] = []; 
        const precos : number[] = []; 
        
        //capturando e organizando os dados obtidos da API 
        (data as any[]).forEach((item) => { 
          nomes.push(item.nome); 
          precos.push(item.preco); });

         //Criar o gráfico 
         this.graficoLinhas.set( 
          new Chart({ 
            chart: { type : 'line' }, 
            title: { text : 'Ranking de produtos por preço' }, 
            subtitle: { text : 'Ranking dos 5 produtos com maior preço cadastrado.' }, 
            xAxis: { categories: nomes, title: { text : 'Nome do produto' } }, 
            yAxis: { min : 0, title: { text : 'Preço' } }, 
            series: [ { name: 'Produtos', type: 'line', data: precos } ], 
            legend: { enabled: false }, credits: { enabled : false } 
          }) 
        );  
      });
  }

  obterProdutosMaiorQuantidade() {
    this.http.get('http://localhost:5145/api/dashboard/produtos-maiorquantidade')
      .subscribe((data) => {
        
        const conteudo: any[] = []; 

        (data as any[]).forEach((item) => { 
          conteudo.push([item.nome, item.quantidade]);
        }); 
        
        this.graficoDonut.set(new Chart({ 
          chart:    { type : 'pie' }, 
          title:    { text : 'Ranking de produtos por quantidade.' }, 
          subtitle: { text : 'Ranking dos 5 produtos com maior quantidade cadastrado.' }, 
          plotOptions: { 
            pie :    { innerSize: '50%', dataLabels: { enabled : true } } }, 
            series: [{ data: conteudo, type : 'pie', name : 'Produtos' }], 
            legend:  { enabled: false }, 
            credits: { enabled : false } }));
        
      });
  }
}