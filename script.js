(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(miliSegundos) {
        const sessentamil = 60000; //  == 1min 
        const hr = Math.floor(miliSegundos / (sessentamil * 60));
        const min = Math.floor((miliSegundos / sessentamil) % 60);
        const sec = Math.floor((miliSegundos % sessentamil) / 1000);
        // console.log(`milisegundos ${miliSegundos}, hr ${hr}, min ${min} e segusdos ${sec}`)
        if (hr > 0)
            return `${hr}h, ${min}m e ${sec}s`;
        return `${min}m e ${sec}s`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : []; //localStores so guarda Strings   
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, guardar) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}"> x </button>
                </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa); // quando clicar no elemento .delete irá chamar a função remover e execultar no proprio elemento .delete
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            //colocar as informações antigas da função ler e depois adicionar os novos
            if (guardar)
                salvar([...ler(), veiculo]);
        }
        function remover(placa) {
            const { nome, entrada } = ler().find(veiculo => veiculo.placa === placa); //
            const tempoPermaneceu = calcTempo(new Date().getTime() - new Date(entrada).getTime()); //get Time pegar o date e converte em milisegundos para poder fazer a operaçãp
            if (!confirm(`O Veiculo de ${nome} permaneceu por ${tempoPermaneceu}. Deseja encerrar?`))
                return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, salvar, render };
    }
    patio().render();
    (_a = $("#btn-cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!(nome && placa)) {
            alert("Os campos nome e placa são obrigatorias");
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
