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
        jogo(Tab,N).

neutrao_inicial([2,2]).

apresentacao:-
        write('NEUTRON EM PROLOG'), nl, nl.

visualiza_estado(Tab):-
        nl,
        write('  '),
        colunas(1), nl,nl,
        print_tab(1, Tab),
        nl,!.

jogo(Tab,[NX,NY]):-
        ler_jogada_soldado(Xi, Yi, Xf, Yf),
        atualiza_jogada(Tab, Xi, Yi, Xf, Yf, Tab_f2),
        visualiza_estado(Tab_f2),
        ler_jogada_neutrao(NXf,NYf),
        atualiza_jogada(Tab_f2, NX, NY, NXf, NYf, Tab_f3),
        visualiza_estado(Tab_f3),
        !,
        (verifica_fim(NXf);
        jogo(Tab_f3,[NXf,NYf])). 

colunas(5) :- write(5), !.

colunas(X) :- 
        write(X),
        write('  '),
        X2 is X+1,
        colunas(X2).

escreve(0):-write('| |').
escreve(1):-write('|'),put_code(9679),write('|').
escreve(2):-write('|'),put_code(9676),write('|').
escreve(3):-write('|'),put_code(9678),write('|').

print_tab(_,[]).
print_tab(N,[Linha|Resto]):-
        write(N),
        print_linha(Linha),
        write('----------------'), nl,
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

verifica_fim(Nx):-
        (Nx == 0, write('Jogador Preto Ganhou!') ; Nx == 4, write('Jogador Branco Ganhou!')).

        
        