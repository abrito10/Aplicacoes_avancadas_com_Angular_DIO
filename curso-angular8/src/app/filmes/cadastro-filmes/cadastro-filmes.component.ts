// por questao de organizacao primeiro os imports do angular
// depois os de outros fornecedores
// depois os criados para a aplicacao
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Filme } from 'src/app/shared/models/filme';
import { FilmesService } from 'src/app/core/filmes.service';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Alerta } from 'src/app/shared/models/alerta';

@Component({
  selector: 'abrito-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  id: number;
  cadastro: FormGroup; // o nome sera utiizado no html [formGroup]="cadastro"
  generos: Array<string>;

  constructor(public validacao: ValidarCamposService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private filmeService: FilmesService, // injeta a filme service
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  get f() { // retona todos os imputs
    return this.cadastro.controls;
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    // se existir o id 
    //pesquisa o filme pelo id e retona para edicao
    if (this.id) {
      this.filmeService.visualizar(this.id)
        .subscribe((filme: Filme) => this.criarFormulario(filme));
    } else {
      this.criarFormulario(this.criarFilmeEmBranco());
    }
    // lista de genero para tela de cadastro
    this.generos = 
        ['Ação', 
        'Aventura', 
        'Comédia', 
        'Drama',
        'Ficção cientifica', 
        'Romance', 
        'Terror' 
      ];

  }

  submit(): void { // 
    this.cadastro.markAllAsTouched();
    if (this.cadastro.invalid) {
      return;
    }

    const filme = this.cadastro.getRawValue() as Filme;
    // caso exista id sera feita uma alteracao
    if (this.id) {
      filme.id = this.id;
      this.editar(filme);
     // caso nao exita id ira salvar um novo registro 
    } else {
      this.salvar(filme);
    }
  }

  reiniciarForm(): void { // metodo para ressetar/limpar o formulario  
    this.cadastro.reset();
  }

  // para edicao do cadastro de filme
  private criarFormulario(filme: Filme): void {
    //validacoes do formulario de cadastro 
    this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]], // campo nao obrigatorio mas caso preenchido tem de ter no minimo 10 caracteres
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]]
    });
  }

  // para cadastro de filme
  // com todos os campos em branco/null
  private criarFilmeEmBranco(): Filme {
    return {
      id: null,
      titulo: null,
      dtLancamento: null,
      urlFoto: null,
      descricao: null,
      nota: null,
      urlImdb: null,
      genero: null
    } as Filme;
  }

  private salvar(filme: Filme): void {
    this.filmeService.salvar(filme).subscribe(() => { // subscribe retorna o que aconteceu ao salvar o filme
     // passagem de parametros que serao sobreescritos no modal
      const config = {
        data: {
          btnSucesso: 'Ir para a listagem',
          btnCancelar: 'Cadastrar um novo filme',
          corBtnCancelar: 'primary',
          possuirBtnFechar: true
        } as Alerta
      };
     
      const dialogRef = this.dialog.open(AlertaComponent, config); // vai abri o dialog
      // retorno dos botoes do dialog
      // caso botao sucesso retorna true
      // caso botao cancelar retor false
      dialogRef.afterClosed().subscribe((opcao: boolean) => {
        if (opcao) {
          // vai navegar pra tela de filmes
          this.router.navigateByUrl('filmes');
        } else {
          // vai limpar o formulario para cadastrar um novo filme
          this.reiniciarForm();
        }
      });
    },
    () => {
      const config = {
      // retorno dos botoes do dialog
      // caso botao sucesso retorna true
      // caso botao cancelar retor false
        data: {
          titulo: 'Erro ao salvar o registro!',
          descricao: 'Não conseguimos salvar seu registro, favor tentar novamente mais tarde',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      };
      this.dialog.open(AlertaComponent, config);
    });
  }

  private editar(filme: Filme): void {
    this.filmeService.editar(filme).subscribe(() => {
      const config = {
        data: {
          descricao: 'Seu registro foi atualizado com sucesso !',
          btnSucesso: 'Ir para a listagem',
        } as Alerta
      };
      const dialogRef = this.dialog.open(AlertaComponent, config);
      dialogRef.afterClosed().subscribe(() => this.router.navigateByUrl('filmes'));
    },
    () => {
      const config = {
        data: {
          titulo: 'Erro ao editar o registro!',
          descricao: 'Não conseguimos editar seu registro, favor tentar novamente mais tarde',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      };
      this.dialog.open(AlertaComponent, config);
    });
  }

}
