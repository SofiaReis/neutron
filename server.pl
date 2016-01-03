:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

:- use_module(library(lists)).
:- use_module(library(random)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

estado_inicial([[1,1,1,1,1],
                [0,0,0,0,0],
                [0,0,3,0,0],
                [0,0,0,0,0],
                [2,2,2,2,2]]).


%move invalid							

jogada_neutrao_humano(Board, NXi, NYi, NXf, NYf, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY):-

	valida_jogada(Board, NXi, NYi, NXf, NYf,3),
	atualiza_jogada(Board,NXi, NYi, NXf, NYf, NewBoard),
	NX is NXf, NY is NYf,
	
	(
		verifica_fim(NXf , NYf , NewBoard, Player, NewPlayer),
		NewPlay is 3,
		Message is 3
		;
    ( 
      Player == 1,
      NewPlayer is 1;
      Player == 2,
      NewPlayer is 2
    ),
		NewPlay is 2,
		Message is 1 %move valid
	);
	NewPlay is 1,
	(
		Player == 1,
		NewPlayer is 1;
		Player == 2,
		NewPlayer is 2
	),
	NX is -1, NY is -1,
	NewBoard is -1,
	Message is -1. %move invalid	

jog_poss(Board, Xi, Yi, Player, NewBoard, Message):-
	jogadas_possiveis(Board, Xi, Yi, 0, Player, NewBoard),
	Message is 1. %sucess


jogada_neutrao_computador(Board, Xi, Yi, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY):-
	jogada_aleatoria(Board, Xi, Yi, Xf, Yf, 3),
	atualiza_jogada(Board, Xi, Yi, Xf, Yf, NewBoard),
	NX is Xf,
	NY is Yf,
	(
		verifica_fim(Xf , Yf , NewBoard, Player, NewPlayer),
		NewPlay is 3,
		Message is 3 %end
		;	
    (
    Player == 1,
    NewPlayer is 1;
    Player == 2,
    NewPlayer is 2
    ),
		NewPlay is 2,
		Message is 1 %sucess
	).

jogada_computador(Board, NXi, NYi, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY):-
	jogada_inteligente_neutron(Board,NXi, NYi, NXf, NYf, Player),
	atualiza_jogada(Board, NXi, NYi, NXf, NYf, NewBoard),
	NX is NXf,
	NY is NYf,
	
	(
		verifica_fim(NXf , NYf , NewBoard, Player, NewPlayer),
		NewPlay is 3,
		Message is 3 %end
		;	
    (
      Player == 1,
      NewPlayer is 1;
      Player == 2,
      NewPlayer is 2
    ),
		NewPlay is 2,
		Message is 1 %valid move
	).
	

valida_jogada(Tab, Xi, Yi, Xf, Yf, N):-
        (Xi =\= Xf;
        Yi =\= Yf),
        
        busca_elemento(Tab, Xi, Yi, N),
        (
           Xf = Xi,
           (
              Yf > Yi,
              M is 2;
              M is 6
           )
        ;
           Yf = Yi,
           (
              Xf > Xi,
              M is 4;
              M is 0
           )
        ;
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

busca_elemento([Tab|_], 0, Yi, E):-
	    busca_linha(Tab, Yi, E).

busca_elemento([_|Tab], Xi, Yi, E):-
        X is Xi - 1,
        busca_elemento(Tab, X, Yi, E).

busca_linha([Tab|_], 0, Tab).

busca_linha([_|Tab], Yi, E):-
        Y is Yi - 1,
        busca_linha(Tab, Y, E).


atualiza_jogada(Tab, Xi, Yi, Xf, Yf, Tab_f2):-
        busca_elemento(Tab, Xi, Yi, E),
        muda_elemento(Tab, Xf, Yf, E, Tab_f),
        muda_elemento(Tab_f, Xi, Yi, 0, Tab_f2).


muda_elemento([Tab|Tail], 0, Yf, E, [Tab_f|Tail]):-
        muda_linha(Tab, Yf, E, Tab_f).

muda_elemento([Tab|Tail], Xf, Yf, E, [Tab|Tab_f]):-
        X is Xf - 1,
        muda_elemento(Tail, X, Yf, E, Tab_f).

muda_linha([_|Tail], 0, E, [E|Tail]).

muda_linha([Tab|Tail], Yf, E, [Tab|Tail_f]):-
        Y is Yf - 1,
        muda_linha(Tail, Y, E, Tail_f).

verifica_fim(Nx,Ny,Tab,J,NJ):-
        Nx == 0,
        NJ is 1;
        J == 2,
        verifica_encurralado(Tab, Nx, Ny),
        NJ is 1
        ; 
        Nx == 4,
        NJ is 2;
        J == 1,
        verifica_encurralado(Tab, Nx, Ny),
        NJ is 2.

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

jogadas_possiveis(_,_,_,8,_,[]).
jogadas_possiveis(Tab, Xi, Yi, M,N, [[Xm,Ym]|T]):-
        verifica_maximo(Tab, Xi, Yi, Xm, Ym, M, N),
        valida_jogada(Tab, Xi, Yi, Xm, Ym, N),
        M1 is M +1,
        jogadas_possiveis(Tab, Xi, Yi, M1,N, T).
jogadas_possiveis(Tab, Xi, Yi, M,N, T):-
        M1 is M +1,
        jogadas_possiveis(Tab, Xi, Yi, M1,N, T).



encontra_peca(Tab, P, X, Y):-
       (
          random(0, 5, X),
          random(0, 5, Y),
          busca_elemento(Tab, X, Y, P)
       ;
          encontra_peca(Tab, P, X, Y)
        ).

jogada_aleatoria(Tab, Xi, Yi, Xf, Yf, P):-
        (
           (
              P = 3
           ;
              encontra_peca(Tab, P, Xi, Yi)
           ),
           random(0, 8, M),
           verifica_maximo(Tab, Xi, Yi, Xf, Yf, M, P),
           valida_jogada(Tab, Xi, Yi, Xf, Yf, P)
        ;
           jogada_aleatoria(Tab, Xi, Yi, Xf, Yf, P) 
         ).

melhor_jogada([],_,_,_):-
        !,false.
melhor_jogada([[X,Y]|_],X,X,Y).
melhor_jogada([_|T],X,Xf,Yf):-
        melhor_jogada(T,X,Xf,Yf).
        
elimina_jogadas([],_,[]).
elimina_jogadas([[X,_]|T],X,TR):-
        elimina_jogadas(T,X,TR).
elimina_jogadas([[X,Y]|T],X1,[[X,Y]|TR]):-
        elimina_jogadas(T,X1,TR).



jogada_inteligente_neutron(Tab, Xi, Yi, Xf, Yf, J):-
        jogadas_possiveis(Tab, Xi, Yi, 0, 3, R),
        (
           (
              J = 1,
              melhor_jogada(R, 0, Xf, Yf)
           ;
              melhor_jogada(R, 4, Xf, Yf)
           )
        ;
           (
              J = 1,
              elimina_jogadas(R, 4, RR)
           ;
              elimina_jogadas(R, 0, RR)
           ),
        random_select([Xf,Yf], RR, _)
        ;
        jogada_aleatoria(Tab, Xi, Yi, Xf, Yf, 3)
        ).

 jogada_humano(Board, NXi, NYi, Xi, Yi, Xf, Yf, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY):-		
	valida_jogada(Board,Xi, Yi, Xf, Yf, Player),
	atualiza_jogada(Board,Xi, Yi, Xf, Yf, NewBoard),
	(
		verifica_fim(NXi, NYi, NewBoard, Player, NewPlayer),
		
		NewPlay is 3,
		Message is 3 %end
		;
		(
			Player == 1,
			NewPlayer is 2;
			Player == 2,
			NewPlayer is 1
		),
		NX is -1, NY is -1,
		NewPlay is 1,
		Message is 1 %move valid
	);
	NewPlay is 2,
	(
		Player == 1,
		NewPlayer is 1;
		Player == 2,
		NewPlayer is 2
	),
	NX is -1, NY is -1,
	NewBoard is -1,
	Message is -1.

% Require your Prolog Files here

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

parse_input(initTab, Tab):- estado_inicial(Tab).

parse_input(playHumano(Board, NXi, NYi, Xi, Yi, Xf, Yf, Player), [NewPlayer, NewPlay, NewBoard, Message, NX, NY]):- 
jogada_humano(Board, NXi, NYi, Xi, Yi, Xf, Yf, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY).

parse_input(playHNeutrao(Board, NXi, NYi, NXf, NYf, Player), [NewPlayer, NewPlay, NewBoard, Message, NX, NY]):- 
write(Board), write(NXi),  write(NXi), write(Xi), write(Yi), write(Xf), write(Yf), write(Player),
jogada_neutrao_humano(Board, NXi, NYi, NXf, NYf, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY)
,
write(NewPlayer), write(NewPlay),  write(NewBoard), write(Message), write(NX), write(NY).

parse_input(getJogadas(Board, Xi, Yi, Player),[NewBoard, Message]):- 
jog_poss(Board, Xi, Yi, Player, NewBoard, Message).

parse_input(playCNeutrao(Board, Xi, Yi, Player), [NewPlayer, NewPlay, NewBoard, Message, NX, NY]):- 
write(Board), write(NXi),  write(NXi), write(Xi), write(Yi), write(Xf), write(Yf), write(Player),
jogada_neutrao_computador(Board, Xi, Yi, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY),
write(NewPlayer), write(NewPlay),  write(NewBoard), write(Message), write(NX), write(NY).

parse_input(playComputador(Board, NXi, NYi, Player), [NewPlayer, NewPlay, NewBoard, Message, NX, NY]):- 
write(Board), write(NXi),  write(NXi), write(Xi), write(Yi), write(Xf), write(Yf), write(Player),
jogada_computador(Board, NXi, NYi, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY),
write(NewPlayer), write(NewPlay),  write(NewBoard), write(Message), write(NX), write(NY).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).