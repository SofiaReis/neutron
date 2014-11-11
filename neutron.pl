% NEUTRON GAME

estado_inicial([[1,1,1,1,1],
                [0,0,0,0,0],
                [0,0,3,0,0],
                [0,0,0,0,0],
                [2,2,2,2,2]]).

inicio:-
        apresentacao,
        estado_inicial(Tab),
        neutrao_inicial(N),
        visualiza_estado(Tab),
        primeira_jogada(Tab,N,1).

neutrao_inicial([1,4]).

apresentacao:-
        write('NEUTRON EM PROLOG'), nl, nl.

visualiza_estado(Tab):-
        nl,
        write('  '),
        colunas(0), nl,
        print_tab(0, Tab),
        nl,!.

jogada_soldado(Tab,Xi, Yi, Xf, Yf, J):-
        (
           ler_jogada_soldado(Xi, Yi, Xf, Yf),
           valida_jogada(Tab, Xi, Yi, Xf, Yf,J);
           write('Jogada Invalida!\n'),
           jogada_soldado(Tab,Xi, Yi, Xf, Yf,J)
        ).

jogada_neutrao(Tab,NXi, NYi, NXf, NYf):- 
        (
        ler_jogada_neutrao(NXf,NYf),
        write('\nLeu Jogada'),
        valida_jogada(Tab, NXi, NYi, NXf, NYf,3);
         write('Jogada Invalida!\n'),
         jogada_neutrao(Tab, NXi, NYi, NXf, NYf)
        ).
        
primeira_jogada(Tab,[NX,NY],J):-
        jogada_soldado(Tab,Xi, Yi, Xf, Yf,J),
        atualiza_jogada(Tab, Xi, Yi, Xf, Yf, Tab_f2),
        visualiza_estado(Tab_f2),
        !,
        (
           verifica_fim(NX,NY,Tab_f2,J)
        ;
           (
                 J is 1,
                 jogo(Tab_f2,[NX,NY],2);
                 jogo(Tab_f2,[NX,NY],1)
              
           )
        ). 

jogo(Tab,[NX,NY],J):-
           jogada_neutrao(Tab,NX, NY, NXf, NYf),
           atualiza_jogada(Tab, NX, NY, NXf, NYf, Tab_f2),
        visualiza_estado(Tab_f2),
        !,
        (
           verifica_fim(NXf, NYf,Tab_f2,J)
        ;
        jogada_soldado(Tab_f2,Xi, Yi, Xf, Yf,J),
        atualiza_jogada(Tab_f2, Xi, Yi, Xf, Yf, Tab_f3),
           visualiza_estado(Tab_f3),
           !,
           (
              verifica_fim(NXf,NYf,Tab_f3,J);
              (
                 J is 1,
                 jogo(Tab_f3,[NXf,NYf],2);
                 jogo(Tab_f3,[NXf,NYf],1)
              )
           )
        ). 

colunas(4) :- write(4), !, nl, write(' ---------------').

colunas(X) :- 
        write(X),
        write('  '),
        X2 is X + 1,
        colunas(X2).

escreve(0):-write('| |').
escreve(1):-write('|'),put_code(9679),write('|').
escreve(2):-write('|'),put_code(9676),write('|').
escreve(3):-write('|'),put_code(9678),write('|').

print_tab(_,[]).
print_tab(N,[Linha|Resto]):-
        write(N),
        print_linha(Linha),
        write(' ---------------'), nl,
        N2 is N+1,
        print_tab(N2, Resto).

print_linha([]) :- nl.
print_linha([Elemento|Resto]):-
        escreve(Elemento),
        print_linha(Resto).

ler_jogada_soldado(Xi, Yi, Xf, Yf):-
        write('Inserir coordenada X inicial da peça do soldado a mover'),
        nl,
        get_code(X1),
        get_char(_),
        write('Inserir coordenada Y inicial da peça do soldado a mover'),
        nl,
        get_code(Y1),
        get_char(_),
        write('Inserir coordenada X final da peça do soldado a mover'),
        nl,
        get_code(X2),
        get_char(_),
        write('Inserir coordenada Y final da peça do soldado a mover'),
        nl,
        get_code(Y2),
        get_char(_),
        % 48 código tecla zero
        Xi is X1 - 48,
        Yi is Y1 - 48,
        Xf is X2 - 48,
        Yf is Y2 - 48.

ler_jogada_neutrao(NXf,NYf):-
        write('Inserir coordenada X final da peça do neutrão a mover'),
        nl,
        get_code(X),
        get_char(_),
        write('Inserir coordenada Y final da peça do neutrão a mover'),
        nl,
        get_code(Y),
        get_char(_),
        NXf is X - 48,
        NYf is Y - 48.
        

% falta verifica validade da jogada
atualiza_jogada(Tab, Xi, Yi, Xf, Yf, Tab_f2):-
        busca_elemento(Tab, Xi, Yi, E),
        muda_elemento(Tab, Xf, Yf, E, Tab_f),
        muda_elemento(Tab_f, Xi, Yi, 0, Tab_f2).

busca_elemento([Tab|_], 0, Yi, E):-
        busca_linha(Tab, Yi, E).

busca_elemento([_|Tab], Xi, Yi, E):-
        X is Xi - 1,
        busca_elemento(Tab, X, Yi, E).

busca_linha([Tab|_], 0, Tab).

busca_linha([_|Tab], Yi, E):-
        Y is Yi - 1,
        busca_linha(Tab, Y, E).

muda_elemento([Tab|Tail], 0, Yf, E, [Tab_f|Tail]):-
        muda_linha(Tab, Yf, E, Tab_f).

muda_elemento([Tab|Tail], Xf, Yf, E, [Tab|Tab_f]):-
        X is Xf - 1,
        muda_elemento(Tail, X, Yf, E, Tab_f).

muda_linha([_|Tail], 0, E, [E|Tail]).

muda_linha([Tab|Tail], Yf, E, [Tab|Tail_f]):-
        Y is Yf - 1,
        muda_linha(Tail, Y, E, Tail_f).

verifica_fim(Nx,Ny,Tab,J):-
        (
           (
              Nx == 0;
              J == 2,
              verifica_encurralado(Tab, Nx, Ny),
              write('cenas')
           ), write('Jogador Preto Ganhou!') 
        ; 
            (
              Nx == 4;
              J == 1,
              verifica_encurralado(Tab, Nx, Ny),
              write('cenas')
           ), write('Jogador Branco Ganhou!')
        ).

valida_jogada(Tab, Xi, Yi, Xf, Yf, N):-
        busca_elemento(Tab, Xi, Yi, N),
        (
           Xf = Xi,
           (
              Yf > Yi,
              M is 2;
              M is 6
           );
           Yf = Yi,
           (
              Xf > Xi,
              M is 4;
              M is 0
           );
           DX is Xf - Xi, 
           DY is Yf - Yi,
           Adx is abs(DX),
           Ady is abs(DY),
           Adx = Ady,
           (
              DX < 0, DY > 0,
              M is 1;
              DX > 0, DY > 0,
              M is 3;
              DX > 0, DY < 0,
              M is 5;
              DX < 0, DY < 0,
              M is 7
           )
        ),
        verifica_maximo(Tab, Xi, Yi, Xm, Ym, M,N),
        !,
        %write('\nValores '),write(Xm),nl,write(Ym),nl,nl,
        Xm = Xf,
        Ym = Yf.

verifica_maximo(Tab, Xi, Yi, Xm, Ym, M, N):-
       busca_elemento(Tab, Xi, Yi, N),
       (
          M = 0,
          X1 is Xi - 1,
          Y1 is Yi;
          M = 1,
          X1 is Xi - 1,
          Y1 is Yi + 1;         
          M = 2,
          X1 is Xi,
          Y1 is Yi + 1;         
          M = 3,
          X1 is Xi + 1,
          Y1 is Yi + 1;         
          M = 4,
          X1 is Xi + 1,
          Y1 is Yi;         
          M = 5,
          X1 is Xi + 1,
          Y1 is Yi - 1;         
          M = 6,
          X1 is Xi,
          Y1 is Yi - 1;         
          M = 7,
          X1 is Xi - 1,
          Y1 is Yi - 1
       ),
       (
          verifica_maximo(Tab, X1, Y1, Xm, Ym, M, 0);
          Xm is Xi,
          Ym is Yi
       ).
        
verifica_encurralado(Tab, NX, NY):-
        verifica_maximo(Tab, NX, NY, X0, Y0, 0, 3),
        !,
        NX == X0,
        NY == Y0,
        verifica_maximo(Tab, NX, NY, X1, Y1, 1, 3),
        !,
        NX == X1,
        NY == Y1,
        verifica_maximo(Tab, NX, NY, X2, Y2, 2, 3),
        !,
        NX == X2,
        NY == Y2,
        verifica_maximo(Tab, NX, NY, X3, Y3, 3, 3),
        !,
        NX == X3,
        NY == Y3,
        verifica_maximo(Tab, NX, NY, X4, Y4, 4, 3),
        !,
        NX == X4,
        NY == Y4,
        verifica_maximo(Tab, NX, NY, X5, Y5, 5, 3),
        !,
        NX == X5,
        NY == Y5,
        verifica_maximo(Tab, NX, NY ,X6, Y6, 6, 3),
        !,
        NX == X6,
        NY == Y6,
        verifica_maximo(Tab, NX, NY, X7, Y7, 7, 3),
        !,
        NX == X7,
        NY == Y7.
        
