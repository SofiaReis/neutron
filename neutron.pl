

estado_inicial([[1,1,1,1,1],
                [0,0,0,0,0],
                [0,0,3,0,0],
                [0,0,0,0,0],
                [2,2,2,2,2]]).

inicio:-
        apresentacao,
        estado_inicial(Tab),
        visualiza_estado(Tab).

apresentacao:-
        write('NEUTRON EM PROLOG'), nl, nl.

visualiza_estado(Tab):-
        nl,
        write('  '),
        colunas(1), nl,nl,
        print_tab(1, Tab),
        nl,!.

colunas(5) :- write(5), !.

colunas(X) :- 
        write(X),
        write('  '),
        X2 is X+1,
        colunas(X2).

escreve(0):-write('   ').
escreve(1):-write(' P ').
escreve(2):-write(' B ').
escreve(3):-write(' N ').

print_tab(_,[]).
print_tab(N,[Linha|Resto]):-
        write(N),
        print_linha(Linha),
        write('  '), nl,
        N2 is N+1,
        print_tab(N2, Resto).

print_linha([]) :- nl.
print_linha([Elemento|Resto]):-
        escreve(Elemento),
        print_linha(Resto).


                                       