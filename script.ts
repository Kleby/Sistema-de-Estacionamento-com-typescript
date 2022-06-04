interface IVeiculo{
    nome: string,
    placa: string,
    entrada : Date | string;
}

(function(){
    const $ = (query : string): HTMLInputElement | null => document.querySelector(query);

    function calcTempo(miliSegundos: number){
        const sessentamil = 60000; //  == 1min 
        const hr = Math.floor(  miliSegundos / (sessentamil * 60));
        const min = Math.floor((miliSegundos / sessentamil) % 60);
        const sec = Math.floor((miliSegundos % sessentamil)/ 1000);
        // console.log(`milisegundos ${miliSegundos}, hr ${hr}, min ${min} e segusdos ${sec}`)

        if(hr > 0) return `${hr}h, ${min}m e ${sec}s`;
        return `${min}m e ${sec}s`;

    }

    function patio(){
        function ler(): IVeiculo[]{ //Ler os carros que existem no localStore, é do tipo Array de Veiculos
            return localStorage.patio ? JSON.parse(localStorage.patio) : []; //localStores so guarda Strings   
        }

        function salvar( veiculos: IVeiculo[]){ //salvar os novos cadastros em formato string
            localStorage.setItem("patio",JSON.stringify(veiculos));
        }

        function adicionar( veiculo: IVeiculo & {cupom?:string}, guardar? : boolean){ //& {} como em &{cupom} serve para concaternar 
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}"> x </button>
                </td>
            `;
            row.querySelector(".delete")?.addEventListener("click", function(){ //selecionar o elemedo da class delete. Quando ouvir um click executa a função
                remover(this.dataset.placa); // quando clicar no elemento .delete irá chamar a função remover e execultar no proprio elemento .delete
            });

            $("#patio")?.appendChild(row);

         //colocar as informações antigas da função ler e depois adicionar os novos
            if( guardar) salvar([...ler(), veiculo]);
        }

        function remover(placa:string){
            const {nome, entrada} = ler().find( veiculo => veiculo.placa === placa); //
            const tempoPermaneceu = calcTempo(new Date().getTime() - new Date(entrada).getTime());   //get Time pegar o date e converte em milisegundos para poder fazer a operaçãp
            
            if(!confirm(`O Veiculo de ${nome} permaneceu por ${tempoPermaneceu}. Deseja encerrar?`)) return;

            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }

        function render(){
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length){
                patio.forEach((veiculo) => adicionar(veiculo))
            }
        }

        return {ler, adicionar, remover, salvar, render}
    }
    patio().render();
    $("#btn-cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        if(!(nome && placa)){

            alert("Os campos nome e placa são obrigatorias");
            return;
        }

        patio().adicionar({ nome, placa, entrada : new Date().toISOString()}, true);

    });
}) ();

