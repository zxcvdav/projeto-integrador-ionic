import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Cliente } from '../model/cliente';

@Injectable()
export class ClienteService{
    cliente : Cliente = new Cliente();

    constructor(private firestore: AngularFirestore){

    }

    listaDeClientes() : Observable<any>{

        // Observable -> Aguardar resposta do servidor
        return from(new Observable(observe =>{ // converter para Observable
            
            // this.firestore.collection('cliente') -> Selecionar a coleção no Firestore
            // .snapshotChanges().subscribe -> Tentar buscar no servidor
            // response -> dados baixados do servidor, os clientes
            this.firestore.collection('cliente').snapshotChanges().subscribe(response=>{
                // transformar response em array de clientes
                let lista: Cliente[] = [];
                response.map(obj =>{
                    // será repetido para cada registro, cada registro do Firestore se chama obj
                    let cliente: Cliente = new Cliente();
                    cliente.setData(obj.payload.doc.data());// obj.payload.doc.data() -> Dados do cliente
                    cliente.id = obj.payload.doc.id; // inserindo ID
                    lista.push(cliente); // adicionando o cliente na lista // push é adicionar
                });
                observe.next(lista);
            })

        }))
    }

    cadastrar(cliente : any) : Observable<any>{
        return from(new Observable(observe => {
            // add cria um novo documento
            this.firestore.collection('cliente').add(cliente).then(response=>{
                observe.next("Cadastrado com sucesso!");
            },(err)=>{
                observe.error("Erro ao cadastrar!");
            })

        }));   
    }

    buscaPorId(id : any) : Observable<any>{
        return from(new Observable(observe => {
            // .doc(id).snapshotChanges() -> Busca pelo id do documento
            this.firestore.collection('cliente').doc(id).snapshotChanges().subscribe(response=>{
                console.log(response);
                let cliente : Cliente = new Cliente();
                cliente.id = response.payload.id;
                cliente.setData(response.payload.data());
                observe.next(cliente);

            },(err)=>{
                observe.error("Erro ao buscar o ID!");
            })

        }));  
    }



    atualizar(cliente : any)  : Observable<any>{
        return from(new Observable(observe => {

            this.firestore.collection('cliente').doc(cliente.id).set(cliente).then(response=>{
                observe.next("Atualizado com sucesso!");
            },(err)=>{
                observe.error("Erro ao atualizar!");
            })

        })); 
    }

    excluir(cliente : any)  : Observable<any>{
        return from(new Observable(observe => {

            this.firestore.collection('cliente').doc(cliente.id).delete().then(response=>{
                observe.next("Excluído com sucesso!");
            },(err)=>{
                observe.error("Erro ao excluir!");
            })

        })); 
    }


}