import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { FilmesService } from 'src/app/core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { ConfigPrams } from 'src/app/shared/models/config-prams';

@Component({
  selector: 'abrito-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {
  readonly semFoto = 'https://www.termoparts.com.br/wp-content/uploads/2017/10/no-image.jpg';

  // parametros iniciais do infinit scrol
  config: ConfigPrams = {
    pagina: 0,
    limite: 4
  };

  filmes: Filme[] = [];
  filtrosListagem: FormGroup;
  generos: Array<string>;

  constructor(private filmesService: FilmesService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.filtrosListagem = this.fb.group({
      texto: [''],
      genero: ['']
    });

    // capitura as alteracoes no campo texto do filtro    
    this.filtrosListagem.get('texto').valueChanges
    .pipe(debounceTime(400))
    .subscribe((val: string) => {
      this.config.pesquisa = val;
      this.resetarConsulta();
    });

    // capitura as alteracoes no campo genero do filtro    
    this.filtrosListagem.get('genero').valueChanges
    .subscribe((val: string) => {
      // tipo generico criado em configPrams/campoGenerico
      this.config.campo = {tipo: 'genero', valor: val};
      this.resetarConsulta();
    });

    this.generos = [
      'Ação', 
      'Aventura', 
      'Comédia',
      'Drama',
      'Ficção cientifica', 
      'Romance', 
      'Terror'
      ];

    this.listarFilmes();
  }

  onScroll(): void {
    this.listarFilmes();
  }

  // metodo para abrir a tela de filmes para edicao 
  abrir(id: number): void {
    this.router.navigateByUrl('/filmes/' + id);
  }

  private listarFilmes(): void {
    this.config.pagina++;
    this.filmesService.listar(this.config)
      .subscribe((filmes: Filme[]) => 
      //spread operator para concatenar array de filmes
      this.filmes.push(...filmes));
  }

  // limpa o array de filmes retorna a pagina para zero 
  // chama novamento o listar filmes 
  // com o filtro passado
  private resetarConsulta(): void {
    this.config.pagina = 0;
    this.filmes = [];
    this.listarFilmes();
  }
}
